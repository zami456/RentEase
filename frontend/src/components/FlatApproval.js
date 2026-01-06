import React, { useEffect, useState } from "react";
import moment from "moment";
import API_BASE from "../config/api";

export default function FlatApproval() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch only this owner's pending requests
  const fetchRequests = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/rental-requests`, {
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to fetch rental requests");
      }
      const data = await res.json(); // data is an array of requests
      setRequests(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id) => {
    try {
      const res = await fetch(
        `${API_BASE}/api/rental-requests/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ status: "approved" }),
        }
      );
      if (res.ok) setRequests((prev) => prev.filter((r) => r._id !== id));
      else console.error("Failed to approve request");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(
        `${API_BASE}/api/rental-requests/${id}`,
        { method: "DELETE", credentials: "include" }
      );
      if (res.ok) setRequests((prev) => prev.filter((r) => r._id !== id));
      else console.error("Failed to delete request");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="text-center mt-6">Loading requests...</p>;
  if (error) return <p className="text-center mt-6 text-red-500">{error}</p>;

  return (
    <div className="p-2 sm:p-4">
      {requests.length === 0 ? (
        <p className="text-center text-blue-400">No pending rental requests.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {requests.map((req) => (
            <div
              key={req._id}
              className="bg-white border border-blue-100 hover:border-blue-300 shadow-sm rounded-xl p-5 flex flex-col justify-between transition-colors group"
            >
              <div>
                <h3 className="text-lg font-bold text-blue-800 mb-2 truncate">
                  {req.property.houseName}
                </h3>
                <p className="text-sm text-blue-600 mb-1 truncate">
                  <span className="font-medium text-blue-700">Address:</span>{" "}
                  {req.property.address}
                </p>
                <p className="text-sm text-blue-500 mb-1 truncate">
                  <span className="font-medium text-blue-700">Tenant:</span>{" "}
                  {req.tenant.username || req.tenant.email}
                </p>
                <p className="text-sm text-blue-500 mb-1 truncate">
                  <span className="font-medium text-blue-700">Contact:</span>{" "}
                  {req.tenant.phone || req.tenant.email}
                </p>
                <p className="text-xs text-blue-800 mt-2">
                  Requested {moment(req.createdAt).fromNow()}
                </p>
              </div>
              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => handleApprove(req._id)}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleDelete(req._id)}
                  className="flex-1 px-4 py-2 bg-red-200 text-red-700 rounded-full font-semibold hover:bg-red-300 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}