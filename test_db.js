require('dotenv').config({ path: './server/.env' });
const mongoose = require('mongoose');

console.log("Testing MongoDB Connection...");
console.log("URI:", process.env.MONGODB_URI ? "Found (hidden)" : "MISSING");

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('✅ Connection SUCCESSFUL!');
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Connection FAILED:', err.message);
        console.error('Full Error:', err);
        process.exit(1);
    });
