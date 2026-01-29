const fs = require('fs');
global.window = {}; // Mock window

const rosterContent = fs.readFileSync('./js/data/roster.js', 'utf8');
eval(rosterContent); // Defines characterData

const count = Object.keys(characterData).length;
console.log(`Total Characters: ${count}`);
console.log('Names:', Object.keys(characterData).join(', '));
