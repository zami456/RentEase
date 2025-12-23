const express = require("express");
const router = express.Router();
const propertyController = require("../controllers/propertyController");

router.get("/owner", propertyController.getProperties);

// POST endpoint to create a property advertisement with an image upload
router.post("/create", propertyController.uploadPropertyImages, propertyController.createAdvertisement);
// Update the create route to use the new upload middleware

// GET endpoint to retrieve properties (advertisements) for the owner
router.get("/", propertyController.getProperties);

// GET endpoint to retrieve rental requests for the owner
router.get("/flat-requests", propertyController.getRentalRequests);

// POST endpoint to update (approve/reject) a rental request
router.post("/flat-requests/:id", propertyController.updateRentalRequest);

// GET all properties for tenant homepage
router.get("/all", propertyController.getAllProperties);

// Search & filter endpoint for tenants (public)
router.get("/search", propertyController.searchProperties);

// **New**: GET endpoint to fetch a single property by ID
router.get("/:id", propertyController.getPropertyById);

// Delete property by ID (owner only)
router.delete("/:id", propertyController.deleteProperty);


module.exports = router;
