class EconomyManager {
    constructor() {
        this.interval = 60000; // 每分钟给一次收益 (Pasywny przychód co 60 sek)
        this.startTimer();

        // Income per property type
        this.propertyIncome = {
            'tent': 5,
            'studio_small': 50,
            'club_local': 200,
            'mansion': 1000
        };
    }

    startTimer() {
        setInterval(() => this.processPassiveIncome(), this.interval);
    }

    processPassiveIncome() {
        if (!window.statsManager || !window.collectionManager) return;

        const properties = window.statsManager.stats.rpg.properties || [];
        let totalIncome = 0;

        properties.forEach(id => {
            if (this.propertyIncome[id]) {
                totalIncome += this.propertyIncome[id];
            }
        });

        // Apply Crew Bonus (Producer)
        if (window.crewManager) {
            const mult = window.crewManager.getEffectValue('money_mult');
            totalIncome = Math.round(totalIncome * mult);
        }

        if (totalIncome > 0) {
            window.collectionManager.updateMoney(totalIncome);
            console.log(`[EconomyManager] Pasywny przychód: +${totalIncome} MK`);

            // Notification in UI (Optional: News Ticker)
            if (window.addNews) window.addNews(`Twój biznes przyniósł +${totalIncome} MK zysku!`, 'green');
        }
    }
}

window.economyManager = new EconomyManager();
