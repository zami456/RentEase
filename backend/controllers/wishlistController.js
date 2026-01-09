const Wishlist = require("../models/Wishlist");

// Add a property to the wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { userId, propertyId } = req.body;

    const wishlistItem = await Wishlist.repo.create({
      user: userId,
      property: propertyId,
    });
    res
      .status(201)
      .json({ message: "Property added to wishlist", wishlistItem });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add property to wishlist", error });
  }
};

// Get all wishlist items for a user
exports.getWishlist = async (req, res) => {
  try {
    const { userId } = req.params;

    const wishlist = await Wishlist.repo.findByUser(userId);
    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch wishlist", error });
  }
};

// Remove a property from the wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const { wishlistId } = req.params;

    await Wishlist.repo.deleteById(wishlistId);
    res.status(200).json({ message: "Property removed from wishlist" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to remove property from wishlist", error });
  }
};