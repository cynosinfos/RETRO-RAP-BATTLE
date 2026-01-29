class AudioManager {
    constructor() {
        this.music = {
            menu: new Audio('./audio/music_menu.mp3')
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
        this.music.menu.volume = 0.5
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
            close: new Audio('./audio/close.mp3')
        }

        this.muted = false
        this.currentMusicType = null
        this.currentTrackInstance = null // Track the exact Audio object playing
    }

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

    stopMusic() {
        // Stop all potential music tracks
        Object.values(this.music).forEach(track => {
            track.pause()
            track.currentTime = 0
        })
        this.fightTracks.forEach(track => {
            track.pause()
            track.currentTime = 0
        })

        this.currentMusicType = null
        this.currentTrackInstance = null
    }

    playSound(name) {
        if (this.muted) return
        if (this.sounds[name]) {
            // Clone node to allow overlapping sounds (rapid fire)
            const sound = this.sounds[name].cloneNode()
            sound.volume = 0.6
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
}
