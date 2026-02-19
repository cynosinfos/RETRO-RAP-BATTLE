class AudioManager {
    constructor() {
        this.music = {
            menu: new Audio('./audio/music_menu_v2.mp3')
        }

        // Random Fight Music Playlist
        this.fightTracks = [
            new Audio('./audio/music_fight.mp3'),
            new Audio('./audio/music_fight2.mp3'),
            new Audio('./audio/music_fight3.mp3')
        ]

        // Loop music
        this.music.menu.loop = true
        this.fightTracks.forEach(track => track.loop = true)

        // Volume
        this.music.menu.volume = 0.35 // Reduced according to request (-30%)
        this.fightTracks.forEach(track => track.volume = 0.2) // Low volume for background

        this.sounds = {
            hit: new Audio('./audio/hit.mp3'),
            attack: new Audio('./audio/attack.mp3'),
            jump: new Audio('./audio/jump.mp3'),
            round1: new Audio('./audio/round1.mp3'),
            round2: new Audio('./audio/round2.mp3'),
            round3: new Audio('./audio/round3.mp3'),
            fight: new Audio('./audio/fight.mp3'),
            ko: new Audio('./audio/ko.mp3'),
            power: new Audio('./audio/power.mp3'),
            close: new Audio('./audio/close.mp3'),
            thunder: new Audio('./audio/thunder.mp3'),
            car_horn: new Audio('./audio/car_horn.mp3'),
            mielon: new Audio('./audio/mielon.mp3')
        }

        this.ambient = {
            wind: new Audio('./audio/wind.mp3')
        }
        this.ambient.wind.loop = true
        this.ambient.wind.volume = 0.5

        this.muted = false
        this.masterVolume = 1.0
        this.currentMusicType = null
        this.currentTrackInstance = null // Track the exact Audio object playing
        this.currentAmbient = null

        // RADIO PODZIEMIE
        this.radioTracks = []
        this.currentRadioIndex = -1
        this.pendingRadio = false
        this.songsPlayedSinceJingle = 0; // Counter for radio.mp3
        this.jingleAudio = new Audio('./audio/music/radio.mp3');
        this.jingleAudio.onended = () => {
            this.playNextRadioTrack(true);
        }
    }

    set volume(val) {
        this.masterVolume = Math.max(0, Math.min(1, val))
        if (this.currentTrackInstance) {
            let baseVol = (this.currentMusicType === 'menu') ? 0.35 : 0.2
            this.currentTrackInstance.volume = baseVol * this.masterVolume
        }
        if (this.radioAudio) this.radioAudio.volume = 0.35 * this.masterVolume;
        if (this.jingleAudio) this.jingleAudio.volume = 0.35 * this.masterVolume;
    }

    get volume() { return this.masterVolume }

    playMusic(type) {
        if (this.muted) return

        // Check if already playing this type (and it's valid)
        // Note: For 'fight', we might want to stick with the CURRENT playing random track if type doesn't change
        if (this.currentMusicType === type && this.currentTrackInstance && !this.currentTrackInstance.paused) {
            return
        }

        this.stopMusic()

        let trackToPlay = null

        if (type === 'fight') {
            // Pick a random track from the playlist
            const randomIndex = Math.floor(Math.random() * this.fightTracks.length)
            trackToPlay = this.fightTracks[randomIndex]
        } else if (this.music[type]) {
            trackToPlay = this.music[type]
        }

        if (trackToPlay) {
            trackToPlay.currentTime = 0
            let baseVol = (type === 'menu') ? 0.35 : 0.2
            trackToPlay.volume = baseVol * this.masterVolume

            // Promise handling for browsers blocking autoplay
            const playPromise = trackToPlay.play()
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.warn("Audio play blocked (user interaction needed)", error)
                })
            }
            this.currentMusicType = type
            this.currentTrackInstance = trackToPlay
        }
    }

    initRadio(tracksData) {
        this.radioTracks = tracksData
            .filter(track => track.filename !== 'radio.mp3') // Exclude jingle from regular pool
            .map(track => {
                const audio = new Audio(`./audio/music/${track.filename}`)
                // Chain next track
                audio.onended = () => {
                    this.playNextRadioTrack(true) // true = auto sequence
                }
                return {
                    ...track,
                    audio: audio
                }
            })

        // Restore State
        try {
            const state = JSON.parse(localStorage.getItem('rrb_radio_state'));
            if (state && state.index !== undefined) {
                this.currentRadioIndex = state.index;
                this.songsPlayedSinceJingle = state.jingleCounter || 0;
            }
        } catch (e) { }

        this.isRadioEnabled = false; // User toggle
        this.radioAudio = null; // Current playing audio object for radio
    }

    playRadio() {
        this.isRadioEnabled = true;
        this.currentMusicType = 'radio';

        // Stop other music
        if (this.currentTrackInstance && this.currentTrackInstance !== this.radioAudio && this.currentTrackInstance !== this.jingleAudio) {
            this.currentTrackInstance.pause();
        }

        // If jingle is playing
        if (this.currentTrackInstance === this.jingleAudio && !this.jingleAudio.paused) {
            this.jingleAudio.muted = false;
            this.jingleAudio.volume = 0.35 * this.masterVolume;
            return;
        }

        // If radio is already playing (in background), just unmute and set volume
        if (this.radioAudio && !this.radioAudio.paused) {
            this.radioAudio.muted = false;
            this.radioAudio.volume = 0.35 * this.masterVolume;
            this.currentTrackInstance = this.radioAudio;
        } else {
            // Start if not playing
            this.playNextRadioTrack();
        }
    }

    stopRadio() {
        this.isRadioEnabled = false;
        if (this.radioAudio) this.radioAudio.muted = true;
        if (this.jingleAudio) this.jingleAudio.muted = true;
    }

    playNextRadioTrack(auto = false) {
        if (this.radioTracks.length === 0) return

        console.log(`[Audio] playNextRadioTrack(auto=${auto}). Current Counter: ${this.songsPlayedSinceJingle}`);

        // 1. Clean up current
        if (this.radioAudio) {
            this.radioAudio.pause();
            this.radioAudio.currentTime = 0;
        }
        if (this.jingleAudio) {
            this.jingleAudio.pause();
            this.jingleAudio.currentTime = 0;
        }

        // 2. Check Jingle logic (Allowed on auto OR if we manual skip but counter reached limit)
        if (this.songsPlayedSinceJingle >= 3) {
            console.log("[Audio] Triggering Jingle (radio.mp3)");
            this.songsPlayedSinceJingle = 0;
            this.currentMusicType = 'radio';
            this.currentTrackInstance = this.jingleAudio;
            this.jingleAudio.muted = !this.isRadioEnabled;
            this.jingleAudio.volume = 0.35 * this.masterVolume;
            this.jingleAudio.play().catch(e => {
                console.warn("[Audio] Jingle play blocked by browser", e);
                this.pendingRadio = true;
            });
            this.saveRadioState();
            if (window.updateTickerContent) window.updateTickerContent();
            return;
        }

        // Next Index
        // Random or Sequential? User said "będziesz je grać losowo" but "live radio" usually sequential shuffled?
        // Let's keep Random for now as requested originally, or simple cyclic?
        // "radio musi leciec samo niezaleznie" -> usually sequential playlist.
        // Let's simply increment or random. Random is fine for a mix.
        let nextIndex = Math.floor(Math.random() * this.radioTracks.length);

        // Prevent same track if possible
        if (this.radioTracks.length > 1 && nextIndex === this.currentRadioIndex) {
            nextIndex = (nextIndex + 1) % this.radioTracks.length;
        }

        this.currentRadioIndex = nextIndex;
        this.songsPlayedSinceJingle++; // Increment counter
        const trackObj = this.radioTracks[nextIndex];

        if (trackObj && trackObj.audio) {
            this.radioAudio = trackObj.audio;
            // Behavior: always play, but volume depends on isRadioEnabled

            this.radioAudio.muted = !this.isRadioEnabled;
            this.radioAudio.volume = 0.35 * this.masterVolume;

            if (this.isRadioEnabled) {
                this.currentTrackInstance = this.radioAudio;
                this.currentMusicType = 'radio';
            }

            this.radioAudio.play().catch(e => {
                // console.warn("Radio block (Autoplay)", e); // Suppressed
                this.pendingRadio = true;
            });

            // Trigger UI update if window exist
            if (window.updateTickerContent) window.updateTickerContent();
        }

        this.saveRadioState();
    }

    saveRadioState() {
        const state = {
            index: this.currentRadioIndex,
            jingleCounter: this.songsPlayedSinceJingle,
            timestamp: Date.now()
        };
        localStorage.setItem('rrb_radio_state', JSON.stringify(state));
    }

    resumeAudio() {
        // Called on user interaction (click/key)
        if (this.pendingRadio && this.radioAudio) {
            console.log("Resuming Radio after interaction...");
            this.radioAudio.play().then(() => {
                this.pendingRadio = false;
            }).catch(e => console.warn("Still blocked", e));
        }

        // Also resume context if using WebAudioAPI in future (Phaser does this automatically usually)
    }

    stopMusic() {
        // Stop MAIN music (menu, fight), but DO NOT Stop Radio if it's meant to be independent?
        // Actually, 'stopMusic' is called when switching contexts (e.g. entering fight).
        // If we enter fight, we want Radio to Mute (not stop, if we want to resume later).

        Object.values(this.music).forEach(track => {
            track.pause()
            track.currentTime = 0
        })
        this.fightTracks.forEach(track => {
            track.pause()
            track.currentTime = 0
        })

        // Handle Radio: Just Mute/Background it, don't stop.
        // Unless we want to fully kill audio.
        // But for "live radio" feel, we let it run muted if we switch to Fight Music.
        if (this.radioAudio) {
            this.radioAudio.muted = true; // Mute while other music plays
        }

        this.currentMusicType = null;
        this.currentTrackInstance = null;
    }

    getCurrentTrackInfo() {
        if (this.currentRadioIndex !== -1) {
            return this.radioTracks[this.currentRadioIndex]
        }
        return null
    }

    playSound(name) {
        if (this.muted) return
        if (this.sounds[name]) {
            // Clone node to allow overlapping sounds (rapid fire)
            const sound = this.sounds[name].cloneNode()
            sound.volume = 0.48 * this.masterVolume // Respect master volume
            sound.play().catch(e => { })
        }
    }

    // Methods compatible with old calls
    playHit() { this.playSound('hit') }
    playAttack() { this.playSound('attack') }
    playJump() { this.playSound('jump') }

    // Announcer Helpers
    // Announcer Helpers
    playRoundStart(roundNum = 1) {
        // Simple sequence: Round X ... Fight
        const soundKey = `round${roundNum}`
        if (this.sounds[soundKey]) {
            this.playSound(soundKey)
        } else {
            // Fallback
            this.playSound('round1')
        }

        setTimeout(() => {
            this.playSound('fight')
        }, 1500)
    }

    playKO() {
        // this.stopMusic() // Keep music playing per user request
        this.playSound('ko')
    }

    playMielon() {
        console.log("[Audio] Playing Mielon Super Attack Song");
        if (this.sounds.mielon) {
            const sound = this.sounds.mielon.cloneNode();
            sound.volume = 1.0 * this.masterVolume; // Maximum volume for super
            sound.play().catch(e => console.warn("[Audio] Mielon play blocked", e));
        } else {
            console.warn("[Audio] Mielon sound not found in this.sounds");
        }
    }

    playPower() {
        this.playSound('power')
    }

    // ARCADE UI SOUNDS
    playNav() {
        // Mechanical click (using Hit sound for tactile feel)
        this.playSound('hit')
    }

    playSelect() {
        // Mechanical clunk (using Attack/Swish for confirmation)
        this.playSound('attack')
    }

    playThunder() {
        this.playSound('thunder')
    }

    playCarHorn() {
        this.playSound('car_horn')
    }

    startAmbient(type) {
        if (this.muted) return
        this.stopAmbient()

        if (this.ambient[type]) {
            this.currentAmbient = this.ambient[type]
            this.currentAmbient.volume = 0.5 * this.masterVolume
            this.currentAmbient.play().catch(e => { })
        }
    }

    stopAmbient() {
        if (this.currentAmbient) {
            this.currentAmbient.pause()
            this.currentAmbient.currentTime = 0
            this.currentAmbient = null
        }
    }

    playCameraShutter() {
        // Fallback to select sound text
        this.playSelect();
    }

    playGlassBreak() {
        try {
            const glassCrack = new Audio('./audio/ko_sound.mp3');
            glassCrack.volume = 0.7 * this.masterVolume;
            glassCrack.play().catch(() => { });
        } catch (e) { }
    }
}
