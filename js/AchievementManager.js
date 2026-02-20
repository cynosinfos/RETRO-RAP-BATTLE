/**
 * AchievementManager - Track and manage player achievements
 * Handles progress tracking, unlocking, rewards, and persistence
 */
class AchievementManager {
    constructor() {
        this.achievements = ACHIEVEMENTS_DATABASE;
        const stored = localStorage.getItem('rrb_current_profile');
        this.currentProfile = stored || 'default';
        this.storageKey = `rrb_achievements_${this.currentProfile}`;
        this.progress = this._getEmptyProgress();
        this.isInitialized = false;
        this.dataFetchedFromServer = false; // Flag to prevent overwriting server data early

        console.log(`[AchievementManager] Instance created (Profile: ${this.currentProfile})`);
    }

    /**
     * Unified Initialization - Must be called and awaited
     */
    async init() {
        if (this.isInitialized) return;

        console.log(`[AchievementManager] Initializing for ${this.currentProfile}...`);

        // Check if progress was already loaded via API import (dataFetchedFromServer will be true)
        // or if it's truly empty (initial state)
        if (!this.dataFetchedFromServer) {
            this.progress = this.loadProgress();
        } else {
            console.log("[AchievementManager] Data already fetched from server, skipping local load.");
        }

        this.isInitialized = true;

        // Sync with collection if available
        if (window.collectionManager) {
            this.syncWithCollection(window.collectionManager);
        }

        return this.progress;
    }

