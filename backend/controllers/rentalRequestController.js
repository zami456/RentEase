const RentalRequest = require("../models/RentalRequest");
const Property = require("../models/Property");

// Create a new rental request
exports.createRentalRequest = async (req, res) => {
  try {
    const rentalRequest = new RentalRequest(req.body);
    await rentalRequest.save();
    res.status(201).json(rentalRequest);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a rental request
exports.updateRentalRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const rentalRequest = await RentalRequest.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!rentalRequest) {
      return res.status(404).json({ message: "Rental request not found" });
    }

    res.status(200).json(rentalRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a rental request
exports.deleteRentalRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const rentalRequest = await RentalRequest.findByIdAndDelete(id);
    if (!rentalRequest) {
      return res.status(404).json({ error: "Rental request not found" });
    }
    res.status(200).json({ message: "Rental request deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all pending rental requests for properties owned by the current user
exports.getAllRentalRequests = async (req, res) => {
  try {
    // Read owner ID from session (session.user.id is set on login)
    const ownerId = req.session.user && req.session.user.id;
    if (!ownerId) return res.status(401).json({ error: "Unauthorized" });

    // Find property IDs owned by this user
    const ownedProps = await Property.find({ owner: ownerId }, "_id");
    const propIds = ownedProps.map((p) => p._id);

    // Fetch only pending requests for those properties
    const requests = await RentalRequest.find({
      property: { $in: propIds },
      status: "pending",
    })
      .populate("property")
      .populate("tenant", "username email phone");

    res.status(200).json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Get all rental requests for the current tenant
exports.getUserRentalRequest = async (req, res) => {
  try {
    // Read tenant ID from session (session.user.id is set on login)
    const tenantId = req.session.user && req.session.user.id;
    if (!tenantId) return res.status(401).json({ error: "Unauthorized" });

    // Fetch all rental requests for the tenant
    const requests = await RentalRequest.find({ tenant: tenantId }).populate({
      path: "property",
      populate: { path: "owner", select: "username email phone" },
      select: "houseName address owner",
    });

    res.status(200).json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
