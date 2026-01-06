// backend/routes/reviewRoutes.js
const express = require("express");
const { addReview, getReviewsForProperty } = require("../controllers/reviewController");

const router = express.Router();

router.post("/add", addReview); // POST review
router.get("/:propertyId", getReviewsForProperty); // GET all reviews for a property

module.exports = router;