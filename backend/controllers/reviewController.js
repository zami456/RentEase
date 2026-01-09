const Review = require("../models/Review");

exports.addReview = async (req, res) => {
  try {
    const { propertyId, userId, rating, comment } = req.body;
    if (!propertyId || !userId || !rating) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    // Prevent duplicate reviews by the same user for the same property
    const existing = await Review.repo.findOne({ propertyId, userId });
    if (existing) return res.status(400).json({ error: "Already reviewed" });

    const review = await Review.repo.create({ propertyId, userId, rating, comment });
    res.status(201).json({ message: "Review added", review });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getReviewsForProperty = async (req, res) => {
  const { propertyId } = req.params;
  try {
    const reviews = await Review.repo.findByPropertyWithUser(propertyId);
    res.json({ reviews });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};