const User = require('../models/User');
const mongoose = require('mongoose');

// Get all profile info
const getAllProfiles = async (req, res) => {
    const info = await User.find({}).sort({ createdAt: -1 });
    res.status(200).json(info);
}


// Get a single profile info
const getProfile = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such profile' });  
    }

    const info = await User.findById(id);
    if (!info) {
        return res.status(404).json({ error: 'No such profile' });
    }
    res.status(200).json(info);
}


// Create a new profile info
const createProfile =  async (req, res) => {
    const { username, password, firstName, lastName, email, phone, address, about, role } = req.body;
    try {
        const info = await User.create({ username, password, firstName, lastName, email, phone, address, about, role });
        res.status(200).json(info);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a profile info
const deleteProfile = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such profile' });  
    }

    const info = await User.findByIdAndDelete({_id: id});

    if (!info) {
        return res.status(404).json({ error: 'No such profile' });
    }
    res.status(200).json(info);
}

// Update a profile info
const updateProfile = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such profile' });  
    }

    const { profileImage, ...otherFields } = req.body;

    const updateData = {
        ...otherFields,
    };

    if (profileImage) {
        updateData.profileImage = profileImage; // Add profileImage if provided
    }

    const info = await User.findOneAndUpdate({ _id: id }, updateData, { new: true });

    if (!info) {
        return res.status(404).json({ error: 'No such profile' });
    }
    res.status(200).json(info);
};


module.exports = {
    createProfile,
    getAllProfiles,
    getProfile,
    deleteProfile,
    updateProfile
};