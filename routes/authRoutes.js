const express = require('express');
const User = require('../models/User');
const { generateToken } = require('../utils/token');
const authMiddleware = require('../middleware/authMiddleware');
const sendEmail = require('../utils/email');
const crypto = require('crypto');
const passport = require('passport');
const { log } = require('console');
const bcrypt = require('bcrypt');
const redisClient = require('../config/redis');


const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const user = new User({ username, password, role });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});



// router.post('/login', async (req, res) => {
//     try {
//         const { username, password } = req.body;
//         const user = await User.findOne({ username });
//         if (!user || !(await user.comparePassword(password)))
//             return res.status(401).json({ message: 'Invalid credentials' });

//         const token = generateToken(user);
//         res.status(200).json({ token });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

router.get('/protected', authMiddleware, (req, res) => {
    res.json({ message: 'Access granted to protected route', user: req.user });
});


// Request password reset
router.post('/request-reset', async (req, res) => {
    const { username } = req.body;

    const user = await User.findOne({ username: username });

    if (!user) return res.status(404).json({ message: 'User not found' });

    const resetToken = user.getResetPasswordToken();

    await user.save();

    const resetUrl = `http://localhost:8000/auth/reset-password/${resetToken}`;
    const message = `You are receiving this email because you requested a password reset. Use the link to reset your password: ${resetUrl}`;


    try {
        await sendEmail(username, 'Password Reset Request', message);
        res.status(200).json({ message: 'Email sent' });
    } catch (error) {
        console.error('Email Sending Error:', error); // Log the error to identify the issue
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        res.status(500).json({ message: 'Email could not be sent', error: error.message });
    }
});

// Reset password
router.put('/reset-password/:token', async (req, res) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    console.log(resetPasswordToken);


    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
});



// Initiate OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Handle OAuth callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    res.status(200).json({ message: 'Google login successful', user: req.user });
});



router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.isLocked()) {
        return res.status(403).json({ message: 'Account is locked. Try again later.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        user.failedLoginAttempts += 1;

        if (user.failedLoginAttempts >= 5) {
            user.lockUntil = Date.now() + 15 * 60 * 1000; // Lock for 15 minutes
            await user.save();
            return res.status(403).json({ message: 'Account locked due to multiple failed attempts' });
        }

        await user.save();
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    const token = generateToken(user);
    res.status(200).json({ token });
});



module.exports = router; 
