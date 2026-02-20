/**
 * CollectionManager - Manages player card collection using localStorage
 */
class CollectionManager {
    constructor() {
        let stored = 'default';
        try {
            stored = localStorage.getItem('rrb_current_profile');
        } catch (e) {
            console.warn("[CollectionManager] LocalStorage access blocked", e);
        }
        this.currentProfile = stored || 'default';
        this.updateStorageKey();

        // Init with empty to prevent sync access errors
        this.collection = this._getEmptyCollection();
        this.selectedCardId = null;
        this.isInitialized = false;

        console.log(`[CollectionManager] Instance created (Profile: ${this.currentProfile})`);
        console.log(`[CollectionManager] Context: ${window.location.protocol}//${window.location.host}${window.location.pathname}`);

        if (window.location.protocol === 'file:') {
            console.warn("%c[CollectionManager] UWAGA: Grasz przez protokół file://. Niektóre przeglądarki blokują współdzielenie danych między stronami w tym trybie. Użyj lokalnego serwera (np. Live Server) dla pełnej synchronizacji.", "color: orange; font-weight: bold; font-size: 14px;");
        }
    }

    /**
     * Unified Initialization - Must be called and awaited
     */
    async init() {
        if (this.isInitialized) return;

        console.log(`[CollectionManager] Initializing for ${this.currentProfile}...`);
        this.collection = await this.loadCollection();
        let selectedId = null;
        try {
            selectedId = localStorage.getItem(`rrb_selected_card_${this.currentProfile}`);
        } catch (e) {
            console.warn("[CollectionManager] LocalStorage access blocked (selectedCard)", e);
        }
        this.selectedCardId = selectedId || null;
        this.isInitialized = true;

        return this.collection;
    }

    updateStorageKey() {
        // If logged in, we expect to use their username as profile for the key
        // But if currentProfile was already set to something else (e.g. manual switch), keep it.
        // UNLESS we just started and don't have a profile.
        if (!this.currentProfile && window.authManager && window.authManager.currentUser) {
            this.currentProfile = window.authManager.currentUser.username;
        }
        this.storageKey = `rrb_collection_${this.currentProfile}`;
    }

    /**
     * Switch Profile - In backend contest, this is mostly for local switching or post-login sync
     * @param {String} profileName
     */
    async switchProfile(profileName) {
        this.currentProfile = profileName;
        this.updateStorageKey();
        try {
            localStorage.setItem('rrb_current_profile', profileName);
        } catch (e) {
            console.warn("[CollectionManager] LocalStorage set failed (currentProfile)", e);
        }

        // 1. Reload necessary systems FIRST (to set correct profile/keys)
        if (window.achievementManager) window.achievementManager.reloadForProfile(profileName);
        if (window.statsManager) window.statsManager.refreshProfile();
        if (window.inventoryManager) window.inventoryManager.refreshProfile();
        if (window.perkManager) window.perkManager.refreshProfile();

        // 2. Load data for the new profile
        this.collection = await this.loadCollection();
        console.log(`[CollectionManager] Switched to profile: ${profileName}. Key: ${this.storageKey}`);

        // Update Global User
        if (window.playerData) {
            window.playerData.nick = profileName;
            window.playerData.money = this.getMoney();
        }
    }

    /**
     * Get list of all local profiles
     * @returns {Array} List of profile names
     */
    getProfiles() {
        try {
            const list = localStorage.getItem('rrb_profiles_list');
            return list ? JSON.parse(list) : ['default'];
        } catch (e) {
            console.warn("[CollectionManager] LocalStorage getProfiles failed", e);
            return ['default'];
        }
    }

    /**
     * Create a new local profile
     * @param {String} name 
     * @param {Boolean} isAdmin 
     * @returns {Boolean} Success
     */
    createProfile(name, isAdmin = false) {
        const profiles = this.getProfiles();
        if (profiles.includes(name)) return false;

        profiles.push(name);
        localStorage.setItem('rrb_profiles_list', JSON.stringify(profiles));

        // Init empty collection for new profile
        const key = `rrb_collection_${name}`;
        const initial = this._getEmptyCollection();
        // Removed hardcoded ADAM overrides
        localStorage.setItem(key, JSON.stringify(initial));

        return true;
    }

