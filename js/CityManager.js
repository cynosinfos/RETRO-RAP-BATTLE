class CityManager {
    constructor() {
        this.cities = {
            'WAW': {
                name: 'Warszawa',
                desc: 'Stolica polskiego rapu. Tu bije serce gry.',
                color: '#ff0055',
                tournamentConfig: { rounds: 10, reward: 10000 },
                options: [
                    { id: 'tournament', name: 'TURNIEJ', desc: 'Walcz o prestiż i pieniądze.' },
                    { id: 'shop', name: 'SKLEP', desc: 'Kup nowy ekwipunek.' },
                    { id: 'bar', name: 'BAR "PODZIEMIE"', desc: 'Odpocznij i zdobądź informacje.' },
                    { id: 'dealer', name: 'DEALER (AUT/DOM)', desc: 'Pokaż klasę na mieście.' },
                    { id: 'concert', name: 'ZAGRAJ KONCERT', desc: 'Zdobądź fanów i kasę.' },
                    { id: 'work', name: 'PRACA NA CZARNO', desc: 'Ryzykowny zarobek.' }
                ]
            },
            'GDN': {
                name: 'Gdansk',
                desc: 'Portowe klimaty, mocne bity i zapach wolnosci.',
                color: '#00ffff',
                tournamentConfig: { rounds: 10, reward: 10000 },
                options: [
                    { id: 'tournament', name: 'TURNIEJ', desc: 'Lokalne zawody.' },
                    { id: 'shop', name: 'SKLEP', desc: 'Sprzet z importu.' },
                    { id: 'bar', name: 'KLUB MEWA', desc: 'Miejsce spotkan.' },
                    { id: 'dealer', name: 'DEALER (AUT)', desc: 'Bryki z importu.' },
                    { id: 'concert', name: 'ZAGRAJ KONCERT', desc: 'Zdobądź fanów i kasę.' },
                    { id: 'work', name: 'PRACA NA CZARNO', desc: 'Ryzykowny zarobek.' }
                ]
            },
            'KRK': {
                name: 'Krakow',
                desc: 'Zabytki, piwnice i technika, ktora miazdzy.',
                color: '#ffff00',
                tournamentConfig: { rounds: 10, reward: 10000 },
                options: [
                    { id: 'tournament', name: 'TURNIEJ', desc: 'Walka na krakowskim rynku.' },
                    { id: 'shop', name: 'SKLEP', desc: 'Lokalne marki.' },
                    { id: 'bar', name: 'PIWNICA', desc: 'Gdzie rodzi sie podziemie.' },
                    { id: 'concert', name: 'ZAGRAJ KONCERT', desc: 'Zdobądź fanów i kasę.' },
                    { id: 'work', name: 'PRACA NA CZARNO', desc: 'Ryzykowny zarobek.' }
                ]
            },
            'BIA': {
                name: 'Bialystok',
                desc: 'Wschodnia sciana, gdzie rap ma swoj wlasny rytm.',
                color: '#ffaa00',
                tournamentConfig: { rounds: 5, reward: 2000 },
                options: [
                    { id: 'tournament', name: 'UTP BATTLE', desc: 'Reprezentuj Podlasie.' },
                    { id: 'shop', name: 'SKLEP', desc: 'Uliczne marki.' },
                    { id: 'bar', name: 'KLUB KRAG', desc: 'Miejsce legend.' },
                    { id: 'concert', name: 'ZAGRAJ KONCERT', desc: 'Zdobądź fanów i kasę.' },
                    { id: 'work', name: 'PRACA NA CZARNO', desc: 'Ryzykowny zarobek.' }
                ]
            },
            'SOS': {
                name: 'Sosnowiec',
                desc: 'Zaglebie rapu. Tu nie ma zartow, tu jest hip-hop.',
                color: '#ff5500',
                tournamentConfig: { rounds: 5, reward: 2000 },
                options: [
                    { id: 'tournament', name: 'TURNIEJ', desc: 'Zaglebiowska Bitwa.' },
                    { id: 'bar', name: 'KLUB REMONT', desc: 'Ciezki klimat.' },
                    { id: 'concert', name: 'ZAGRAJ KONCERT', desc: 'Zdobądź fanów i kasę.' },
                    { id: 'work', name: 'PRACA NA CZARNO', desc: 'Ryzykowny zarobek.' }
                ]
            },
            'RAD': {
                name: 'Radom',
                desc: 'Miasto z charakterem. Tu kazda ulica ma swoja historie.',
                color: '#ff0000',
                tournamentConfig: { rounds: 5, reward: 2000 },
                options: [
                    { id: 'tournament', name: 'RADOMSKA SCENA', desc: 'Zasluz na respekt.' },
                    { id: 'shop', name: 'SKLEP', desc: 'Uliczny styl.' },
                    { id: 'concert', name: 'ZAGRAJ KONCERT', desc: 'Zdobądź fanów i kasę.' },
                    { id: 'work', name: 'PRACA NA CZARNO', desc: 'Ryzykowny zarobek.' }
                ]
            },
            'WRO': {
                name: 'Wroclaw', desc: 'Miasto stu mostow. Mosty do kariery.', color: '#aa00ff',
                tournamentConfig: { rounds: 5, reward: 3000 },
                options: [{ id: 'tournament', name: 'TURNIEJ', desc: 'Bitwa nad Odra.' }, { id: 'shop', name: 'SKLEP', desc: 'Rzeczy z granicy.' }, { id: 'concert', name: 'ZAGRAJ KONCERT', desc: 'Zdobądź fanów i kasę.' }, { id: 'work', name: 'PRACA NA CZARNO', desc: 'Ryzykowny zarobek.' }]
            },
            'KAT': {
                name: 'Katowice', desc: 'Serce Slaska. Tu sie zapierdala na fejm.', color: '#000000',
                tournamentConfig: { rounds: 5, reward: 3000 },
                options: [{ id: 'tournament', name: 'SPODEK BATTLE', desc: 'Legendarna arena.' }, { id: 'bar', name: 'BAR GORNIK', desc: 'Mocne trunki.' }, { id: 'concert', name: 'ZAGRAJ KONCERT', desc: 'Zdobądź fanów i kasę.' }, { id: 'work', name: 'PRACA NA CZARNO', desc: 'Ryzykowny zarobek.' }]
            },
            'POZ': { name: 'Poznan', desc: 'Stolica Wielkopolski. Porzadek musi byc.', color: '#0000ff', options: [{ id: 'tournament', name: 'TURNIEJ', desc: 'Bitwa o Koziolki.' }, { id: 'concert', name: 'ZAGRAJ KONCERT', desc: 'Zdobądź fanów i kasę.' }, { id: 'work', name: 'PRACA NA CZARNO', desc: 'Ryzykowny zarobek.' }] },
            'LOD': { name: 'Lodz', desc: 'Wlokniarza rytm. Miasto filmu i rapu.', color: '#ff0000', options: [{ id: 'tournament', name: 'TURNIEJ', desc: 'Bitwa w Bramie.' }, { id: 'concert', name: 'ZAGRAJ KONCERT', desc: 'Zdobądź fanów i kasę.' }, { id: 'work', name: 'PRACA NA CZARNO', desc: 'Ryzykowny zarobek.' }] },
            'SZC': { name: 'Szczecin', desc: 'Paprykarz i rymy. Portowa sila.', color: '#0088ff', options: [{ id: 'tournament', name: 'TURNIEJ', desc: 'Bitwa Portowa.' }, { id: 'concert', name: 'ZAGRAJ KONCERT', desc: 'Zdobądź fanów i kasę.' }, { id: 'work', name: 'PRACA NA CZARNO', desc: 'Ryzykowny zarobek.' }] },
            'OLS': { name: 'Olsztyn', desc: 'Kraina jezior. Rap na molo.', color: '#00ff00', options: [{ id: 'tournament', name: 'TURNIEJ', desc: 'Bitwa Jezior.' }, { id: 'concert', name: 'ZAGRAJ KONCERT', desc: 'Zdobądź fanów i kasę.' }, { id: 'work', name: 'PRACA NA CZARNO', desc: 'Ryzykowny zarobek.' }] },
            'BYD': { name: 'Bydgoszcz', desc: 'Operowy styl. Klasyka gatunku.', color: '#ff0088', options: [{ id: 'tournament', name: 'TURNIEJ', desc: 'Bitwa nad Brda.' }, { id: 'concert', name: 'ZAGRAJ KONCERT', desc: 'Zdobądź fanów i kasę.' }, { id: 'work', name: 'PRACA NA CZARNO', desc: 'Ryzykowny zarobek.' }] },
            'TOR': { name: 'Torun', desc: 'Pierniki i Kopernik. Kosmiczny poziom.', color: '#ff8800', options: [{ id: 'tournament', name: 'TURNIEJ', desc: 'Bitwa Gotycka.' }, { id: 'concert', name: 'ZAGRAJ KONCERT', desc: 'Zdobądź fanów i kasę.' }, { id: 'work', name: 'PRACA NA CZARNO', desc: 'Ryzykowny zarobek.' }] },
            'OPO': { name: 'Opole', desc: 'Stolica Polskiej Piosenki. I rapu tez.', color: '#ffff00', options: [{ id: 'tournament', name: 'TURNIEJ', desc: 'Debiuty.' }, { id: 'concert', name: 'ZAGRAJ KONCERT', desc: 'Zdobądź fanów i kasę.' }, { id: 'work', name: 'PRACA NA CZARNO', desc: 'Ryzykowny zarobek.' }] },
            'CZE': { name: 'Czestochowa', desc: 'Swiete Miasto. Modl sie o wygrana.', color: '#ffffff', options: [{ id: 'tournament', name: 'TURNIEJ', desc: 'Bitwa pod Jasna Gora.' }, { id: 'concert', name: 'ZAGRAJ KONCERT', desc: 'Zdobądź fanów i kasę.' }, { id: 'work', name: 'PRACA NA CZARNO', desc: 'Ryzykowny zarobek.' }] },
            'KIE': { name: 'Kielce', desc: 'Scyzoryki. Ostry rap.', color: '#ff0000', options: [{ id: 'tournament', name: 'TURNIEJ', desc: 'Bitwa Scyzoryka.' }, { id: 'concert', name: 'ZAGRAJ KONCERT', desc: 'Zdobądź fanów i kasę.' }, { id: 'work', name: 'PRACA NA CZARNO', desc: 'Ryzykowny zarobek.' }] },
            'GLI': { name: 'Gliwice', desc: 'Radiostacja nadaje. Slaska sila.', color: '#000000', options: [{ id: 'tournament', name: 'TURNIEJ', desc: 'Bitwa Radiowa.' }, { id: 'concert', name: 'ZAGRAJ KONCERT', desc: 'Zdobądź fanów i kasę.' }, { id: 'work', name: 'PRACA NA CZARNO', desc: 'Ryzykowny zarobek.' }] },
            'LUB': { name: 'Lublin', desc: 'Wschodnia brama. Inspiracje ze wschodu.', color: '#00ff00', options: [{ id: 'tournament', name: 'TURNIEJ', desc: 'Bitwa na Zamku.' }, { id: 'concert', name: 'ZAGRAJ KONCERT', desc: 'Zdobądź fanów i kasę.' }, { id: 'work', name: 'PRACA NA CZARNO', desc: 'Ryzykowny zarobek.' }] },
            'RZE': { name: 'Rzeszow', desc: 'Innowacja. Nowoczesny rap.', color: '#0088ff', options: [{ id: 'tournament', name: 'TURNIEJ', desc: 'Bitwa Innowacji.' }, { id: 'concert', name: 'ZAGRAJ KONCERT', desc: 'Zdobądź fanów i kasę.' }, { id: 'work', name: 'PRACA NA CZARNO', desc: 'Ryzykowny zarobek.' }] }
        };
    }

    getCity(code) {
        return this.cities[code] || {
            name: code,
            desc: 'Miasto w budowie. Tu wkrótce będzie się działo.',
            color: '#888',
            options: [
                { id: 'tournament', name: 'TURNIEJ (BETA)', desc: 'Sprawdź swoje siły.' }
            ]
        };
    }

    isUnlocked(cityCode) {
        // PER USER REQUEST Phase 3: All cities are now unlocked by default
        return true;
    }
}

window.cityManager = new CityManager();
