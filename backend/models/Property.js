// backend/models/Property.js
const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  houseName: { type: String, required: true },
  address: { type: String, required: true },
  contact: {type: String, required: true},
  rooms: { type: Number, required: true },
  washrooms: { type: Number, required: true },
  squareFeet: { type: Number, required: true },
  price: { type: Number, required: true },
  mainImage: { type: String, required: true },
  roomImages: [{type: String}],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  description: {type: String, required: true},
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Property", propertySchema);
