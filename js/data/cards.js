// COMPLETE CARD DATABASE - REFACTORED FOR EQUALITY V2
// Every rapper has 5 tiers: 4 obtainables + 1 craftable (GOAT)

const CARD_TIERS = {
    UNDERGROUND: { name: 'UNDERGROUND', color: '#888888', gradient: ['#666666', '#999999'], glow: '#555555', dropRate: 0.60, statMult: 1.0 },
    MAINSTREAM: { name: 'MAINSTREAM', color: '#00ff00', gradient: ['#00cc00', '#00ff66'], glow: '#00ff00', dropRate: 0.25, statMult: 1.2 },
    STAR: { name: 'STAR', color: '#9933ff', gradient: ['#7700ff', '#bb55ff'], glow: '#9933ff', dropRate: 0.10, statMult: 1.5 },
    ICON: { name: 'ICON', color: '#ffaa00', gradient: ['#ff8800', '#ffcc00'], glow: '#ffaa00', dropRate: 0.04, statMult: 2.0 },
    GOAT: { name: 'G.O.A.T.', color: '#ff00ff', gradient: ['#ff0099', '#9900ff', '#00ffff', '#ffff00'], glow: '#ff00ff', dropRate: 0.00, isCraftable: true, statMult: 3.0 } // 0% drop rate, craft only
};

const CARD_TYPES = {
    RAPPER: 'RAPER',
    ALBUM: 'PŁYTA',
    GROUP: 'SKŁAD',
    JOURNALIST: 'DZIENNIKARZ',
    PRODUCER: 'PROD.DJ.MIX'
};

// Producers & DJs List
const PRODUCERS_LIST = [
    { id: 'kubi', name: 'Kubi Producent', img: 'kubi_producent', social: { spotify: 'https://open.spotify.com/artist/2Id9v8R7pS6ZfH08n5I8Hh', instagram: 'https://www.instagram.com/kubiproducent/', youtube: 'https://www.youtube.com/@Kubi_Producent' } },
    { id: 'steez', name: 'Steez', img: 'steez', social: { spotify: 'https://open.spotify.com/artist/3Sg3RkI0O4Cg2P1D1Gj0E8', instagram: 'https://www.instagram.com/steez83/', youtube: 'https://www.youtube.com/@Steez83' } },
    { id: 'dj_chwial', name: 'DJ Chwial', img: 'dj_chwial', social: { instagram: 'https://www.instagram.com/dj_chwial/', spotify: 'https://open.spotify.com/search/DJ%20Chwial' } },
    { id: 'jedynak', name: 'Jedynak', img: 'jedynak', social: { instagram: 'https://www.instagram.com/jedynak_flirtini/', spotify: 'https://open.spotify.com/search/Jedynak' } },
    { id: '600v', name: '600V', img: '600v', social: { youtube: 'https://www.youtube.com/@V6MUSIC', spotify: 'https://open.spotify.com/artist/4X...' } },
    { id: 'ajron', name: 'Ajron', img: 'ajron', social: { youtube: 'https://www.youtube.com/@ajron8423', spotify: 'https://open.spotify.com/search/Ajron' } },
    { id: 'dj_biskup', name: 'DJ Biskup', img: 'dj_biskup', social: { spotify: 'https://open.spotify.com/search/DJ%20Biskup', instagram: '', youtube: '' } },
    { id: 'dj_decks', name: 'DJ Decks', img: 'dj_decks', social: { instagram: 'https://www.instagram.com/djdecks/', spotify: 'https://open.spotify.com/artist/...' } },
    { id: 'dj_eprom', name: 'DJ Eprom', img: 'dj_eprom', social: { instagram: 'https://www.instagram.com/eprombeats/', youtube: 'https://www.youtube.com/@eprombeats' } },
    { id: 'dj_ike', name: 'DJ Ike', img: 'dj_ike', social: { youtube: 'https://www.youtube.com/@DenshaqProductions', spotify: 'https://open.spotify.com/search/DJ%20Ike' } },
    { id: 'dj_moyes', name: 'DJ Moyes', img: 'dj_moyes', social: { spotify: 'https://open.spotify.com/search/DJ%20Moyes', instagram: '', youtube: '' } },
    { id: 'dj_taek', name: 'DJ Taek', img: 'dj_taek', social: { spotify: 'https://open.spotify.com/search/DJ%20Moyes', instagram: 'https://www.instagram.com/dj.taek/', youtube: '' } },
    { id: 'enzu', name: 'Enzu', img: 'enzu', social: { spotify: 'https://open.spotify.com/artist/enzu', instagram: '', youtube: 'https://www.youtube.com/@ENZUmusic' } },
    { id: 'favst', name: 'Favst', img: 'favst', social: { spotify: 'https://open.spotify.com/artist/1e...' } },
    { id: 'forxst', name: 'Forxst', img: 'forxst', social: { instagram: 'https://www.instagram.com/forxst/', spotify: 'https://open.spotify.com/search/Forxst' } },
    { id: 'francis', name: 'Francis', img: 'francis', social: { spotify: 'https://open.spotify.com/search/Francis%20Producent', instagram: '', youtube: '' } },
    { id: 'jonatan', name: 'Jonatan', img: 'jonatan', social: { spotify: 'https://open.spotify.com/search/Francis%20Producent', instagram: 'https://www.instagram.com/jonatan.music/', youtube: 'https://www.youtube.com/@JonatanChmielewski' } },
    { id: 'lanek', name: 'Lanek', img: 'lanek', social: { instagram: 'https://www.instagram.com/LANEK1/', spotify: 'https://open.spotify.com/search/Lanek' } },
    { id: 'magiera', name: 'Magiera', img: 'magiera', social: { spotify: 'https://Magiera.lnk.to/Spotify', instagram: 'https://www.instagram.com/magierski_71/', youtube: 'https://www.youtube.com/@magiera1881' } },
    { id: 'noon', name: 'Noon', img: 'noon', social: { instagram: 'https://www.instagram.com/noon_pentasix/', youtube: 'https://www.youtube.com/channel/NoweNagrania' } },
    { id: 'pawbeats', name: 'Pawbeats', img: 'pawbeats', social: { instagram: 'https://www.instagram.com/pawbeats/', youtube: 'https://www.youtube.com/@Pawbeats' } },
    { id: 'soulpete', name: 'Soulpete', img: 'soulpete', social: { spotify: 'https://open.spotify.com/search/Soulpete' } },
    { id: 'waco', name: 'Waco', img: 'waco', social: { spotify: 'https://spoti.fi/3zBqIoN', instagram: 'https://www.instagram.com/waco_swiezy_material/', youtube: 'https://www.youtube.com/@wacobeats' } },
    { id: 'matheo', name: 'Matheo', img: 'matheo', social: { instagram: 'https://www.instagram.com/officialmatheo', youtube: 'https://www.youtube.com/@MatheoProductions', spotify: 'https://open.spotify.com/search/Matheo' } },
    { id: 'zeppy_zep', name: 'Zeppy Zep', img: 'zeppy_zep', social: { spotify: 'https://open.spotify.com/search/Zeppy%20Zep', instagram: 'https://www.instagram.com/zeppyzep', youtube: 'https://www.youtube.com/@zeppyzep' } },

];

