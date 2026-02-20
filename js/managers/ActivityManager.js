window.ActivityManager = class {
    constructor() {
        this.concertTimer = null;
        this.concertEndTime = 0;
        this.checkExistingActivities();
    }

    checkExistingActivities() {
        const savedEndTime = localStorage.getItem('rrb_concert_end_time');
        if (savedEndTime) {
            const now = Date.now();
            if (now < savedEndTime) {
                // Resume timer
                this.startConcertTimer(savedEndTime - now);
            } else {
                // Clean up expired timer
                localStorage.removeItem('rrb_concert_end_time');
            }
        }
    }

    startConcert(cityCode) {
        if (this.concertTimer) {
            alert("JUŻ GRASZ KONCERT! POCZEKAJ AŻ SIĘ SKOŃCZY.");
            return;
        }

        if (window.statsManager) {
            if (!window.statsManager.consumeStamina(30)) {
                alert("Jesteś zbyt zmęczony! (Wymagane 30 Stamina)");
                return;
            }
        }

        const duration = 5 * 60 * 1000; // 5 minutes
        // const duration = 10 * 1000; // DEBUG: 10 seconds

        const now = Date.now();
        this.concertEndTime = now + duration;
        localStorage.setItem('rrb_concert_end_time', this.concertEndTime);
        localStorage.setItem('rrb_concert_city', cityCode);

        // Show Overlay
        this.showConcertOverlay();

        this.startConcertTimer(duration);
    }

    showConcertOverlay() {
        const overlay = document.getElementById('concertScreen');
        if (overlay) {
            overlay.style.display = 'flex';
            this.updateConcertTimer();
        }
    }

    startConcertTimer(duration) {
        if (this.concertTimer) clearInterval(this.concertTimer);

        const update = () => {
            if (this.concertEndTime <= Date.now()) {
                this.endConcert();
                return;
            }
            this.updateConcertTimer();
        };

        this.concertTimer = setInterval(update, 1000);
        update(); // Initial call
    }

    updateConcertTimer() {
        const timerEl = document.getElementById('concertTimer');
        if (!timerEl) return;

        const left = Math.max(0, this.concertEndTime - Date.now());
        const mins = Math.floor(left / 60000);
        const secs = Math.floor((left % 60000) / 1000);
        timerEl.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    endConcert() {
        if (this.concertTimer) {
            clearInterval(this.concertTimer);
            this.concertTimer = null;
        }

        localStorage.removeItem('rrb_concert_end_time');
        const cityCode = localStorage.getItem('rrb_concert_city');
        localStorage.removeItem('rrb_concert_city');

        // Close Overlay
        const overlay = document.getElementById('concertScreen');
        if (overlay) overlay.style.display = 'none';

        // Rewards
        const moneyReward = 1000;
        const respectReward = 50;

        if (window.collectionManager) window.collectionManager.updateMoney(moneyReward);
        if (window.statsManager) {
            window.statsManager.addRespect(respectReward);
            window.statsManager.addExperience(500); // +500 XP
        }

        alert(`KONCERT ZAKOŃCZONY SUKCESEM!\n\nPublika była zachwycona!\n+${moneyReward} MK\n+${respectReward} Reputacji\n+500 XP`);
    }

    // Illegal Work Logic (Expanded to 10 Tiers per User Request)
    startIllegalWork(difficulty = 'LEVEL_1') {
        const configs = {
            'LEVEL_1': { successChance: 0.90, money: 200, respect: 5, xp: 50, stamina: 5, failPenalty: -2, name: 'KRADZIEŻ KABLI' },
            'LEVEL_2': { successChance: 0.80, money: 500, respect: 15, xp: 120, stamina: 8, failPenalty: -5, name: 'KASZTAN (ŁATWE)' },
            'LEVEL_3': { successChance: 0.50, money: 800, respect: 30, xp: 250, stamina: 12, failPenalty: -15, name: 'SZABER W PIWNICY' },
            'LEVEL_4': { successChance: 0.40, money: 1440, respect: 60, xp: 400, stamina: 15, failPenalty: -30, name: 'DROBNE OSZUSTWO' },
            'LEVEL_5': { successChance: 0.30, money: 2400, respect: 100, xp: 600, stamina: 20, failPenalty: -50, name: 'OGÓREK (ŚREDNIE)' },
            'LEVEL_6': { successChance: 0.20, money: 4000, respect: 180, xp: 900, stamina: 25, failPenalty: -90, name: 'SKOK NA KANTOR' },
            'LEVEL_7': { successChance: 0.10, money: 6800, respect: 280, xp: 1400, stamina: 30, failPenalty: -150, name: 'PRZEZUT TOWARU' },
            'LEVEL_8': { successChance: 0.25, money: 14000, respect: 500, xp: 2200, stamina: 40, failPenalty: -250, name: 'DIDDY (TRUDNE)' },
            'LEVEL_9': { successChance: 0.15, money: 30000, respect: 1000, xp: 5000, stamina: 60, failPenalty: -500, name: 'NAPAD NA KONWÓJ' },
            'LEVEL_10': { successChance: 0.08, money: 75000, respect: 2500, xp: 12000, stamina: 90, failPenalty: -1200, name: 'ILEGALNY IMPERIUM' }
        };

        const config = configs[difficulty] || configs['LEVEL_1'];

        // Rate Limit: 2 per hour
        const now = Date.now();
        const oneHour = 60 * 60 * 1000;
        let attempts = JSON.parse(localStorage.getItem('rrb_work_attempts') || '[]');

        attempts = attempts.filter(t => now - t < oneHour);

        if (attempts.length >= 2) {
            const nextAvailable = attempts[0] + oneHour;
            const waitTime = Math.ceil((nextAvailable - now) / 60000);
            alert(`PRZEPRACOWAŁEŚ SIĘ! Odczekaj jeszcze ${waitTime} minut, aż emocje opadną.`);
            return;
        }

        const successScenarios = [
            "Przerzut towaru przez granicę zakończony pełnym sukcesem. Pogranicznicy spali.",
            "Opchnąłeś partię nielegalnych winyli kolekcjonerowi z zagranicy. Graba i kasa.",
            "Zorganizowałeś tajny, biletowany stream z nielegalnej bitwy. Serwery płonęły.",
            "Skradłeś master-tape'y lokalnej wytwórni i odsprzedałeś je konkurencji.",
            "Udany włam do magazynu sprzętu audio. Masz nowe studio pod pachą.",
            "Twoja 'specyficzna' ochrona na koncercie u innego rapera przyniosła gruby zysk.",
            "Pomyślnie przeprany hajs z lewych biletów trafił na twoje konto.",
            "Zastraszyłeś producenta, który wisiał ci hajs. Oddał z nawiązką.",
            "Twoja ekipa przejęła kontrolę nad dystrybucją na jednym z osiedli.",
            "Sprzedałeś autorskie sample 'pod stołem' dla kogoś z mainstreamu."
        ];

        const failureScenarios = [
            "NALOT! Policja wpadła do piwnicy. Musiałeś uciekać przez okno.",
            "Twój ziomek okazał się kretem i sprzedał info psom. Tracisz zaufanie.",
            "Towar został skonfiskowany na celnym. Wielka strata.",
            "Zostałeś wystawiony podczas transakcji. Ledwo uszedłeś z życiem.",
            "Twoje konto zostało zamrożone przez skarbówkę. Gorąco!",
            "Próba kradzieży bitów zakończyła się awanturą w studiu i interwencją ochrony.",
            "Konkurencja spaliła twój towar. Reputacja w opałach.",
            "Wpadłeś podczas malowania nielegalnego muralu. Mandat i wstyd.",
            "Twoje 'dodatkowe zajęcie' wyszło na jaw. Media lokalne cię zjedzą.",
            "Uciekłeś przed policją, ale musiałeś porzucić cały hajs i sprzęt."
        ];

        if (window.statsManager) {
            if (!window.statsManager.consumeStamina(config.stamina)) {
                alert(`Jesteś zbyt zmęczony! (Wymagane ${config.stamina} Stamina)`);
                return;
            }
        }

        const success = Math.random() < config.successChance;
        const msgIndex = Math.floor(Math.random() * 10);

        if (success) {
            const scenarioMsg = successScenarios[msgIndex];
            attempts.push(now);
            localStorage.setItem('rrb_work_attempts', JSON.stringify(attempts));

            if (window.collectionManager) window.collectionManager.updateMoney(config.money);
            if (window.statsManager) {
                window.statsManager.addRespect(config.respect);
                window.statsManager.addExperience(config.xp);
            }
            alert(`UDAŁO SIĘ! (${config.name})\n${scenarioMsg}\n\n+${config.money} MK\n+${config.respect} Reputacji\n+${config.xp} XP`);
        } else {
            const scenarioMsg = failureScenarios[msgIndex];
            attempts.push(now);
            localStorage.setItem('rrb_work_attempts', JSON.stringify(attempts));

            if (window.statsManager) window.statsManager.addRespect(config.failPenalty);
            alert(`WPADKA! (${config.name})\n${scenarioMsg}\n\nStraciłeś ${Math.abs(config.failPenalty)} Reputacji!`);
        }
    }
}

// Init
window.activityManager = new window.ActivityManager();
