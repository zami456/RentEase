// src/pages/OwnerDashboard.js
import React from "react";
import PropertyManagement from "./PropertyManagement";

export default function OwnerDashboard() {
  return (
    <div>
      <main>
        {/* Embed the Property Management page */}
        <PropertyManagement />
      </main>
    </div>

    
  );
}