// Journalists List (Media personalities)
// Journalists List (Media personalities)
const JOURNALISTS_LIST = [
    { id: 'yurkosky', name: 'Yurkosky', img: 'yurkosky', social: { youtube: 'https://www.youtube.com/c/Yurkosky', instagram: 'https://www.instagram.com/yurkosky_official/' } },

    { id: 'bartek_biegun', name: 'Bartek Biegun', img: 'bartek_biegun', social: { instagram: 'https://www.instagram.com/biegun.b/', spotify: 'https://open.spotify.com/playlist/42ymvhFCUMVlxoPGFVjV8T?si=9b6d43525c9144b0' } },
    { id: 'lil_konon', name: 'Lil Konon', img: 'lil_konon', social: { instagram: 'https://www.instagram.com/lil.konon/', youtube: 'https://www.youtube.com/@LILKONOON', twitch: 'https://www.twitch.tv/lilkonoon', spotify: 'https://open.spotify.com/show/4zU...' } },
    { id: 'hype', name: 'Hype', img: 'hype', social: { youtube: 'https://www.youtube.com/@TurtleHype' } },

    { id: 'mateusz_natali', name: 'Mateusz Natali', img: 'mateusz_natali', social: { instagram: 'https://www.instagram.com/mateusznatali/', youtube: 'https://www.youtube.com/@PopkillerPL' } },
    { id: 'jacek_adamkiewicz', name: 'Jacek Adamkiewicz', img: 'jacek_adamkiewicz', social: { instagram: 'https://www.instagram.com/grubyperes/', youtube: 'https://www.youtube.com/@JacekAdamkiewicz' } },
    { id: 'muzyka_tv', name: 'Muzyka TV', img: 'muzyka_tv', social: { youtube: 'https://www.youtube.com/@muzykatv4554', instagram: 'https://www.instagram.com/muzykatv/' } },
    { id: 'flint', name: 'Flint', img: 'flint', social: { instagram: 'https://www.instagram.com/jakubflint/', youtube: 'https://www.youtube.com/user/FlintOfficial' } },
    { id: 'novacci', name: 'Novacci', img: 'novacci', social: { instagram: 'https://www.instagram.com/novacci_pablo/', youtube: 'https://www.youtube.com/@PabloNovacci' } },
    { id: 'wuwunio', name: 'Wuwunio', img: 'wuwunio', social: { instagram: 'https://www.instagram.com/wuwunio/', youtube: 'https://www.youtube.com/@wuwunio' } },
    { id: 'warga', name: 'Warga', img: 'warga', social: { instagram: 'https://www.instagram.com/programzdupy/', youtube: 'https://www.youtube.com/user/zdupy' } },
    { id: 'skopzzor', name: 'Skopzzor', img: 'skopzzor', social: { instagram: 'https://www.instagram.com/skopzzor/', kick: 'https://kick.com/skopzzor', youtube: 'https://www.youtube.com/@SkopzzoR' } },
    { id: 'patkustoms', name: 'Patkustoms', img: 'patkustoms', social: { youtube: 'https://www.youtube.com/c/DailyGrind' } },
    { id: 'matt', name: 'Matt', img: 'matt', social: { youtube: 'https://www.youtube.com/@MATT_OFICJALNIE' } },
    { id: 'horrypaz', name: 'Horrypaz', img: 'horrypaz', social: { instagram: 'https://www.instagram.com/horrypaz', youtube: 'https://www.youtube.com/@horrypaz' } }
];

