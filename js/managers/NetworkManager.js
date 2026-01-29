class NetworkManager {
    constructor() {
        this.socket = null
        this.roomId = null
        this.isOnline = false
        this.playerIndex = -1 // 0 = Host (left), 1 = Guest (right)
    }

    connect() {
        // Default to localhost for dev, but ready for production URL
        const serverUrl = 'http://localhost:3000'

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
        })

        this.socket.on('playerJoined', (data) => {
            console.log('Player joined evt:', data)
            // If I am not the one who joined (so receive notification about guest),
            // OR if I am the guest confirm joining.

            if (data.playerId !== this.socket.id) {
                alert("PRZECIWNIK DOŁĄCZYŁ! Zaczynamy!")
            } else {
                this.playerIndex = 1 // I am P2
            }
        })

        this.socket.on('gameReady', () => {
            console.log('Game Ready!')
            // Trigger Game Start -> Go to Char Selection
            // For now, let's just create a visual cue
            if (typeof startOnlineGame === 'function') {
                startOnlineGame()
            }
        })

        this.socket.on('enemyInput', (input) => {
            // console.log("Enemy input:", input)
            if (window.handleOnlineInput) {
                window.handleOnlineInput(input)
            }
        })
    }

    createRoom() {
        if (!this.socket) this.connect()
        setTimeout(() => this.socket.emit('createRoom'), 500)
    }

    joinRoom(roomId) {
        if (!this.socket) this.connect()
        setTimeout(() => {
            this.roomId = roomId
            this.socket.emit('joinRoom', roomId)
        }, 500)
    }

    sendInput(inputData) {
        if (this.socket && this.roomId) {
            this.socket.emit('playerInput', {
                roomId: this.roomId,
                input: inputData
            })
        }
    }
}

window.networkManager = new NetworkManager()
