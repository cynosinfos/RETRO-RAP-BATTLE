
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const cardsPath = 'c:\\Users\\Dziubasek\\.gemini\\antigravity\\scratch\\RRBT\\js\\data\\cards.js';
let content = fs.readFileSync(cardsPath, 'utf8');

// Replace const with var to ensure it sticks to context
content = content.replace(/const /g, 'var ');

const context = {};
vm.createContext(context);
try {
    vm.runInContext(content, context);
} catch (e) {
    console.error("Error evaluating cards.js:", e.message);
}

const PRODUCERS_LIST = context.PRODUCERS_LIST || [];
const JOURNALISTS_LIST = context.JOURNALISTS_LIST || [];
const RAPPERS_LIST = context.RAPPERS_LIST || [];

function checkList(list, type) {
    console.log(`\n${type} (${list.length} total):`);
    let missingCount = 0;
    list.forEach(item => {
        const social = item.social || {};
        const missing = [];

        // Check for missing or empty fields
        if (!social.spotify || social.spotify === '' || social.spotify.includes('artist.sptfy.com/OzNf')) missing.push('spotify');
        if (!social.instagram || social.instagram === '') missing.push('instagram');
        if (!social.youtube || social.youtube === '') missing.push('youtube');

        if (missing.length > 0) {
            console.log(`- ${item.name} (${item.id}): Missing [${missing.join(', ')}]`);
            missingCount++;
        }
    });
    if (missingCount === 0) console.log("  All good! (But verify visually)");
}

console.log('--- ACCURATE MISSING LINKS REPORT ---');
checkList(PRODUCERS_LIST, 'PRODUCERS');
checkList(JOURNALISTS_LIST, 'JOURNALISTS');
checkList(RAPPERS_LIST, 'RAPPERS');
console.log('\n--- END REPORT ---');
