// src/pages/PropertyManagement.js
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CreateAdvertisement from "../components/CreateAdvertisement";
import FlatApproval from "../components/FlatApproval";
import MyAdvertisement from "../components/MyAdvertisement";
import API_BASE from "../config/api";

export default function PropertyManagement() {
  const [activeTab, setActiveTab] = useState("create");
  const navigate = useNavigate();
  const { propertyId } = useParams();

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to log out?")) return;
    try {
  await fetch(`${API_BASE}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      navigate("/login");
    } catch (err) {
      console.error("Failed to log out:", err);
    }
  };

  // Sidebar navigation items
  const navItems = [
    { key: "create", label: "Create Advertisement" },
    { key: "myAds", label: "My Advertisements" },
    { key: "approval", label: "Flat Approval" },
  ];

  return (
    <div className="flex min-h-screen bg-blue-50">
      {/* Sidebar */}
      <aside className="w-72 bg-blue-900 text-white flex flex-col py-8 px-4 shadow-lg">
        <div className="mb-8 text-2xl font-bold tracking-tight text-blue-100 text-center select-none">
          Owner Dashboard
        </div>
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`w-full text-left px-4 py-2 rounded transition-colors duration-150 font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-blue-800 hover:bg-blue-800 ${
                activeTab === item.key
                  ? "bg-blue-700 text-blue-100"
                  : "text-blue-100"
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => navigate("/profile")}
            className="w-full text-left px-4 py-2 rounded transition-colors duration-150 font-medium text-blue-100 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Personal Information
          </button>
        </nav>
        <button
          onClick={handleLogout}
          className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded shadow transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 flex flex-col items-center justify-start">
        <div className="w-full max-w-3xl bg-white rounded-lg shadow p-6 min-h-[400px]">
          {activeTab === "create" && (
            <CreateAdvertisement onCreated={() => setActiveTab("myAds")} />
          )}
          {activeTab === "myAds" && <MyAdvertisement />}
          {activeTab === "approval" && <FlatApproval />}
        </div>
      </main>
    </div>
  );
}