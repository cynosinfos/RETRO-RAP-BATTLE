/**
 * RadioBar - Shared UI component for the top news ticker and radio controls
 */
class RadioBar {
    constructor() {
        this.newsItems = [
            "RETRO RAP BATTLES - NAJLEPSZA GRA O POLSKIM RAPIE!",
            "WKRÓTCE TRYB ETAPÓW (KARIERA)!",
            "DODANO MULTIPLAYER ONLINE - GRAJ Z KUMPLAMI!",
            "SPRAWDŹ STATYSTYKI W MENU GŁÓWNYM!",
            "FOLLOWUJ @ADAMMANSKI NA INSTAGRAMIE PO DODATKOWE MK!",
            "RADIO PODZIEMIE: NAJLEPSZE TRACKI 24/7"
        ];
        this.currentNewsIndex = 0;
    }

    init() {
        this.injectStyles();
        this.injectHTML();
        this.startClock();
        this.startTicker();
        this.setupEventListeners();
    }

    injectStyles() {
        if (document.getElementById('radioBarStyles')) return;
        const style = document.createElement('style');
        style.id = 'radioBarStyles';
        style.innerHTML = `
            #newsTickerBar {
                display: flex;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 45px;
                background: linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 50%, #000 100%);
                border-bottom: 3px solid #ff0055;
                box-shadow: 0 4px 20px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.1);
                z-index: 20000;
                align-items: center;
                font-family: 'Press Start 2P', cursive;
                overflow: hidden;
            }
            #newsClock {
                padding: 0 15px;
                width: 140px;
                text-align: center;
                background: linear-gradient(135deg, #ff0055 0%, #cc0044 100%);
                color: white;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 11px;
                z-index: 10;
                flex-shrink: 0;
                box-shadow: 3px 0 10px rgba(0,0,0,0.7), inset -2px 0 4px rgba(0,0,0,0.5), inset 2px 0 4px rgba(255,255,255,0.2);
                border-right: 2px solid #000;
                letter-spacing: 1px;
            }
            .radio-btn {
                background: linear-gradient(180deg, #222 0%, #111 50%, #000 100%);
                border: none;
                color: #fff;
                font-family: 'Press Start 2P', cursive;
                font-size: 14px;
                cursor: pointer;
                padding: 8px 12px;
                box-shadow: 0 4px 0 #000, 0 6px 10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1);
                transition: all 0.1s;
                font-weight: bold;
                min-width: 40px;
                text-align: center;
                border-radius: 3px;
                margin-right: 5px;
            }
            .radio-btn:hover { background: #ff0055; border-color: #fff; }
            .radio-btn:active {
                transform: translateY(2px);
                box-shadow: 0 2px 0 #000, 0 3px 5px rgba(0,0,0,0.5);
            }
            .radio-btn-play { background: linear-gradient(180deg, #00ff00 0%, #00cc00 50%, #009900 100%) !important; color: #000 !important; box-shadow: 0 4px 0 #006600 !important; }
            .radio-btn-stop { background: linear-gradient(180deg, #ff0055 0%, #cc0044 50%, #990033 100%) !important; color: #fff !important; box-shadow: 0 4px 0 #660022 !important; }
            .radio-btn-next { background: linear-gradient(180deg, #00ffff 0%, #00cccc 50%, #009999 100%) !important; color: #000 !important; box-shadow: 0 4px 0 #006666 !important; }

            #newsContentContainer {
                flex: 1;
                overflow: hidden;
                position: relative;
                height: 100%;
                display: flex;
                align-items: center;
            }
            #newsContent {
                white-space: nowrap;
                display: inline-block;
                padding-left: 10px;
                animation: ticker 50s linear infinite;
                flex-shrink: 0;
                color: #00ffff;
                font-size: 12px;
                line-height: 45px;
                text-shadow: 0 0 10px rgba(0,255,255,0.8), 2px 2px 0 #000;
                letter-spacing: 2px;
                font-weight: bold;
            }
            @keyframes ticker {
                0% { transform: translateX(100%); }
                100% { transform: translateX(-100%); }
            }
            #radioStatus {
                color: #ffff00;
                font-size: 9px;
                margin-left: 10px;
                font-family: 'Press Start 2P', cursive;
                text-shadow: 0 0 5px rgba(255,255,0,0.8), 1px 1px 0 #000;
                letter-spacing: 1px;
                text-transform: uppercase;
                min-width: 150px;
            }
        `;
        document.head.appendChild(style);
    }

