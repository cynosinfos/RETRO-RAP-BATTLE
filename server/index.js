// Server Update: 2026-01-30 23:55
const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const path = require('path')

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "*", // Allow connections from anywhere (for now)
        methods: ["GET", "POST"]
    }
})

// Serve static files from the game directory (parent folder)
app.use(express.static(path.join(__dirname, '../')))

// Game State
const rooms = {}
const matchmakingQueue = {
    desktop: [],
    mobile: []
}



io.on('connection', (socket) => {
    console.log('A user connected:', socket.id)

    // 1. Create Game Room
    socket.on('createRoom', () => {
        const roomId = Math.random().toString(36).substring(2, 6).toUpperCase()
        rooms[roomId] = {
            players: [socket.id],
            ready: [false, false]
        }
        socket.join(roomId)
        socket.emit('roomCreated', roomId)
        console.log(`Room creating: ${roomId} by ${socket.id}`)
    })

    // 2. Join Game Room
    socket.on('joinRoom', (roomId) => {
        const room = rooms[roomId]
        if (room && room.players.length < 2) {
            room.players.push(socket.id)
            socket.join(roomId)

            // Notify both players
            io.to(roomId).emit('playerJoined', {
                playerId: socket.id,
                playerIndex: 1 // 0 is host, 1 is guest
            })

            console.log(`User ${socket.id} joined room ${roomId}`)

            // Start Game if 2 players
            if (room.players.length === 2) {
                io.to(roomId).emit('gameReady')
            }
        } else {
            socket.emit('error', 'Room full or does not exist')
        }
    })

    // 3. Game Input Sync (The Core)
    socket.on('playerInput', ({ roomId, input }) => {
        // Broadcast input to the OTHER player in the room
        socket.to(roomId).emit('enemyInput', input)
    })

    // 4. Disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id)

        // Remove from Queue if waiting
        for (const type in matchmakingQueue) {
            const index = matchmakingQueue[type].indexOf(socket.id);
            if (index > -1) {
                matchmakingQueue[type].splice(index, 1);
                break;
            }
        }

        // Update Global Count
        io.emit('playerCountUpdate', io.engine.clientsCount)
    })

    // 5. Quick Match (Matchmaking)
    socket.on('findMatch', (data) => {
        const device = (data && data.device === 'mobile') ? 'mobile' : 'desktop';
        console.log(`User searching for match (${device}):`, socket.id)

        const targetQueue = matchmakingQueue[device];

        // If already in queue, ignore
        if (targetQueue.includes(socket.id)) return

        if (targetQueue.length > 0) {
            // Found an opponent!
            const opponentId = targetQueue.shift()

            // Create a room for them
            const roomId = "QUICK_" + Math.random().toString(36).substring(2, 6).toUpperCase()
            rooms[roomId] = {
                players: [opponentId, socket.id]
            }

            // Move sockets to room
            const opponentSocket = io.sockets.sockets.get(opponentId)
            if (opponentSocket) {
                opponentSocket.join(roomId)
                socket.join(roomId)

                // Notify P1 (Opponent)
                io.to(opponentId).emit('matchFound', {
                    roomId: roomId,
                    playerIndex: 0
                })

                // Notify P2 (Me)
                socket.emit('matchFound', {
                    roomId: roomId,
                    playerIndex: 1
                })

                console.log(`Match found (${device}): ${opponentId} vs ${socket.id} in ${roomId}`)
            } else {
                // Opponent disconnected while waiting? Add myself to queue instead.
                targetQueue.push(socket.id)
            }
        } else {
            // No one waiting, join queue
            targetQueue.push(socket.id)
            console.log(`Added to queue (${device}):`, socket.id)
        }
    })

    // Initial Count Check
    io.emit('playerCountUpdate', io.engine.clientsCount)
})

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
