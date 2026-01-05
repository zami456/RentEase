const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlistController");

// Add a property to the wishlist
router.post("/", wishlistController.addToWishlist);

// Get all wishlist items for a user
router.get("/:userId", wishlistController.getWishlist);

// Remove a property from the wishlist
router.delete("/:wishlistId", wishlistController.removeFromWishlist);

module.exports = router;