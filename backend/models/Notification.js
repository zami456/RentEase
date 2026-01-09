// backend/models/Notification.js
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const NotificationModel = mongoose.model("Notification", notificationSchema);

NotificationModel.repo = {
  create(data) {
    return NotificationModel.create(data);
  },
};

module.exports = NotificationModel;