// src/pages/Home.js
import React, { useEffect, useState } from "react";
import PropertyCard from "../components/propertycard";
import SearchBar from "../components/searchbar";
import API_BASE from "../config/api";

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roomFilter, setRoomFilter] = useState("");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/properties/all`);
        const data = await res.json();
        setProperties(data.properties || []);
      } catch (err) {
        console.error("Failed to fetch properties:", err);
      }
    };

    fetchProperties();
  }, []);

  const filteredProperties = properties.filter((prop) => {
    const matchesAddress = prop.address
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesRoom = roomFilter ? prop.rooms === Number(roomFilter) : true;
    return matchesAddress && matchesRoom;
  });

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center py-10 px-2">
      <h1 className="text-4xl font-bold text-blue-900 mb-6 text-center tracking-tight">
        Welcome to RentEase{" "}
        <span role="img" aria-label="house">
          🏠
        </span>
      </h1>
      <div className="w-full max-w-3xl mb-8">
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          roomFilter={roomFilter}
          setRoomFilter={setRoomFilter}
        />
      </div>
      <div className="w-full max-w-6xl">
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
            {filteredProperties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 bg-blue-100 rounded-lg shadow-sm">
            <p className="text-blue-400 text-lg">No matching flats found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;