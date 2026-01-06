// backend/routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/users", adminController.getAllUsers);
router.get("/reports", adminController.getAllReports);
router.delete("/users/:id", adminController.deleteUser);

module.exports = router;