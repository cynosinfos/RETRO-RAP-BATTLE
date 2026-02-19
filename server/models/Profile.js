const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    collection: {
        cards: [{
            id: String,
            count: Number,
            tier: String
        }],
        selected_card_id: String
    },
    economy: {
        money: { type: Number, default: 5000 }
    },
    achievements: {
        stats: {
            cards_owned: { type: Number, default: 0 },
            packs_opened: { type: Number, default: 0 },
            wins: { type: Number, default: 0 },
            money_earned: { type: Number, default: 0 }
        },
        unlocked: [String],
        rewards_claimed: [String]
    },
    stats: { type: Object, default: {} },
    inventory: { type: Object, default: {} },
    perks: {
        learned: [String],
        totalSpentSP: { type: Number, default: 0 }
    },
    updated_at: { type: Date, default: Date.now }
}, {
    suppressReservedKeysWarning: true
});

module.exports = mongoose.model('Profile', ProfileSchema);
