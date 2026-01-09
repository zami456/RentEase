// backend/controllers/adminController.js
const User = require("../models/User");
const Report = require("../models/Report");

// Get all users (tenants and owners)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.repo.findBasicUsers();
    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// Get all reports
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.repo.findAllWithRelations();

    // Log the reports to verify
    console.log("Reports:", reports);

    // Filter out reports that don't have a valid reportedBy field
    const filteredReports = reports.filter(report => report.reportedBy);

    res.json({ reports: filteredReports });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reports" });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.repo.deleteById(id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};