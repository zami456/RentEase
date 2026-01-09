const mongoose = require("mongoose");
const { Schema } = mongoose;

const WishlistSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
  },
  { timestamps: true }
);

const WishlistModel = mongoose.model("Wishlist", WishlistSchema);

WishlistModel.repo = {
  create(data) {
    return WishlistModel.create(data);
  },
  findByUser(userId) {
    return WishlistModel.find({ user: userId }).populate("property");
  },
  deleteById(id) {
    return WishlistModel.findByIdAndDelete(id);
  },
};

module.exports = WishlistModel;