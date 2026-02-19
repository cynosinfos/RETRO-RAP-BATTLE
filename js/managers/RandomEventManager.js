class RandomEventManager {
    constructor() {
        this.events = [
            {
                id: 'fan_meeting',
                title: 'SPOTKANIE Z FANEM',
                desc: 'Młody chłopak rozpoznał Cię na ulicy i poprosił o autograf.',
                icon: '🤳',
                chance: 0.2, // 20%
                action: () => {
                    const bonusRespekt = 10;
                    if (window.statsManager) window.statsManager.updateRpgStat('respect', bonusRespekt);
                    return `Zyskałeś +${bonusRespekt} respektu!`;
                }
            },
            {
                id: 'street_beef',
                title: 'ULICZNY BEEF',
                desc: 'Ktoś krzyknął coś pod Twoim adresem z przejeżdżającego auta.',
                icon: '🤬',
                chance: 0.15,
                action: () => {
                    const lossRespekt = -5;
                    if (window.statsManager) window.statsManager.updateRpgStat('respect', lossRespekt);
                    return `Straciłeś ${Math.abs(lossRespekt)} respektu przez brak reakcji.`;
                }
            },
            {
                id: 'found_money',
                title: 'ZNALAZŁEŚ MK',
                desc: 'Na chodniku leżał zwitek banknotów.',
                icon: '💸',
                chance: 0.1,
                action: () => {
                    const amount = Math.floor(Math.random() * 200) + 50;
                    if (window.collectionManager) window.collectionManager.updateMoney(amount);
                    return `Znalazłeś ${amount} MK!`;
                }
            },
            {
                id: 'inspiration',
                title: 'NAGŁA INSPIRACJA',
                desc: 'Słyszysz świetny bit w głowie przechodząc obok klubu.',
                icon: '💡',
                chance: 0.15,
                action: () => {
                    const amount = 20;
                    if (window.statsManager) window.statsManager.updateRpgStat('respect', amount);
                    return `Twoja pewność siebie rośnie! +${amount} respektu.`;
                }
            }
        ];
    }

    roll() {
        // 50% chance of ANY event happening
        if (Math.random() > 0.5) return;

        const available = this.events.filter(e => Math.random() < e.chance);
        if (available.length > 0) {
            const event = available[Math.floor(Math.random() * available.length)];
            this.showEvent(event);
        }
    }

    showEvent(event) {
        const resultText = event.action();

        // Show in UI
        const overlay = document.createElement('div');
        overlay.id = 'eventOverlay';
        overlay.style = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.85); display: flex; align-items: center;
            justify-content: center; z-index: 10000; font-family: 'Press Start 2P', monospace;
        `;

        overlay.innerHTML = `
            <div style="background: #111; border: 4px solid #00ffff; padding: 30px; max-width: 500px; text-align: center; box-shadow: 0 0 30px #00ffff;">
                <div style="font-size: 50px; margin-bottom: 20px;">${event.icon}</div>
                <div style="color: #00ffff; font-size: 20px; margin-bottom: 15px;">${event.title}</div>
                <div style="color: white; font-size: 12px; line-height: 1.5; margin-bottom: 20px;">${event.desc}</div>
                <div style="color: #00ff00; font-size: 14px; margin-bottom: 30px;">${resultText}</div>
                <button id="closeEventBtn" style="background: #00ffff; border: none; padding: 15px 30px; font-family: 'Press Start 2P'; cursor: pointer;">OK</button>
            </div>
        `;

        document.body.appendChild(overlay);

        document.getElementById('closeEventBtn').onclick = () => {
            overlay.remove();
        };
    }
}

window.randomEventManager = new RandomEventManager();