    /**
     * Load collection from API or localStorage
     */
    async loadCollection() {
        // 1. Try API if logged in
        if (window.authManager && window.authManager.isLoggedIn()) {
            try {
                const res = await fetch(`${window.authManager.apiBase}/profile`, {
                    headers: window.authManager.getAuthHeaders()
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data && data.collection) {
                        console.log("[CollectionManager] Loaded exactly from API");

                        // Transform Cards Array -> Map/Object
                        const cardsMap = {};
                        if (Array.isArray(data.collection.cards)) {
                            data.collection.cards.forEach(c => {
                                cardsMap[c.id] = c.count;
                            });
                        } else {
                            Object.assign(cardsMap, data.collection.cards || {});
                        }

                        // Set directly from Server
                        const serverMerged = {
                            cards: cardsMap,
                            selected_card_id: data.collection.selected_card_id || null,
                            money: data.economy ? data.economy.money : 0,
                            totalCards: this.countTotalCards(cardsMap)
                        };

                        // Sync Achievements
                        if (window.achievementManager) {
                            window.achievementManager.importData(data.achievements || {});
                        }

                        // Sync Stats
                        if (window.statsManager) {
                            window.statsManager.importData(data.stats || {});
                        }

                        // Sync Inventory
                        if (window.inventoryManager) {
                            window.inventoryManager.importData(data.inventory || {});
                        }

                        // Sync Perks
                        if (window.perkManager) {
                            if (window.perkManager.importData) {
                                window.perkManager.importData(data.perks || {});
                            } else {
                                window.perkManager.perks = data.perks || { learned: [], totalSpentSP: 0 };
                                window.perkManager.savePerks(); // local persistence of perks for iframe
                            }
                        }

                        // Update Selected Card ID
                        if (data.collection && data.collection.selected_card_id) {
                            this.selectedCardId = data.collection.selected_card_id;
                        }

                        // TRUST THE SERVER OVER LOCAL
                        try {
                            localStorage.setItem(this.storageKey, JSON.stringify(serverMerged));
                        } catch (e) {
                            console.warn("[CollectionManager] LocalStorage sync unsuccessful", e);
                        }
                        this.collection = serverMerged; // CRITICAL: Update internal state
                        return serverMerged;
                    }
                }
            } catch (err) {
                console.error("[CollectionManager] API Load Error:", err);
            }
        }

        // 2. Fallback to LocalStorage
        let stored = null;
        try {
            stored = localStorage.getItem(this.storageKey);
        } catch (e) {
            console.warn("[CollectionManager] LocalStorage fallback failed", e);
        }
        console.log(`[CollectionManager] Loading from key: '${this.storageKey}'`);

        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                // VALIDATION: Ensure cards is an object, not null/undefined
                if (!parsed.cards || typeof parsed.cards !== 'object') {
                    parsed.cards = {};
                }
                parsed.totalCards = this.countTotalCards(parsed.cards);
                parsed.money = Number(parsed.money || 2000);

                console.log(`[CollectionManager] Loaded (Local) ${Object.keys(parsed.cards).length} unique cards`);
                this.collection = parsed;
                return parsed;
            } catch (e) {
                console.error(`[CollectionManager] Parse error:`, e);
            }
        }

        console.log(`[CollectionManager] No valid collection found, creating empty`);
        this.collection = this._getEmptyCollection();
        return this.collection;
    }

    countTotalCards(cardsObj) {
        if (!cardsObj) return 0;
        if (Array.isArray(cardsObj)) {
            // If server returns array format, convert to object map
            return cardsObj.reduce((acc, c) => acc + c.count, 0);
        }
        // Object map format { id: count }
        return Object.values(cardsObj).reduce((a, b) => a + b, 0);
    }

    /**
     * Get an empty collection object
     * @returns {Object}
     */
    _getEmptyCollection() {
        return {
            cards: {}, // { cardId: count }
            totalCards: 0,
            money: 2000,
            lastFreePackClaim: null,
            isAdmin: false
        };
    }

    /**
     * Save collection to API and localStorage
     */
    async saveCollection() {
        if (!this.isInitialized) {
            console.warn("[CollectionManager] Blokada zapisu: Manager nie jest jeszcze zainicjalizowany.");
            return;
        }

        // 1. Save to LocalStorage (Immediate backup)
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.collection));
        } catch (e) {
            console.warn("[CollectionManager] LocalStorage primary save failed", e);
        }

        // 2. Save to API if logged in
        if (window.authManager && window.authManager.isLoggedIn()) {
            try {
                // Convert cards object to array for server if needed, 
                // but our server schema expects object or array? 
                // Let's check Profile.js schema. 
                // Profile.js schema: cards: [{ id: String, count: Number, tier: String }]
                // But CollectionManager uses { cardId: count } object.
                // WE NEED TO CONVERT.

                const cardsArray = [];

                // SAFETY CHECK: Ensure CARDS_DATABASE is available
                if (typeof CARDS_DATABASE === 'undefined') {
                    console.error("[CollectionManager] CARDS_DATABASE MISSING! Cannot sync cards to server.");
                    // Still try to sync money/achievements if possible, but cards are blocked
                } else {
                    for (const [id, count] of Object.entries(this.collection.cards)) {
                        if (count > 0) {
                            const cardData = CARDS_DATABASE.find(c => c.id === id);
                            cardsArray.push({
                                id: id,
                                count: count,
                                tier: cardData ? cardData.tier : 'underground'
                            });
                        }
                    }
                }

                // Achievements also need to be synced? 
                // Actually CollectionManager handles money and cards. 
                // AchievementManager handles achievements. 
                // But /api/profile/save expects full profile... 
                // We should probably rely on separate managers or have a unified save.
                // For now, let's just send what we manage.

                // WAIT: The server endpoint replaces the whole object?
                // Profile.js: collection.cards is replaced.

                // SECURE IFRAME ACCESS FOR SAFARI
                const getIframeManagerData = (managerName) => {
                    try {
                        const iframe = document.querySelector('iframe');
                        if (iframe && iframe.contentWindow) {
                            const manager = iframe.contentWindow[managerName];
                            if (manager && typeof manager.getExportData === 'function') {
                                return manager.getExportData();
                            } else if (manager && managerName === 'perkManager' && manager.perks) {
                                return manager.perks;
                            }
                        }
                    } catch (e) {
                        // This handles SecurityError on Safari when iframe is not same-origin or restricted
                        console.warn(`[Sync] Could not access ${managerName} in iframe:`, e.message);
                    }
                    return {};
                };

                const achievementsData = (window.achievementManager ? window.achievementManager.getExportData() : null) || getIframeManagerData('achievementManager');
                const statsData = (window.statsManager ? window.statsManager.getExportData() : null) || getIframeManagerData('statsManager');
                const inventoryData = (window.inventoryManager ? window.inventoryManager.getExportData() : null) || getIframeManagerData('inventoryManager');
                const perksData = (window.perkManager ? window.perkManager.perks : null) || getIframeManagerData('perkManager');

                const res = await fetch(`${window.authManager.apiBase}/profile/save`, {
                    method: 'POST',
                    headers: window.authManager.getAuthHeaders(),
                    body: JSON.stringify({
                        collection: {
                            cards: cardsArray,
                            selected_card_id: this.selectedCardId
                        },
                        economy: {
                            money: Number(this.collection.money || 0),
                            total_earned: 0, // Track these properly later
                            total_spent: 0
                        },
                        achievements: achievementsData,
                        stats: statsData,
                        inventory: inventoryData,
                        perks: perksData
                    })
                });

                if (document.getElementById('networkStatus')) {
                    const el = document.getElementById('networkStatus');
                    if (res.ok) {
                        el.innerText = "ZAPISANO (API OK)";
                        el.style.color = "#00ff00";
                    } else {
                        el.innerText = "BLAD ZAPISU (API ERROR)";
                        el.style.color = "red";
                    }
                }
                // console.log("[CollectionManager] Saved to API");
            } catch (err) {
                console.warn("[CollectionManager] API Save Failed (Offline?):", err);
                if (document.getElementById('networkStatus')) {
                    const el = document.getElementById('networkStatus');
                    el.innerText = "OFFLINE (ZAPIS LOKALNY)";
                    el.style.color = "yellow";
                }
            }
        }
    }

    /**
     * Add card to collection
     * @param {String} cardId
     * @param {Number} count
     * @param {Boolean} skipSave - If true, do not trigger save (useful for batch adds)
     */
    addCard(cardId, count = 1, skipSave = false) {
        if (!this.collection.cards[cardId]) {
            this.collection.cards[cardId] = 0;
        }

        const oldAmount = this.collection.cards[cardId];
        this.collection.cards[cardId] += count;
        this.collection.totalCards = Object.values(this.collection.cards).reduce((a, b) => a + b, 0);

        console.log(`[CollectionManager] Card added: ${cardId} (${oldAmount} -> ${this.collection.cards[cardId]})`);

        // ACHIEVEMENT TRACKING
        if (window.achievementManager) {
            window.achievementManager.trackEvent('card_added', {
                cardId: cardId,
                count: count,
                totalCards: this.collection.totalCards
            });
            // Force full sync to ensure tier/type counts are correct
            window.achievementManager.syncWithCollection(this);
        }

        if (!skipSave) {
            this.saveCollection();
        }
    }

    /**
     * Add multiple cards from pack opening
     * @param {Array} cards - Array of card objects
     */
    addCards(cards) {
        cards.forEach(card => {
            this.addCard(card.id, 1, true); // Skip save for individual adds
        });

        // Save once at the end
        this.saveCollection();
    }

    /**
     * Get card count
     * @param {String} cardId
     * @returns {Number}
     */
    getCardCount(cardId) {
        return this.collection.cards[cardId] || 0;
    }

    /**
     * Check if player owns card
     * @param {String} cardId
     * @returns {Boolean}
     */
    ownsCard(cardId) {
        return this.getCardCount(cardId) > 0;
    }

    /**
     * Get all owned cards with full data
     * @returns {Array} Array of { card, count }
     */
    getOwnedCards() {
        const owned = [];

        for (const cardId in this.collection.cards) {
            const count = this.collection.cards[cardId];
            if (count > 0) {
                const cardData = CARDS_DATABASE.find(c => c.id === cardId);
                if (cardData) {
                    owned.push({ card: cardData, count });
                }
            }
        }

        return owned;
    }

    /**
     * Get cards filtered by type
     * @param {String} type - Card type from CARD_TYPES
     * @returns {Array}
     */
    getCardsByType(type) {
        return this.getOwnedCards().filter(item => item.card.type === type);
    }

    /**
     * Get cards filtered by tier
     * @param {String} tier - Tier from CARD_TIERS
     * @returns {Array}
     */
    getCardsByTier(tier) {
        return this.getOwnedCards().filter(item => item.card.tier === tier);
    }

    /**
     * Get collection statistics
     * @returns {Object}
     */
    getStats() {
        const stats = {
            totalCards: this.collection.totalCards || 0,
            uniqueCards: Object.keys(this.collection.cards || {}).length,
            totalAvailable: (typeof CARDS_DATABASE !== 'undefined') ? CARDS_DATABASE.length : 0,
            completion: 0,
            byTier: {},
            byType: {}
        };

        if (typeof CARDS_DATABASE !== 'undefined' && CARDS_DATABASE.length > 0) {
            stats.completion = ((stats.uniqueCards / CARDS_DATABASE.length) * 100).toFixed(1);
        }

        // Count by tier
        Object.keys(CARD_TIERS).forEach(tier => {
            const count = this.getCardsByTier(tier).length;
            stats.byTier[tier] = count;
        });

        // Count by type
        Object.values(CARD_TYPES).forEach(type => {
            const count = this.getCardsByType(type).length;
            stats.byType[type] = count;
        });

        return stats;
    }

    /**
     * Get data for synchronization
     * @returns {Object}
     */
    getCollectionData() {
        return {
            cards: this.collection.cards || {},
            selected_card_id: this.selectedCardId || null,
            money: this.getMoney()
        };
    }

    /**
     * Update player money
     * @param {Number} amount - Positive to add, negative to subtract
     */
    updateMoney(amount) {
        const oldMoney = this.collection.money;
        this.collection.money = Number(this.collection.money || 0) + Number(amount);
        if (this.collection.money < 0) this.collection.money = 0;

        console.log(`[CollectionManager] Money update: ${oldMoney} -> ${this.collection.money} (Delta: ${amount})`);

        // Sync global player data for UI
        if (window.playerData) {
            window.playerData.money = this.collection.money;
        }

        // Force UI Update if on player menu
        const moneyEl = document.getElementById('playerMoney');
        if (moneyEl) {
            moneyEl.textContent = this.collection.money + ' MK';
        }

        // Broadcast to subpages/listeners
        if (window.updateStats) window.updateStats();
        if (window.updateMoney) window.updateMoney(); // In pack_opening.html

        // Tracking
        if (window.achievementManager) {
            if (amount > 0) {
                window.achievementManager.trackEvent('money_earned', { amount: amount });
            } else if (amount < 0) {
                window.achievementManager.trackEvent('money_spent', { amount: Math.abs(amount) });
            }
            window.achievementManager.trackEvent('money_updated', { amount: this.collection.money });
            // Always sync current state to be sure
            window.achievementManager.syncWithCollection(this);
        }

        this.saveCollection();
    }

    /**
     * Get player money
     * @returns {Number}
     */
    getMoney() {
        if (!this.collection) return 0;
        return this.collection.money || 0;
    }

    /**
     * Check if free pack is available (daily)
     * @returns {Boolean}
     */
    canClaimFreePack() {
        if (!this.collection.lastFreePackClaim) return true;

        const lastClaim = new Date(this.collection.lastFreePackClaim);
        const now = new Date();
        const hoursSince = (now - lastClaim) / (1000 * 60 * 60);

        return hoursSince >= 24;
    }

    /**
     * Claim free pack
     */
    claimFreePack() {
        this.collection.lastFreePackClaim = new Date().toISOString();
        this.saveCollection();
    }

    /**
     * Reset collection (for testing)
     */
    /**
     * Check if a rapper can be evolved to GOAT
     * @param {String} baseRapperId - e.g. 'quebonafide'
     * @returns {Boolean}
     */
    canEvolve(baseRapperId) {
        const tiers = ['underground', 'mainstream', 'star', 'icon'];
        for (const tier of tiers) {
            const cardId = `${baseRapperId}_${tier}`;
            if (!this.ownsCard(cardId)) return false;
        }
        return true;
    }

    /**
     * Evolve rapper to GOAT tier (Consumes 1 of each tier)
     * @param {String} baseRapperId
     * @returns {Boolean} Success
     */
    evolveRapper(baseRapperId) {
        if (!this.canEvolve(baseRapperId)) return false;

        const tiers = ['underground', 'mainstream', 'star', 'icon'];

        // Consume cards
        tiers.forEach(tier => {
            const cardId = `${baseRapperId}_${tier}`;
            this.collection.cards[cardId]--;
            // Remove if 0? No, keep key with 0 (cleaner)
        });

        // Add GOAT card
        const goatId = `${baseRapperId}_goat`;
        this.addCard(goatId);

        // Track Event
        if (window.achievementManager) {
            window.achievementManager.trackEvent('card_evolved', { rapperId: baseRapperId });
        }

        this.saveCollection();
        return true;
    }

    /**
     * Select a card for fight
     * @param {String} cardId 
     * @returns {Boolean}
     */
    selectCard(cardId) {
        if (!this.ownsCard(cardId)) {
            console.error("Cannot select card: Not owned", cardId);
            return false;
        }
        this.selectedCardId = cardId;
        localStorage.setItem(`rrb_selected_card_${this.currentProfile}`, cardId);

        // Save to collection object so it gets synced to API
        this.collection.selected_card_id = cardId;

        console.log("[CollectionManager] Selected card:", cardId);

        // Trigger UI callback if exists
        if (window.onCardSelected) window.onCardSelected(cardId);

        this.saveCollection();
        return true;
    }

    /**
     * Get data for currently selected card
     * @returns {Object|null}
     */
    getSelectedCard() {
        const id = this.selectedCardId;
        if (!id) return null;

        if (typeof CARDS_DATABASE !== 'undefined') {
            return CARDS_DATABASE.find(c => c.id === id) || null;
        }
        return null;
    }

    reset() {
        localStorage.removeItem(this.storageKey);
        this.collection = this.loadCollection();
    }


    /**
     * Migrate local data to server (Force Merge)
     * To be called manually or when detecting guest->user transition
     */
    async migrateFromLocal(localData = null) {
        if (!window.authManager || !window.authManager.isLoggedIn()) {
            console.error("Cannot migrate: Not logged in");
            return false;
        }

        const dataToMigrate = localData || localStorage.getItem(this.storageKey);
        if (!dataToMigrate) {
            console.log("No local data to migrate.");
            return false;
        }

        // Ensure object format
        const payload = (typeof dataToMigrate === 'string') ? JSON.parse(dataToMigrate) : dataToMigrate;

        try {
            console.log("[CollectionManager] Migrating local data to server...");
            const res = await fetch(`${window.authManager.apiBase}/profile/migrate`, {
                method: 'POST',
                headers: window.authManager.getAuthHeaders(),
                body: JSON.stringify({
                    localStorageData: payload
                })
            });

            if (res.ok) {
                const result = await res.json();
                console.log("[CollectionManager] Migration Success:", result);
                alert("Zsynchronizowano dane lokalne z serwerem!");
                // Reload to get fresh merged state
                this.collection = await this.loadCollection();
                return true;
            } else {
                console.error("Migration Failed:", await res.text());
            }
        } catch (e) {
            console.error("Migration Error:", e);
        }
        return false;
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CollectionManager;
}
