// frontend/components/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE from "../config/api";


axios.defaults.withCredentials = true;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchReports();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/admin/users`, {
        withCredentials: true,
      });
      setUsers(res.data.users);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  const fetchReports = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/admin/reports`, {
        withCredentials: true,
      });
      setReports(res.data.reports);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await axios.delete(`${API_BASE}/api/admin/users/${id}`, {
        withCredentials: true,
      });
      fetchUsers(); // Refresh user list after deletion
    }
  };

  const viewPropertyDetails = (propertyId) => {
    // Redirect to the property details page
    navigate(`/property/${propertyId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 p-6">
      {/* USERS */}
      <section className="max-w-5xl mx-auto mb-12">
        <h2 className="text-3xl font-semibold text-blue-800 mb-6 tracking-tight">
          👥 All Users
        </h2>
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full bg-white rounded-lg">
            <thead>
              <tr className="bg-blue-100 text-blue-800">
                <th className="p-3 font-medium text-left">Name</th>
                <th className="p-3 font-medium text-left">Email</th>
                <th className="p-3 font-medium text-left">Role</th>
                <th className="p-3 font-medium text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u._id}
                  className="border-t border-blue-100 hover:bg-blue-50 transition"
                >
                  <td className="p-3">{u.username}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3 capitalize text-blue-700">{u.role}</td>
                  <td className="p-3">
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded transition shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                      onClick={() => deleteUser(u._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* REPORTS */}
      <section className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-semibold text-blue-800 mb-6 tracking-tight">
          📩 User Reports
        </h2>
        <div className="space-y-6">
          {reports.map((r) => (
            <div
              key={r._id}
              className="bg-white border border-blue-100 rounded-lg p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-blue-700">
                  {r.reportedBy?.username || "Unknown"}{" "}
                  <span className="text-xs text-blue-400">
                    ({r.reportedBy?.role})
                  </span>
                </span>
                <span className="text-xs text-blue-300">
                  {new Date(r.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-blue-900 italic mb-2">"{r.description}"</p>
              {r.propertyId && (
                <div className="flex items-center justify-between text-blue-600 text-sm mb-2">
                  <div>
                    🏠 <span className="font-medium">Reported Property:</span>{" "}
                    {r.propertyId.houseName || "N/A"}
                  </div>
                  <button
                    className="bg-blue-400 hover:bg-blue-600 text-white px-4 py-1 rounded transition focus:outline-none focus:ring-2 focus:ring-blue-200 ml-4"
                    onClick={() => viewPropertyDetails(r.propertyId._id)}
                  >
                    View Details
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* PROPERTY MODAL */}
      {showModal && selectedProperty && (
        <div className="fixed inset-0 bg-blue-900 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl relative border border-blue-200">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-blue-400 hover:text-blue-700 text-xl focus:outline-none"
              aria-label="Close"
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold text-blue-800 mb-4">
              {selectedProperty.houseName}
            </h3>
            <img
              src={selectedProperty.image}
              alt="Property"
              className="w-full h-44 object-cover rounded mb-4 border border-blue-100"
            />
            <div className="space-y-1 text-blue-700 text-sm">
              <p>
                <span className="font-medium">Address:</span>{" "}
                {selectedProperty.address}
              </p>
              <p>
                <span className="font-medium">Rooms:</span>{" "}
                {selectedProperty.rooms}
              </p>
              <p>
                <span className="font-medium">Bedrooms:</span>{" "}
                {selectedProperty.bedrooms}
              </p>
              <p>
                <span className="font-medium">Kitchens:</span>{" "}
                {selectedProperty.kitchens}
              </p>
              <p>
                <span className="font-medium">Washrooms:</span>{" "}
                {selectedProperty.washrooms}
              </p>
              <p>
                <span className="font-medium">Square Feet:</span>{" "}
                {selectedProperty.squareFeet} sqft
              </p>
              <p>
                <span className="font-medium">Rent Days:</span>{" "}
                {selectedProperty.rentDays} days
              </p>
              <p>
                <span className="font-medium">Price:</span>{" "}
                <span className="text-blue-900 font-semibold">
                  ৳{selectedProperty.price}
                </span>
              </p>
            </div>
            <hr className="my-4 border-blue-100" />
            <p className="text-xs text-blue-300 mt-2">
              Posted on{" "}
              {new Date(selectedProperty.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;