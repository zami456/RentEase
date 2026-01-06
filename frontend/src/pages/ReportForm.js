import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API_BASE from "../config/api";

const ReportForm = () => {
  const { id } = useParams();
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_BASE}/api/reports`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ propertyId: id, description }),
    });
    if (res.ok) {
      alert("Report submitted successfully");
      navigate("/");
    } else {
      alert("Failed to submit report");
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
        <h2 className="text-2xl font-bold mb-6 text-blue-900 text-center tracking-tight">
          Report Property
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <textarea
            className="w-full border border-blue-200 bg-blue-50 rounded-xl p-4 focus:ring-2 focus:ring-blue-400 focus:outline-none text-blue-900 placeholder-blue-300 shadow-sm transition min-h-[120px]"
            rows="5"
            placeholder="Describe the issue..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Submit Report
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportForm;