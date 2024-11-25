const express = require('express');
const router = express.Router();
const URL = require('../models/url');

// Add the delete route
router.delete('/url/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await URL.findByIdAndDelete(id);
        
        if (!result) {
            return res.status(404).json({ error: 'URL not found' });
        }
        
        return res.status(200).json({ message: 'URL deleted successfully' });
    } catch (error) {
        console.error('Error deleting URL:', error);
        return res.status(500).json({ error: 'Failed to delete URL' });
    }
});

module.exports = router;