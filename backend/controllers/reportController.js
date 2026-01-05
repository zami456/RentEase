const Report = require("../models/Report");

exports.createReport = async (req, res) => {
    try {
      const { propertyId, description } = req.body;
  
      if (!req.session.user || !req.session.user.id) {
        return res.status(401).json({ error: "Unauthorized. Please login." });
      }
  
      const report = new Report({
        reportedBy: req.session.user.id,
        propertyId,
        description,
      });
  
      await report.save();
      res.status(201).json({ message: "Report submitted successfully" });
  
    } catch (err) {
      console.error("Error submitting report:", err);
      res.status(500).json({ error: "Failed to submit report" });
    }
  };

  exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find().populate("reportedBy").populate("propertyId");
    res.status(200).json(reports);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reports" });
  }
};