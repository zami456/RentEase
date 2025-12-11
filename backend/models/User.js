// backend/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },

  firstName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  phone: {
    type: Number,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  about: {
    type: String,
    required: false,
  },

  profileImage: {
    type: String, // Base64-encoded image will be stored as a string
    required: false, // Optional field
  },
  role: {
    type: String,
    enum: ["Owner", "Tenant"],
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);