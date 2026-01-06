import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE from "../config/api";

const MyRentalHistory = () => {
  const [rentalRequests, setRentalRequests] = useState([]);

  useEffect(() => {
    const fetchRentalRequests = async () => {
      try {
        const response = await axios.get(
          `${API_BASE}/api/rental-requests/my-requests`
        );
        console.log(response.data);
        setRentalRequests(response.data);
      } catch (error) {
        console.error("Error fetching rental requests:", error);
      }
    };

    fetchRentalRequests();
  }, []);

  return (
    <div className="rental-history min-h-screen bg-gradient-to-b from-blue-50 via-blue-100 to-blue-200 py-10 px-2 sm:px-8">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-extrabold text-blue-800 mb-8 text-center tracking-tight">
          My Rental History
        </h2>
        {rentalRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 bg-white/60 rounded-lg shadow-sm">
            <p className="text-blue-400 text-lg">No rental requests found.</p>
          </div>
        ) : (
          <ul className="space-y-6">
            {rentalRequests.map((request) => (
              <li
                key={request._id}
                className="bg-white/90 border border-blue-100 rounded-xl shadow hover:shadow-lg transition-shadow p-6 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-xl font-semibold text-blue-700 truncate">
                    {request.property.houseName}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide 
                      ${
                        request.status === "pending"
                          ? "bg-red-100 text-red-600"
                          : request.status === "approved"
                          ? "bg-green-200 text-green-800"
                          : "bg-blue-50 text-blue-400"
                      }
                    `}
                  >
                    {request.status}
                  </span>
                </div>
                <p className="text-blue-500 text-sm truncate">
                  Address:{" "}
                  <span className="font-medium text-blue-700">
                    {request.property.address}
                  </span>
                </p>
                <p className="text-blue-500 text-sm truncate">
                  Owner:{" "}
                  <span className="font-medium text-blue-700">
                    {request.property.owner.username}
                  </span>
                </p>
                <p className="text-blue-500 text-sm truncate">
                  Contact:{" "}
                  <span className="font-medium text-blue-700">
                    {request.property.owner.phone || request.property.owner.email}
                  </span>
                </p>
                <p className="text-blue-400 text-xs mt-2">
                  Requested On:{" "}
                  <span className="font-medium text-blue-600">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </span>
                  <span className="mx-1">at</span>
                  <span className="font-medium text-blue-600">
                    {new Date(request.createdAt).toLocaleTimeString()}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MyRentalHistory;