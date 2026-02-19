
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const cardsPath = 'c:\\Users\\Dziubasek\\.gemini\\antigravity\\scratch\\RRBT\\js\\data\\cards.js';
const content = fs.readFileSync(cardsPath, 'utf8');

const sandbox = {
    module: {},
    console: console,
    require: require
};

const code = content + '\nmodule.exports = { PRODUCERS_LIST, JOURNALISTS_LIST, RAPPERS_LIST };';

try {
    const script = new vm.Script(code);
    const context = vm.createContext(sandbox);
    script.runInContext(context);

    const { PRODUCERS_LIST, JOURNALISTS_LIST, RAPPERS_LIST } = sandbox.module.exports;

    const allChars = [...PRODUCERS_LIST, ...JOURNALISTS_LIST, ...RAPPERS_LIST];

    console.log('# Raport Linków Social Media\n');
    console.log(`Łącznie Postaci: ${allChars.length}\n`);

    console.log('## PRODUCENCI');
    PRODUCERS_LIST.forEach(char => printChar(char));

    console.log('\n## DZIENNIKARZE');
    JOURNALISTS_LIST.forEach(char => printChar(char));

    console.log('\n## RAPERZY');
    RAPPERS_LIST.forEach(char => printChar(char));

} catch (e) {
    console.error("Błąd parsowania cards.js:", e);
}

function printChar(char) {
    const social = char.social || {};
    const links = [];
    if (social.spotify) links.push(`[Spotify](${social.spotify})`);
    if (social.instagram) links.push(`[Instagram](${social.instagram})`);
    if (social.youtube) links.push(`[YouTube](${social.youtube})`);
    if (social.twitch) links.push(`[Twitch](${social.twitch})`);
    if (social.kick) links.push(`[Kick](${social.kick})`);

    if (links.length > 0) {
        console.log(`- **${char.name}** (${char.id}): ${links.join(', ')}`);
    } else {
        console.log(`- **${char.name}** (${char.id}): BRAK LINKÓW`);
    }
}
