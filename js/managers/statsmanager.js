window.StatsManager = class {
    constructor() {
        this.updateStorageKey();
        this.stats = this.loadStats()

        // Auto-save interval
        setInterval(() => this.saveStats(), 30000);

        // Stamina Regen Loop
        this.startStaminaRegen();
    }

    importData(data) {
        if (!data) return;
        this.dataFetchedFromServer = true;
        console.log("[StatsManager] Importing data from API...");

        // Ensure stats structure exists
        if (!this.stats) this.stats = this.getSeedData();

        // 1. Merge characters (take max values to avoid data loss)
        if (data.characters) {
            const serverChars = data.characters instanceof Map ? Object.fromEntries(data.characters) : data.characters;
            Object.keys(serverChars).forEach(key => {
                if (!this.stats.characters[key]) {
                    this.stats.characters[key] = { ...serverChars[key] };
                } else {
                    const local = this.stats.characters[key];
                    const server = serverChars[key];
                    local.picks = Math.max(Number(local.picks || 0), Number(server.picks || 0));
                    local.wins = Math.max(Number(local.wins || 0), Number(server.wins || 0));
                    local.losses = Math.max(Number(local.losses || 0), Number(server.losses || 0));
                }
            });
        }

        // 2. Merge RPG (Stats like level, respect, exp)
        if (data.rpg) {
            const localRpg = this.stats.rpg || {};
            const serverRpg = data.rpg;

            // Higher value for progress-based stats
            this.stats.rpg.level = Math.max(Number(localRpg.level || 1), Number(serverRpg.level || 1));
            this.stats.rpg.respect = Math.max(Number(localRpg.respect || 0), Number(serverRpg.respect || 0));
            this.stats.rpg.experience = Math.max(Number(localRpg.experience || 0), Number(serverRpg.experience || 0));
            this.stats.rpg.stamina = Math.max(Number(localRpg.stamina || 100), Number(serverRpg.stamina || 100));
            this.stats.rpg.maxStamina = Math.max(Number(localRpg.maxStamina || 100), Number(serverRpg.maxStamina || 100));
            this.stats.rpg.sp = Math.max(Number(localRpg.sp || 0), Number(serverRpg.sp || 0));

            // Preference for server for volatile state
            this.stats.rpg.location = serverRpg.location || localRpg.location || 'WAW';
            this.stats.rpg.transport = serverRpg.transport || localRpg.transport || 'train';

            // Merge sets/arrays
            this.stats.rpg.properties = [...new Set([...(localRpg.properties || []), ...(serverRpg.properties || [])])];
            this.stats.rpg.unlockedCities = [...new Set([...(localRpg.unlockedCities || []), ...(serverRpg.unlockedCities || [])])];

            // Local Respect
            if (serverRpg.localRespect) {
                const sLR = serverRpg.localRespect instanceof Map ? Object.fromEntries(serverRpg.localRespect) : serverRpg.localRespect;
                const lLR = localRpg.localRespect || {};
                const mergedLR = { ...lLR };

                Object.keys(sLR).forEach(city => {
                    mergedLR[city] = Math.max(Number(lLR[city] || 0), Number(sLR[city] || 0));
                });
                this.stats.rpg.localRespect = mergedLR;
            }
        }

        if (data.totalMatches !== undefined) {
            this.stats.totalMatches = Math.max(Number(this.stats.totalMatches || 0), Number(data.totalMatches));
        }

        this.saveStats();
        this.notifyUI();
    }

    getExportData() {
        return this.stats;
    }

    startStaminaRegen() {
        if (this.regenInterval) clearInterval(this.regenInterval);
        this.regenInterval = setInterval(() => {
            if (this.stats && this.stats.rpg) {
                if (this.stats.rpg.stamina < this.stats.rpg.maxStamina) {
                    // CALCULATE REGEN RATE
                    let regenAmount = 1;
                    const props = this.stats.rpg.properties || [];

                    if (props.includes('prop_villa')) regenAmount = 2; // 100% bonus
                    else if (props.includes('prop_apt')) regenAmount = 1.8;
                    else if (props.includes('prop_house')) regenAmount = 1.6;
                    else if (props.includes('prop_flat')) regenAmount = 1.4;
                    else if (props.includes('prop_camper')) regenAmount = 1.2;

                    this.regenerateStamina(regenAmount);
                }
            }
        }, 30000); // Base every 30s
    }

    getTravelCostMultiplier() {
        const props = this.stats.rpg.properties || [];
        if (props.includes('car_luxury')) return 0.2; // 80% discount
        if (props.includes('car_standard')) return 0.5; // 50% discount
        return 1.0;
    }

    consumeStamina(amount) {
        if (!this.stats.rpg) return false;

        // Apply travel discount if this is a travel consumption (detected by caller)
        // For simplicity, we assume callers handle the multiplier for now, 
        // OR we add a flag. Let's let index.html handle it for clarity.

        if (this.stats.rpg.stamina >= amount) {
            this.stats.rpg.stamina -= amount;
            this.saveStats();
            this.notifyUI();
            return true;
        }
        return false;
    }

    regenerateStamina(amount) {
        if (!this.stats.rpg) return;
        this.stats.rpg.stamina = Number((this.stats.rpg.stamina + amount).toFixed(2));
        if (this.stats.rpg.stamina > this.stats.rpg.maxStamina) {
            this.stats.rpg.stamina = this.stats.rpg.maxStamina;
        }
        this.saveStats();
        this.notifyUI();
    }

    notifyUI() {
        if (window.updateStats) window.updateStats();
    }

    updateStorageKey() { // Keep existing logic
        if (window.authManager && window.authManager.currentUser) {
            this.currentProfile = window.authManager.currentUser.username;
        } else {
            this.currentProfile = localStorage.getItem('rrb_current_profile') || 'default';
        }
        this.storageKey = `rrb_stats_${this.currentProfile}`;
    }

    refreshProfile() {
        this.saveStats(); // Save old profile first
        this.updateStorageKey();
        this.stats = this.loadStats();
        this.dataFetchedFromServer = false;
        console.log(`[StatsManager] Profile refreshed: ${this.currentProfile}`);
    }

    loadStats() {
        try {
            const stored = localStorage.getItem(this.storageKey)
            if (stored) {
                const parsed = JSON.parse(stored)
                // Strict Schema Validation
                if (parsed && typeof parsed === 'object' && parsed.characters && typeof parsed.characters === 'object') {
                    // Ensure totalMatches exists
                    if (typeof parsed.totalMatches !== 'number') parsed.totalMatches = 0

                    // SCHEMA FIX: Ensure RPG object exists
                    if (!parsed.rpg || typeof parsed.rpg !== 'object') {
                        console.log("[StatsManager] RPG object missing in local data, seeding...");
                        parsed.rpg = this.getSeedData().rpg;
                    }

                    return parsed
                }
                console.warn("Stats data corrupted or invalid format. Resetting.")
            }
        } catch (e) {
            console.error("Failed to load stats, resetting:", e)
            localStorage.removeItem(this.storageKey)
        }

        // Return Default "Seed" Data (Fake Stats for visual)
        return this.getSeedData()
    }

    getSeedData() {
        return {
            totalMatches: 0,
            characters: {},
            rpg: {
                respect: 0,
                localRespect: {}, // { 'WAW': 10, 'GDN': 5 }
                stamina: 100,
                maxStamina: 100,
                level: 1,
                experience: 0,
                nextLevelXp: 1000,
                properties: [], // [ 'tent' ]
                transport: 'train',
                location: 'WAW',
                unlockedCities: ['WAW']
            }
        }
    }

    saveStats() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.stats))

        // Trigger global save via CollectionManager (throttled)
        if (window.collectionManager && window.authManager && window.authManager.isLoggedIn()) {
            if (!this.dataFetchedFromServer) return; // Prevent overwriting server with fresh local

            const now = Date.now();
            if (!this.lastApiSave || (now - this.lastApiSave > 5000)) { // 5s throttle
                this.lastApiSave = now;
                setTimeout(() => window.collectionManager.saveCollection(), 100);
            }
        }
    }

    // Called when a match ends
    recordMatch(player1Name, player2Name, winnerName) {
        this.stats.totalMatches++
        const p1Key = player1Name.toUpperCase()
        const p2Key = player2Name.toUpperCase()
        const winnerKey = winnerName === 'DRAW' ? 'DRAW' : winnerName.toUpperCase()

        // Ensure characters exist in stats
        this.initChar(p1Key)
        this.initChar(p2Key)

        // Increment picks
        this.stats.characters[p1Key].picks++
        this.stats.characters[p2Key].picks++

        // Record outcomes
        if (winnerKey === p1Key) {
            this.stats.characters[p1Key].wins++
            this.stats.characters[p2Key].losses++

            // Track Quest: win_matches
            if (window.questManager) window.questManager.trackProgress('win_matches', 1);

            // GRANT XP for Win
            this.addExperience(100);
        } else if (winnerKey === p2Key) {
            this.stats.characters[p2Key].wins++
            this.stats.characters[p1Key].losses++
        } else {
            // Tie (optional logic, counting as neither win nor loss or both loss?) 
            // For simplicity just picks increment.
        }

        this.saveStats()
    }

    initChar(name) {
        if (!this.stats.characters[name]) {
            this.stats.characters[name] = {
                picks: 0,
                wins: 0,
                losses: 0
            }
        }
    }

    // Returns array sorted by popularity (picks)
    getIcebergData() {
        if (!this.stats || !this.stats.characters) {
            this.stats = { totalMatches: 0, characters: {} }
            return []
        }

        const chars = Object.keys(this.stats.characters).map(name => {
            const data = this.stats.characters[name]
            if (!data) return null
            return {
                name: name,
                ...data,
                winRate: data.picks > 0 ? Math.round((data.wins / data.picks) * 100) : 0
            }
        }).filter(item => item !== null)

        // Sort by picks descending
        return chars.sort((a, b) => b.picks - a.picks)
    }

    // Generate random mock data for visual testing
    getMockIcebergData() {
        const allChars = [
            'BEDOES 2115', 'BLACHA 2115', 'FLEXXY 2115', 'KUBI PRODUCENT', 'KUQE 2115', 'WHITE 2115',
            'ASTEK', 'ATUTOWY', 'BAMBI', 'CATCHUP', 'DJ CHWIAL', 'DZIARMA',
            'TACO', 'QUEBONAFIDE', 'PEJA', 'OSTR', 'SOKOL', 'MATA', 'YOUNG LEOSIA'
        ]

        const getRandomSubset = (count) => {
            const shuffled = [...allChars].sort(() => 0.5 - Math.random())
            return shuffled.slice(0, count).map(name => ({
                name: name,
                picks: Math.floor(Math.random() * 100) + 10,
                wins: Math.floor(Math.random() * 50),
                losses: Math.floor(Math.random() * 50)
            }))
        }

        // Logic "Od góry kolejno... 3, 2, 1" (Pyramid Top-Down: 3 on top row, 2 middle, 1 bottom)
        // Total 6 items per category
        return {
            picks: getRandomSubset(6).sort((a, b) => b.picks - a.picks),
            wins: getRandomSubset(6).sort((a, b) => b.wins - a.wins),
            losses: getRandomSubset(6).sort((a, b) => b.losses - a.losses)
        }
    }

    resetStats() {
        localStorage.removeItem(this.storageKey)
        this.stats = this.loadStats()
    }

    updateRpgStat(stat, amount) {
        if (!this.stats.rpg) {
            this.stats.rpg = { respect: 0, stamina: 100, maxStamina: 100, unlockedCities: ['WAW'] };
        }
        this.stats.rpg[stat] += amount;

        if (stat === 'stamina') {
            if (this.stats.rpg.stamina > this.stats.rpg.maxStamina) this.stats.rpg.stamina = this.stats.rpg.maxStamina;
            if (this.stats.rpg.stamina < 0) this.stats.rpg.stamina = 0;
        }

        this.saveStats();
    }

    addExperience(amount) {
        if (!this.stats.rpg.level) this.stats.rpg.level = 1;
        if (!this.stats.rpg.experience) this.stats.rpg.experience = 0;
        if (!this.stats.rpg.nextLevelXp) this.stats.rpg.nextLevelXp = 1000;

        this.stats.rpg.experience += amount;
        this.notify(`ZDOBYTO ${amount} XP!`);

        // Check Level Up
        if (this.stats.rpg.experience >= this.stats.rpg.nextLevelXp) {
            this.levelUp();
        }

        this.saveStats();
        this.notifyUI();
    }

    levelUp() {
        this.stats.rpg.level++;
        this.stats.rpg.experience -= this.stats.rpg.nextLevelXp;
        // User Request: Slow down leveling.
        // Old: 1.5x. New: 2.0x or higher base?
        // Let's use 1.8x multiplier to make it significantly harder but not impossible.
        this.stats.rpg.nextLevelXp = Math.floor(this.stats.rpg.nextLevelXp * 1.8);

        // Rewards
        this.stats.rpg.stamina = this.stats.rpg.maxStamina; // Full Restore

        // Reward: Skill Point (PU)
        this.stats.rpg.sp = (this.stats.rpg.sp || 0) + 1;

        // Add money?
        if (window.collectionManager) {
            window.collectionManager.updateMoney(500 * this.stats.rpg.level);
            this.notify(`AWANS! POZIOM ${this.stats.rpg.level}! (+${500 * this.stats.rpg.level} MK, +1 PU)`);
        } else {
            this.notify(`AWANS! POZIOM ${this.stats.rpg.level}! (+1 PU)`);
        }

        // Play Sound?
        // if (window.audioManager) window.audioManager.playSound('levelup');
    }

    // Alias for addRespect
    addRespect(amount) {
        this.updateRpgStat('respect', amount);

        // Unify SP Logic: 1 SP per 1000 Respect Milestone
        const r = this.stats.rpg.respect;
        const currentMilestone = Math.floor(r / 1000);
        const lastMilestone = this.stats.rpg.lastRespectSPMilestone || 0;

        if (currentMilestone > lastMilestone) {
            const spGained = currentMilestone - lastMilestone;
            this.stats.rpg.sp = (this.stats.rpg.sp || 0) + spGained;
            this.stats.rpg.lastRespectSPMilestone = currentMilestone;
            this.notify(`AWANS! +${spGained} PUNKT UMIEJETNOSCI (REP: ${currentMilestone * 1000})!`);
        }

        this.checkUnlocks();
    }

    updateLocalRespect(cityCode, amount) {
        if (!this.stats.rpg.localRespect) this.stats.rpg.localRespect = {};
        if (!this.stats.rpg.localRespect[cityCode]) this.stats.rpg.localRespect[cityCode] = 0;

        this.stats.rpg.localRespect[cityCode] += amount;
        this.stats.rpg.respect += amount; // Also update global respect
        this.checkUnlocks();
        this.saveStats();
    }

    getLocalRespect(cityCode) {
        if (!this.stats.rpg.localRespect) return 0;
        return this.stats.rpg.localRespect[cityCode] || 0;
    }

    checkUnlocks() {
        const r = this.stats.rpg.respect;
        if (!this.stats.rpg.unlockedCities) this.stats.rpg.unlockedCities = ['WAW'];
        const cities = this.stats.rpg.unlockedCities;

        // User Request: WRO, KRK, KATO need 400 Respect.
        // Small Cities Unlock (accessible early)
        if (r >= 200) {
            ['LOD', 'POZ', 'OLS', 'TOR', 'BYD', 'CZE', 'KIE', 'GLI', 'OPO'].forEach(c => {
                if (!cities.includes(c)) { cities.push(c); this.notify(`ODBLOKOWANO: ${c}!`); }
            });
        }
        if (r >= 300) {
            ['SZC', 'LUB', 'RZE'].forEach(c => {
                if (!cities.includes(c)) { cities.push(c); this.notify(`ODBLOKOWANO: ${c}!`); }
            });
        }

        if (r >= 400) {
            if (!cities.includes('KRK')) { cities.push('KRK'); this.notify("ODBLOKOWANO: KRAKOW!"); }
            if (!cities.includes('WRO')) { cities.push('WRO'); this.notify("ODBLOKOWANO: WROCLAW!"); }
            if (!cities.includes('KAT')) { cities.push('KAT'); this.notify("ODBLOKOWANO: KATOWICE!"); }
        }

        if (r >= 500 && !cities.includes('GDN')) {
            cities.push('GDN');
            this.notify("ODBLOKOWANO: GDANSK!");
        }
        if (r >= 3000 && !cities.includes('BIA')) {
            cities.push('BIA');
            this.notify("ODBLOKOWANO: BIALYSTOK!");
        }
        if (r >= 5000 && !cities.includes('SOS')) {
            cities.push('SOS');
            this.notify("ODBLOKOWANO: SOSNOWIEC!");
        }
        if (r >= 10000 && !cities.includes('RAD')) {
            cities.push('RAD');
            this.notify("ODBLOKOWANO: RADOM!");
        }

        // Check for Level Up / Skill Points - Logic moved to addRespect / levelUp

        this.saveStats();
    }

    notify(msg) {
        if (window.addNews) window.addNews(msg, 'gold');
        else console.log(msg);
    }

    startTipsTicker() {
        const tips = [
            "TIP: PAMIETAJ O BLOKOWANIU (S/DOL)!",
            "TIP: ODWIEDZAJ SKLEPY W INNYCH MIASTACH.",
            "TIP: KUPNO EKIPY ZWIEKSZA TWOJE SZANSE.",
            "TIP: WALCZ W TURNIEJACH ABY ZDOBYC RESPEKT.",
            "TIP: OBSERWUJ TWORCE NA INSTAGRAMIE ZA BONUS.",
            "TIP: ZJEDZ KEBABA ZEDY ODNOWIC ZDROWIE.",
            "TIP: NIE KAZDY PRZECIWNIK JEST TAKI SAM.",
            "TIP: POZIOM TRUDNOSCI WPLYWA NA NAGRODY.",
            "TIP: ZBIERAJ KARTY, ABY ODBLOKOWAC BONUSY.",
            "INFO: UWAGA DILERZY W KATOWICACH - ZWIEKSZONE RYZYKO.",
            "INFO: POLICJA W WARSZAWIE - UWAZAJ NA MANDATY.",
            "INFO: TURNIEJ W GDANSKU - ZAPISY OTWARTE.",
            "NEWS: KTOS WYGRAL TURNIEJ MK I ZGARNAL 50 000!",
            "POGODA: W WARSZAWIE SYPIE SNIEG - IDEALNY CZAS NA WALKE.",
            "TIP: POSIADANIE HELIKOPTERA ZMNIEJSZA KOSZT PODROZY."
        ];
        const showTip = () => {
            const randomTip = tips[Math.floor(Math.random() * tips.length)];
            if (window.addNews) window.addNews(randomTip, '#aaa');
        };
        showTip(); // Show one immediately
        setInterval(showTip, 14000); // Every 14 seconds
    }

    setLocation(cityCode) {
        this.stats.rpg.location = cityCode;
        this.saveStats();
    }

    unlockAllCities() {
        if (!this.stats.rpg.unlockedCities) this.stats.rpg.unlockedCities = [];
        const allCities = ['WAW', 'GDN', 'KRK', 'BIA', 'SOS', 'RAD'];
        let newUnlock = false;

        allCities.forEach(city => {
            if (!this.stats.rpg.unlockedCities.includes(city)) {
                this.stats.rpg.unlockedCities.push(city);
                newUnlock = true;
            }
        });

        if (newUnlock) {
            this.notify("ODBLOKOWANO WSZYSTKIE MIASTA DZIEKI OBSERWACJI!");
            this.saveStats();
        }
    }

    addProperty(propertyId) {
        if (!this.stats.rpg.properties) this.stats.rpg.properties = [];
        if (!this.stats.rpg.properties.includes(propertyId)) {
            this.stats.rpg.properties.push(propertyId);
            this.saveStats();
        }
    }
}

if (!window.statsManager) {
    window.statsManager = new window.StatsManager();
}
