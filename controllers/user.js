const User = require('../models/user');
const {v4:uuidv4} = require('uuid');

const {setUser} = require('../service/auth');

async function handleUserSignup(req, res) {
    try {
        if (!req.body) {
            return res.status(400).json({ error: 'Missing request body' });
        }

        const { name, email, password } = req.body;
        
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        await User.create({
            name,
            email,
            password,
        });

        return res.render("home");
    } catch (error) {
        console.error('Signup error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

async function handleUserLogin(req, res) {
    try {
        if (!req.body) {
            return res.status(400).json({ error: 'Missing request body' });
        }

        const { email, password } = req.body;

        const user = await User.findOne({
            email, password
        });

        if (!user) {
            return res.render('login', {
                error: "Invalid Username or Password",
            });
        }

       //const sessionId = uuidv4();
        const token = setUser(user);
        res.cookie("uid", token);
        return res.redirect("/");

        // Set cookie with proper options
        // res.cookie('uid', sessionId, {
        //     httpOnly: true,
        //     path: '/',
        //     // secure: true,  // uncomment in production with HTTPS
        // });

       // return res.redirect("/");

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    handleUserSignup,
    handleUserLogin,
}