const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String
  }
}, { timestamps: true });

const ReviewModel = mongoose.model("Review", reviewSchema);

ReviewModel.repo = {
  create(data) {
    return ReviewModel.create(data);
  },
  findOne(filter) {
    return ReviewModel.findOne(filter);
  },
  findByPropertyWithUser(propertyId) {
    return ReviewModel.find({ propertyId }).populate("userId", "username");
  },
};

module.exports = ReviewModel;