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

const UserModel = mongoose.model("User", userSchema);

// Wrapper API to keep controllers database-agnostic
UserModel.repo = {
  create(data) {
    return UserModel.create(data);
  },
  findBasicUsers() {
    return UserModel.find({}, "username email role");
  },
  findOneByEmail(email) {
    return UserModel.findOne({ email });
  },
  findAllSorted(sort = { createdAt: -1 }) {
    return UserModel.find({}).sort(sort);
  },
  findById(id) {
    return UserModel.findById(id);
  },
  deleteById(id) {
    return UserModel.findByIdAndDelete(id);
  },
  updateById(id, update) {
    return UserModel.findOneAndUpdate({ _id: id }, update, { new: true });
  },
  isValidId(id) {
    return mongoose.Types.ObjectId.isValid(id);
  },
};

module.exports = UserModel;