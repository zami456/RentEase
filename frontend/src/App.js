import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import API_BASE_URL from "./config/api";

// importing pages and components
import Home from "./pages/home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import TenantDashboard from "./pages/TenantDashboard";
import ReportForm from "./pages/ReportForm";

import PropertyDetails from "./pages/PropertyDetails";
import OwnerDashboard from "./pages/OwnerDashboard";
import Payment from "./pages/Payment";
import AdminDashboard from "./components/AdminDashboard";

function AppRoutes({ user, setUser }) {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith("/admin");

  return (
    <>
      {!hideNavbar && <Navbar user={user} />}
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile user={user} />} />
          <Route path="/tenant-dashboard" element={<TenantDashboard user={user} />} />
          <Route path="/report/:id" element={<ReportForm />} />
          <Route path="/property/:id" element={<PropertyDetails user={user} />} />
          <Route path="/owner-dashboard/*" element={<OwnerDashboard user={user} />} />
          <Route path="/payment" element={<Payment user={user} />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
          {/* Add other routes here */}
  
        </Routes>
      </div>
      <Footer />
    </>
  );
}

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/session`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.loggedIn) {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Session check failed:", error);
      }
    };
    checkSession();
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <AppRoutes user={user} setUser={setUser} />
      </BrowserRouter>
    </div>
  );
}

export default App;