// Base Rapper List (All equally capable of being GOATs)
const RAPPERS_LIST = [
    { id: 'quebonafide', name: 'Quebonafide', img: 'quebonafide', social: { spotify: 'https://open.spotify.com/artist/1fxbULcd6ryMNc1usHoP0R', instagram: 'https://www.instagram.com/quebonafide/', youtube: 'https://www.youtube.com/@QueQualityPL' } },
    { id: 'taco', name: 'Taco Hemingway', img: 'taco', social: { spotify: 'https://open.spotify.com/artist/7CJgLPEqiIRuneZSolpawQ', instagram: 'https://www.instagram.com/tacohemingway/', youtube: 'https://www.youtube.com/@TacoHemingwayOfficial' } },
    { id: 'mata', name: 'Mata', img: 'mata', social: { spotify: 'https://open.spotify.com/artist/0MIG6gMcQTSvFbKvUwK0id', instagram: 'https://www.instagram.com/33mata/', youtube: 'https://www.youtube.com/channel/UC0oDoz9O0u3cI_oG_cK9fTw' } },
    { id: 'tede', name: 'Tede', img: 'tede', social: { spotify: 'https://open.spotify.com/artist/1pMlsfXQ3I0M7U52v1m1j7', instagram: 'https://www.instagram.com/tedef/', youtube: 'https://www.youtube.com/user/tedetv' } },
    { id: 'peja', name: 'Peja', img: 'peja', social: { spotify: 'https://open.spotify.com/artist/1rpf1pVv0Z9QHaZmVFeLFi', instagram: 'https://www.instagram.com/pejaslumsattack/', youtube: 'https://www.youtube.com/user/pejaslumsattack' } },
    { id: 'bedoes', name: 'Bedoes 2115', img: 'bedoes_2115', social: { spotify: 'https://open.spotify.com/artist/0LX2VNf5w4iOHW1yyIqb74', instagram: 'https://www.instagram.com/bedoes2115/', youtube: 'https://www.youtube.com/@2115' } },
    { id: 'white', name: 'White 2115', img: 'white_2115', social: { spotify: 'https://open.spotify.com/artist/4nPxrGG7k7aEKmNLsfX4cd', instagram: 'https://www.instagram.com/2115white/', youtube: 'https://www.youtube.com/@white2115official' } },
    { id: 'paluch', name: 'Paluch', img: 'paluch', social: { spotify: 'https://open.spotify.com/artist/462yq5vpZnO172v3nK9ibv', instagram: 'https://www.instagram.com/paluchofficial/', youtube: 'https://www.youtube.com/@BORCREWOFFICIAL' } },
    { id: 'kukon', name: 'Kukon', img: 'kukon', social: { spotify: 'https://open.spotify.com/artist/3U5Oag04Yl2WnvPULOlsMD', instagram: 'https://www.instagram.com/kukonogg/', youtube: 'https://www.youtube.com/@OgrodyLabel' } },
    { id: 'ostr', name: 'O.S.T.R.', img: 'ostr', social: { spotify: 'https://open.spotify.com/artist/52XMlxvCIzmiNkzSqEw3Uv', instagram: 'https://www.instagram.com/adam.ostr.ostrowski/', youtube: 'https://www.youtube.com/@OSTR_Official' } },
    { id: 'solar', name: 'Solar', img: 'solar', social: { spotify: 'https://open.spotify.com/artist/6mQJ9D99JqT9g12vLw83Xv', instagram: 'https://www.instagram.com/solarmatize/', youtube: 'https://www.youtube.com/@SBMlabel' } },
    { id: 'popek', name: 'Popek', img: 'popek', social: { spotify: 'https://open.spotify.com/artist/4NtiLs5NpjgZDHNBEMbjKz', instagram: 'https://www.instagram.com/popek_oficjalnie/', youtube: 'https://www.youtube.com/@KrolAlbaniiTV' } },
    { id: 'kali', name: 'Kali', img: 'kali', social: { spotify: 'https://open.spotify.com/artist/3txlfIcKCNrKk5bJw1er3R', instagram: 'https://www.instagram.com/kalis7/', youtube: 'https://www.youtube.com/@KaliGanjaMafia' } },
    { id: 'szpaku', name: 'Szpaku', img: 'szpaku', social: { spotify: 'https://open.spotify.com/artist/0Wi2fADbhwXlPUWxBmzo99', instagram: 'https://www.instagram.com/szpakusimba/', youtube: 'https://www.youtube.com/@GUGULABEL' } },
    { id: 'young_multi', name: 'Young Multi', img: 'young_multi', social: { spotify: 'https://open.spotify.com/artist/1CJifOFnf7pPhqV0KaS879', instagram: 'https://www.instagram.com/youngmulti/', youtube: 'https://www.youtube.com/@YOUNGMULTI' } },
    { id: 'young_leosia', name: 'Young Leosia', img: 'young_leosia', social: { spotify: 'https://open.spotify.com/artist/0iBTVnJ1Sff92zCDujfvyJ', instagram: 'https://www.instagram.com/youngleosia/', youtube: 'https://www.youtube.com/@YoungLeosiaOfficial' } },
    { id: 'sokol', name: 'Sokół', img: 'sokol', social: { spotify: 'https://open.spotify.com/artist/5L1f6S2Z8N0S8n8f6n9f7f', instagram: 'https://www.instagram.com/wojteksokol/', youtube: 'https://www.youtube.com/@PROSTOtv' } },
    { id: 'pezet', name: 'Pezet', img: 'pezet', social: { spotify: 'https://open.spotify.com/artist/0Zp9p6UOYr7c9s7UqU5Y7w', instagram: 'https://www.instagram.com/pezetofficial/', youtube: 'https://www.youtube.com/@PezetOfficial' } },
    { id: 'kizo', name: 'Kizo', img: 'kizo', social: { spotify: 'https://open.spotify.com/artist/2IHoZ3RrDJIikMRsYgHjhy', instagram: 'https://www.instagram.com/kizo_wnik_058/', youtube: 'https://www.youtube.com/@MYTOSUKCES-OFFICIAL' } },
    { id: 'sarius', name: 'Sarius', img: 'sarius', social: { instagram: 'https://www.instagram.com/mariuszsarius/', spotify: 'https://open.spotify.com/search/Sarius' } },
    { id: 'smolasty', name: 'Smolasty', img: 'smolasty', social: { spotify: 'https://open.spotify.com/artist/5GwdnlZaSwKpHmjcAijATP', instagram: 'https://www.instagram.com/smolasty/', youtube: 'https://www.youtube.com/@Smolasty' } },
    { id: 'young_igi', name: 'Young Igi', img: 'young_igi', social: { spotify: 'https://open.spotify.com/artist/1yq2JzsqbzFbJ1B7wGOXLc', instagram: 'https://www.instagram.com/youngigiyi/', youtube: 'https://www.youtube.com/channel/YoungIgi' } },
    { id: 'rahim', name: 'Rahim', img: 'rahim', social: { instagram: 'https://www.instagram.com/rahimofficial/', spotify: 'https://open.spotify.com/search/Rahim' } },
    { id: 'gedz', name: 'Gedz', img: 'gedz', social: { spotify: 'https://open.spotify.com/artist/1MZ1TtfmzMHEYIlynXsr1a', instagram: 'https://www.instagram.com/gedz_nnjl/', youtube: 'https://www.youtube.com/Gedz' } },
    { id: 'green', name: 'Green', img: 'green', social: { spotify: 'https://open.spotify.com/search/Parias', instagram: '', youtube: '' } },
    { id: 'filipek', name: 'Filipek', img: 'filipek', social: { instagram: 'https://www.instagram.com/filipek1995/', youtube: 'https://www.youtube.com/channel/QueQualityPL', spotify: 'https://open.spotify.com/search/Filipek' } },
    { id: 'eldo', name: 'Eldo', img: 'eldo', social: { instagram: 'https://www.instagram.com/eldoeternia/', youtube: 'https://www.youtube.com/channel/Eldo', spotify: 'https://open.spotify.com/search/Eldo' } },
    { id: 'fokus', name: 'Fokus', img: 'fokus', social: { instagram: 'https://www.instagram.com/fokus_official/', spotify: 'https://open.spotify.com/search/Fokus' } },
    { id: 'guzior', name: 'Guzior', img: 'guzior', social: { spotify: 'https://open.spotify.com/artist/7uWyXPJ04ihdQdYGGw3xVV', instagram: 'https://www.instagram.com/guziormati/', youtube: 'https://www.youtube.com/@EVILTHING' } },
    { id: 'gibbs', name: 'Gibbs', img: 'gibbs', social: { spotify: 'https://open.spotify.com/artist/4X3X4uYp6ErtY3pP5H7r7N', instagram: 'https://www.instagram.com/gibbs95p/', youtube: 'https://www.youtube.com/@DopeHouseLabel' } },
    { id: 'zabson', name: 'Żabson', img: 'zabson', social: { spotify: 'https://open.spotify.com/artist/0QR764k0D36npmTMWx5bft', instagram: 'https://www.instagram.com/zabsonziomal/', youtube: 'https://www.youtube.com/@INTERNAZIOMALE' } },
    { id: 'bonus_rpk', name: 'Bonus RPK', img: 'bonus_rpk', social: { spotify: 'https://open.spotify.com/artist/2Id9v8R7pS6ZfH08n5I8Hh', instagram: 'https://www.instagram.com/bonusrpk_oficjalnie/', youtube: 'https://www.youtube.com/@CiemnaStrefa' } },
    { id: 'bialas', name: 'Białas', img: 'bialas', social: { spotify: 'https://open.spotify.com/artist/2Id9v8R7pS6ZfH08n5I8Hh', instagram: 'https://www.instagram.com/bialas_h8me/', youtube: 'https://www.youtube.com/@SBMlabel' } },
    { id: 'sentino', name: 'Sentino', img: 'sentino', social: { spotify: 'https://open.spotify.com/artist/1Kjs5u8GQf6zCFdTj6SI9E', instagram: 'https://www.instagram.com/sentinobln/', youtube: 'https://www.youtube.com/@SentinoOfficial' } },
    { id: 'malik', name: 'Malik', img: 'malik', social: { spotify: 'https://open.spotify.com/artist/1Kjs5u8GQf6zCFdTj6SI9E', instagram: 'https://www.instagram.com/donmalikmontana/', youtube: 'https://www.youtube.com/@MalikMontanaOfficial' } },
    { id: 'borixon', name: 'Borixon', img: 'borixon', social: { spotify: 'https://open.spotify.com/artist/3Sg3RkI0O4Cg2P1D1Gj0E8', instagram: 'https://www.instagram.com/borixon_newbadline/', youtube: 'https://www.youtube.com/@spacerlabel' } },
    { id: 'liroy', name: 'Liroy', img: 'liroy', social: { instagram: 'https://www.instagram.com/liroy_marzec/', youtube: 'https://www.youtube.com/@liroyPolska', spotify: 'https://open.spotify.com/search/Liroy' } },
    { id: 'pih', name: 'Pih', img: 'pih', social: { instagram: 'https://www.instagram.com/pihszou/', spotify: 'https://open.spotify.com/search/Pih' } },
    { id: 'pelson', name: 'Pelson', img: 'pelson', social: { instagram: 'https://www.instagram.com/pelson_official/', spotify: 'https://open.spotify.com/search/Pelson' } },
    { id: 'mezo', name: 'MEZO', img: 'mezo', social: { instagram: 'https://www.instagram.com/jacek_mezo_mejer/', youtube: 'https://www.youtube.com/user/mezokracjapl', spotify: 'https://open.spotify.com/search/Mezo' } },
    { id: 'vkie', name: 'VKI', img: 'vkie', social: { instagram: 'https://www.instagram.com/bigvkie/', youtube: 'https://www.youtube.com/@TheBiggestVkie', spotify: 'https://open.spotify.com/search/Vkie' } },
    { id: 'ero', name: 'Ero', img: 'ero', social: { instagram: 'https://www.instagram.com/erosick1/', youtube: 'https://www.youtube.com/@Ero_JWP', spotify: 'https://open.spotify.com/search/Ero' } },
    { id: 'bisz', name: 'Bisz', img: 'bisz', social: { instagram: 'https://www.instagram.com/bisz_official/', youtube: 'https://www.youtube.com/user/pchamytensyfpl', spotify: 'https://open.spotify.com/search/Bisz' } },
    { id: 'abradab', name: 'Abradab', img: 'abradab', social: { instagram: 'https://www.instagram.com/abradab_44/', spotify: 'https://open.spotify.com/search/Abradab' } },
    { id: 'slon', name: 'Słoń', img: 'slon', social: { instagram: 'https://www.instagram.com/braindeadslon/', youtube: 'https://www.youtube.com/@BrainDeadSlon', spotify: 'https://open.spotify.com/search/S%C5%82o%C5%84' } },
    { id: 'miuosh', name: 'Miuosh', img: 'miuosh', social: { instagram: 'https://www.instagram.com/miuosh/', spotify: 'https://open.spotify.com/search/Miuosh' } },
    { id: 'fisz', name: 'Fisz', img: 'fisz', social: { instagram: 'https://www.instagram.com/fisz_emade_official/', spotify: 'https://open.spotify.com/search/Fisz' } },
    { id: 'avi', name: 'AVI', img: 'avi', social: { instagram: 'https://www.instagram.com/avi_sycylijczyk/', spotify: 'https://open.spotify.com/search/Avi' } },
    { id: 'reto', name: 'ReTo', img: 'reto', social: { spotify: 'https://open.spotify.com/artist/1Kjs5u8GQf6zCFdTj6SI9E', instagram: 'https://www.instagram.com/reto_syn_andrzeja/', youtube: 'https://www.youtube.com/@spacerlabel' } },
    { id: 'sobel', name: 'Sobel', img: 'sobel', social: { spotify: 'https://open.spotify.com/search/Sobel' } },
    { id: 'otsochodzi', name: 'Otsochodzi', img: 'otsochodzi', social: { spotify: 'https://open.spotify.com/artist/4zvO09rVUIVTeALhs6xLoB', instagram: 'https://www.instagram.com/otsochodzi/', youtube: 'https://www.youtube.com/@janekskumajto' } },
    { id: 'bonson', name: 'BonSon', img: 'bonson', social: { instagram: 'https://www.instagram.com/bonsonsbejbi/', spotify: 'https://open.spotify.com/search/Bonson' } },
    { id: 'kozik', name: 'Oki', img: 'oki', social: { spotify: 'https://open.spotify.com/artist/1oxn6cQ37twQ7yGnlE3ETd', instagram: 'https://www.instagram.com/spietadresiara/', youtube: 'https://www.youtube.com/channel/OkiTopic' } },
    { id: 'chivas', name: 'Chivas', img: 'chivas', social: { instagram: 'https://www.instagram.com/_chivas_042_/', youtube: 'https://www.youtube.com/@ChivasioOfficial', spotify: 'https://open.spotify.com/search/Chivas' } },
    { id: 'bambi', name: 'Bambi', img: 'bambi', social: { instagram: 'https://www.instagram.com/bambi.ofc/', spotify: 'https://open.spotify.com/search/Bambi' } },
    { id: 'intruz', name: 'Intruz', img: 'intruz', social: { instagram: 'https://www.instagram.com/intruzik_opole/', youtube: 'https://www.youtube.com/@intruz_opole', spotify: 'https://open.spotify.com/search/Intruz' } },
    { id: 'koras', name: 'Koras', img: 'koras', social: { instagram: 'https://www.instagram.com/korasek_rpw/', spotify: 'https://open.spotify.com/search/Koras' } },
    { id: 'rado', name: 'Rado Radosny', img: 'rado_radosny', social: { instagram: 'https://www.instagram.com/dwaslawy/', youtube: 'https://www.youtube.com/@dwaslawy', spotify: 'https://open.spotify.com/search/Rado' } },
    // Rest of Underground
    { id: 'adi_nowak', name: 'Adi Nowak', img: 'adi_nowak', social: { instagram: 'https://www.instagram.com/adi_nowak/', youtube: 'https://www.youtube.com/@adinowaking', spotify: 'https://open.spotify.com/search/Adi%20Nowak' } },
    { id: 'adma', name: 'Adma', img: 'adma', social: { instagram: 'https://www.instagram.com/adma_exorientelux/', youtube: 'https://www.youtube.com/@AdMaMusic', spotify: 'https://open.spotify.com/search/Adma' } },
    { id: 'arab', name: 'Arab', img: 'arab', social: { instagram: 'https://www.instagram.com/gabrys_arabski/', youtube: 'https://www.youtube.com/@ARABTV', spotify: 'https://open.spotify.com/search/Arab' } },
    { id: 'astek', name: 'Astek', img: 'astek', social: { instagram: 'https://www.instagram.com/dwaslawy/', youtube: 'https://www.youtube.com/@dwaslawy', spotify: 'https://open.spotify.com/search/Astek' } },
    { id: 'atutowy', name: 'Atutowy', img: 'atutowy', social: { instagram: 'https://www.instagram.com/atutowy/', spotify: 'https://open.spotify.com/search/Atutowy' } },
    { id: 'bardal', name: 'Bardal', img: 'bardal', social: { spotify: 'https://open.spotify.com/search/Bardal', instagram: '', youtube: '' } },
    { id: 'belmondo', name: 'Belmondo', img: 'belmondo', social: { spotify: 'https://open.spotify.com/search/Belmondawg', instagram: 'https://www.instagram.com/belmondawg', youtube: '' } },
    { id: 'biak', name: 'Biak', img: 'biak', social: { spotify: 'https://open.spotify.com/search/Biak', instagram: '', youtube: '' } },
    { id: 'bilon', name: 'Bilon', img: 'bilon', social: { instagram: 'https://www.instagram.com/belmondawg', youtube: 'https://www.youtube.com/@DIILTV', spotify: 'https://open.spotify.com/search/Biak' } },
    { id: 'blacha', name: 'Blacha', img: 'blacha_2115', social: { instagram: 'https://www.instagram.com/blacha_2115/', spotify: 'https://open.spotify.com/search/Blacha' } },
    { id: 'kabe', name: 'Kabe', img: 'kabe', social: { spotify: 'https://open.spotify.com/search/Kabe', instagram: 'https://www.instagram.com/kabe.gcbw/', youtube: 'https://www.youtube.com/@QueQualityPL' } },
    { id: 'bosski', name: 'Bosski Roman', img: 'bosski_roman', social: { instagram: 'https://www.instagram.com/bosskiroman/', youtube: 'https://www.youtube.com/user/BosskiRomanFirma', spotify: 'https://open.spotify.com/search/Bosski%20Roman' } },
    { id: 'catchup', name: 'Catchup', img: 'catchup', social: { instagram: 'https://www.instagram.com/catchupxxl/', youtube: 'https://www.youtube.com/@TomSchklaneck', spotify: 'https://open.spotify.com/search/Catchup' } },
    { id: 'cielog', name: 'Cielog', img: 'cielog', social: { spotify: 'https://open.spotify.com/search/Cielog', instagram: '', youtube: '' } },
    { id: 'dawid_szynol', name: 'Dawid Szynol', img: 'dawid_szynol', social: { spotify: 'https://open.spotify.com/search/Dawid%20Szynol', instagram: '', youtube: '' } },
    { id: 'dizkret', name: 'Dizkret', img: 'dizkret', social: { spotify: 'https://open.spotify.com/search/Dizkret', instagram: 'https://www.instagram.com/dizkret', youtube: '' } },
    { id: 'dziarma', name: 'Dziarma', img: 'dziarma', social: { instagram: 'https://www.instagram.com/dizkret', youtube: 'https://www.youtube.com/@dziarmaofficial', spotify: 'https://open.spotify.com/search/Dziarma' } },
    { id: 'eripe', name: 'Eripe', img: 'eripe', social: { youtube: 'https://www.youtube.com/@patokalipsa', spotify: 'https://open.spotify.com/search/Eripe' } },
    { id: 'erking', name: 'Erking', img: 'erking', social: { spotify: 'https://open.spotify.com/search/Erking', instagram: '', youtube: '' } },
    { id: 'fagata', name: 'Fagata', img: 'fagata', social: { instagram: 'https://www.instagram.com/fagataaa/', spotify: 'https://open.spotify.com/search/Fagata' } },
    { id: 'flexxy', name: 'Flexxy', img: 'flexxy_2115', social: { instagram: 'https://www.instagram.com/flexxy2115/', spotify: 'https://open.spotify.com/search/Flexxy' } },
    { id: 'frosti', name: 'Frosti Rege', img: 'frosti', social: { instagram: 'https://www.instagram.com/frostirege/', spotify: 'https://open.spotify.com/search/Frosti' } },
    { id: 'fu', name: 'Fu', img: 'fu', social: { instagram: 'https://www.instagram.com/fu_official/', spotify: 'https://open.spotify.com/search/Fu' } },
    { id: 'gospel', name: 'Gospel', img: 'gospel', social: { spotify: 'https://open.spotify.com/search/Gospel%20Raper', instagram: '', youtube: '' } },
    { id: 'gsp', name: 'GSP', img: 'gsp', social: { spotify: 'https://open.spotify.com/search/GSP%20Mobbyn', instagram: '', youtube: '' } },
    { id: 'gural', name: 'Gural', img: 'gural', social: { instagram: 'https://www.instagram.com/djdziadzior/', spotify: 'https://open.spotify.com/search/Gural' } },
    { id: 'indeb', name: 'Indeb', img: 'indeb', social: { instagram: 'https://www.instagram.com/i.n.d.e.b/', spotify: 'https://open.spotify.com/search/Indeb' } },
    { id: 'jan_rapowanie', name: 'Jan Rapowanie', img: 'jan_rapowanie', social: { instagram: 'https://www.instagram.com/janekoficjalnie/', spotify: 'https://open.spotify.com/search/Jan-rapowanie' } },
    { id: 'jedker', name: 'Jedker', img: 'jedker', social: { instagram: 'https://www.instagram.com/jedker_aka_jd/', youtube: 'https://www.youtube.com/@Jedker_Official', spotify: 'https://open.spotify.com/search/J%C4%99dker' } },
    { id: 'juras', name: 'Juras', img: 'juras', social: { instagram: 'https://www.instagram.com/jurekwronski/', youtube: 'https://www.youtube.com/@JURASMUZYCZNYKANA', spotify: 'https://open.spotify.com/search/Juras' } },
    { id: 'kaczor', name: 'Kaczor', img: 'kaczor', social: { instagram: 'https://www.instagram.com/kaczorboss/', spotify: 'https://open.spotify.com/search/Kaczor' } },
    { id: 'kafar', name: 'Kafar Dixon37', img: 'kafar_dixon37', social: { instagram: 'https://www.instagram.com/kafar_dixon37/', spotify: 'https://open.spotify.com/search/Kafar' } },
    { id: 'kara', name: 'Kara', img: 'kara', social: { instagram: 'https://www.instagram.com/kara_official_yo/', youtube: 'https://www.youtube.com/@KARA_TV', spotify: 'https://open.spotify.com/search/Kara' } },
    { id: 'kazek', name: 'KAZ', img: 'kazek', social: { instagram: 'https://www.instagram.com/be_do_gie_official/', spotify: 'https://open.spotify.com/search/Kaz%20Ba%C5%82agane' } },
    { id: 'keke', name: 'Kękę', img: 'keke', social: { instagram: 'https://www.instagram.com/kekeoficjalnie/', spotify: 'https://open.spotify.com/search/K%C4%99K%C4%99' } },
    { id: 'krzy', name: 'Krży Krzysztof', img: 'krzy_krzysztof', social: { spotify: 'https://open.spotify.com/search/Krzy%20Krzysztof', instagram: '', youtube: '' } },
    { id: 'kuban', name: 'Kuban', img: 'kuban', social: { instagram: 'https://www.instagram.com/kubanofficial/', youtube: 'https://www.youtube.com/@Kubano', spotify: 'https://open.spotify.com/search/Kuban' } },
    { id: 'kubanczyk', name: 'Kubańczyk', img: 'kubanczyk', social: { instagram: 'https://www.instagram.com/kubanczyk.official/', youtube: 'https://www.youtube.com/@Kubanczyq', spotify: 'https://open.spotify.com/search/Kuba%C5%84czyk' } },
    { id: 'kuqe', name: 'Kuqe', img: 'kuqe_2115', social: { instagram: 'https://www.instagram.com/kuqe2115/', spotify: 'https://open.spotify.com/search/Kuqe' } },
    { id: 'laikike1', name: 'Laikike1', img: 'laikike1', social: { instagram: 'https://www.instagram.com/laiczek/', spotify: 'https://open.spotify.com/search/Laikike1' } },
    { id: 'lajzol', name: 'Lajzół', img: 'lajzol', social: { instagram: 'https://www.instagram.com/lajzol/', spotify: 'https://open.spotify.com/search/%C5%81ajzol' } },
    { id: 'lech', name: 'Lech Roch Pawlak', img: 'lech_roch_pawlak', social: { spotify: 'https://open.spotify.com/search/Lech%20Roch%20Pawlak', instagram: '', youtube: '' } },
    { id: 'little', name: 'Little', img: 'little', social: { spotify: 'https://open.spotify.com/search/Little', instagram: '', youtube: '' } },
    { id: 'livka', name: 'Livka', img: 'livka', social: { instagram: 'https://www.instagram.com/livka_2115/', spotify: 'https://open.spotify.com/search/Livka' } },
    { id: 'lj_karwel', name: 'LJ Karwel', img: 'lj_karwel', social: { instagram: 'https://www.instagram.com/eljotkarwel/', spotify: 'https://open.spotify.com/search/LJ%20Karwel' } },
    { id: 'lona', name: 'Lona', img: 'lona', social: { spotify: 'https://open.spotify.com/search/%C5%81ona', instagram: '', youtube: '' } },
    { id: 'louis_v', name: 'Louis V', img: 'louis_v', social: { spotify: 'https://open.spotify.com/search/Louis%20Villain', instagram: '', youtube: '' } },
    { id: 'malpa', name: 'Małpa', img: 'malpa', social: { instagram: 'https://www.instagram.com/lukasz_malpa_malkiewicz/', spotify: 'https://open.spotify.com/search/Ma%C5%82pa' } },
    { id: 'mielzky', name: 'Mielzky', img: 'mielzky', social: { spotify: 'https://open.spotify.com/artist/4X3X4uYp6ErtY3pP5H7r7N', instagram: 'https://www.instagram.com/iammielzky/', kick: 'https://kick.com/iammielzky', youtube: 'https://www.youtube.com/@iammielzky' } },
    { id: 'og_olgierd', name: 'OG Olgierd', img: 'og_olgierd', social: { instagram: 'https://www.instagram.com/og_olgierd/', spotify: 'https://open.spotify.com/search/OG%20Olgierd' } },
    { id: 'okon', name: 'Okoń', img: 'okon_pzw', social: { instagram: 'https://www.instagram.com/ruwbabicze/', youtube: 'https://www.youtube.com/@POLSKANIEGOTOWA', spotify: 'https://open.spotify.com/search/Oko%C5%84' } },
    { id: 'opal', name: 'Opal', img: 'opal', social: { spotify: 'https://open.spotify.com/search/Opa%C5%82', instagram: 'https://www.instagram.com/opalclown', youtube: '' } },
    { id: 'oskar', name: 'Oskar', img: 'oskar', social: { instagram: 'https://www.instagram.com/opalclown', youtube: 'https://www.youtube.com/@PRO8L3M', spotify: 'https://open.spotify.com/search/Oskar83' } },
    { id: 'pers', name: 'Pers', img: 'pers', social: { instagram: 'https://www.instagram.com/pers_nbb/', spotify: 'https://open.spotify.com/search/Pers' } },
    { id: 'planet_anm', name: 'Planet ANM', img: 'planet_anm', social: { spotify: 'https://open.spotify.com/search/Planet%20ANM', instagram: '', youtube: '' } },
    { id: 'pyskaty', name: 'Pyskaty', img: 'pyskaty', social: { spotify: 'https://open.spotify.com/search/Pyskaty', instagram: '', youtube: '' } },
    { id: 'ras', name: 'RAS', img: 'ras', social: { spotify: 'https://open.spotify.com/artist/5qgCrzMzASs1YpEMSp7tGt', instagram: '', youtube: '' } },
    { id: 'schafter', name: 'Schafter', img: 'schafter', social: { instagram: 'https://www.instagram.com/restaurant_posse/', spotify: 'https://open.spotify.com/search/Schafter' } },
    { id: 'shhieda', name: 'Shhieda', img: 'shhieda', social: { instagram: 'https://www.instagram.com/shhiedae/', spotify: 'https://open.spotify.com/search/Shhieda' } },
    { id: 'sitek', name: 'Sitek', img: 'sitek', social: { instagram: 'https://www.instagram.com/sitekofficial_/', spotify: 'https://open.spotify.com/search/Sitek' } },
    { id: 'smarki', name: 'Smarki Smark', img: 'smarki_smark', social: { spotify: 'https://open.spotify.com/search/Smarki%20Smark', instagram: '', youtube: '' } },
    { id: 'ten_typ_mes', name: 'Ten Typ Mes', img: 'ten_typ_mes', social: { instagram: 'https://www.instagram.com/mestentyp/', youtube: 'https://www.youtube.com/channel/TenTypMes', spotify: 'https://open.spotify.com/search/Ten%20Typ%20Mes' } },
    { id: 'tetris', name: 'Tetris', img: 'tetris', social: { instagram: 'https://www.instagram.com/tetmusic/', spotify: 'https://open.spotify.com/search/Tetris' } },
    { id: 'vbs', name: 'VBS', img: 'vbs', social: { instagram: 'https://www.instagram.com/vbsik/', youtube: 'https://www.youtube.com/channel/QueQualityPL', spotify: 'https://open.spotify.com/search/VBS' } },
    { id: 'vienio', name: 'Vienio', img: 'vienio', social: { instagram: 'https://www.instagram.com/piotrvienio/', spotify: 'https://open.spotify.com/search/Vienio' } },
    { id: 'vnm', name: 'VNM', img: 'vnm', social: { instagram: 'https://www.instagram.com/fau_enem/', spotify: 'https://open.spotify.com/search/VNM' } },
    { id: 'wena', name: 'Wena', img: 'wena', social: { instagram: 'https://www.instagram.com/wudoe/', youtube: 'https://www.youtube.com/@Wudoe', spotify: 'https://open.spotify.com/search/W.E.N.A.' } },
    { id: 'wilku', name: 'Wilku', img: 'wilku', social: { instagram: 'https://www.instagram.com/wdzone/', youtube: 'https://www.youtube.com/@WilkuWDZ', spotify: 'https://open.spotify.com/search/Wilku' } },
    { id: 'jan_rapowanie', name: 'Jan-Rapowanie', img: 'jan_rapowanie', social: { spotify: 'https://open.spotify.com/search/Jan-rapowanie', instagram: 'https://www.instagram.com/janekoficjalnie/', youtube: 'https://www.youtube.com/@JanRapowanie' } },
    { id: 'wlodi', name: 'Włodi', img: 'wlodi', social: { instagram: 'https://www.instagram.com/wlodi_osad/', spotify: 'https://open.spotify.com/search/W%C5%82odi' } },
    { id: 'zyto', name: 'Żyto', img: 'zyto', social: { instagram: 'https://www.instagram.com/michalzytniak/', youtube: 'https://www.youtube.com/@ZytoJinksiarz', spotify: 'https://open.spotify.com/search/%C5%BByto' } },
    { id: 'mrozu', name: 'Mrozu', img: 'mrozu', social: { instagram: 'https://www.instagram.com/mrozu_/', youtube: 'https://www.youtube.com/@MrozuMusic', spotify: 'https://open.spotify.com/search/Mrozu' } },
    { id: 'mily_atz', name: 'Miły ATZ', img: 'mily_atz', social: { instagram: 'https://www.instagram.com/___atz/', youtube: 'https://www.youtube.com/@Mily_ATZ', spotify: 'https://open.spotify.com/search/Mi%C5%82y%20ATZ' } },
    { id: 'fukaj', name: 'Fukaj', img: 'fukaj', social: { instagram: 'https://www.instagram.com/fukajot/', spotify: 'https://open.spotify.com/search/Fukaj' } },
    { id: '2sty', name: '2sty', img: '2sty', social: { instagram: 'https://www.instagram.com/2styk0t/', youtube: 'https://www.youtube.com/@2stykot', spotify: 'https://open.spotify.com/search/2sty' } },
    { id: 'janusz_walczuk', name: 'Janusz Walczuk', img: 'janusz_walczuk', social: { instagram: 'https://www.instagram.com/januszwalczuk/', youtube: 'https://www.youtube.com/@JanuszWalczuk', spotify: 'https://open.spotify.com/search/Janusz%20Walczuk' } },
    { id: 'hans_52debiec', name: 'Hans 52Dębiec', img: 'hans_52debiec', social: { instagram: 'https://www.instagram.com/piec.dwa/', youtube: 'https://www.youtube.com/@PiecDwa', spotify: 'https://open.spotify.com/search/Hans' } },
    { id: 'eis', name: 'Eis', img: 'eis', social: { spotify: 'https://open.spotify.com/search/Eis' } },
    { id: 'kabe', name: 'Kabe', img: 'kabe', social: { instagram: 'https://www.instagram.com/yngpolonais/', spotify: 'https://open.spotify.com/search/Kabe' } },
    { id: 'malolat', name: 'Małolat', img: 'malolat', social: { instagram: 'https://www.instagram.com/malolat_official/', youtube: 'https://www.youtube.com/@malolat_official', spotify: 'https://open.spotify.com/search/Ma%C5%82olat' } },
    { id: 'emas', name: 'Emas', img: 'emas', social: { spotify: 'https://open.spotify.com/search/Emas', instagram: '', youtube: '' } },
    { id: 'deobson', name: 'Deobson', img: 'deobson', social: { instagram: 'https://www.instagram.com/deobson_/', spotify: 'https://open.spotify.com/search/Deobson' } },
    { id: 'kosi', name: 'Kosi', img: 'kosi', social: { spotify: 'https://open.spotify.com/search/Kosi%20JWP', instagram: 'https://www.instagram.com/isok_o1t', youtube: '' } },
    { id: 'wojek', name: 'Wojek', img: 'wojek', social: { instagram: 'https://www.instagram.com/wojteklewojtek/', spotify: 'https://open.spotify.com/search/Wojek' } },
    { id: 'oliwka_brazil', name: 'Oliwka Brazil', img: 'oliwka_brazil', social: { instagram: 'https://www.instagram.com/oliwka_brazil/', youtube: 'https://www.youtube.com/@oliwka_brazil', spotify: 'https://open.spotify.com/search/Oliwka%20Brazil' } },
    { id: 'matheo', name: 'Matheo', img: 'matheo', social: { instagram: 'https://www.instagram.com/officialmatheo', youtube: 'https://www.youtube.com/@MatheoProductions', spotify: 'https://open.spotify.com/search/Matheo' } },
    { id: 'zeppy_zep', name: 'Zeppy Zep', img: 'zeppy_zep', social: { spotify: 'https://open.spotify.com/search/Zeppy%20Zep', instagram: 'https://www.instagram.com/zeppyzep', youtube: 'https://www.youtube.com/@zeppyzep' } },
    { id: 'waima', name: 'Waima', img: 'waima', social: { instagram: 'https://www.instagram.com/waimaziomaleo/', youtube: 'https://www.youtube.com/@waimaziomaleo', spotify: 'https://open.spotify.com/search/Waima' } },
    { id: 'juras_mma', name: 'Juras MMA', img: 'juras_mma', social: { instagram: 'https://www.instagram.com/jurasmma/', youtube: 'https://www.youtube.com/channel/JurasMMA', spotify: 'https://open.spotify.com/search/Juras' } },
    { id: 'stasiak', name: 'Stasiak', img: 'stasiak', social: { spotify: 'https://open.spotify.com/search/2cztery7', instagram: '', youtube: '' } }
];

