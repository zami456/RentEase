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
  latitude: { type: Number },
  longitude: { type: Number },
  mainImage: { type: String, required: true },
  roomImages: [{type: String}],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  description: {type: String, required: true},
  createdAt: { type: Date, default: Date.now },
});

const PropertyModel = mongoose.model("Property", propertySchema);

// Wrapper API for DB-agnostic controller usage
PropertyModel.repo = {
  create(data) {
    return PropertyModel.create(data);
  },
  findByOwner(ownerId) {
    return PropertyModel.find({ owner: ownerId });
  },
  findAll() {
    return PropertyModel.find({});
  },
  findWithFilter(filter = {}) {
    return PropertyModel.find(filter);
  },
  findById(id) {
    return PropertyModel.findById(id);
  },
  findByIdWithOwner(id) {
    return PropertyModel.findById(id).populate("owner", "username email phone");
  },
  deleteById(id) {
    return PropertyModel.findByIdAndDelete(id);
  },
  search({ address, rooms }) {
    const filter = {};
    if (address) filter.address = { $regex: address, $options: "i" };
    if (rooms) filter.rooms = Number(rooms);
    return PropertyModel.find(filter);
  },
};

module.exports = PropertyModel;