/**
 * PackManager - Handles pack opening logic and drop rates
 */
class PackManager {
    constructor() {
        this.packTypes = {
            FREE: {
                name: 'PRÓBKA',
                price: 0,
                cards: 1,
                guaranteedTier: null
            },
            STREET: {
                name: 'STREET PACK',
                price: 500,
                cards: 5,
                guaranteedTier: 'MAINSTREAM'
            },
            STUDIO: {
                name: 'STUDIO PACK',
                price: 2000,
                cards: 5,
                guaranteedTier: 'STAR'
            },
            PLATINUM: {
                name: 'PLATINUM PACK',
                price: 5000,
                cards: 5,
                guaranteedTier: 'ICON'
            }
        };
    }

    /**
     * Open a pack and return cards based on drop rates
     * @param {String} packType - FREE, STREET, STUDIO, or PLATINUM
     * @param {Boolean} skipTracking - If true, don't track achievement (for simulations)
     * @returns {Array} Array of card objects
     */
    openPack(packType, skipTracking = false) {
        const pack = this.packTypes[packType];
        if (!pack) throw new Error('Invalid pack type');

        const droppedCards = [];

        for (let i = 0; i < pack.cards; i++) {
            let card;

            // Last card guaranteed tier
            if (i === pack.cards - 1 && pack.guaranteedTier) {
                card = this.getCardByTier(pack.guaranteedTier);
            } else {
                card = this.getRandomCard();
            }

            droppedCards.push(card);
        }

        // ACHIEVEMENT TRACKING - Skip for simulations
        if (!skipTracking && window.achievementManager) {
            window.achievementManager.trackEvent('pack_opened', {
                packType: packType,
                cost: pack.price,  // Changed from 'price' to 'cost' to match  AchievementManager expectation
                cardsObtained: droppedCards
            });
        }

        return droppedCards;
    }

    /**
     * Get random card based on drop rates
     * @returns {Object} Card object
     */
    getRandomCard() {
        const roll = Math.random();
        let cumulativeRate = 0;

        // Calculate which tier based on roll
        for (const tierKey in CARD_TIERS) {
            const tier = CARD_TIERS[tierKey];
            cumulativeRate += tier.dropRate;

            if (roll <= cumulativeRate) {
                return this.getCardByTier(tierKey);
            }
        }

        // Fallback to UNDERGROUND
        return this.getCardByTier('UNDERGROUND');
    }

    /**
     * Get random card from specific tier
     * @param {String} tierKey - Tier name from CARD_TIERS
     * @returns {Object} Card object
     */
    getCardByTier(tierKey) {
        const cardsInTier = CARDS_DATABASE.filter(card => card.tier === tierKey);

        if (cardsInTier.length === 0) {
            // Fallback if no cards in tier
            return CARDS_DATABASE[Math.floor(Math.random() * CARDS_DATABASE.length)];
        }

        const randomCard = cardsInTier[Math.floor(Math.random() * cardsInTier.length)];
        return { ...randomCard }; // Return copy
    }

    /**
     * Simulate pack opening drop statistics
     * @param {String} packType
     * @param {Number} iterations - How many packs to simulate
     * @returns {Object} Statistics
     */
    simulateDrops(packType, iterations = 1000) {
        const stats = {};
        Object.keys(CARD_TIERS).forEach(tier => stats[tier] = 0);

        for (let i = 0; i < iterations; i++) {
            const cards = this.openPack(packType, true); // Pass true to skip achievement tracking
            cards.forEach(card => {
                stats[card.tier]++;
            });
        }

        const totalCards = iterations * this.packTypes[packType].cards;
        Object.keys(stats).forEach(tier => {
            stats[tier] = ((stats[tier] / totalCards) * 100).toFixed(2) + '%';
        });

        return stats;
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PackManager;
}
