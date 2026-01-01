// src/components/PropertyCard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import API_BASE_URL from "../config/api";

const PropertyCard = ({ property }) => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/auth/session`,
          {
            withCredentials: true,
          }
        );
        if (response.data.loggedIn) {
          setUserId(response.data.user.id);
        }
      } catch (error) {
        console.error("Failed to fetch user session:", error);
      }
    };

    fetchUserId();
  }, []);

  return (
    <div className="bg-white border border-blue-100 rounded-2xl shadow-sm hover:shadow-lg transition-shadow max-w-md mx-auto relative flex flex-col">
      {/* Property Image and Link to Details */}
      <Link to={`/property/${property._id}`} className="block">
        <img
          src={property.mainImage?.startsWith("http") ? property.mainImage : `https://tenantsync-backend.onrender.com${property.mainImage}`}
          alt="Flat"
          className="w-full h-48 object-cover rounded-t-2xl bg-blue-100"
        />
        <div className="p-4">
          <h2 className="text-lg font-bold text-blue-900 mb-1 truncate">
            {property.houseName}
          </h2>
          <p className="text-blue-500 text-sm mb-2 truncate">
            {property.address}
          </p>
          {/* Room and Rent Information */}
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-blue-400">
              Rooms: {property.rooms}
            </span>
            <span className="text-base font-semibold text-blue-700">
              {property.price}৳
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PropertyCard;