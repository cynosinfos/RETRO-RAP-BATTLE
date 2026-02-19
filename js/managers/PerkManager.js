class PerkManager {
    constructor() {
        this.updateStorageKey();
        this.perks = this.loadPerks();

        // Database of available perks
        this.perkDatabase = {
            'fast_regen': {
                name: 'SZYBKI METABOLIZM',
                desc: 'Odnawiasz +5% HP co 10 sekund walki.',
                icon: '💉',
                cost: 1,
                effect: { type: 'regen', value: 0.05 }
            },
            'street_diplomat': {
                name: 'ULICZNY DYPLOMATA',
                desc: 'Zyskujesz 20% wiecej respektu z walk i eventow.',
                icon: '🤝',
                cost: 2,
                effect: { type: 'respect_bonus', value: 1.2 }
            },
            'flow_master': {
                name: 'MISTRZ FLOW',
                desc: 'Pasek HYPE (Super) laduje sie 15% szybciej.',
                icon: '🌊',
                cost: 3,
                effect: { type: 'hype_rate', value: 1.15 }
            },
            'iron_fist': {
                name: 'ZELAZNA PIESC',
                desc: 'Twoje ciosy zadaja 10% wiecej obrazen.',
                icon: '🥊',
                cost: 3,
                effect: { type: 'damage_bonus', value: 1.1 }
            },
            'travel_discount': {
                name: 'TANI PRZEWOZNIK',
                desc: 'Podroze miedzy miastami sa 20% tansze.',
                icon: '✈️',
                cost: 1,
                effect: { type: 'travel_discount', value: 0.8 } // 0.8 modifier (20% off)
            },
            'gambler_luck': {
                name: 'SZCZESCIARZ',
                desc: 'Zwieksza szanse na wygrana w barze (automaty/gry).',
                icon: '🎰',
                cost: 2,
                effect: { type: 'gambling_buff', value: 1.15 } // 1.15 modifier
            }
        };
    }

    loadPerks() {
        const saved = localStorage.getItem(this.storageKey);
        return saved ? JSON.parse(saved) : {
            learned: [], // Array of perk IDs
            totalSpentSP: 0
        };
    }

    importData(data) {
        if (!data) return;
        // Merge strategy: learned lists combined
        const local = this.perks.learned || [];
        const server = data.learned || [];
        this.perks.learned = [...new Set([...local, ...server])];
        this.perks.totalSpentSP = Math.max(Number(this.perks.totalSpentSP || 0), Number(data.totalSpentSP || 0));
        this.savePerks();
        console.log("[PerkManager] Data imported from server.");
    }

    updateStorageKey() {
        if (window.authManager && window.authManager.currentUser) {
            this.currentProfile = window.authManager.currentUser.username;
        } else {
            this.currentProfile = localStorage.getItem('rrb_current_profile') || 'default';
        }
        this.storageKey = `rrb_perks_${this.currentProfile}`;
    }

    refreshProfile() {
        this.updateStorageKey();
        this.perks = this.loadPerks();
    }

    savePerks() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.perks));

        // Trigger global save via CollectionManager (throttled)
        if (window.collectionManager && window.authManager && window.authManager.isLoggedIn()) {
            const now = Date.now();
            if (!this.lastApiSave || (now - this.lastApiSave > 5000)) { // 5s throttle
                this.lastApiSave = now;
                setTimeout(() => {
                    if (window.collectionManager.saveCollection) {
                        window.collectionManager.saveCollection();
                    }
                }, 500);
            }
        }
    }

    // SP is now handled in StatsManager
    getAvailableSP() {
        if (window.statsManager && window.statsManager.stats.rpg) {
            return window.statsManager.stats.rpg.sp || 0;
        }
        return 0;
    }

    unlockPerk(perkId) {
        const perk = this.perkDatabase[perkId];
        if (!perk) return { success: false, message: "Perk nie istnieje." };
        if (this.perks.learned.includes(perkId)) return { success: false, message: "Juz znasz te umiejetnosc." };

        const available = this.getAvailableSP();
        if (available < perk.cost) {
            return { success: false, message: `Za malo Punktow Umiejetnosci! Brak: ${perk.cost - available}` };
        }

        // Spend from StatsManager
        if (window.statsManager && window.statsManager.stats.rpg) {
            window.statsManager.stats.rpg.sp -= perk.cost;
            window.statsManager.saveStats();
        }

        this.perks.learned.push(perkId);
        this.perks.totalSpentSP += perk.cost;
        this.savePerks();

        // Refresh UI
        if (window.updateStats) window.updateStats();

        return { success: true, message: `Odblokowano: ${perk.name}!` };
    }

    getEffect(type) {
        let total = 1.0;
        this.perks.learned.forEach(id => {
            const perk = this.perkDatabase[id];
            if (perk && perk.effect.type === type) {
                total *= perk.effect.value;
            }
        });
        return total;
    }

    hasPerk(perkId) {
        return this.perks.learned.includes(perkId);
    }
}

window.perkManager = new PerkManager();
