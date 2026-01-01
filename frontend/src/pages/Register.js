// src/pages/Register.js
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config/api";

// Ensure axios sends credentials with requests
axios.defaults.withCredentials = true;

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "Tenant", // default role
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (error) setError("");
    if (success) setSuccess("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/api/auth/register`, form);
      setSuccess("Registered successfully! Now, login.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      if (
        err.response &&
        err.response.data &&
        err.response.data.message &&
        err.response.data.message
          .toLowerCase()
          .includes("email is already registered")
      ) {
        setError("Email is already registered.");
      } else {
        alert("Error registering. Please try again.");
      }
    }
  };

  return (
    <>
      {error && (
        <div className="fixed top-0 left-1/2 transform -translate-x-1/2 bg-blue-900 text-white px-6 py-3 rounded-b-md z-50 text-base shadow-md">
          {error}
        </div>
      )}
      {success && (
        <div className="fixed top-0 left-1/2 transform -translate-x-1/2 bg-blue-700 text-white px-6 py-3 rounded-b-md z-50 text-base shadow-md">
          {success}
        </div>
      )}
      <div className="min-h-screen bg-blue-50 flex justify-center items-center px-4">
        <div className="flex flex-col items-center w-full">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm text-blue-900"
          >
            <h2 className="text-2xl mb-6 font-bold text-center text-blue-800">
              Register
            </h2>
            <div className="mb-4">
              <input
                name="username"
                onChange={handleChange}
                placeholder="Username"
                className="w-full p-3 border border-blue-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-100 placeholder-blue-400 transition"
              />
            </div>
            <div className="mb-4">
              <input
                name="email"
                onChange={handleChange}
                placeholder="Email"
                className="w-full p-3 border border-blue-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-100 placeholder-blue-400 transition"
              />
            </div>
            <div className="mb-6">
              <input
                type="password"
                name="password"
                onChange={handleChange}
                placeholder="Password"
                className="w-full p-3 border border-blue-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-100 placeholder-blue-400 transition"
              />
            </div>
            <div className="mb-6">
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full p-3 border border-blue-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-100 text-blue-900 transition"
              >
                <option value="Tenant" className="text-blue-700">
                  Tenant
                </option>
                <option value="Owner" className="text-blue-700">
                  Owner
                </option>
              </select>
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-1/2 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-full text-sm font-semibold transition-colors shadow-sm"
              >
                Sign Up
              </button>
            </div>
          </form>
          <p className="text-center text-sm text-blue-700 mt-6">
            Already registered?{" "}
            <span
              className="underline cursor-pointer hover:text-blue-900"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </>
  );
}