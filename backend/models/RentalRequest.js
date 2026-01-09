// backend/models/RentalRequest.js
const mongoose = require("mongoose");

const rentalRequestSchema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

const RentalRequestModel = mongoose.model("RentalRequest", rentalRequestSchema);

RentalRequestModel.repo = {
  create(data) {
    const req = new RentalRequestModel(data);
    return req.save();
  },
  updateById(id, updates) {
    return RentalRequestModel.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
  },
  deleteById(id) {
    return RentalRequestModel.findByIdAndDelete(id);
  },
  findById(id) {
    return RentalRequestModel.findById(id);
  },
  findByIdWithTenant(id) {
    return RentalRequestModel.findById(id).populate("tenant");
  },
  findPendingByPropertyIds(propertyIds) {
    return RentalRequestModel.find({ property: { $in: propertyIds }, status: "pending" })
      .populate("property")
      .populate("tenant", "username email phone");
  },
  findForTenant(tenantId) {
    return RentalRequestModel.find({ tenant: tenantId }).populate({
      path: "property",
      populate: { path: "owner", select: "username email phone" },
      select: "houseName address owner",
    });
  },
  findForOwner(ownerId) {
    return RentalRequestModel.find()
      .populate({
        path: "property",
        match: { owner: ownerId },
      })
      .populate("tenant", "name email");
  },
};

module.exports = RentalRequestModel;
