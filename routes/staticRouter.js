const express = require('express');
const router = express.Router();
const URL = require('../models/url');  // Adjust the path based on your project structure


router.get('/', async (req, res) => {
    if (!req.user) return res.redirect('/login');
    
    try {
        const urls = await URL.find({ createdBy: req.user._id });
        return res.render('home', {
            urls: urls
        });
    } catch (error) {
        console.error('Error fetching URLs:', error);
        return res.render('home', { error: 'Error fetching URLs' });
    }
});


router.get("/signup", (req,res)=>{
    return res.render("signup");
})

router.get("/login", (req,res)=>{
    return res.render("login");
})

module.exports = router;