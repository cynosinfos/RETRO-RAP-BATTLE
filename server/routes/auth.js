const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Profile = require('../models/Profile');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: 'Wszystkie pola są wymagane.' });
        }

        // Check if exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Użytkownik o takim loginie lub emailu już istnieje.' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create User
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        const savedUser = await newUser.save();

        // Create Profile
        const newProfile = new Profile({
            user_id: savedUser._id,
            collection: { cards: [], selected_card_id: null },
            economy: { money: 5000 },
            achievements: {
                stats: { cards_owned: 0, packs_opened: 0, wins: 0, money_earned: 0 },
                unlocked: [],
                rewards_claimed: []
            }
        });
        await newProfile.save();

        // JWT Token
        const token = jwt.sign({ user_id: savedUser._id, username: savedUser.username }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({
            success: true,
            token,
            user: {
                id: savedUser._id,
                username: savedUser.username,
                email: savedUser.email
            }
        });

    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ success: false, message: 'Błąd serwera podczas rejestracji.' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Błędny login lub hasło.' });
        }

        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) {
            return res.status(400).json({ success: false, message: 'Błędny login lub hasło.' });
        }

        const token = jwt.sign({ user_id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Błąd serwera podczas logowania.' });
    }
});

// Import protect middleware for the sync route
const { authenticateToken } = require('../middleware/auth');

// Sync Profile (Autosave endpoint)
router.put('/profile/sync', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id; // From protect middleware
        const { collection, economy, achievements, stats, inventory, perks } = req.body;

        // Find the user's profile
        let profile = await Profile.findOne({ user_id: userId });

        if (!profile) {
            return res.status(404).json({ success: false, message: 'Profil nie istnieje.' });
        }

        // Update fields if they were provided in the request
        if (collection) profile.collection = collection;
        if (economy) profile.economy = economy;
        if (achievements) profile.achievements = achievements;
        if (stats) profile.stats = stats;
        if (inventory) profile.inventory = inventory;
        if (perks) profile.perks = perks;

        profile.updated_at = Date.now();

        // Save to Database
        await profile.save();

        res.json({ success: true, message: 'Profil zsynchronizowany pomyślnie.', updated_at: profile.updated_at });

    } catch (error) {
        console.error('Profile sync error:', error);
        res.status(500).json({ success: false, message: 'Błąd serwera podczas synchronizacji profilu.' });
    }
});

module.exports = router;
