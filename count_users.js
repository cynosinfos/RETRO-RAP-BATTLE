require('dotenv').config({ path: './server/.env' });
const mongoose = require('mongoose');
const User = require('./server/models/User');

async function countUsers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const count = await User.countDocuments();
        console.log(`TOTAL_USERS: ${count}`);
        await mongoose.connection.close();
    } catch (err) {
        console.error('Error counting users:', err);
    }
}

countUsers();
