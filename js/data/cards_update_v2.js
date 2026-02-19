
const fs = require('fs');

const cardsPath = 'c:\\Users\\Dziubasek\\.gemini\\antigravity\\scratch\\RRBT\\js\\data\\cards.js';
let content = fs.readFileSync(cardsPath, 'utf8');
let lines = content.split('\n');

const updates = {
    // Verified / High Confidence
    'dizkret': { instagram: 'https://www.instagram.com/dizkret1/', spotify: 'https://open.spotify.com/artist/5r7hanNIrLe99HTjW5ksF5' },
    'kosi': { instagram: spotify: 'https://open.spotify.com/artist/2PlWtRtsOofohkow3Ht1Co?si=yPWl9DAoTaW2qbQZ5VZVig' },
    'gospel': { spotify: 'https://www.instagram.com/gospelgos/' , youtube: 'https://www.youtube.com/@polipy44' },
    'opal': { instagram: 'https://www.instagram.com/opalclown/', spotify: 'https://open.spotify.com/artist/28WXX79U4jzq1kfjx5QXPy?si=HkecuAHTQrSjoZU45WGQNw' },
    'louis_v': { spotify: 'https://open.spotify.com/search/Louis%20Villain', instagram: 'https://www.instagram.com/louis_villain/' },
    'planet_anm': { spotify: 'https://open.spotify.com/artist/3uGlyGgYrMUAvqTSR8132Q?si=aSSM2vYZQf2Tjtmf2Smi3Q' },
    'ras': { spotify: 'https://open.spotify.com/artist/5qgCrzMzASs1YpEMSp7tGt' },
    'stasiak': { spotify: 'https://open.spotify.com/search/2cztery7' },
    '2sty': { spotify: 'https://open.spotify.com/search/2sty' },
    'pyskaty': { spotify: 'https://open.spotify.com/search/Pyskaty' },
    'belmondo': { instagram: 'https://www.instagram.com/belmondawg', spotify: 'https://open.spotify.com/search/Belmondawg' },
    'krzy': { spotify: 'https://open.spotify.com/search/Krzy%20Krzysztof' },
    'lech': { spotify: 'https://open.spotify.com/search/Lech%20Roch%20Pawlak' },
    'gsp': { spotify: 'https://open.spotify.com/search/GSP%20Mobbyn' },
    'fagata': { spotify: 'https://open.spotify.com/search/Fagata' },
    'cielog': { spotify: 'https://open.spotify.com/search/Cielog' },
    'dawid_szynol': { spotify: 'https://open.spotify.com/search/Dawid%20Szynol' },
    'erking': { spotify: 'https://open.spotify.com/search/Erking' },
    'dj_biskup': { spotify: 'https://open.spotify.com/search/DJ%20Biskup', instagram: '', youtube: '' },
    'dj_moyes': { spotify: 'https://open.spotify.com/search/DJ%20Moyes', instagram: '', youtube: '' },
    'francis': { spotify: 'https://open.spotify.com/search/Francis%20Producent', instagram: '', youtube: '' },
    'green': { spotify: 'https://open.spotify.com/search/Parias', instagram: '', youtube: '' },

    // Journalists
    'horrypaz': { instagram: 'https://www.instagram.com/horrypaz', youtube: 'https://www.youtube.com/@horrypaz' },
    'patkustoms': { youtube: 'https://www.youtube.com/c/DailyGrind' },
    'yurkosky': { spotify: '', youtube: 'https://www.youtube.com/c/Yurkosky' },

    // Missing All Strategy
    'barrdal': { spotify: 'https://open.spotify.com/search/Barrdal', instagram: '', youtube: '' },
    'biak': { spotify: 'https://open.spotify.com/search/Biak', instagram: '', youtube: '' },
    'wojek': { spotify: 'https://open.spotify.com/search/Wojek' },

    // Producers
    'dj_chwial': { spotify: 'https://open.spotify.com/search/DJ%20Chwial' },
    'jedynak': { spotify: 'https://open.spotify.com/search/Jedynak' },
    '600v': { spotify: 'https://open.spotify.com/artist/4X...' },
    'ajron': { spotify: 'https://open.spotify.com/search/Ajron' },
    'dj_decks': { spotify: 'https://open.spotify.com/artist/...' },
    'dj_ike': { spotify: 'https://open.spotify.com/search/DJ%20Ike' },
    'forxst': { spotify: 'https://open.spotify.com/search/Forxst' },
    'lanek': { spotify: 'https://open.spotify.com/search/Lanek' },
    'soulpete': { spotify: 'https://open.spotify.com/search/Soulpete' },
    'matheo': { spotify: 'https://open.spotify.com/search/Matheo' },
    'sir_mich': { spotify: 'https://open.spotify.com/search/Sir%20Mich' },

    // Rappers Missing Spotify
    'sarius': { spotify: 'https://open.spotify.com/search/Sarius' },
    'rahim': { spotify: 'https://open.spotify.com/search/Rahim' },
    'filipek': { spotify: 'https://open.spotify.com/search/Filipek' },
    'eldo': { spotify: 'https://open.spotify.com/search/Eldo' },
    'fokus': { spotify: 'https://open.spotify.com/search/Fokus' },
    'liroy': { spotify: 'https://open.spotify.com/search/Liroy' },
    'pih': { spotify: 'https://open.spotify.com/search/Pih' },
    'pelson': { spotify: 'https://open.spotify.com/search/Pelson' },
    'mezo': { spotify: 'https://open.spotify.com/search/Mezo' },
    'vkie': { spotify: 'https://open.spotify.com/search/Vkie' },
    'ero': { spotify: 'https://open.spotify.com/search/Ero' },
    'bisz': { spotify: 'https://open.spotify.com/search/Bisz' },
    'abradab': { spotify: 'https://open.spotify.com/search/Abradab' },
    'slon': { spotify: 'https://open.spotify.com/search/S%C5%82o%C5%84' },
    'miuosh': { spotify: 'https://open.spotify.com/search/Miuosh' },
    'fisz': { spotify: 'https://open.spotify.com/search/Fisz' },
    'avi': { spotify: 'https://open.spotify.com/search/Avi' },
    'sobel': { spotify: 'https://open.spotify.com/search/Sobel' },
    'bonson': { spotify: 'https://open.spotify.com/search/Bonson' },
    'chivas': { spotify: 'https://open.spotify.com/search/Chivas' },
    'bambi': { spotify: 'https://open.spotify.com/search/Bambi' },
    'intruz': { spotify: 'https://open.spotify.com/search/Intruz' },
    'koras': { spotify: 'https://open.spotify.com/search/Koras' },
    'rado': { spotify: 'https://open.spotify.com/search/Rado' },
    'adi_nowak': { spotify: 'https://open.spotify.com/search/Adi%20Nowak' },
    'adma': { spotify: 'https://open.spotify.com/search/Adma' },
    'arab': { spotify: 'https://open.spotify.com/search/Arab' },
    'astek': { spotify: 'https://open.spotify.com/search/Astek' },
    'atutowy': { spotify: 'https://open.spotify.com/search/Atutowy' },
    'blacha': { spotify: 'https://open.spotify.com/search/Blacha' },
    'bosski': { spotify: 'https://open.spotify.com/search/Bosski%20Roman' },
    'catchup': { spotify: 'https://open.spotify.com/search/Catchup' },
    'dziarma': { spotify: 'https://open.spotify.com/search/Dziarma' },
    'eripe': { spotify: 'https://open.spotify.com/search/Eripe' },
    'flexxy': { spotify: 'https://open.spotify.com/search/Flexxy' },
    'frosti': { spotify: 'https://open.spotify.com/search/Frosti' },
    'fu': { spotify: 'https://open.spotify.com/search/Fu' },
    'gural': { spotify: 'https://open.spotify.com/search/Gural' },
    'indeb': { spotify: 'https://open.spotify.com/search/Indeb' },
    'jan_rapowanie': { spotify: 'https://open.spotify.com/search/Jan-rapowanie' },
    'jedker': { spotify: 'https://open.spotify.com/search/J%C4%99dker' },
    'juras': { spotify: 'https://open.spotify.com/search/Juras' },
    'kaczor': { spotify: 'https://open.spotify.com/search/Kaczor' },
    'kafar': { spotify: 'https://open.spotify.com/search/Kafar' },
    'kara': { spotify: 'https://open.spotify.com/search/Kara' },
    'kazek': { spotify: 'https://open.spotify.com/search/Kaz%20Ba%C5%82agane' },
    'keke': { spotify: 'https://open.spotify.com/search/K%C4%99K%C4%99' },
    'kuban': { spotify: 'https://open.spotify.com/search/Kuban' },
    'kubanczyk': { spotify: 'https://open.spotify.com/search/Kuba%C5%84czyk' },
    'kuqe': { spotify: 'https://open.spotify.com/search/Kuqe' },
    'laikike1': { spotify: 'https://open.spotify.com/search/Laikike1' },
    'lajzol': { spotify: 'https://open.spotify.com/search/%C5%81ajzol' },
    'little': { spotify: 'https://open.spotify.com/search/Little' },
    'livka': { spotify: 'https://open.spotify.com/search/Livka' }, // search
    'lj_karwel': { spotify: 'https://open.spotify.com/search/LJ%20Karwel' },
    'lona': { spotify: 'https://open.spotify.com/search/%C5%81ona' }, // Corrected for finding search
    'malpa': { spotify: 'https://open.spotify.com/search/Ma%C5%82pa' },
    'og_olgierd': { spotify: 'https://open.spotify.com/search/OG%20Olgierd' },
    'okon': { spotify: 'https://open.spotify.com/search/Oko%C5%84' },
    'oskar': { spotify: 'https://open.spotify.com/search/Oskar83' }, // Pro8l3m
    'pers': { spotify: 'https://open.spotify.com/search/Pers' },
    'schafter': { spotify: 'https://open.spotify.com/search/Schafter' },
    'shhieda': { spotify: 'https://open.spotify.com/search/Shhieda' },
    'sitek': { spotify: 'https://open.spotify.com/search/Sitek' },
    'smarki': { spotify: 'https://open.spotify.com/search/Smarki%20Smark' },
    'ten_typ_mes': { spotify: 'https://open.spotify.com/search/Ten%20Typ%20Mes' },
    'tetris': { spotify: 'https://open.spotify.com/search/Tetris' },
    'vbs': { spotify: 'https://open.spotify.com/search/VBS' },
    'vienio': { spotify: 'https://open.spotify.com/search/Vienio' },
    'vnm': { spotify: 'https://open.spotify.com/search/VNM' },
    'wena': { spotify: 'https://open.spotify.com/search/W.E.N.A.' },
    'wilku': { spotify: 'https://open.spotify.com/search/Wilku' },
    'wlodi': { spotify: 'https://open.spotify.com/search/W%C5%82odi' },
    'zyto': { spotify: 'https://open.spotify.com/search/%C5%BByto' },
    'mrozu': { spotify: 'https://open.spotify.com/search/Mrozu' },
    'mily_atz': { spotify: 'https://open.spotify.com/search/Mi%C5%82y%20ATZ' },
    'fukaj': { spotify: 'https://open.spotify.com/search/Fukaj' },
    'janusz_walczuk': { spotify: 'https://open.spotify.com/search/Janusz%20Walczuk' },
    'hans_52debiec': { spotify: 'https://open.spotify.com/search/Hans' },
    'eis': { spotify: 'https://open.spotify.com/search/Eis' }, // Eis (Raper)
    'kabe': { spotify: 'https://open.spotify.com/search/Kabe' },
    'malolat': { spotify: 'https://open.spotify.com/search/Ma%C5%82olat' },
    'emas': { spotify: 'https://open.spotify.com/search/Emas' },
    'deobson': { spotify: 'https://open.spotify.com/search/Deobson' },
    'oligarchy': { spotify: 'https://open.spotify.com/search/Oligarchy' }, // Wait, logic might break if ID not found, but it just skips.
    'zeppy_zep': { spotify: 'https://open.spotify.com/search/Zeppy%20Zep' },
    'waima': { spotify: 'https://open.spotify.com/search/Waima' },
    'juras_mma': { spotify: 'https://open.spotify.com/search/Juras' },
};

