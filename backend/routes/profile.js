const express = require('express');
const { 
    createProfile,
    getAllProfiles,
    getProfile, 
    deleteProfile,
    updateProfile
} = require('../controllers/profileController');

const router = express.Router();

// GET all profile info
router.get('/', getAllProfiles);

// GET a single profile info
router.get('/:id', getProfile);

// POST a new profile info
router.post('/', createProfile);

// delete a profile info
router.delete('/:id', deleteProfile);

// update a profile info
router.patch('/:id', updateProfile);


module.exports = router;