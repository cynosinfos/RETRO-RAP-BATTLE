const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const Profile = require('../models/Profile');

/**
 * GET /api/profile
 * Get user's profile data
 */
router.get('/', authenticateToken, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user_id: req.user.user_id });

        if (!profile) {
            return res.status(404).json({ success: false, message: 'Profile not found' });
        }

        res.json({
            collection: profile.collection,
            achievements: profile.achievements,
            economy: profile.economy,
            stats: profile.stats,
            inventory: profile.inventory,
            updated_at: profile.updated_at
        });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/**
 * POST /api/profile/save
 * Save user's profile data
 */
router.post('/save', authenticateToken, async (req, res) => {
    try {
        const { collection, achievements, economy } = req.body;

        const profile = await Profile.findOne({ user_id: req.user.user_id });

        if (!profile) {
            return res.status(404).json({ success: false, message: 'Profile not found' });
        }

        // Update profile fields
        if (collection) profile.collection = collection;
        if (achievements) profile.achievements = achievements;
        if (economy) profile.economy = economy;
        if (req.body.stats) profile.stats = req.body.stats;
        if (req.body.inventory) profile.inventory = req.body.inventory;

        profile.updated_at = Date.now();

        await profile.save();

        res.json({
            success: true,
            updated_at: profile.updated_at
        });

    } catch (error) {
        console.error('Save profile error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/**
 * POST /api/profile/migrate
 * Migrate localStorage data to database
 */
router.post('/migrate', authenticateToken, async (req, res) => {
    try {
        const { localStorageData } = req.body;

        if (!localStorageData) {
            return res.status(400).json({ success: false, message: 'localStorage data required' });
        }

        const profile = await Profile.findOne({ user_id: req.user.user_id });

        if (!profile) {
            return res.status(404).json({ success: false, message: 'Profile not found' });
        }

        // Merge logic: prefer newer data
        // For simplicity, we'll add cards and merge achievements

        if (localStorageData.collection && localStorageData.collection.cards) {
            // Merge cards - add any that don't exist, increase count for duplicates
            const cardMap = new Map();

            // Add existing cards
            profile.collection.cards.forEach(card => {
                cardMap.set(card.id, card.count);
            });

            // Add localStorage cards
            localStorageData.collection.cards.forEach(card => {
                const existing = cardMap.get(card.id) || 0;
                cardMap.set(card.id, existing + card.count);
            });

            // Convert back to array
            profile.collection.cards = Array.from(cardMap.entries()).map(([id, count]) => {
                // Find tier from original data
                const originalCard = localStorageData.collection.cards.find(c => c.id === id);
                return {
                    id,
                    count,
                    tier: originalCard?.tier || 'UNDERGROUND'
                };
            });
        }

        // Merge achievements stats (take maximum values)
        if (localStorageData.achievements && localStorageData.achievements.stats) {
            const localStats = localStorageData.achievements.stats;
            const profileStats = profile.achievements.stats;

            profileStats.cards_owned = Math.max(profileStats.cards_owned, localStats.cards_owned || 0);
            profileStats.packs_opened = Math.max(profileStats.packs_opened, localStats.packs_opened || 0);
            profileStats.wins = Math.max(profileStats.wins, localStats.wins || 0);
            profileStats.money_earned = Math.max(profileStats.money_earned, localStats.money_earned || 0);

            // Merge unlocked achievements
            if (localStorageData.achievements.unlocked && Array.isArray(localStorageData.achievements.unlocked)) {
                profile.achievements.unlocked = [
                    ...new Set([...profile.achievements.unlocked, ...localStorageData.achievements.unlocked])
                ];
            }

            // Merge rewards claimed
            if (localStorageData.achievements.rewards_claimed && Array.isArray(localStorageData.achievements.rewards_claimed)) {
                profile.achievements.rewards_claimed = [
                    ...new Set([...(profile.achievements.rewards_claimed || []), ...localStorageData.achievements.rewards_claimed])
                ];
            }
        }

        // Merge economy (take maximum money)
        if (localStorageData.economy) {
            profile.economy.money = Math.max(profile.economy.money, localStorageData.economy.money || 0);
        }

        profile.updated_at = Date.now();
        await profile.save();

        res.json({
            success: true,
            message: 'Profile migrated successfully',
            stats: {
                total_cards: profile.collection.cards.length,
                money: profile.economy.money,
                achievements_unlocked: profile.achievements.unlocked.length
            }
        });

    } catch (error) {
        console.error('Migration error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