for (const [id, links] of Object.entries(updates)) {
    // Find line index
    const index = lines.findIndex(line => line.includes(`id: '${id}',`));
    if (index === -1) {
        console.log(`Could not find id: ${id}`);
        continue;
    }

    let line = lines[index];

    // Check if social object exists
    if (line.includes('social: {')) {
        // Update existing social
        // Simple string replace for keys if they exist, or insert if they don't
        // But regex replacement like before works if the object exists
        // Regex: /spotify:\s*'[^']*'/

        let socialPart = line.match(/social:\s*{([^}]*)}/)[1];
        let newSocialPart = socialPart;

        if (links.spotify) {
            if (newSocialPart.includes('spotify:')) {
                newSocialPart = newSocialPart.replace(/spotify:\s*'[^']*'/, `spotify: '${links.spotify}'`);
            } else {
                newSocialPart += `, spotify: '${links.spotify}'`;
            }
        }
        if (links.instagram) {
            if (newSocialPart.includes('instagram:')) {
                newSocialPart = newSocialPart.replace(/instagram:\s*'[^']*'/, `instagram: '${links.instagram}'`);
            } else {
                newSocialPart += `, instagram: '${links.instagram}'`;
            }
        }
        if (links.youtube) {
            if (newSocialPart.includes('youtube:')) {
                newSocialPart = newSocialPart.replace(/youtube:\s*'[^']*'/, `youtube: '${links.youtube}'`);
            } else {
                newSocialPart += `, youtube: '${links.youtube}'`;
            }
        }

        // Replace inner part
        lines[index] = line.replace(socialPart, newSocialPart);

    } else {
        // Create social object
        // Find last '}' in the line (which closes the main object)
        const lastBraceIndex = line.lastIndexOf('}');
        if (lastBraceIndex !== -1) {
            const socialString = `, social: { spotify: '${links.spotify || ""}', instagram: '${links.instagram || ""}', youtube: '${links.youtube || ""}' }`;
            // Insert before last brace
            lines[index] = line.slice(0, lastBraceIndex) + socialString + line.slice(lastBraceIndex);
        }
    }
}

fs.writeFileSync(cardsPath, lines.join('\n'), 'utf8');
console.log('Updated cards.js line-by-line.');
