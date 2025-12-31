import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config/api";

// Ensure cookies are sent with requests
axios.defaults.withCredentials = true;

export default function Login({ setUser }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(""); // For error messages
  const [welcome, setWelcome] = useState(""); // For welcome message
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (error) setError("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Hardcoded admin check
    if (form.email === "admin" && form.password === "admin") {
      setWelcome("Welcome, Admin");
      setTimeout(() => {
        setWelcome("");
        navigate("/admin/dashboard");
      }, 1000);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("The email address is not valid");
      setTimeout(() => setError(""), 3000);
      return;
    }

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        form
      );
      console.log("Login response:", res.data);
      setWelcome(`Welcome, ${res.data.user.username}`);
      // localStorage.setItem("myKey", res.data.user.id);
      setUser(res.data.user);
      setTimeout(() => {
        setWelcome("");
        // Check role and redirect accordingly
        if (res.data.user.role === "Owner") {
          navigate("/owner-dashboard");
        } else if (res.data.user.role === "Tenant") {
          navigate("/");
        } else {
          navigate("/admin");
        }
      }, 1000);
    } catch (err) {
      const errMsg =
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message.toLowerCase()
          : "";
      if (errMsg.includes("password")) {
        setError("Give the correct password");
      } else if (
        errMsg.includes("not registered") ||
        errMsg.includes("no user")
      ) {
        setError("This email is not registered");
      } else {
        setError("Invalid credentials. Please try again.");
      }
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex justify-center items-center px-4 relative">
      {/* Floating Error Message */}
      {error && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-blue-900 text-white px-6 py-3 rounded-b-md z-50 text-base shadow-md">
          {error}
        </div>
      )}
      {/* Floating Welcome Message */}
      {welcome && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-blue-700 text-white px-6 py-3 rounded-b-md z-50 text-base shadow-md">
          {welcome}
        </div>
      )}
      <div className="flex flex-col items-center w-full">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm text-blue-900"
        >
          <h2 className="text-2xl mb-6 font-bold text-center text-blue-800">
            Login
          </h2>
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
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-1/2 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-full text-sm font-semibold transition-colors shadow-sm"
            >
              Login
            </button>
          </div>
        </form>
        <p className="text-center text-sm text-blue-700 mt-6">
          Did not sign up yet? then{" "}
          <span
            className="underline cursor-pointer hover:text-blue-900"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}