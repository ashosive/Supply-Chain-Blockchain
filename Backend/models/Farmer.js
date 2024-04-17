const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Farmer = require('./models/Farmer'); // Assuming you have a Farmer model
const authMiddleware = require('./middleware/auth'); // Middleware to verify JWT token

// Update Profile
router.put('/updateProfile', authMiddleware, async (req, res) => {
    try {
        const { userId } = req.user; // Extracting user ID from JWT payload
        const { profileData } = req.body;

        // Update profile in the database
        await Farmer.findOneAndUpdate({ user: userId }, { profileData });

        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add Items
router.post('/addItem', authMiddleware, async (req, res) => {
    try {
        const { userId } = req.user;
        const { itemData } = req.body;

        // Find the farmer and add the item
        const farmer = await Farmer.findOne({ user: userId });
        farmer.items.push(itemData);
        await farmer.save();

        res.status(200).json({ message: 'Item added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update List
router.put('/updateList', authMiddleware, async (req, res) => {
    try {
        const { userId } = req.user;
        const { newList } = req.body;

        // Find the farmer and update the list
        const farmer = await Farmer.findOne({ user: userId });
        farmer.list = newList;
        await farmer.save();

        res.status(200).json({ message: 'List updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Upload Videos
router.post('/uploadVideo', authMiddleware, async (req, res) => {
    // Implementation for uploading videos
});

// Delete Videos
router.delete('/deleteVideo/:videoId', authMiddleware, async (req, res) => {
    // Implementation for deleting videos
});

// Upload Photos
router.post('/uploadPhoto', authMiddleware, async (req, res) => {
    // Implementation for uploading photos
});

// Delete Photos
router.delete('/deletePhoto/:photoId', authMiddleware, async (req, res) => {
    // Implementation for deleting photos
});

module.exports = router;
