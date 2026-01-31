const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');

const app = express();
app.use(cors());

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
        rooms[roomId] = { p1: socket.id, p2: null };
        socket.join(roomId);
        socket.emit('roomCreated', roomId);
        console.log(`Room ${roomId} created by ${socket.id}`);
    });

    // 2. JOIN PRIVATE ROOM
    socket.on('joinRoom', (roomId) => {
        if (rooms[roomId] && !rooms[roomId].p2) {
            rooms[roomId].p2 = socket.id;
            socket.join(roomId);

            // Notify everyone that someone joined (for chat/logs)
            io.to(roomId).emit('playerJoined', { roomId, playerId: socket.id });

            // Send Game Ready INDIVIDUALLY with correct roles
            const hostSocket = io.sockets.sockets.get(rooms[roomId].p1);
            const guestSocket = socket;

            if (hostSocket) hostSocket.emit('gameReady', { playerIndex: 0 });
            if (guestSocket) guestSocket.emit('gameReady', { playerIndex: 1 });

            console.log(`Player ${socket.id} joined room ${roomId}`);
        } else {
            socket.emit('error', 'Room full or does not exist');
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
                rooms[roomId] = { p1: p1Val, p2: p2Val };

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
    console.log(`Server running on port ${PORT}`);
});
