class TournamentManager {
    constructor() {
        this.isActive = false
        this.round = 0 // 0: Quarters, 1: Semis, 2: Finals
        this.bracket = [] // Array of {p1, p2, winner}
        this.playerChar = null
        this.matches = []
        this.currentMatchIndex = -1
    }

    startTournament(playerCharacter, cityCode = 'WAW') {
        this.isActive = true

        // AUTO-SELECT CHARACTER FROM MY CARD
        if (window.collectionManager) {
            const selectedCard = window.collectionManager.getSelectedCard();
            if (selectedCard) {
                this.playerChar = selectedCard.name;
                console.log(`[Tournament] Auto-selected character: ${this.playerChar}`);
            } else {
                this.playerChar = playerCharacter || allCharacters[0];
            }
        } else {
            this.playerChar = playerCharacter;
        }

        this.round = 0
        this.cityCode = cityCode

        // Large cities: 10 rounds, Small: 5 (User Request)
        const largeCities = ['WAW', 'KRK', 'WRO', 'KAT', 'GDN']
        this.roundsCount = largeCities.includes(cityCode.toUpperCase()) ? 10 : 5

        console.log(`[Tournament] City: ${cityCode}, Rounds: ${this.roundsCount}`)

        this.generateBracket()
        this.updateVisuals()
    }

    generateBracket() {
        // 1. Select 7 random opponents + Player
        const participants = [this.playerChar]
        // Filter out playerChar to avoid duplicates if possible, though mirrors are allowed in this game
        // Let's try to get unique chars
        const pool = allCharacters.filter(c => c !== this.playerChar)

        // Shuffle pool
        for (let i = pool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pool[i], pool[j]] = [pool[j], pool[i]];
        }

        // Take 7
        for (let i = 0; i < 7; i++) {
            // Fallback if pool small
            participants.push(pool[i] || allCharacters[Math.floor(Math.random() * allCharacters.length)])
        }

        // Shuffle participants to randomize player position? 
        // Actually, let's keep Player at index 0 for Match 1 for simplicity, 
        // OR shuffle effectively. 
        // Let's put Player in Match 1 (Indices 0 vs 1).

        this.matches = []
        // Quarter Finals: 4 Matches
        for (let i = 0; i < 8; i += 2) {
            this.matches.push({
                p1: participants[i],
                p2: participants[i + 1],
                winner: null
            })
        }

        // Determine which match is the USER's match
        this.findUserMatch()
    }

    findUserMatch() {
        this.currentMatchIndex = this.matches.findIndex(m => m.p1 === this.playerChar || m.p2 === this.playerChar)
    }

    getCurrentOpponent() {
        if (this.currentMatchIndex === -1) return null
        const m = this.matches[this.currentMatchIndex]
        return (m.p1 === this.playerChar) ? m.p2 : m.p1
    }

    resolveCpuMatches() {
        // Decide winners for non-user matches in this round
        this.matches.forEach((m, idx) => {
            if (idx !== this.currentMatchIndex && !m.winner) {
                // Random winner
                m.winner = Math.random() > 0.5 ? m.p1 : m.p2
            }
        })
    }

    handleWin() {
        // User won their match
        const m = this.matches[this.currentMatchIndex]
        m.winner = this.playerChar

        // Resolve others
        this.resolveCpuMatches()

        // Prepare Next Round
        this.nextRound()
    }

    nextRound() {
        // Check if tournament over
        if (this.matches.length === 1) {
            // Champion!
            this.updateVisuals() // Show full bracket with winner
            setTimeout(() => {
                this.endTournament(true)
            }, 3000)
            return
        }

        // Generate next level matches
        const nextMatches = []
        for (let i = 0; i < this.matches.length; i += 2) {
            const m1 = this.matches[i]
            const m2 = this.matches[i + 1]
            nextMatches.push({
                p1: m1.winner,
                p2: m2.winner,
                winner: null
            })
        }

        this.matches = nextMatches
        this.round++
        this.findUserMatch()
        this.updateVisuals()
    }

    endTournament(won) {
        this.isActive = false
        if (won) {
            // Reward (Base 1000 MK, could be city-specific)
            if (window.collectionManager) {
                window.collectionManager.updateMoney(1000)
            }
            alert("WYGRALES TURNIEJ! NAGRODA: 1000 MK")
        } else {
            alert("ODPADLES Z TURNIEJU!")
        }

        // RETURN TO RPG CITY MENU (POINT 2)
        if (typeof window.openCity === 'function' && this.cityCode) {
            // First show map, then open the specific city again
            if (document.getElementById('playerMenuScreen')) {
                document.getElementById('playerMenuScreen').style.display = 'block';
                window.openCity(this.cityCode);
            }
        } else {
            showMainMenu();
        }
    }

    updateVisuals() {
        const screen = document.getElementById('tournamentScreen')
        if (!screen) return

        const container = document.getElementById('bracketContainer')
        container.innerHTML = ''

        // Render current state
        const title = document.getElementById('tournamentTitle')
        if (this.round === 0) title.innerText = "CWIERCFINALY"
        else if (this.round === 1) title.innerText = "POLFINALY"
        else if (this.round === 2) title.innerText = "FINAL"

        // Display Matches
        this.matches.forEach((m, i) => {
            const el = document.createElement('div')
            el.style = "border: 2px solid #555; padding: 10px; margin: 10px; width: 200px; text-align: center; background: #222;"

            // Highlight user match
            if (i === this.currentMatchIndex) {
                el.style.borderColor = "#00ff00"
                el.style.boxShadow = "0 0 10px #00ff00"
            }

            el.innerHTML = `
                <div style="color: ${m.winner === m.p1 ? '#00ff00' : (m.winner ? '#555' : 'white')}">${m.p1}</div>
                <div style="color: #555; font-size: 10px;">VS</div>
                <div style="color: ${m.winner === m.p2 ? '#00ff00' : (m.winner ? '#555' : 'white')}">${m.p2}</div>
            `
            container.appendChild(el)
        })

        // "FIGHT" Button
        const btn = document.getElementById('startTourneyMatchBtn')
        btn.onclick = () => {
            // Start the actual game
            screen.style.display = 'none'
            // Setup VS params
            p1Index = allCharacters.indexOf(this.playerChar)
            // find opponent index
            const oppName = this.getCurrentOpponent()
            p2Index = allCharacters.indexOf(oppName)

            player1Selection = this.playerChar
            player2Selection = oppName

            // Start Game (PVE Mode)
            gameMode = 'PVE_TOURNAMENT'
            // We can skip Map Select or pick random?
            // Let's pick random map for tournament
            mapIndex = Math.floor(Math.random() * maps.length)

            // Go !
            startGame()
        }
    }
}

window.tournamentManager = new TournamentManager()
