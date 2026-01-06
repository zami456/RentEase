//basic this is the map view page
import React, { useEffect, useState } from "react";
import Map from "../components/map";
import API_BASE_URL from "../config/api";

const Mapview = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [poiMode, setPoiMode] = useState(false);
  const [pois, setPois] = useState([]);
  const [bestProperty, setBestProperty] = useState(null);
  const [computing, setComputing] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`${API_BASE_URL}/api/properties/all`, {
          credentials: "include",
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`Failed: ${res.status}`);
        const data = await res.json();
        // Expecting array of properties
        setProperties(Array.isArray(data) ? data : data?.properties || []);
      } catch (e) {
        if (e.name !== "AbortError") setError(e.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
    return () => controller.abort();
  }, []);

  const handleComputeBest = async () => {
    if (pois.length === 0) {
      alert("Please add at least one POI on the map.");
      return;
    }
    
    setComputing(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/properties/best`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ pois }),
      });
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      const data = await res.json();
      setBestProperty(data.property);
      if (data.property) {
        alert(`Best property: ${data.property.houseName}\nTotal distance score: ${Math.round(data.score)} meters`);
      } else {
        alert("No suitable property found.");
      }
    } catch (e) {
      setError(e.message || "Failed to compute best property");
    } finally {
      setComputing(false);
    }
  };

  const handleClearPois = () => {
    setPois([]);
    setBestProperty(null);
    setPoiMode(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-blue-50">
      <h1 className="text-4xl font-bold text-blue-900 mb-6 px-6 pt-4">Map View</h1>
      
      {/* POI Controls */}
      <div className="px-6 mb-4 flex gap-3 items-center">
        <button
          onClick={() => setPoiMode(!poiMode)}
          className={`px-4 py-2 rounded font-semibold ${
            poiMode
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {poiMode ? "Stop Adding POIs" : "Add Points of Interest"}
        </button>
        
        {pois.length > 0 && (
          <>
            <span className="text-sm text-gray-700">
              {pois.length} POI{pois.length !== 1 ? "s" : ""} added (max 5)
            </span>
            <button
              onClick={handleComputeBest}
              disabled={computing}
              className="px-4 py-2 bg-green-500 text-white rounded font-semibold hover:bg-green-600 disabled:opacity-50"
            >
              {computing ? "Computing..." : "Find Best Property"}
            </button>
            <button
              onClick={handleClearPois}
              className="px-4 py-2 bg-gray-500 text-white rounded font-semibold hover:bg-gray-600"
            >
              Clear POIs
            </button>
          </>
        )}
        
        {poiMode && (
          <span className="text-sm text-blue-700 italic">
            Click anywhere on the map to add a POI
          </span>
        )}
      </div>
      
      <div className="flex-1 px-6 pb-6">
        {!loading && !error && (() => {
          const total = properties.length;
          const geocoded = properties.filter(p => Number.isFinite(Number(p.latitude)) && Number.isFinite(Number(p.longitude))).length;
          if (total > 0 && geocoded === 0) {
            return (
              <div className="mb-4 px-4 py-2 bg-yellow-100 text-yellow-800 rounded">
                No properties have coordinates yet. Add latitude/longitude to listings to see them on the map.
              </div>
            );
          }
          return null;
        })()}
        
        {bestProperty && (
          <div className="mb-4 px-4 py-2 bg-green-100 text-green-800 rounded">
            <strong>Best Property:</strong> {bestProperty.houseName} - {bestProperty.address} - ${bestProperty.price}
          </div>
        )}
        
        {error && (
          <div className="mb-4 px-4 py-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        {loading ? (
          <div className="px-4 py-2">Loading properties…</div>
        ) : (
          <Map 
            properties={properties} 
            poiMode={poiMode}
            pois={pois}
            onPoisChange={setPois}
          />
        )}
      </div>
    </div>
  );
}

export default Mapview;