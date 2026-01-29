class StatsManager {
    constructor() {
        this.storageKey = '2020_fighters_stats_v2'
        this.stats = this.loadStats()
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
            totalMatches: 420,
            characters: {
                'TACO': { picks: 50, wins: 30, losses: 20 },
                'QUEBONAFIDE': { picks: 45, wins: 25, losses: 20 },
                'BEDOES 2115': { picks: 40, wins: 20, losses: 20 },
                'PEJA': { picks: 35, wins: 15, losses: 20 },
                'OSTR': { picks: 30, wins: 28, losses: 2 },
                'SOKOL': { picks: 25, wins: 10, losses: 15 },
                'MATA': { picks: 20, wins: 5, losses: 15 },
                'YOUNG LEOSIA': { picks: 15, wins: 15, losses: 0 },
                'KUBI PRODUCENT': { picks: 10, wins: 2, losses: 8 },
                'MAGIK': { picks: 5, wins: 5, losses: 0 } // Easter egg
            }
        }
    }

    saveStats() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.stats))
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
}

const statsManager = new StatsManager()