    /**
     * Load achievement progress from localStorage
     */
    loadProgress() {
        // 1. Try to get from window.playerData or API if already loaded?
        // No, usually CollectionManager loads first.

        const key = `rrb_achievements_${this.currentProfile}`;
        const saved = localStorage.getItem(key);
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error("Achievement Parse Error", e);
            }
        }

        // Initialize empty progress
        return this._getEmptyProgress();
    }

    _getEmptyProgress() {
        return {
            unlocked: [],
            stats: {
                cards_owned: 0,
                cards_by_tier: {},
                max_duplicates: 0,
                packs_opened: 0,
                packs_by_type: {},
                money_spent_packs: 0,
                daily_streak: 0,
                last_free_pack: null,
                wins: 0,
                losses: 0,
                win_streak: 0,
                best_streak: 0,
                perfect_rounds: 0,
                difficulty_wins: {},
                online_wins: 0,
                fighters_beaten: [],
                money_earned: 0,
                money_spent: 0,
                money_current: 0,
                single_fight_best: 0
            },
            rewards_claimed: []
        };
    }

    /**
     * Import data from API
     * @param {Object} data 
     */
    importData(data) {
        if (!data) return;
        console.log("[AchievementManager] Importing data from API:", data);

        // Merge logic: Combine local and server state to prevent progress loss
        const localUnlocked = this.progress.unlocked || [];
        const serverUnlocked = data.unlocked || [];
        const mergedUnlocked = [...new Set([...localUnlocked, ...serverUnlocked])];

        const localClaimed = this.progress.rewards_claimed || [];
        const serverClaimed = data.rewards_claimed || [];
        const mergedClaimed = [...new Set([...localClaimed, ...serverClaimed])];

        // Stats merging: generally take the higher value for progress-based stats
        const localStats = this.progress.stats || {};
        const serverStats = data.stats || {};
        const mergedStats = { ...this._getEmptyProgress().stats };

        const cumulativeKeys = ['cards_owned', 'packs_opened', 'wins', 'losses', 'perfect_rounds', 'money_earned', 'money_spent', 'online_wins', 'best_streak', 'max_duplicates', 'money_spent_packs', 'money_current', 'single_fight_best'];

        Object.keys(mergedStats).forEach(key => {
            if (cumulativeKeys.includes(key)) {
                mergedStats[key] = Math.max(Number(localStats[key] || 0), Number(serverStats[key] || 0));
            } else if (typeof mergedStats[key] === 'object' && !Array.isArray(mergedStats[key]) && mergedStats[key] !== null) {
                // Nested objects like cards_by_tier, packs_by_type, difficulty_wins (all use counts)
                const localSub = localStats[key] || {};
                const serverSub = serverStats[key] || {};
                const mergedSub = {};

                // Combine keys from both
                const allSubKeys = [...new Set([...Object.keys(localSub), ...Object.keys(serverSub)])];
                allSubKeys.forEach(subKey => {
                    mergedSub[subKey] = Math.max(Number(localSub[subKey] || 0), Number(serverSub[subKey] || 0));
                });
                mergedStats[key] = mergedSub;
            } else if (Array.isArray(mergedStats[key])) {
                // Array merger (e.g. fighters_beaten)
                mergedStats[key] = [...new Set([...(localStats[key] || []), ...(serverStats[key] || [])])];
            } else {
                // Fallback: prefer server data for non-cumulative fields
                mergedStats[key] = serverStats[key] !== undefined ? serverStats[key] : localStats[key];
            }
        });

        this.progress = {
            unlocked: mergedUnlocked,
            stats: mergedStats,
            rewards_claimed: mergedClaimed
        };
        this.dataFetchedFromServer = true;

        this.saveProgress(false); // Update local backup
    }

    /**
     * Get data for API Export
     */
    getExportData() {
        return this.progress;
    }

    /**
     * Save progress to localStorage and API
     * @param {Boolean} syncToApi - Whether to trigger API save
     */
    saveProgress(syncToApi = true) {
        localStorage.setItem(this.storageKey, JSON.stringify(this.progress));

        // Trigger global save via CollectionManager (throttled)
        // CRITICAL: Only sync to API if we've already fetched from server (to avoid overwriting with fresh local state)
        if (syncToApi && window.collectionManager && window.authManager && window.authManager.isLoggedIn()) {
            if (!this.dataFetchedFromServer) {
                console.log("[AchievementManager] Skipping API sync - server data not yet confirmed.");
                return;
            }
            // Check throttle
            const now = Date.now();
            if (!this.lastApiSave || (now - this.lastApiSave > 5000)) { // 5s throttle
                this.lastApiSave = now;
                // Run in background
                setTimeout(() => window.collectionManager.saveCollection(), 100);
            }
        }
    }

    /**
     * Track an event and check for unlocks
     * @param {String} eventType - Type of event (e.g., 'card_added', 'pack_opened', 'fight_won')
     * @param {Object} data - Event data
     */
    trackEvent(eventType, data = {}) {
        let updated = false;

        switch (eventType) {
            case 'card_added':
                this.progress.stats.cards_owned++;

                // Update by tier
                if (typeof CARDS_DATABASE !== 'undefined') {
                    const card = CARDS_DATABASE.find(c => c.id === data.cardId);
                    if (card) {
                        const tier = card.tier;
                        this.progress.stats.cards_by_tier[tier] = (this.progress.stats.cards_by_tier[tier] || 0) + (data.count || 1);
                    }
                }

                // Update Max Duplicates
                if (window.collectionManager) {
                    const count = window.collectionManager.getCardCount(data.cardId);
                    this.progress.stats.max_duplicates = Math.max(this.progress.stats.max_duplicates || 0, count);
                }

                updated = true;
                break;

            case 'pack_opened':
                this.progress.stats.packs_opened++;
                const packType = data.packType || 'FREE';
                this.progress.stats.packs_by_type[packType] = (this.progress.stats.packs_by_type[packType] || 0) + 1;
                if (data.cost) this.progress.stats.money_spent_packs += data.cost;

                // Track Pulled Tiers
                if (data.cardsObtained) {
                    data.cardsObtained.forEach(c => {
                        this.progress.stats.pulled_tiers = this.progress.stats.pulled_tiers || {};
                        this.progress.stats.pulled_tiers[c.tier] = (this.progress.stats.pulled_tiers[c.tier] || 0) + 1;
                    });
                }
                updated = true;
                break;

            case 'fight_won':
                this.progress.stats.wins++;
                this.progress.stats.win_streak++;
                this.progress.stats.best_streak = Math.max(this.progress.stats.best_streak, this.progress.stats.win_streak);
                if (data.perfect) this.progress.stats.perfect_rounds++;
                if (data.fighter && !this.progress.stats.fighters_beaten.includes(data.fighter)) {
                    this.progress.stats.fighters_beaten.push(data.fighter);
                }
                if (data.moneyEarned) {
                    this.progress.stats.money_earned += data.moneyEarned;
                    this.progress.stats.single_fight_best = Math.max(this.progress.stats.single_fight_best, data.moneyEarned);
                }
                updated = true;
                break;

            case 'fight_lost':
                this.progress.stats.losses++;
                this.progress.stats.win_streak = 0;
                updated = true;
                break;

            case 'money_spent':
                this.progress.stats.money_spent += data.amount || 0;
                updated = true;
                break;

            case 'money_updated':
                this.progress.stats.money_current = data.amount || 0;
                updated = true;
                break;
        }

        if (updated) {
            this.saveProgress();
            this.checkUnlocks();
        }
    }

    /**
     * Check all achievements for unlocks
     */
    checkUnlocks() {
        const newUnlocks = [];

        this.achievements.forEach(achievement => {
            // Skip if already unlocked
            if (this.isUnlocked(achievement.id)) return;

            // Check if requirement is met
            if (this.checkRequirement(achievement.req)) {
                this.unlock(achievement.id);
                newUnlocks.push(achievement);
            }
        });

        // Show notifications for new unlocks
        if (newUnlocks.length > 0) {
            this.showUnlockNotifications(newUnlocks);
        }
    }

    /**
     * Check if a requirement is met
     */
    checkRequirement(req) {
        const stats = this.progress.stats;

        switch (req.type) {
            case 'cards_owned':
                return stats.cards_owned >= req.val;

            case 'tier_cards':
                return (stats.cards_by_tier && stats.cards_by_tier[req.tier] >= req.val);

            case 'max_duplicates':
                return stats.max_duplicates >= req.val;

            case 'type_complete':
                if (!window.collectionManager || typeof CARDS_DATABASE === 'undefined') return false;
                const totalInType = CARDS_DATABASE.filter(c => c.type === req.cardType).length;
                const ownedInType = window.collectionManager.getCardsByType(req.cardType).length;
                return ownedInType >= totalInType && totalInType > 0;

            case 'packs_opened':
                return stats.packs_opened >= req.val;

            case 'pack_type':
                return (stats.packs_by_type[req.packType] || 0) >= req.val;

            case 'pulled_tier':
                return (stats.pulled_tiers && stats.pulled_tiers[req.tier] >= req.val);

            case 'wins':
                return stats.wins >= req.val;

            case 'win_streak':
                return stats.best_streak >= req.val;

            case 'perfect_rounds':
                return stats.perfect_rounds >= req.val;

            case 'money_earned':
                return stats.money_earned >= req.val;

            case 'money_owned':
                return stats.money_current >= req.val;

            case 'money_spent_packs':
                return stats.money_spent_packs >= req.val;

            case 'single_fight_earn':
                return stats.single_fight_best >= req.val;

            default:
                // console.warn("Unhandled requirement type:", req.type);
                return false;
        }
    }

    /**
     * Unlock an achievement
     */
    unlock(achievementId) {
        if (!this.progress.unlocked.includes(achievementId)) {
            this.progress.unlocked.push(achievementId);
            this.saveProgress();
        }
    }

    /**
     * Check if achievement is unlocked
     */
    isUnlocked(achievementId) {
        return this.progress.unlocked.includes(achievementId);
    }

    /**
     * Alias for isUnlocked
     */
    hasAchievement(achievementId) {
        return this.isUnlocked(achievementId);
    }

    /**
     * Claim reward for achievement
     */
    claimReward(id) {
        if (this.isRewardClaimed(id)) return false;

        const achievement = this.achievements.find(a => a.id === id);
        if (!achievement) return false;

        // Force reload of claimed list to be safe
        let savedRaw = localStorage.getItem(this.storageKey);
        if (savedRaw) {
            try {
                const parsed = JSON.parse(savedRaw);
                if (parsed.rewards_claimed && parsed.rewards_claimed.includes(id)) {
                    if (!this.progress.rewards_claimed.includes(id)) {
                        this.progress.rewards_claimed.push(id); // Sync local memory
                    }
                    console.warn(`[Achievement] Reward for ${id} already claimed in Storage.`);
                    return false;
                }
            } catch (e) {
                console.error("Sync Error in claimReward:", e);
            }
        }

        // 1. Mark as Claimed IMMEDIATELY (Before sync)
        if (!this.progress.rewards_claimed.includes(id)) {
            this.progress.rewards_claimed.push(id);
        }

        // 2. Give Money
        if (achievement.reward && achievement.reward.mk) {
            if (window.collectionManager) {
                window.collectionManager.updateMoney(achievement.reward.mk);
            }
            this.showCustomNotification(`ODEBRANO NAGRODĘ: ${achievement.name} (+${achievement.reward.mk} MK)`);
        } else if (achievement.rewardMK) {
            if (window.collectionManager) {
                window.collectionManager.updateMoney(achievement.rewardMK);
            }
            this.showCustomNotification(`ODEBRANO NAGRODĘ: ${achievement.name} (+${achievement.rewardMK} MK)`);
        }

        // 3. Give Cards/Packs (Stub for now)
        if (achievement.reward && achievement.reward.pack) {
            this.showCustomNotification(`ODBLOKOWANO PACZKĘ: ${achievement.reward.pack}`);
        } else if (achievement.rewardPack) {
            this.showCustomNotification(`ODBLOKOWANO PACZKĘ: ${achievement.rewardPack}`);
        }

        // 4. Force save to localStorage and trigger collection save
        this.saveProgress(true); // forceSync implied by most use cases

        // Notify achievements UI to refresh if open
        if (window.renderAchievementsList) window.renderAchievementsList();
        if (window.updateStats) window.updateStats();

        // One last check to ensure it was saved
        localStorage.setItem(this.storageKey, JSON.stringify(this.progress));

        return achievement.reward || { mk: achievement.rewardMK, pack: achievement.rewardPack };
    }

    /**
     * Show a simple notification (Fallback for missing notify)
     */
    showCustomNotification(msg) {
        if (window.addNews) {
            window.addNews(msg, '#00ff00');
        } else {
            console.log("NOTIF:", msg);
            // Optionally create a temporary UI element or just use alert
            alert(msg);
        }
    }

    /**
     * Check if reward has been claimed
     */
    isRewardClaimed(achievementId) {
        return this.progress.rewards_claimed.includes(achievementId);
    }

    /**
     * Get all achievements with unlock status
     */
    getAllAchievements() {
        return this.achievements.map(a => ({
            ...a,
            unlocked: this.isUnlocked(a.id),
            rewardClaimed: this.isRewardClaimed(a.id),
            progress: this.getProgress(a)
        }));
    }

    /**
     * Get progress for a specific achievement
     */
    getProgress(achievement) {
        const req = achievement.req;
        const stats = this.progress.stats;
        let current = 0;
        let target = req.val || 1;

        switch (req.type) {
            case 'cards_owned':
                current = stats.cards_owned;
                break;
            case 'packs_opened':
                current = stats.packs_opened;
                break;
            case 'pack_type':
                current = stats.packs_by_type[req.packType] || 0;
                break;
            case 'wins':
                current = stats.wins;
                break;
            case 'win_streak':
                current = stats.best_streak;
                break;
            case 'perfect_rounds':
                current = stats.perfect_rounds;
                break;
            case 'money_earned':
                current = stats.money_earned;
                break;
            case 'money_owned':
                current = stats.money_current;
                break;
            default:
                current = 0;
        }

        return {
            current: Math.min(current, target),
            target,
            percentage: Math.floor((current / target) * 100)
        };
    }

    /**
     * Get statistics
     */
    getStats() {
        const total = this.achievements.length;
        const validUnlocked = this.progress.unlocked.filter(id => this.achievements.some(a => a.id === id));
        let claimedCount = 0;

        validUnlocked.forEach(id => {
            if (this.progress.rewards_claimed.includes(id)) {
                claimedCount++;
            }
        });

        const unlocked = validUnlocked.length;
        const claimed = claimedCount;

        return {
            total,
            unlocked,
            locked: Math.max(0, total - unlocked),
            claimed,
            unclaimed: Math.max(0, unlocked - claimed),
            completion: total > 0 ? Math.floor((unlocked / total) * 100) : 0,
            points: this.getTotalPoints()
        };
    }

    /**
     * Get total achievement points earned
     */
    getTotalPoints() {
        let points = 0;
        this.progress.unlocked.forEach(id => {
            const achievement = this.achievements.find(a => a.id === id);
            if (achievement) {
                const tier = ACHIEVEMENT_TIERS[achievement.tier];
                points += tier ? tier.points : 0;
            }
        });
        return points;
    }

    /**
     * Show unlock notifications
     */
    showUnlockNotifications(achievements) {
        achievements.forEach((achievement, index) => {
            setTimeout(() => {
                this.showNotification(achievement);
            }, index * 1000);
        });
    }

    /**
     * Show single notification
     */
    showNotification(achievement) {
        // Create notification element
        const notif = document.createElement('div');
        notif.className = 'achievement-notification';
        notif.style.cssText = `
            position: fixed;
            top: 100px;
            right: -400px;
            width: 350px;
            background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
            border: 2px solid ${ACHIEVEMENT_TIERS[achievement.tier].color};
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 0 30px ${ACHIEVEMENT_TIERS[achievement.tier].color};
            z-index: 10000;
            font-family: 'Press Start 2P';
            transition: right 0.5s ease-out;
        `;

        notif.innerHTML = `
            <div style="color: ${ACHIEVEMENT_TIERS[achievement.tier].color}; font-size: 10px; margin-bottom: 10px;">
                🏆 ACHIEVEMENT UNLOCKED!
            </div>
            <div style="color: white; font-size: 14px; margin-bottom: 10px;">
                ${achievement.icon} ${achievement.name}
            </div>
            <div style="color: #aaa; font-size: 8px; margin-bottom: 10px;">
                ${achievement.desc}
            </div>
            <div style="color: #ffaa00; font-size: 10px;">
                +${ACHIEVEMENT_TIERS[achievement.tier].points} pts
                ${achievement.reward.mk ? ` | +${achievement.reward.mk} MK` : ''}
            </div>
        `;

        document.body.appendChild(notif);

        // Slide in
        setTimeout(() => {
            notif.style.right = '20px';
        }, 100);

        // Slide out and remove
        setTimeout(() => {
            notif.style.right = '-400px';
            setTimeout(() => notif.remove(), 500);
        }, 5000);
    }

    /**
     * Sync stats with CollectionManager (Source of Truth)
     * @param {Object} collectionMgr - Instance of CollectionManager
     */
    syncWithCollection(collectionMgr) {
        if (!collectionMgr) return;
        console.log("Syncing Achievements with Collection...");

        // 1. Sync Money
        if (collectionMgr.getMoney) {
            this.progress.stats.money_current = collectionMgr.getMoney();
        }

        // 2. Sync Cards
        if (collectionMgr.getStats) {
            const cStats = collectionMgr.getStats();
            this.progress.stats.cards_owned = cStats.totalCards;

            // Sync specific types if possible (e.g. unique cards? tiered cards?)
            // For now, cards_owned is the main one.
            // We can also iterate owned cards to update specific counts if they were missed.
            const owned = collectionMgr.getOwnedCards();
            this.progress.stats.cards_by_tier = {}; // Reset and rebuild

            owned.forEach(item => {
                // Count per tier
                const tier = item.card.tier;
                this.progress.stats.cards_by_tier[tier] = (this.progress.stats.cards_by_tier[tier] || 0) + item.count;
            });
        }

        this.checkUnlocks();
        this.saveProgress();
    }

    /**
     * Reload (switch) profile
     * @param {String} profileName 
     */
    reloadForProfile(profileName) {
        this.currentProfile = profileName || 'default';
        this.storageKey = `rrb_achievements_${this.currentProfile}`;
        this.progress = this.loadProgress();
        this.dataFetchedFromServer = false; // Reset flag for new profile
        console.log(`[AchievementManager] Switched to profile: ${this.currentProfile}`);

        // If we need to re-sync with collection immediately:
        // WARNING: syncWithCollection triggers saveProgress(true) which might sync EMPTY data to API.
        // We now have the dataFetchedFromServer guard in saveProgress.
        if (window.collectionManager) {
            this.syncWithCollection(window.collectionManager);
        }
    }

    /**
     * Reset all progress (for testing)
     */
    reset() {
        const key = `rrb_achievements_${this.currentProfile}`;
        localStorage.removeItem(key);
        this.progress = this.loadProgress();
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AchievementManager;
}
