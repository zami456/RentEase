const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const ReportModel = mongoose.model("Report", reportSchema);

ReportModel.repo = {
  create(data) {
    const report = new ReportModel(data);
    return report.save();
  },
  findAllWithRelations() {
    return ReportModel.find()
      .populate("reportedBy")
      .populate("propertyId");
  },
};

module.exports = ReportModel;