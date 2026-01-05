// src/components/CreateAdvertisement.js
import React, { useState } from "react";
import axios from "axios";
import API_BASE from "../config/api";
axios.defaults.withCredentials = true;
export default function CreateAdvertisement({ onCreated }) {
  const [form, setForm] = useState({
    houseName: "",
    address: "",
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

    try {
  await axios.post(
        `${API_BASE}/api/properties/create`,
        formData,
        {
          
          //headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
  );
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
        {/* Address */}
        <div className="col-span-1 md:col-span-2 flex flex-col">
          <label className="font-medium text-blue-700 mb-1">Address</label>
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            required
            className="px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-blue-900 placeholder-blue-300"
            placeholder="Enter address"
          />
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