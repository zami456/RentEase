const express = require("express");
const {
  createRentalRequest,
  updateRentalRequest,
  deleteRentalRequest,
  getAllRentalRequests,
  getUserRentalRequest,
} = require("../controllers/rentalRequestController");

const router = express.Router();

// Routes for rental requests
router.post("/", createRentalRequest);
router.patch("/:id", updateRentalRequest);
router.delete("/:id", deleteRentalRequest);
router.get("/", getAllRentalRequests);

// Route for fetching rental requests for the current tenant
router.get("/my-requests", getUserRentalRequest);

module.exports = router;
