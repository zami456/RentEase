//create leaflet map instance
import React, { useEffect, useRef, useState } from "react";

const Map = ({ properties = [], onPoisChange, pois = [], poiMode = false }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const poiMarkersRef = useRef([]);
  const [localPois, setLocalPois] = useState(pois);
  const localPoisRef = useRef(pois);

  useEffect(() => {
    localPoisRef.current = localPois;
  }, [localPois]);

  useEffect(() => {
    // Function to initialize map when Leaflet is available
    const initializeMap = () => {
      if (!window.L) {
        console.error("Leaflet library not loaded yet");
        return false;
      }

      if (!mapRef.current) {
        console.error("Map container not found");
        return false;
      }

      // Check if map is already initialized
      if (mapInstanceRef.current) {
        console.log("Map already initialized");
        // Ensure markers render when map exists
        renderPropertyMarkers();
        return true;
      }

      try {
        // Get user's current location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              // Check again if map already exists (async callback)
              if (mapInstanceRef.current) {
                return;
              }

              // Triple check the ref still exists
              if (!mapRef.current || !window.L) {
                console.error("Map container lost during geolocation");
                return;
              }

              const { latitude, longitude } = position.coords;
              console.log("Current location:", latitude, longitude);

              // Initialize the map with user's current location
              const map = window.L.map(mapRef.current).setView([latitude, longitude], 13);
              mapInstanceRef.current = map;
              
              // Add OpenStreetMap tiles
              window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution:
                  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 19,
              }).addTo(map);

              // Add a marker for current location
              window.L.marker([latitude, longitude])
                .addTo(map)
                .bindPopup("Your current location")
                .openPopup();

              console.log("Map initialized successfully with current location");
              // Render property markers if available
              renderPropertyMarkers();
              
              // Add click handler for POI mode
              setupMapClickHandler(map);
            },
            (error) => {
              console.warn("Geolocation error:", error);
              // Fallback to default location
              initializeMapWithDefault();
            }
          );
        } else {
          console.warn("Geolocation not supported");
          initializeMapWithDefault();
        }
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    };

    // Fallback function with default location
    const initializeMapWithDefault = () => {
      // Check if map already exists
      if (mapInstanceRef.current) {
        return;
      }

      // Verify container still exists
      if (!mapRef.current || !window.L) {
        console.error("Cannot initialize map - missing container or Leaflet");
        return;
      }

      try {
        // Initialize the map with default location
        const map = window.L.map(mapRef.current).setView([51.505, -0.09], 13);
        mapInstanceRef.current = map;
        
        // Add OpenStreetMap tiles
        window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        // Add a marker with default location
        window.L.marker([51.5, -0.09])
          .addTo(map)
          .bindPopup("Default location");

        console.log("Map initialized with default location");
        // Render property markers if available
        renderPropertyMarkers();
        
        // Add click handler for POI mode
        setupMapClickHandler(map);
      } catch (error) {
        console.error("Error initializing map with default:", error);
      }
    };

    const renderPropertyMarkers = () => {
      if (!window.L || !mapInstanceRef.current) return;

      // Clear existing markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      const bounds = [];
      properties.forEach((p) => {
        const lat = Number(p.latitude);
        const lon = Number(p.longitude);
        if (!Number.isFinite(lat) || !Number.isFinite(lon)) return;

        const marker = window.L.marker([lat, lon]).addTo(
          mapInstanceRef.current
        );
        const title = p.houseName || "Property";
        const price =
          Number.isFinite(Number(p.price)) ? `$${Number(p.price).toLocaleString()}` : "";
        const addr = p.address || "";
        marker.bindPopup(
          `<div style="min-width:180px">
            <div style="font-weight:600;margin-bottom:4px">${title}</div>
            ${addr ? `<div style="color:#555">${addr}</div>` : ""}
            ${price ? `<div style="margin-top:4px">${price}</div>` : ""}
          </div>`
        );
        markersRef.current.push(marker);
        bounds.push([lat, lon]);
      });

      if (bounds.length >= 1) {
        try {
          mapInstanceRef.current.fitBounds(bounds, { padding: [30, 30] });
        } catch {}
      }
    };

    const setupMapClickHandler = (map) => {
      map.on('click', (e) => {
        if (!poiMode) return;
        
        if (localPoisRef.current.length >= 5) {
          alert("Maximum 5 POIs allowed. Remove one to add another.");
          return;
        }
        
        const { lat, lng } = e.latlng;
        const newPoi = { latitude: lat, longitude: lng, id: Date.now() };
        const labelIndex = localPoisRef.current.length + 1;
        setLocalPois((prev) => {
          const updated = [...prev, newPoi];
          if (onPoisChange) onPoisChange(updated);
          return updated;
        });
        
        // Add POI marker (different style)
        const icon = window.L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });
        
        const marker = window.L.marker([lat, lng], { icon }).addTo(map);
        marker.bindPopup(`<div>POI #${labelIndex}<br/><button onclick="window.removePoi(${newPoi.id})">Remove</button></div>`);
        marker.poiId = newPoi.id;
        poiMarkersRef.current.push(marker);
      });
    };
    
    // Expose remove function globally for popup button
    window.removePoi = (poiId) => {
      setLocalPois((prev) => {
        const updated = prev.filter(p => p.id !== poiId);
        if (onPoisChange) onPoisChange(updated);
        return updated;
      });

      const markerIndex = poiMarkersRef.current.findIndex(m => m.poiId === poiId);
      if (markerIndex > -1) {
        poiMarkersRef.current[markerIndex].remove();
        poiMarkersRef.current.splice(markerIndex, 1);
      }
    };

    // Initialize map with retry mechanism
    let retryCount = 0;
    const maxRetries = 20; // 20 * 100ms = 2 seconds max wait
    let retryTimer;
    let mounted = true;
    
    const start = () => {
      if (!mounted) return; // Component unmounted
      
      if (!mapRef.current || !window.L) {
        retryCount++;
        if (retryCount < maxRetries) {
          retryTimer = setTimeout(start, 100);
        } else {
          console.error("Failed to initialize map after retries");
        }
        return;
      }
      
      const result = initializeMap();
      if (!result && retryCount < maxRetries) {
        // initializeMap failed, retry
        retryCount++;
        retryTimer = setTimeout(start, 100);
      }
    };

    start();

    // Cleanup on unmount
    return () => {
      mounted = false;
      if (retryTimer) {
        clearTimeout(retryTimer);
      }
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.off('click');
          mapInstanceRef.current.remove();
        } catch (e) {
          console.error("Error cleaning up map:", e);
        }
        mapInstanceRef.current = null;
      }
      delete window.removePoi;
    };
  }, [poiMode, onPoisChange]);

  // Re-render markers whenever properties change and map is ready
  useEffect(() => {
    const hasMap = !!mapInstanceRef.current;
    if (hasMap) {
      // Render markers based on latest properties
      if (window.L) {
        // renderPropertyMarkers is defined in the other effect's scope;
        // re-create a lightweight renderer here using the refs to avoid scope issues.
        // Clear existing markers
        markersRef.current.forEach((m) => m.remove());
        markersRef.current = [];

        const bounds = [];
        properties.forEach((p) => {
          const lat = Number(p.latitude);
          const lon = Number(p.longitude);
          if (!Number.isFinite(lat) || !Number.isFinite(lon)) return;

          const marker = window.L.marker([lat, lon]).addTo(
            mapInstanceRef.current
          );
          const title = p.houseName || "Property";
          const price =
            Number.isFinite(Number(p.price)) ? `$${Number(p.price).toLocaleString()}` : "";
          const addr = p.address || "";
          marker.bindPopup(
            `<div style=\"min-width:180px\">\n                <div style=\"font-weight:600;margin-bottom:4px\">${title}</div>\n                ${addr ? `<div style=\"color:#555\">${addr}</div>` : ""}\n                ${price ? `<div style=\"margin-top:4px\">${price}</div>` : ""}\n              </div>`
          );
          markersRef.current.push(marker);
          bounds.push([lat, lon]);
        });

        if (bounds.length >= 1) {
          try {
            mapInstanceRef.current.fitBounds(bounds, { padding: [30, 30] });
          } catch {}
        }
      }
    }
  }, [properties]);

  return (
    <div 
      ref={mapRef}
      id="map" 
      style={{ 
        height: "100%", 
        width: "100%",
        minHeight: "500px",
        backgroundColor: "#e5e3df",
        cursor: poiMode ? "crosshair" : "default"
      }}
    />
  );
};

export default Map;