// backend/controllers/propertyController.js
const Property = require("../models/Property");
const RentalRequest = require("../models/RentalRequest");
const Notification = require("../models/Notification");
const multer = require("multer");
const path = require("path");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary using environment variables
// Required: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use in-memory storage; we'll stream buffers to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper: upload a buffer to Cloudinary and return secure_url
const uploadBufferToCloudinary = (buffer, filename, folder = "properties") => {
  return new Promise((resolve, reject) => {
    const baseName = filename ? path.parse(filename).name : "upload";
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const publicId = `${baseName}-${uniqueSuffix}`;

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        // Ensure uniqueness to prevent overwrites when filenames repeat
        public_id: publicId,
        overwrite: false,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    uploadStream.end(buffer);
  });
};

// Helper: extract Cloudinary public_id from a secure URL
// Example: https://res.cloudinary.com/<cloud>/image/upload/v1699999999/properties/my-img.jpg
// Returns: properties/my-img
const extractPublicIdFromUrl = (url) => {
  if (!url || typeof url !== "string") return null;
  try {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+(?:\?.*)?$/);
    return match && match[1] ? match[1] : null;
  } catch {
    return null;
  }
};


// Create a new advertisement (property)
exports.createAdvertisement = async (req, res) => {
  try {
    const ownerId = req.session.user && req.session.user.id;
    if (!ownerId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const {
      houseName,
      address,
      contact,
      rooms,
      washrooms,
      squareFeet,
      description,
      price,      
    } = req.body;

    // Safely handle req.files (multer)
    const files = req.files || {};

    // Upload main image to Cloudinary if provided
    let mainImage = "";
    if (files.mainImage && files.mainImage[0]) {
      const f = files.mainImage[0];
      mainImage = await uploadBufferToCloudinary(
        f.buffer,
        f.originalname,
        "properties"
      );
    }

    // Upload room images (limit handled by multer fields)
    let roomImages = [];
    if (files.roomImages && files.roomImages.length) {
      roomImages = await Promise.all(
        files.roomImages.map((f) =>
          uploadBufferToCloudinary(f.buffer, f.originalname, "properties")
        )
      );
    }

    // Deduplicate (safety)
    const uniqueRoomImages = Array.from(new Set(roomImages));


    const property = new Property({
      houseName,
      address,
      contact,
      rooms,
      washrooms,
      squareFeet,
      description,
      price,     
      mainImage,
      roomImages: uniqueRoomImages,
      owner: ownerId,
    });
    await property.save();
    res.status(201).json({ message: "Advertisement created", property });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Export the multer middleware for property image upload
exports.uploadPropertyImages = upload.fields([
  {name: 'mainImage', maxCount: 1},
  {name: 'roomImages', maxCount: 3}
]);

// Get rental requests for properties owned by the logged-in owner
exports.getRentalRequests = async (req, res) => {
  try {
    const ownerId = req.session.user && req.session.user.id;
    if (!ownerId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    // Find requests for properties that belong to the owner
    const requests = await RentalRequest.find()
      .populate({
        path: "property",
        match: { owner: ownerId },
      })
      .populate("tenant", "name email");
    const filteredRequests = requests.filter((r) => r.property);
    res.json({ requests: filteredRequests });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Approve or Reject a rental request
exports.updateRentalRequest = async (req, res) => {
  try {
    const ownerId = req.session.user && req.session.user.id;
    if (!ownerId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { id } = req.params; // rental request ID
    const { action } = req.body; // 'approve' or 'reject'
    let status;
    if (action === "approve") {
      status = "approved";
    } else if (action === "reject") {
      status = "rejected";
    } else {
      return res.status(400).json({ error: "Invalid action" });
    }
    const request = await RentalRequest.findById(id).populate("tenant");
    if (!request) return res.status(404).json({ error: "Rental request not found" });

    const property = await Property.findById(request.property);
    if (property.owner.toString() !== ownerId) {
      return res.status(403).json({ error: "Not authorized to update this request" });
    }
    request.status = status;
    await request.save();

    // Create a notification for the tenant
    const notification = new Notification({
      tenant: request.tenant._id,
      message: `Your request for property "${property.houseName}" has been ${status}.`,
    });
    await notification.save();

    res.json({ message: `Rental request ${status}`, request });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// Create Advertisement and other functions remain here...

// New: Get all properties for the logged-in owner
exports.getProperties = async (req, res) => {
  try {
    const ownerId = req.session.user && req.session.user.id;
    if (!ownerId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const properties = await Property.find({ owner: ownerId });
    res.json({ properties });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// PUBLIC: Fetch all properties for homepage
exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find({});
    res.status(200).json({ properties });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch properties" });
  }
};

// Tenant-side search & filter properties
exports.searchProperties = async (req, res) => {
  try {
    const { address, rooms } = req.query;

    const filter = {};

    // If address is provided, use case-insensitive regex match
    if (address) {
      filter.address = { $regex: address, $options: "i" };
    }

    // If rooms is provided, filter by number of rooms
    if (rooms) {
      filter.rooms = parseInt(rooms); // Make sure it's a number
    }

    const properties = await Property.find(filter);
    res.json({ properties });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// backend/controllers/propertyController.js
// Add this function to handle fetching a property by ID
exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate("owner", "username email phone") // Populate owner details

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }
    res.json({ property });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch property" });
  }
};


// Optional image upload export
exports.uploadPropertyImage = upload.single("image");

// Delete property (owner only). Attempts to clean up Cloudinary images if URLs are Cloudinary.
exports.deleteProperty = async (req, res) => {
  try {
    const ownerId = req.session.user && req.session.user.id;
    if (!ownerId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { id } = req.params;
    const property = await Property.findById(id);
    if (!property) return res.status(404).json({ error: "Property not found" });
    if (property.owner.toString() !== ownerId) {
      return res.status(403).json({ error: "Not authorized to delete this property" });
    }

    // Best-effort Cloudinary cleanup (if URLs are Cloudinary)
    const images = [];
    if (property.mainImage && property.mainImage.startsWith("http")) images.push(property.mainImage);
    if (Array.isArray(property.roomImages)) {
      property.roomImages.forEach((u) => {
        if (u && typeof u === "string" && u.startsWith("http")) images.push(u);
      });
    }

    const publicIds = images
      .map(extractPublicIdFromUrl)
      .filter(Boolean);

    if (publicIds.length) {
      await Promise.allSettled(
        publicIds.map((pid) => cloudinary.uploader.destroy(pid).catch(() => null))
      );
    }

    await property.deleteOne();
    res.json({ message: "Property deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete property" });
  }
};
