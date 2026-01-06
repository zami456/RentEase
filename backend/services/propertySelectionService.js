const Property = require("../models/Property");

const OSRM_BASE_URL = process.env.OSRM_BASE_URL || "https://router.project-osrm.org";
const routeCache = new Map();

// Rate limiting
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 200; // milliseconds between requests

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function throttledFetch() {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await delay(MIN_REQUEST_INTERVAL - timeSinceLastRequest);
  }
  lastRequestTime = Date.now();
}

const getFetch = () => {
  if (typeof fetch !== "function") {
    throw new Error("Fetch API is unavailable in this Node runtime. Use Node 18+ or provide a polyfill.");
  }
  return fetch;
};

async function getDistancesFromPropertyToPois(lat, lon, pois) {
  if (!Array.isArray(pois) || pois.length === 0) return [];
  
  const cacheKey = `table|${lat},${lon}|${pois.map(p => `${p.latitude},${p.longitude}`).join('|')}`;
  if (routeCache.has(cacheKey)) return routeCache.get(cacheKey);

  // Throttle requests
  await throttledFetch();

  const fetchImpl = getFetch();
  
  // Build coordinates: property first, then all POIs
  const coordinates = [[lon, lat], ...pois.map(p => [p.longitude, p.latitude])];
  const coordString = coordinates.map(c => c.join(',')).join(';');
  
  const url = `${OSRM_BASE_URL}/table/v1/driving/${coordString}?annotations=distance,duration`;
  
  console.log('OSRM Table Request:', url);
  
  const res = await fetchImpl(url);
  console.log('OSRM Table Response status:', res.status);
  
  if (!res.ok) {
    throw new Error(`OSRM Table request failed: ${res.status}`);
  }
  
  const data = await res.json();
  
  if (!data.distances || !data.durations) {
    throw new Error("No distances/durations in OSRM Table response");
  }
  
  // Extract distances from property (index 0) to each POI (indices 1+)
  const results = data.distances[0].slice(1).map((distance, index) => ({
    distance,
    duration: data.durations[0][index + 1],
    poiIndex: index,
  }));
  
  routeCache.set(cacheKey, results);
  return results;
}

async function scorePropertyAgainstPoisBulk(properties, pois, weights) {
  if (!Array.isArray(pois) || pois.length === 0 || !properties.length) {
    return properties.map(p => ({ property: p, score: Infinity, legs: [] }));
  }

  const cacheKey = `bulk|${properties.map(p => `${p.latitude},${p.longitude}`).join('|')}|${pois.map(p => `${p.latitude},${p.longitude}`).join('|')}`;
  if (routeCache.has(cacheKey)) return routeCache.get(cacheKey);

  // Throttle requests
  await throttledFetch();

  try {
    const fetchImpl = getFetch();
    
    // Build single request with all properties and POIs
    const coordinates = [
      ...properties.map(p => [Number(p.longitude), Number(p.latitude)]),
      ...pois.map(p => [p.longitude, p.latitude])
    ];
    const coordString = coordinates.map(c => c.join(',')).join(';');
    
    const url = `${OSRM_BASE_URL}/table/v1/driving/${coordString}?annotations=distance,duration`;
    
    console.log(`\n✓ Making single OSRM Table request for ${properties.length} properties + ${pois.length} POIs`);
    console.log('URL:', url.substring(0, 100) + '...');
    
    const res = await fetchImpl(url);
    console.log('✓ OSRM Response status:', res.status);
    
    if (!res.ok) {
      throw new Error(`OSRM Table request failed: ${res.status}`);
    }
    
    const data = await res.json();
    
    if (!data.distances || !data.durations) {
      throw new Error("No distances/durations in OSRM response");
    }
    
    // Extract results: for each property, extract distances to all POIs
    const results = properties.map((property, propIndex) => {
      const legs = pois.map((poi, poiIndex) => {
        const destIndex = properties.length + poiIndex; // POIs start after all properties
        const weight = Array.isArray(weights) && typeof weights[poiIndex] === "number" ? weights[poiIndex] : 1;
        return {
          distance: data.distances[propIndex][destIndex],
          duration: data.durations[propIndex][destIndex],
          weight,
          weightedDistance: data.distances[propIndex][destIndex] * weight,
          poiIndex: poiIndex,
        };
      });
      
      const total = legs.reduce((sum, leg) => sum + leg.weightedDistance, 0);
      return { property, score: total, legs };
    });
    
    routeCache.set(cacheKey, results);
    return results;
  } catch (err) {
    console.error('✗ Error in bulk scoring:', err.message);
    return properties.map(p => ({ property: p, score: Infinity, legs: [] }));
  }
}

async function findBestProperty({ pois = [], filters = {}, limit = 100, weights = [] }) {
  // Basic validation
  const validPois = pois.filter(
    (p) => p && typeof p.latitude === "number" && typeof p.longitude === "number"
  );
  if (validPois.length === 0) {
    return { property: null, score: Infinity, distances: [], candidates: [] };
  }
  
  console.log('Finding best property for POIs:', validPois);

  // Build query filters: ensure properties with coordinates
  const query = {
    latitude: { $ne: null },
    longitude: { $ne: null },
  };
  if (filters.minPrice || filters.maxPrice) {
    query.price = {};
    if (filters.minPrice) query.price.$gte = filters.minPrice;
    if (filters.maxPrice) query.price.$lte = filters.maxPrice;
  }
  if (filters.rooms) query.rooms = { $gte: filters.rooms };

  const properties = await Property.find(query).limit(limit).lean();
  
  console.log(`Found ${properties.length} properties to evaluate`);
  properties.forEach(p => {
    console.log(`- ${p.houseName} at [${p.latitude}, ${p.longitude}]`);
  });

  const scored = await scorePropertyAgainstPoisBulk(properties, validPois, weights);
  
  const ranked = scored.sort((a, b) => a.score - b.score);
  
  console.log('\n✓ All properties ranked by score:');
  ranked.forEach((r, i) => {
    console.log(`${i + 1}. ${r.property.houseName} - Score: ${Math.round(r.score)}m`);
  });

  let best = null;
  let bestScore = Infinity;
  let bestLegs = [];

  if (ranked.length > 0) {
    best = ranked[0].property;
    bestScore = ranked[0].score;
    bestLegs = ranked[0].legs;
  }

  return {
    property: best,
    score: bestScore,
    distances: bestLegs.map((l) => l.distance),
    durations: bestLegs.map((l) => l.duration),
    legs: bestLegs,
    candidates: ranked,
  };
}

module.exports = {
  findBestProperty,
};