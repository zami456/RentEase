import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MyRentalHistory from "../components/MyRentalHistory";
import Wishlist from "../components/wishlist";
import API_BASE from "../config/api";

const TenantDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState("rentalHistory");
  const navigate = useNavigate();

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (!confirmLogout) return;

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

  const renderContent = () => {
    switch (activeTab) {
      case "rentalHistory":
        return <MyRentalHistory />;
      case "wishlist":
        return <Wishlist user={user} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-blue-50">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col py-8 px-6 min-h-screen sticky top-0">
        <h2 className="text-2xl font-bold mb-8 text-blue-100 tracking-tight">
          Dashboard
        </h2>
        <ul className="flex-1 space-y-2">
          <li>
            <button
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors font-medium ${
                activeTab === "rentalHistory"
                  ? "bg-blue-700 text-white"
                  : "hover:bg-blue-800 text-blue-100"
              }`}
              onClick={() => setActiveTab("rentalHistory")}
            >
              Rental History
            </button>
          </li>
          <li>
            <button
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors font-medium ${
                activeTab === "wishlist"
                  ? "bg-blue-700 text-white"
                  : "hover:bg-blue-800 text-blue-100"
              }`}
              onClick={() => setActiveTab("wishlist")}
            >
              Wishlist
            </button>
          </li>
          <li>
            <button
              className="w-full text-left px-4 py-2 rounded-lg transition-colors font-medium hover:bg-blue-800 text-blue-100"
              onClick={() => navigate("/profile")}
            >
              Personal Information
            </button>
          </li>
        </ul>
        <button
          className="mt-8 w-full text-left px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
          onClick={handleLogout}
        >
          Log Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">{renderContent()}</main>
    </div>
  );
};

export default TenantDashboard;