// src/components/CreateAdvertisement.js
import React, { useState } from "react";
import axios from "axios";
import Map from "./map";
import API_BASE_URL from "../config/api";

axios.defaults.withCredentials = true;

const API_BASE = API_BASE_URL;
export default function CreateAdvertisement({ onCreated }) {
  const [form, setForm] = useState({
    houseName: "",
    address: "",
    latitude: "",
    longitude: "",
    contact: "",
    rooms: "",
    kitchens: "",
    bedrooms: "",
    washrooms: "",
    squareFeet: "",
    rentDays: "",
    price: "", // NEW: Price of the flat
    description: "", // NEW: Description field
  });
  const [mainImage, setMainImage] = useState(null);
  const [roomImages, setRoomImages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  // Map search state
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const handleMainImageChange = (e) => {
    setMainImage(e.target.files[0]);
  };


  const handleRoomImagesChange = (e) => {
    // Convert FileList to array and limit to 3 files
    const files = Array.from(e.target.files).slice(0, 3);
    setRoomImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    
  
  
    formData.append("houseName", form.houseName);
    formData.append("address", form.address);
    formData.append("latitude", form.latitude);
    formData.append("longitude", form.longitude);
    formData.append("contact", form.contact);
    formData.append("rooms", form.rooms);
    formData.append("kitchens", form.kitchens);
    formData.append("bedrooms", form.bedrooms);
    formData.append("washrooms", form.washrooms);
    formData.append("squareFeet", form.squareFeet);
    formData.append("rentDays", form.rentDays);
    formData.append("price", form.price);
    formData.append("description", form.description);
    
    //append main image
    if (mainImage) {
      formData.append("mainImage", mainImage);
    }
    // Append room images - all with same field name
    roomImages.forEach((image) => {
      formData.append("roomImages", image);
    });

    if (!form.latitude || !form.longitude) {
      setLoading(false);
      setMessage("Please pick a location on the map.");
      return;
    }

    try {
      await axios.post(`${API_BASE}/api/properties/create`, formData, {
        withCredentials: true,
      });
      alert("Advertisement created successfully!");
      setMessage("");
      if (typeof onCreated === "function") onCreated();
    } catch (err) {
      setMessage("Error creating advertisement.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-xl mx-auto bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl shadow-lg mt-10">
      <h2 className="text-2xl font-semibold text-center text-blue-800 mb-8 tracking-tight">
        Create Advertisement
      </h2>
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* House Name */}
        <div className="col-span-1 md:col-span-2 flex flex-col">
          <label className="font-medium text-blue-700 mb-1">House Name</label>
          <input
            name="houseName"
            value={form.houseName}
            onChange={handleChange}
            required
            className="px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-blue-900 placeholder-blue-300"
            placeholder="Enter house name"
          />
        </div>
        {/* Address via Map Search */}
        <div className="col-span-1 md:col-span-2 flex flex-col space-y-2">
          <label className="font-medium text-blue-700">Select Address on Map</label>
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-blue-900 placeholder-blue-300"
              placeholder="Search address (type and press Enter)"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  // Simple Nominatim search
                  if (!query.trim()) return;
                  fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`)
                    .then((res) => res.json())
                    .then((data) => setResults(data.slice(0, 5)))
                    .catch(() => setResults([]));
                }
              }}
            />
            <button
              type="button"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              onClick={() => {
                if (!query.trim()) return;
                fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`)
                  .then((res) => res.json())
                  .then((data) => setResults(data.slice(0, 5)))
                  .catch(() => setResults([]));
              }}
            >
              Search
            </button>
          </div>
          {results.length > 0 && (
            <ul className="border border-blue-200 rounded-lg bg-white divide-y">
              {results.map((r) => (
                <li
                  key={`${r.place_id}`}
                  className="p-2 hover:bg-blue-50 cursor-pointer"
                  onClick={() => {
                    const lat = parseFloat(r.lat);
                    const lon = parseFloat(r.lon);
                    setForm((prev) => ({
                      ...prev,
                      address: r.display_name,
                      latitude: String(lat),
                      longitude: String(lon),
                    }));
                    setSelectedLocation({ lat, lng: lon });
                    setResults([]);
                  }}
                >
                  {r.display_name}
                </li>
              ))}
            </ul>
          )}
          <div className="rounded-lg border border-blue-200 overflow-hidden" style={{ minHeight: "320px" }}>
            <Map
              initialCenter={{ lat: 23.7806, lng: 90.407 }}
              zoom={12}
              selected={selectedLocation}
              onSelect={({ lat, lng }) => {
                setSelectedLocation({ lat, lng });
                setForm((prev) => ({ ...prev, latitude: String(lat), longitude: String(lng) }));
              }}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              className="px-3 py-2 border rounded"
              placeholder="Selected address"
              readOnly
            />
            <input
              name="latitude"
              value={form.latitude}
              onChange={handleChange}
              className="px-3 py-2 border rounded"
              placeholder="Latitude"
              readOnly
            />
            <input
              name="longitude"
              value={form.longitude}
              onChange={handleChange}
              className="px-3 py-2 border rounded"
              placeholder="Longitude"
              readOnly
            />
          </div>
        </div>
        {/* for contact field*/}
        <div className="col-span-1 md:col-span-2 flex flex-col">
          <label className="font-medium text-blue-700 mb-1">Contact Info</label>
          <input
            name="contact"
            value={form.contact}
            onChange={handleChange}
            required
            className="px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-blue-900 placeholder-blue-300"
            placeholder="Enter Personal Contact"
          />
        </div>
        
        {/* Rooms */}
        <div className="flex flex-col">
          <label className="font-medium text-blue-700 mb-1">Rooms</label>
          <input
            name="rooms"
            type="number"
            value={form.rooms}
            onChange={handleChange}
            required
            className="px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-blue-900 placeholder-blue-300"
            placeholder="0"
            min="0"
          />
        </div>

        {/* Washrooms */}
        <div className="flex flex-col">
          <label className="font-medium text-blue-700 mb-1">Washrooms</label>
          <input
            name="washrooms"
            type="number"
            value={form.washrooms}
            onChange={handleChange}
            required
            className="px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-blue-900 placeholder-blue-300"
            placeholder="0"
            min="0"
          />
        </div>
        {/* Square Feet */}
        <div className="flex flex-col">
          <label className="font-medium text-blue-700 mb-1">Square Feet</label>
          <input
            name="squareFeet"
            type="number"
            value={form.squareFeet}
            onChange={handleChange}
            required
            className="px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-blue-900 placeholder-blue-300"
            placeholder="0"
            min="0"
          />
        </div>
        {/* Price */}
        <div className="flex flex-col">
          <label className="font-medium text-blue-700 mb-1">Price</label>
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            required
            className="px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-blue-900 placeholder-blue-300"
            placeholder="0"
            min="0"
          />
        </div>
        {/* NEW: Description Field */}
        <div className="col-span-1 md:col-span-2 flex flex-col">
          <label className="font-medium text-blue-700 mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="4"
            className="px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-blue-900 placeholder-blue-300"
            placeholder="Enter Related description"
          />
        </div>
        
        {/* Main Image Upload */}
        <div className="col-span-1 md:col-span-2 flex flex-col">
          <label className="font-medium text-blue-700 mb-1">Cover Image</label>
          <input
            name="mainImage"
            type="file"
            accept="image/*"
            onChange={handleMainImageChange}
            required
            className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-200 file:text-blue-800 hover:file:bg-blue-300 bg-white text-blue-900"
          />
        </div>
        
        {/* Room Images Upload */}
        <div className="col-span-1 md:col-span-2 flex flex-col">
          <label className="font-medium text-blue-700 mb-1">Room Images (up to 3)</label>
          <input
            name="roomImages"
            type="file"
            accept="image/*"
            multiple
            onChange={handleRoomImagesChange}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-200 file:text-blue-800 hover:file:bg-blue-300 bg-white text-blue-900"
          />
          <p className="text-xs text-blue-500 mt-1">You can select up to 3 images</p>
        </div>

        {/* Submit Button */}
        <div className="col-span-1 md:col-span-2 flex justify-center mt-2">
          <button
            type="submit"
            disabled={loading}
            className={`px-8 py-2 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-full font-semibold shadow hover:from-blue-700 hover:to-blue-500 transition-all duration-200 ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="inline-block w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" aria-hidden="true"></span>
                Saving...
              </span>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </form>
  {/* Success is shown via alert; keep inline messages empty */}
    </div>
  );
}