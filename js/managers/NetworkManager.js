class NetworkManager {
    constructor() {
        this.socket = null
        this.roomId = null
        this.isOnline = false
        this.roomId = null
        this.isOnline = false
        this.playerIndex = -1 // 0,1 = Team 1 | 2,3 = Team 2
        this.playersInRoom = [null, null, null, null]; // Track who is in which slot
    }

    connect() {
        const renderUrl = 'https://retro-rap-battle.onrender.com';

        // Use localhost if running locally, otherwise use Render
        const isLocal = window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1' ||
            window.location.protocol === 'file:';

        const serverUrl = isLocal ? 'http://localhost:3000' : renderUrl;

        console.log(`Connecting to server: ${serverUrl}...`)

        if (typeof io === 'undefined') {
            console.error("Socket.IO client library not loaded!")
            return
        }

        this.socket = io(serverUrl)

        this.socket.on('connect', () => {
            console.log('Connected to server:', this.socket.id)
            this.isOnline = true
            // Update UI to show connected status
            const statusIndicator = document.getElementById('onlineStatus')
            if (statusIndicator) statusIndicator.innerText = "SERVER: CONNECTED"
        })

        this.socket.on('connect_error', (err) => {
            console.error('Connection failed:', err)
            const statusIndicator = document.getElementById('onlineStatus')
            if (statusIndicator) statusIndicator.innerText = "SERVER: OFFLINE"
        })

        this.socket.on('roomCreated', (roomId) => {
            console.log('Room created:', roomId)
            this.roomId = roomId
            this.playerIndex = 0 // Host is P1

            // Show Code
            alert(`TWOJE KOD POKOJU: ${roomId}\n\nWyślij go znajomemu!`)
            // UI Update
            const codeDisplay = document.getElementById('roomCodeDisplay')
            if (codeDisplay) codeDisplay.innerText = `ROOM: ${roomId}`

            // If 2v2 Mode, go to Side Selection immediately
            if (window.gameMode === '2V2_CHAOS' && typeof window.showSideSelection === 'function') {
                window.showSideSelection();
            }
        })

        this.socket.on('playerJoined', (data) => {
            console.log('Player joined evt:', data)

            // Update local tracking
            if (data.playerIndex !== undefined && data.playerIndex >= 0) {
                this.playersInRoom[data.playerIndex] = data.playerId;
            }

            // Sync Side Selection UI if active
            if (window.updateSideSelectionUI) {
                window.updateSideSelectionUI();
            }

            if (data.playerId !== this.socket.id) {
                // Alert only if game already starting or significant event? 
                // For 4 player lobby, maybe just update UI instead of alert spam.
                console.log("New player connected to room.");
            } else {
                this.playerIndex = data.playerIndex
            }
        })

        this.socket.on('playerCountUpdate', (count) => {
            const el = document.getElementById('playersOnlineCount')
            if (el) el.innerText = `GRACZY ONLINE: ${count}`
        })

        this.socket.on('matchFound', (data) => {
            const status = document.getElementById('matchStatus')
            if (status) {
                status.style.display = 'block'
                status.innerText = "PRZECIWNIK ZNALEZIONY!"
                status.style.color = "#00ff00"
            }
            this.roomId = data.roomId
            this.playerIndex = data.playerIndex // 0 or 1 assigned by server
            startOnlineGame() // Auto start
        })

        this.socket.on('gameReady', (data) => {
            console.log('Game Ready!')
            // If data contains role info, update playerIndex (server authoritative)
            if (data && data.playerIndex !== undefined) {
                this.playerIndex = data.playerIndex
            }

            // For 4 player room, ensure we have full list?
            if (data && data.players) {
                data.players.forEach((pid, idx) => {
                    this.playersInRoom[idx] = pid;
                });
            }

            // IF 2v2 Mode, go to Side Selection instead of Start Game
            if (window.gameMode === '2V2_CHAOS' && typeof window.showSideSelection === 'function') {
                window.showSideSelection();
            } else if (typeof startOnlineGame === 'function') {
                startOnlineGame()
            }
        })

        this.socket.on('enemyInput', (data) => {
            if (window.handleOnlineInput) {
                // Compatible with old (input only) and new ({input, from}) format
                if (data.from) window.handleOnlineInput(data.input, data.from);
                else window.handleOnlineInput(data);
            }
        })
    }

    createRoom() {
        this.isQuickMatch = false
        if (!this.socket) this.connect()

        // Check mode for capacity
        const capacity = (window.gameMode === '2V2_CHAOS') ? 4 : 2;

        setTimeout(() => {
            if (this.socket && this.socket.connected) {
                this.socket.emit('createRoom', { capacity });
            } else {
                console.error('[NetworkManager] Socket not connected yet for createRoom');
            }
        }, 1500)
    }

    joinRoom(roomId) {
        this.isQuickMatch = false
        if (!this.socket) this.connect()
        setTimeout(() => {
            this.roomId = roomId
            if (this.socket && this.socket.connected) {
                this.socket.emit('joinRoom', roomId);
            } else {
                console.error('[NetworkManager] Socket not connected yet for joinRoom');
            }
        }, 1500)
    }

    findMatch() {
        this.isQuickMatch = true
        if (!this.socket) this.connect()

        const btn = document.getElementById('findMatchBtn')
        const status = document.getElementById('matchStatus')

        if (btn) btn.style.display = 'none'
        if (status) {
            status.style.display = 'block'
            status.innerText = "SZUKAM PRZECIWNIKA..."
            status.style.color = "white"
        }

        // Updated Detection
        const isMobile = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        this.myDevice = isMobile ? 'mobile' : 'desktop';
        console.log("Searching for match as:", this.myDevice);

        setTimeout(() => {
            // Include device in the matchmaking request
            if (this.socket && this.socket.connected) {
                this.socket.emit('findMatch', { device: this.myDevice });
            } else {
                console.error('[NetworkManager] Socket not connected yet for findMatch');
                const status = document.getElementById('matchStatus');
                if (status) {
                    status.innerText = "BŁĄD POŁĄCZENIA Z SERWEREM";
                    status.style.color = "red";
                }
            }
        }, 1500)
    }

    sendInput(inputData) {
        if (this.socket && this.roomId) {
            this.socket.emit('playerInput', {
                roomId: this.roomId,
                input: inputData
            })
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect()
            this.socket = null
        }
        this.isOnline = false
        this.roomId = null
        this.playerIndex = -1
        console.log("Disconnected from server.")

        // UI Update
        const statusIndicator = document.getElementById('onlineStatus')
        if (statusIndicator) statusIndicator.innerText = "SERVER: DISCONNECTED"
    }
}

window.networkManager = new NetworkManager()