const CARDS_DATABASE = [];

// 0. GENERATE PRODUCER CARDS (4 Tiers + GOAT)
PRODUCERS_LIST.forEach(producer => {
    ['UNDERGROUND', 'MAINSTREAM', 'STAR', 'ICON'].forEach(tierKey => {
        const tier = CARD_TIERS[tierKey];
        const basePower = 50 + Math.floor(Math.random() * 20);
        const baseSpeed = 50 + Math.floor(Math.random() * 20);
        const baseDef = 50 + Math.floor(Math.random() * 20);

        CARDS_DATABASE.push({
            id: `${producer.id}_${tierKey.toLowerCase()}`,
            name: producer.name,
            tier: tierKey,
            type: CARD_TYPES.PRODUCER,
            stats: {
                power: Math.floor(basePower * tier.statMult),
                speed: Math.floor(baseSpeed * tier.statMult),
                defense: Math.floor(baseDef * tier.statMult)
            },
            effect: `Moc: ${Math.floor(tier.statMult * 10)}%`,
            imagePath: `img/${producer.img}_8x8.png`,
            social: producer.social || { spotify: '', instagram: '', youtube: '' }
        });
    });
    CARDS_DATABASE.push({
        id: `${producer.id}_goat`,
        name: producer.name,
        tier: 'GOAT',
        type: CARD_TYPES.PRODUCER,
        stats: { power: 99, speed: 99, defense: 99 },
        effect: 'LEGENDARNA MOC',
        imagePath: `img/${producer.img}_8x8.png`,
        isCraftable: true,
        social: producer.social || { spotify: '', instagram: '', youtube: '' }
    });
});


