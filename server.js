require('dotenv').config({ path: './server/.env' });
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies
app.use(express.static(__dirname)); // Serve current directory as static


// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// API Routes
const authRoutes = require('./server/routes/auth');
const profileRoutes = require('./server/routes/profile');

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString()
    });
});

// Socket.io setup (multiplayer functionality)
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

let rooms = {};
let matchmakingQueue = {
    desktop: [],
    mobile: []
};

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Broadcast player count to all clients
    io.emit('playerCountUpdate', io.engine.clientsCount);

    // 1. CREATE PRIVATE ROOM
    socket.on('createRoom', () => {
        const roomId = generateRoomId();
        // Support up to 4 players for 2v2
        rooms[roomId] = { players: [socket.id, null, null, null] };
        socket.join(roomId);
        socket.emit('roomCreated', roomId);
        socket.emit('playerJoined', { roomId, playerId: socket.id, playerIndex: 0 });
        console.log(`Room ${roomId} created by ${socket.id}`);
    });

    // 2. JOIN PRIVATE ROOM
    socket.on('joinRoom', (roomId) => {
        const room = rooms[roomId];
        if (room) {
            // Find first empty slot
            const emptyIndex = room.players.findIndex(p => p === null);

            if (emptyIndex !== -1) {
                room.players[emptyIndex] = socket.id;
                socket.join(roomId);

                // Notify new player of their index
                socket.emit('gameReady', { playerIndex: emptyIndex });

                // Notify everyone in room about the new joiner
                io.to(roomId).emit('playerJoined', { roomId, playerId: socket.id, playerIndex: emptyIndex });

                // FIX: If 2nd player joined, notify others (Host) that we can start
                if (emptyIndex === 1) {
                    socket.to(roomId).emit('gameReady');
                }

                // ALSO: Send current room state to the new joiner so they know who is already there
                const existingPlayers = room.players.map((pid, idx) => ({ idx, pid })).filter(p => p.pid !== null && p.pid !== socket.id);
                existingPlayers.forEach(p => {
                    socket.emit('playerJoined', { roomId, playerId: p.pid, playerIndex: p.idx });
                });

                console.log(`Player ${socket.id} joined room ${roomId} at index ${emptyIndex}`);
            } else {
                socket.emit('error', 'Room full');
            }
        } else {
            socket.emit('error', 'Room does not exist');
        }
    });

    // 3. RANDOM MATCHMAKING (FIND MATCH)
    socket.on('findMatch', (data) => {
        const device = (data && data.device === 'mobile') ? 'mobile' : 'desktop';
        console.log(`Player ${socket.id} looking for match (${device})...`);

        const targetQueue = matchmakingQueue[device];

        // Remove from queue if already there to avoid duplicates
        if (targetQueue.includes(socket.id)) return;

        // Add to queue
        targetQueue.push(socket.id);

        // Check if we can match
        if (targetQueue.length >= 2) {
            const p1Val = targetQueue.shift(); // Get first waiting
            const p2Val = targetQueue.shift(); // Get second waiting

            // Verify if sockets still connected
            const s1 = io.sockets.sockets.get(p1Val);
            const s2 = io.sockets.sockets.get(p2Val);

            if (s1 && s2) {
                const roomId = `match_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
                // Quick match is still 1v1 for now, but using the same structure
                rooms[roomId] = { players: [p1Val, p2Val, null, null] };

                s1.join(roomId);
                s2.join(roomId);

                // Notify P1 (Host)
                s1.emit('matchFound', { roomId, playerIndex: 0 });
                // Notify P2 (Guest)
                s2.emit('matchFound', { roomId, playerIndex: 1 });

                console.log(`Match found (${device}): ${p1Val} vs ${p2Val} in ${roomId}`);
            } else {
                // Return valid socket to queue if one disconnected
                if (s1) targetQueue.unshift(p1Val);
                if (s2) targetQueue.unshift(p2Val);
            }
        }
    });

    // 4. RELAY INPUTS
    socket.on('playerInput', (data) => {
        // Broadcast to everyone in room EXCEPT sender
        socket.to(data.roomId).emit('enemyInput', data.input);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);

        // Remove from matchmaking queue (Iterate both)
        for (const key in matchmakingQueue) {
            matchmakingQueue[key] = matchmakingQueue[key].filter(id => id !== socket.id);
        }

        // Update player count
        io.emit('playerCountUpdate', io.engine.clientsCount);
    });
});

function generateRoomId() {
    return Math.random().toString(36).substring(2, 6).toUpperCase();
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 API: http://localhost:${PORT}/api/health`);
});