    injectHTML() {
        if (document.getElementById('newsTickerBar')) return;
        const bar = document.createElement('div');
        bar.id = 'newsTickerBar';
        bar.innerHTML = `
            <div id="newsClock">00:00 | 00.00</div>
            <div style="display: flex; gap: 8px; margin: 0 15px; z-index: 100; align-items: center;">
                <button class="radio-btn radio-btn-play" id="radioPlay">▶</button>
                <button class="radio-btn radio-btn-stop" id="radioStop">■</button>
                <button class="radio-btn radio-btn-next" id="radioNext">⏭</button>
                <div id="radioStatus">RADIO: STOP</div>
            </div>
            <div id="newsContentContainer">
                <div id="newsContent">WITAMY W WORLD OF RAP *** ZDOBYWAJ RESPEKT *** WALCZ W TURNIEJACH *** KUPUJ NIERUCHOMOSCI *** ZOSTAŃ LEGENDĄ *** RADIO PODZIEMIE NADAJE ***</div>
            </div>
        `;
        document.body.prepend(bar);

        // Adjust body padding to avoid overlap
        document.body.style.paddingTop = '45px';
    }

    startClock() {
        const updateClock = () => {
            const clock = document.getElementById('newsClock');
            if (clock) {
                const now = new Date();
                const hh = String(now.getHours()).padStart(2, '0');
                const mm = String(now.getMinutes()).padStart(2, '0');
                const dd = String(now.getDate()).padStart(2, '0');
                const mo = String(now.getMonth() + 1).padStart(2, '0');
                clock.innerText = `${hh}:${mm} | ${dd}.${mo}`;
            }
        };
        updateClock();
        setInterval(updateClock, 1000);
    }

    startTicker() {
        // Handled by CSS Animation
    }

    setupEventListeners() {
        const playBtn = document.getElementById('radioPlay');
        const stopBtn = document.getElementById('radioStop');
        const nextBtn = document.getElementById('radioNext');

        if (playBtn) playBtn.onclick = () => {
            if (window.playRadio) window.playRadio();
            else if (window.audioManager) {
                window.audioManager.playRadio();
                this.updateStatus('ON');
            }
        };
        if (stopBtn) stopBtn.onclick = () => {
            if (window.stopRadio) window.stopRadio();
            else if (window.audioManager) {
                window.audioManager.stopRadio();
                this.updateStatus('STOP');
            }
        };
        if (nextBtn) nextBtn.onclick = () => {
            if (window.nextTrack) window.nextTrack();
            else if (window.audioManager) {
                window.audioManager.playNextRadioTrack();
            }
        };

        const checkStatus = () => {
            const statusEl = document.getElementById('radioStatus');
            if (window.audioManager && statusEl) {
                // Check if jingle is playing
                if (window.audioManager.currentTrackInstance === window.audioManager.jingleAudio && !window.audioManager.jingleAudio.paused) {
                    this.updateStatus('REKLAMA / INTRO');
                    return;
                }

                const info = typeof window.audioManager.getCurrentTrackInfo === 'function' ? window.audioManager.getCurrentTrackInfo() : null;
                if (info && window.audioManager.isRadioEnabled) {
                    this.updateStatus(info.title || 'ON');
                } else if (!window.audioManager.isRadioEnabled) {
                    this.updateStatus('STOP');
                } else {
                    this.updateStatus('ON');
                }
            }
        };
        setInterval(checkStatus, 1000);
    }

    updateStatus(status) {
        const el = document.getElementById('radioStatus');
        if (el) el.innerText = `RADIO: ${status}`;
    }
}

// Global instance for subpages
if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        if (window.self !== window.top) return; // FIX: Don't init inside iframe (radio playing in parent)

        // Only init if we are on a subpage that doesn't have its own ticker hardcoded
        if (!document.getElementById('newsTickerBar')) {
            // Initialize AudioManager if not already present
            if (!window.audioManager && typeof AudioManager !== 'undefined') {
                try {
                    window.audioManager = new AudioManager();
                    if (typeof window.tracks !== 'undefined') {
                        window.audioManager.initRadio(window.tracks);
                        // Auto-start radio on subpages if it was playing? 
                        // Browsers block auto-audio, so user must click play usually.
                    }
                    console.log("[RadioBar] AudioManager initialized for subpage.");
                } catch (e) {
                    console.error("[RadioBar] Failed to init AudioManager:", e);
                }
            }

            window.radioBar = new RadioBar();
            window.radioBar.init();
        }
    });
}