// 1. GENERATE RAPPER CARDS (4 Tiers + GOAT)
RAPPERS_LIST.forEach(rapper => {
    // Generate 4 Obtainable Tiers
    ['UNDERGROUND', 'MAINSTREAM', 'STAR', 'ICON'].forEach(tierKey => {
        const tier = CARD_TIERS[tierKey];
        // Base stats are random-ish but scaled by Tier
        const basePower = 50 + Math.floor(Math.random() * 20);
        const baseSpeed = 50 + Math.floor(Math.random() * 20);
        const baseDef = 50 + Math.floor(Math.random() * 20);

        CARDS_DATABASE.push({
            id: `${rapper.id}_${tierKey.toLowerCase()}`,
            name: rapper.name,
            tier: tierKey,
            type: 'RAPER',
            stats: {
                power: Math.floor(basePower * tier.statMult),
                speed: Math.floor(baseSpeed * tier.statMult),
                defense: Math.floor(baseDef * tier.statMult)
            },
            effect: `Moc: ${Math.floor(tier.statMult * 10)}%`,
            imagePath: `img/${rapper.img}_8x8.png`,
            social: rapper.social || { spotify: '', instagram: '', youtube: '' }
        });
    });

    // Generate GOAT Tier (Craft Only)
    CARDS_DATABASE.push({
        id: `${rapper.id}_goat`,
        name: rapper.name,
        tier: 'GOAT',
        type: 'RAPER',
        stats: { power: 99, speed: 99, defense: 99 },
        effect: 'LEGENDARNA MOC',
        imagePath: `img/${rapper.img}_8x8.png`,
        isCraftable: true,
        social: rapper.social || { spotify: '', instagram: '', youtube: '' }
    });
});

