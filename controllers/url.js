const shortid = require('shortid');
const URL = require('../models/url.js');

async function handleGenerateNewShortURL(req, res) {
    let { url } = req.body;
    if(!url) return res.status(400).json({ error: "url required" });

    // Add https:// if no protocol is specified
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }

    try {
        // Check for existing URL
        const existingEntry = await URL.findOne({ 
            redirectURL: url,
            createdBy: req.user._id 
        });
        
        if (existingEntry) {
            const urls = await URL.find({ createdBy: req.user._id });
            return res.render("home", {
                id: existingEntry.shortId,
                urls: urls
            });
        }

        // Generate new shortId
        const shortId = shortid.generate();
        
        // Create new URL entry
        await URL.create({
            shortId: shortId,
            redirectURL: url,
            visitHistory: [],
            createdBy: req.user._id,
        });

        // Fetch all URLs for this user
        const urls = await URL.find({ createdBy: req.user._id });
        
        return res.render("home", { 
            id: shortId,
            urls: urls
        });
    } catch(error) {
        console.error("Error creating URL entry:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

async function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortId });
    if (!result) return res.status(404).json({ error: "Short ID not found" });
    return res.json({
        totalClicks: result.visitHistory.length, 
        analytics: result.visitHistory
    });
}

module.exports = {
    handleGenerateNewShortURL,
    handleGetAnalytics,
};