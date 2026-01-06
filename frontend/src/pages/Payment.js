import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CreditCard } from "lucide-react";
import API_BASE from "../config/api";

const Payment = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const property = location.state?.property;
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);

  if (!property) {
    return (
      <div className="text-center mt-10 text-red-500">
        No property selected.
      </div>
    );
  }

  // Calculate days (inclusive)
  const getDays = () => {
    if (!fromDate || !toDate) return 0;
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const diff = (to - from) / (1000 * 60 * 60 * 24);
    return diff >= 0 ? diff + 1 : 0;
  };

  const days = getDays();
  const totalPrice = days * (property.price || 0);

  const handleRentNow = async () => {
    if (!user) {
      alert("You must be logged in to rent.");
      return;
    }
    if (!fromDate || !toDate || days <= 0) {
      alert("Please select valid dates.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/rental-requests/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          property: property._id,
          tenant: user.id,
          fromDate,
          toDate,
          totalPrice,
        }),
      });
      if (res.ok) {
        alert("Rental request submitted successfully!");
        navigate(`/tenant-dashboard`);
      } else {
        alert("Failed to submit rental request.");
      }
    } catch (err) {
      alert("An error occurred while submitting the rental request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-blue-800 text-center">
          Payment
        </h2>
        <div className="mb-4">
          <div className="mb-2">
            <span className="font-semibold text-blue-700">Property:</span>{" "}
            {property.houseName}
          </div>
          <div className="mb-2">
            <span className="font-semibold text-blue-700">Price per day:</span>{" "}
            {property.price}৳
          </div>
        </div>
        <div className="flex flex-col gap-4 mb-6">
          <div>
            <label className="block text-blue-700 font-medium mb-1">From:</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="border border-blue-200 rounded px-3 py-2 w-full"
            />
          </div>
          <div>
            <label className="block text-blue-700 font-medium mb-1">To:</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="border border-blue-200 rounded px-3 py-2 w-full"
            />
          </div>
        </div>
        <div className="text-blue-900 mb-4">
          <p>
            <span className="font-semibold">Days:</span> {days}
          </p>
          <p className="text-lg font-bold mt-2">
            Total Price: <span className="text-green-700">{totalPrice}৳</span>
          </p>
        </div>
        <button
          onClick={handleRentNow}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow w-full disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <CreditCard size={18} />
          {loading ? "Processing..." : "Make Payment"}
        </button>
      </div>
    </div>
  );
};

export default Payment;