// 1B. GENERATE JOURNALIST CARDS (4 Tiers + GOAT)
JOURNALISTS_LIST.forEach(journalist => {
    // Generate 4 Obtainable Tiers
    ['UNDERGROUND', 'MAINSTREAM', 'STAR', 'ICON'].forEach(tierKey => {
        const tier = CARD_TIERS[tierKey];
        const basePower = 50 + Math.floor(Math.random() * 20);
        const baseSpeed = 50 + Math.floor(Math.random() * 20);
        const baseDef = 50 + Math.floor(Math.random() * 20);

        CARDS_DATABASE.push({
            id: `${journalist.id}_${tierKey.toLowerCase()}`,
            name: journalist.name,
            tier: tierKey,
            type: 'DZIENNIKARZ',  // Different type for journalists
            stats: {
                power: Math.floor(basePower * tier.statMult),
                speed: Math.floor(baseSpeed * tier.statMult),
                defense: Math.floor(baseDef * tier.statMult)
            },
            effect: `Moc: ${Math.floor(tier.statMult * 10)}%`,
            imagePath: `img/${journalist.img}_8x8.png`,
            social: journalist.social || { spotify: '', instagram: '', youtube: '' }
        });
    });

    // Generate GOAT Tier (Craft Only)
    CARDS_DATABASE.push({
        id: `${journalist.id}_goat`,
        name: journalist.name,
        tier: 'GOAT',
        type: 'DZIENNIKARZ',  // Different type for journalists
        stats: { power: 99, speed: 99, defense: 99 },
        effect: 'LEGENDARNA MOC',
        imagePath: `img/${journalist.img}_8x8.png`,
        isCraftable: true,
        social: journalist.social || { spotify: '', instagram: '', youtube: '' }
    });
});

// 2. ALBUMS (50 placeholders)
for (let i = 1; i <= 50; i++) {
    CARDS_DATABASE.push({
        id: `album_${i}`,
        name: `Album #${i}`,
        tier: (i % 5 === 0) ? 'ICON' : (i % 2 === 0 ? 'STAR' : 'MAINSTREAM'),
        type: 'PŁYTA',
        stats: { defense: 10 + i },
        effect: 'Buff Płyty',
        imagePath: 'img/cards/albums/placeholder.png', // User to replace
        social: { spotify: '', instagram: '', youtube: '' }
    });
}


// 4. GROUPS (20 placeholders)
for (let i = 1; i <= 20; i++) {
    CARDS_DATABASE.push({
        id: `group_${i}`,
        name: `Skład #${i}`,
        tier: 'ICON',
        type: 'SKŁAD',
        stats: { power: 10 + i },
        effect: 'Buff Składu',
        imagePath: 'img/cards/groups/placeholder.png', // User to replace
        social: { spotify: '', instagram: '', youtube: '' }
    });
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CARD_TIERS, CARD_TYPES, CARDS_DATABASE };
}
