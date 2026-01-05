// src/components/MyAdvertisement.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_BASE from "../config/api";   

axios.defaults.withCredentials = true;

export default function MyAdvertisement() {
  const [properties, setProperties] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/properties`, {
          withCredentials: true,
        });
        setProperties(res.data.properties);
      } catch (err) {
        console.error("Failed to load your advertisements:", err);
      }
    };
    fetchProperties();
  }, []);

  const handleRemove = async (id) => {
    if (!window.confirm("Are you sure you want to remove this property?")) return;
    try {
      await axios.delete(`${API_BASE}/api/properties/${id}`, {
        withCredentials: true,
      });
      setProperties((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Failed to delete property:", err);
      alert("Failed to delete property. Please try again.");
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold text-blue-900 mb-8 text-center tracking-tight">
        My Advertisements
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {properties.map((p) => (
          <div
            key={p._id}
            className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow border border-blue-100 hover:border-blue-300 group"
          >
            {p.mainImage && (
              <img
                src={p.mainImage.startsWith("http") ? p.mainImage : `${API_BASE}${p.mainImage}`}
                alt={p.houseName}
                className="w-full h-40 object-cover rounded-md mb-3 group-hover:opacity-90 transition-opacity"
              />
            )}
            <h3 className="text-lg font-bold text-blue-800 mb-1 truncate">
              {p.houseName}
            </h3>
            <p className="text-sm text-blue-600 mb-1 truncate">{p.address}</p>
            <p className="font-semibold text-blue-700">Price: {p.price}৳</p>
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={() => navigate(`/properties/${p._id}`)}
                className="px-3 py-1 rounded bg-blue-600 text-white text-sm hover:bg-blue-700"
              >
                View
              </button>
              <button
                onClick={() => handleRemove(p._id)}
                className="px-3 py-1 rounded bg-red-500 text-white text-sm hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}