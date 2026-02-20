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
    { id: 'kubi', name: 'Kubi Producent', img: 'kubi_producent', social: { spotify: 'https://open.spotify.com/artist/0WDJa0qnagyOnMaiD26wht?si=QoHaua4rTKGBbN2FMTRhPw', instagram: 'https://www.instagram.com/kubiproducent/', youtube: 'https://www.youtube.com/@Kubi_Producent' } },
    { id: 'steez', name: 'Steez', img: 'steez', social: { spotify: 'https://open.spotify.com/artist/7v49oVVUhvIQG5EK0jkcF7?si=QUHaj6T3QfiKfqDbempt7A', instagram: 'https://www.instagram.com/steez83/', youtube: 'https://www.youtube.com/channel/UCIKpSENz2Fgfb62ZzE22xLg' } },
    { id: 'dj_chwial', name: 'DJ Chwial', img: 'dj_chwial', social: { instagram: 'https://www.instagram.com/chwial_the_returners/', spotify: 'https://open.spotify.com/artist/4zO6WqG8mu49ek0ZDIptTk?si=qgYDZyCoSSuoxBBuPrrHZA' } },
    { id: 'jedynak', name: 'Jedynak', img: 'jedynak', social: { instagram: 'https://www.instagram.com/janporebski2020/', spotify: 'https://open.spotify.com/artist/3hf4x3XTc6O8Fr0qGZDrnu?si=J--Aw_mgRc6T-OtuzdmmCw' } },
    { id: '600v', name: '600V', img: '600v', social: { instagram: 'https://www.instagram.com/600v_music/', spotify: 'https://open.spotify.com/artist/1f5Eu4igDRi2LNNY837AdS?si=uTJHedd3Qr6vdd8DFa5m2g' } },
    { id: 'ajron', name: 'Ajron', img: 'ajron', social: { instagram: 'https://www.instagram.com/michaldabal/', spotify: 'https://open.spotify.com/artist/5dlqcZJpv99qibC0d9mJLM?si=t8Ct8bTARnm1gmFGMv4cFg' } },
    { id: 'dj_biskup', name: 'DJ Biskup', img: 'dj_biskup', social: { instagram: 'https://www.instagram.com/djbiskup/', kick: 'https://kick.com/djbiskup/videos' } },
    { id: 'dj_decks', name: 'DJ Decks', img: 'dj_decks', social: { instagram: 'https://www.instagram.com/djdecks/', spotify: 'https://open.spotify.com/artist/7rRsXnU1mpJwuBNMwH0Tsn?si=m73stxwNRH6UUMQ4Phbk1g' } },
    { id: 'dj_eprom', name: 'DJ Eprom', img: 'dj_eprom', social: { instagram: 'https://www.instagram.com/eprombeats/', youtube: 'https://www.youtube.com/@eprombeats' } },
    { id: 'dj_ike', name: 'DJ Ike', img: 'dj_ike', social: { instagram: 'https://www.instagram.com/djikecom/', spotify: 'https://open.spotify.com/artist/7h7GI8ug0kdo9ct3vj1Mw5?si=vt5asyqXRKOhzMaKTq8FDA' } },
    { id: 'dj_moyes', name: 'DJ Moyes', img: 'dj_moyes', social: { instagram: 'https://www.instagram.com/dj_moyes/' } },
    { id: 'dj_taek', name: 'DJ Taek', img: 'dj_taek', social: { spotify: 'https://open.spotify.com/artist/5FhjSSoKazHVr8mWpiwW6R?si=Cc647pPoRzar2DO-_4uaBw', instagram: 'https://www.instagram.com/dj.taek/' } },
    { id: 'enzu', name: 'Enzu', img: 'enzu', social: { instagram: 'https://www.instagram.com/enzumusic/' } },
    { id: 'favst', name: 'Favst', img: 'favst', social: { spotify: 'https://open.spotify.com/artist/16TsNPlesuA1R9kPLS6nta?si=xaAYR_JKRBGDEzyEWBgLSg', instagram: 'https://www.instagram.com/favstmusik/' } },
    { id: 'forxst', name: 'Forxst', img: 'forxst', social: { instagram: 'https://www.instagram.com/forxst/', spotify: 'https://open.spotify.com/artist/4t8zhFslMZ1y2XQo6uirep?si=SGHKzhIlRUyvs2o4vwftxA' } },
    { id: 'francis', name: 'Francis', img: 'francis', social: { spotify: 'https://open.spotify.com/artist/6HdxibJzoNkDUUDHagx3Ko?si=8Tc3VI1eQUGsR5KdL0J_VQ', instagram: 'https://www.instagram.com/bonjour.francis/' } },
    { id: 'jonatan', name: 'Jonatan', img: 'jonatan', social: { spotify: 'https://open.spotify.com/artist/2dLhpezBEgAELn73fiMEak?si=3qeLWs1jRM2kUZ85g_5OgA', instagram: 'https://www.instagram.com/jonatan.music/' } },
    { id: 'lanek', name: 'Lanek', img: 'lanek', social: { instagram: 'https://www.instagram.com/lanek_1/', spotify: 'https://open.spotify.com/artist/7afPAbg5jb45KFUSnHIMFG?si=ST1VeAw_TM6-VxJIUg9TvQ' } },
    { id: 'magiera', name: 'Magiera', img: 'magiera', social: { spotify: 'https://open.spotify.com/artist/3OFZwEYEAKMEmUheZ8TKso?si=yeunq1JxTlGtKMkngvB-0Q', instagram: 'https://www.instagram.com/magierski_71/' } },
    { id: 'noon', name: 'Noon', img: 'noon', social: { instagram: 'https://www.instagram.com/noon_pentasix/', youtube: 'https://www.youtube.com/channel/NoweNagrania' } },
    { id: 'pawbeats', name: 'Pawbeats', img: 'pawbeats', social: { instagram: 'https://www.instagram.com/pawbeats/', youtube: 'https://www.youtube.com/@Pawbeats' } },
    { id: 'soulpete', name: 'Soulpete', img: 'soulpete', social: { spotify: 'https://open.spotify.com/artist/5ZdPxvZW2SJhHepZxAx7b5?si=KQPCaRkbTLGVUs5okdC9IA', instagram: 'https://www.instagram.com/soulpetemusic/' } },
    { id: 'waco', name: 'Waco', img: 'waco', social: { spotify: 'https://open.spotify.com/artist/4fwFJRmea6ksX4ZUM1Hhlu?si=7t7t1acJRuCr2ipb0ubJ2A', instagram: 'https://www.instagram.com/waco_odalastudio/' } },
    { id: 'matheo', name: 'Matheo', img: 'matheo', social: { instagram: 'https://www.instagram.com/officialmatheo', youtube: 'https://www.youtube.com/@MatheoProductions', spotify: 'https://open.spotify.com/artist/6YFFJXCSmDv4SJEi0JSp2S?si=UcNy2j3IRQK47pNV-GYb-A' } },
    { id: 'zeppy_zep', name: 'Zeppy Zep', img: 'zeppy_zep', social: { spotify: 'https://open.spotify.com/artist/2hnyMG1DuXarlHFJDITc3n?si=vKM3yqu-R_iTX00d-Ly14w', instagram: 'https://www.instagram.com/zeppyzep', youtube: 'https://www.youtube.com/@zeppyzep' } },

];

// Journalists List (Media personalities)
// Journalists List (Media personalities)
const JOURNALISTS_LIST = [
    { id: 'yurkosky', name: 'Yurkosky', img: 'yurkosky', social: { youtube: 'https://www.youtube.com/c/Yurkosky', instagram: 'https://www.instagram.com/yurkosky_official/' } },

    { id: 'bartek_biegun', name: 'Bartek Biegun', img: 'bartek_biegun', social: { instagram: 'https://www.instagram.com/biegun.b/', youtube: 'https://www.youtube.com/@BartekBiegun' } },
    { id: 'lil_konon', name: 'Lil Konon', img: 'lil_konon', social: { instagram: 'https://www.instagram.com/lil.konon/', youtube: 'https://www.youtube.com/@LILKONOON', twitch: 'https://www.twitch.tv/lilkonoon', spotify: 'https://open.spotify.com/show/2XwRk3SmT65Cs54vfZ2Ih2?si=e61edb6ae7e446bd' } },
    { id: 'hype', name: 'Hype', img: 'hype', social: { youtube: 'https://www.youtube.com/@TurtleHype', instagram: 'https://www.instagram.com/turtlehype/' } },

    { id: 'mateusz_natali', name: 'Mateusz Natali', img: 'mateusz_natali', social: { instagram: 'https://www.instagram.com/mateusznatali/', youtube: 'https://www.youtube.com/@PopkillerTV' } },
    { id: 'jacek_adamkiewicz', name: 'Jacek Adamkiewicz', img: 'jacek_adamkiewicz', social: { instagram: 'https://www.instagram.com/jacek_adamkiewicz/', youtube: 'https://www.youtube.com/@JacekAdamkiewicz' } },
    { id: 'muzyka_tv', name: 'Muzyka TV', img: 'muzyka_tv', social: { youtube: 'https://www.youtube.com/@muzykatv4554', instagram: 'https://www.instagram.com/muzykatvswag/', twitch: 'https://www.twitch.tv/muzykatv1' } },
    { id: 'flint', name: 'Flint', img: 'flint', social: { instagram: 'https://www.instagram.com/jakubflint/', youtube: 'https://www.youtube.com/user/FlintOfficial' } },
    { id: 'novacci', name: 'Novacci', img: 'novacci', social: { instagram: 'https://www.instagram.com/novaccinovacci/' } },
    { id: 'wuwunio', name: 'Wuwunio', img: 'wuwunio', social: { instagram: 'https://www.instagram.com/wuwunio/', youtube: 'https://www.youtube.com/@wuwunio' } },
    { id: 'warga', name: 'Warga', img: 'warga', social: { instagram: 'https://www.instagram.com/programzdupy/', youtube: 'https://www.youtube.com/user/zdupy' } },
    { id: 'skopzzor', name: 'Skopzzor', img: 'skopzzor', social: { instagram: 'https://www.instagram.com/skopzzor/', kick: 'https://kick.com/skopzzor', youtube: 'https://www.youtube.com/@SkopzzoR' } },
    { id: 'patkustoms', name: 'Pat Kustoms', img: 'patkustoms', social: { youtube: 'https://www.youtube.com/@dailygrind2020', instagram: 'https://www.instagram.com/patkustoms_official/' } },
    { id: 'matt', name: 'Matt', img: 'matt', social: { youtube: 'https://www.youtube.com/@RapMATTers', instagram: 'https://www.instagram.com/rapmatterspodcast/', spotify: 'https://open.spotify.com/show/1zdmnSXVz7aLR137V38v9j?si=aeb1630b8270458b' } },
    { id: 'horrypaz', name: 'Horrypaz', img: 'horrypaz', social: { instagram: 'https://www.instagram.com/horrypaz/', youtube: 'https://www.youtube.com/@horrypaz', twitch: 'https://www.twitch.tv/horrypaz' } }
];

// Base Rapper List (All equally capable of being GOATs)
const RAPPERS_LIST = [
    { id: 'quebonafide', name: 'Quebonafide', img: 'quebonafide', social: { spotify: 'https://open.spotify.com/artist/1fxbULcd6ryMNc1usHoP0R', instagram: 'https://www.instagram.com/quebonafide/', youtube: 'https://www.youtube.com/@QueQualityPL' } },
    { id: 'taco', name: 'Taco Hemingway', img: 'taco', social: { spotify: 'https://open.spotify.com/artist/7CJgLPEqiIRuneZSolpawQ', instagram: 'https://www.instagram.com/tacohemingway/', youtube: 'https://www.youtube.com/@TacoHemingwayOfficial' } },
    { id: 'mata', name: 'Mata', img: 'mata', social: { spotify: 'https://open.spotify.com/artist/0MIG6gMcQTSvFbKvUwK0id', instagram: 'https://www.instagram.com/33mata/', youtube: 'https://www.youtube.com/channel/UC0oDoz9O0u3cI_oG_cK9fTw' } },
    { id: 'tede', name: 'Tede', img: 'tede', social: { spotify: 'https://open.spotify.com/artist/38iqZSGa2pvToKrMISU8g1?si=TVWa5gfTRcSS88oGV-wbug', instagram: 'https://www.instagram.com/tedef/', youtube: 'https://www.youtube.com/@TEDEWIZJA' } },
    { id: 'peja', name: 'Peja', img: 'peja', social: { spotify: 'https://open.spotify.com/artist/5IQZA1dxUd3Qv73mHNln59?si=zfZoRSnIQ0qAmHHNIPxzoA', instagram: 'https://www.instagram.com/pejaslumsattack/', youtube: 'https://www.youtube.com/user/pejaslumsattack' } },
    { id: 'bedoes', name: 'Bedoes 2115', img: 'bedoes_2115', social: { spotify: 'https://open.spotify.com/artist/0LX2VNf5w4iOHW1yyIqb74', instagram: 'https://www.instagram.com/bedoes2115/', youtube: 'https://www.youtube.com/@2115' } },
    { id: 'white', name: 'White 2115', img: 'white_2115', social: { spotify: 'https://open.spotify.com/artist/4nPxrGG7k7aEKmNLsfX4cd', instagram: 'https://www.instagram.com/2115white/', youtube: 'https://www.youtube.com/@white2115official' } },
    { id: 'paluch', name: 'Paluch', img: 'paluch', social: { spotify: 'https://open.spotify.com/artist/462yq5vpZnO172v3nK9ibv', instagram: 'https://www.instagram.com/paluchofficial/', youtube: 'https://www.youtube.com/@BORCREWOFFICIAL' } },
    { id: 'kukon', name: 'Kukon', img: 'kukon', social: { spotify: 'https://open.spotify.com/artist/3U5Oag04Yl2WnvPULOlsMD', instagram: 'https://www.instagram.com/kukonogg/', youtube: 'https://www.youtube.com/@OgrodyLabel' } },
    { id: 'ostr', name: 'O.S.T.R.', img: 'ostr', social: { spotify: 'https://open.spotify.com/artist/52XMlxvCIzmiNkzSqEw3Uv', instagram: 'https://www.instagram.com/adam.ostr.ostrowski/', youtube: 'https://www.youtube.com/@OSTR_Official' } },
    { id: 'solar', name: 'Solar', img: 'solar', social: { spotify: 'https://open.spotify.com/artist/1KJvuZHmkpnrjIyTLhhwpb?si=qjloTqnUQmqZKUQXbvwg3A', instagram: 'https://www.instagram.com/solarmodelu/', youtube: 'https://www.youtube.com/@sbm_label' } },
    { id: 'popek', name: 'Popek', img: 'popek', social: { spotify: 'https://open.spotify.com/artist/4NtiLs5NpjgZDHNBEMbjKz', instagram: 'https://www.instagram.com/popek_oficjalnie/', youtube: 'https://www.youtube.com/@KrolAlbaniiTV' } },
    { id: 'kali', name: 'Kali', img: 'kali', social: { spotify: 'https://open.spotify.com/artist/3txlfIcKCNrKk5bJw1er3R?si=84LHo6O8TPul3XFR0rCMUw', instagram: 'https://www.instagram.com/kalis7/', youtube: 'https://www.youtube.com/@KaliGanjaMafia' } },
    { id: 'szpaku', name: 'Szpaku', img: 'szpaku', social: { spotify: 'https://open.spotify.com/artist/0Wi2fADbhwXlPUWxBmzo99', instagram: 'https://www.instagram.com/szpakusimba/', youtube: 'https://www.youtube.com/@GUGULABEL' } },
    { id: 'young_multi', name: 'Young Multi', img: 'young_multi', social: { spotify: 'https://open.spotify.com/artist/5CkZIA3WpaEFxp0wSjMzRI?si=EiS9I5ujQIODwFBVTMY7Bw', instagram: 'https://www.instagram.com/youngmulti/', youtube: 'https://www.youtube.com/@YoungMulti', twitch: 'https://www.twitch.tv/youngmulti' } },
    { id: 'young_leosia', name: 'Young Leosia', img: 'young_leosia', social: { spotify: 'https://open.spotify.com/artist/0iBTVnJ1Sff92zCDujfvyJ?si=ftrlU4I3Q7-DfBjj5-i0Kw', instagram: 'https://www.instagram.com/youngleosia/', youtube: 'https://www.youtube.com/@BailaElla' } },
    { id: 'sokol', name: 'Sokół', img: 'sokol', social: { spotify: 'https://open.spotify.com/artist/5Kuxl5ZenCl9fYzmtin6ot?si=Huz9wiE3QGCDZRalwdegGQ', instagram: 'https://www.instagram.com/wojteksokol/', youtube: 'https://www.youtube.com/@PROSTOtv' } },
    { id: 'pezet', name: 'Pezet', img: 'pezet', social: { spotify: 'https://open.spotify.com/artist/4z93wkjfGntA0XFqnv4wj7?si=GKoXkHAaRHy_NY6TvAjmDA', instagram: 'https://www.instagram.com/pezetofficial/', youtube: 'https://www.youtube.com/@PezetOfficial' } },
    { id: 'kizo', name: 'Kizo', img: 'kizo', social: { spotify: 'https://open.spotify.com/artist/2IHoZ3RrDJIikMRsYgHjhy', instagram: 'https://www.instagram.com/kizo_wnik_058/', youtube: 'https://www.youtube.com/@MYTOSUKCES-OFFICIAL' } },
    { id: 'sarius', name: 'Sarius', img: 'sarius', social: { instagram: 'https://www.instagram.com/mariuszsarius/', spotify: 'https://open.spotify.com/search/Sarius' } },
    { id: 'smolasty', name: 'Smolasty', img: 'smolasty', social: { spotify: 'https://open.spotify.com/artist/5GwdnlZaSwKpHmjcAijATP', instagram: 'https://www.instagram.com/smolasty/', youtube: 'https://www.youtube.com/@Smolasty' } },
    { id: 'young_igi', name: 'Young Igi', img: 'young_igi', social: { spotify: 'https://open.spotify.com/artist/1yq2JzsqbzFbJ1B7wGOXLc', instagram: 'https://www.instagram.com/youngigiyi/', youtube: 'https://www.youtube.com/channel/YoungIgi' } },
    { id: 'rahim', name: 'Rahim', img: 'rahim', social: { instagram: 'https://www.instagram.com/rahimofficial/', spotify: 'https://open.spotify.com/artist/0sKdZaAhTTobH1I6OHB2tY?si=i5LsGZ7JQ9GFNftzeQX90w' } },
    { id: 'gedz', name: 'Gedz', img: 'gedz', social: { spotify: 'https://open.spotify.com/artist/1MZ1TtfmzMHEYIlynXsr1a', instagram: 'https://www.instagram.com/gedz_nnjl/', youtube: 'https://www.youtube.com/Gedz' } },
    { id: 'green', name: 'Green', img: 'green', social: { spotify: 'https://open.spotify.com/artist/425dAH6elWgBjvcJmSxMbf?si=SoSMiKz0QMKYoc_oAAmSuA', instagram: 'https://www.instagram.com/kryptonim_green/', youtube: '' } },
    { id: 'filipek', name: 'Filipek', img: 'filipek', social: { instagram: 'https://www.instagram.com/filipek1995/', youtube: 'https://www.youtube.com/channel/QueQualityPL', spotify: 'https://open.spotify.com/artist/5hqRsNHDZH1jHzI9LgxFRZ?si=06rP8_jlTGiRDm6lR7WXzA' } },
    { id: 'eldo', name: 'Eldo', img: 'eldo', social: { instagram: 'https://www.instagram.com/eldoeternia/', youtube: 'https://www.youtube.com/channel/Eldo', spotify: 'https://open.spotify.com/artist/5nuF8QjV4BtabUeBaXzzwK?si=GDw_nTBZS1WilqcZXRt66A' } },
    { id: 'fokus', name: 'Fokus', img: 'fokus', social: { instagram: 'https://www.instagram.com/fokus_official/', spotify: 'https://open.spotify.com/artist/2h2nL9Hk4GQNcFm7fYV5ck?si=NvIzzXCaQ7GcmcTD_kfJIA' } },
    { id: 'guzior', name: 'Guzior', img: 'guzior', social: { spotify: 'https://open.spotify.com/artist/7uWyXPJ04ihdQdYGGw3xVV', instagram: 'https://www.instagram.com/guziormati/', youtube: 'https://www.youtube.com/@EVILTHING' } },
    { id: 'gibbs', name: 'Gibbs', img: 'gibbs', social: { spotify: 'https://open.spotify.com/artist/1T4HxOYolAEb5PadIVKdWZ?si=pKaqc7oLT0GtU8UBqJj-Aw', instagram: 'https://www.instagram.com/mateuszgibbs/', youtube: 'https://www.youtube.com/@DopeHouseLabel' } },
    { id: 'zabson', name: 'Żabson', img: 'zabson', social: { spotify: 'https://open.spotify.com/artist/0QR764k0D36npmTMWx5bft', instagram: 'https://www.instagram.com/zabsonziomal/', youtube: 'https://www.youtube.com/@INTERNAZIOMALE' } },
    { id: 'bonus_rpk', name: 'Bonus RPK', img: 'bonus_rpk', social: { spotify: 'https://open.spotify.com/artist/2Id9v8R7pS6ZfH08n5I8Hh', instagram: 'https://www.instagram.com/bonusrpk_oficjalnie/', youtube: 'https://www.youtube.com/@CiemnaStrefa' } },
    { id: 'bialas', name: 'Białas', img: 'bialas', social: { spotify: 'https://open.spotify.com/artist/2ufQfSFDFXfMS7MEMzdGZE?si=wI5EPd32S92u8sJKEiVSug', instagram: 'https://www.instagram.com/bialas_h8me/', youtube: 'https://www.youtube.com/@sbm_label' } },
    { id: 'sentino', name: 'Sentino', img: 'sentino', social: { spotify: 'https://open.spotify.com/artist/6DAQjwwMGZ9QgqHhIkU7H0?si=p1tjH_OgSDaC-mj1t7TrNA', instagram: 'https://www.instagram.com/sentinobln/' } },
    { id: 'malik', name: 'Malik', img: 'malik', social: { spotify: 'https://open.spotify.com/artist/1Kjs5u8GQf6zCFdTj6SI9E?si=sdsw8cANQNqSZIwdfUgfdg', instagram: 'https://www.instagram.com/donmalikmontana/', youtube: 'https://www.youtube.com/@MalikMontanaOfficial' } },
    { id: 'borixon', name: 'Borixon', img: 'borixon', social: { spotify: 'https://open.spotify.com/artist/5Q5WdRs96HgbxdVIfhHqt2?si=o0PxKaWZSLmFzQyvJdRwpQ', instagram: 'https://www.instagram.com/borixon_newbadline/', youtube: 'https://www.youtube.com/@spacerlabel' } },
    { id: 'liroy', name: 'Liroy', img: 'liroy', social: { instagram: 'https://www.instagram.com/liroy_marzec/', spotify: 'https://open.spotify.com/artist/1YNJc03EgclUK2rnLX7tE5?si=qwwiIvotQ7yiRG4B5SoI3Q' } },
    { id: 'pih', name: 'Pih', img: 'pih', social: { instagram: 'https://www.instagram.com/pihszou/', spotify: 'https://open.spotify.com/artist/4x2dSjOKPB7f2S5moqNGtV?si=eYLGXij3QZWF2TNtvVJBQQ' } },
    {
        id: 'pelson', name: 'Pelson', img: 'pelson', social: {
            instagram: 'https://www.instagram.com/pelson_kontra/', spotify: 'https://open.spotify.com/artist/7KEnuKnjw3c9XH7em1lqIT?si=w1LW76bTR8qOiqls17V8mg'
        }
    },
    { id: 'mezo', name: 'MEZO', img: 'mezo', social: { instagram: 'https://www.instagram.com/jacek_mezo_mejer/', spotify: 'https://open.spotify.com/artist/4ZqkZhFSFECbgemBC6ILUC?si=fFOE0FErTBqItu4sQXlZ4Q' } },
    { id: 'vkie', name: 'VKI', img: 'vkie', social: { instagram: 'https://www.instagram.com/bigvkie/', youtube: 'https://www.youtube.com/@TheBiggestVkie', spotify: 'https://open.spotify.com/artist/3DPog7Ux8hRgsTWdlFDl7v?si=H8AYwZz3SjWu3uUZ5W4Kqg' } },
    { id: 'ero', name: 'Ero', img: 'ero', social: { instagram: 'https://www.instagram.com/erosick1/', youtube: 'https://www.youtube.com/@Ero_JWP', spotify: 'https://open.spotify.com/artist/5DM2lp5yxLNjwHPmFGcFqr?si=xbK6PaJXTumE_4fLJvFKvw' } },
    { id: 'bisz', name: 'Bisz', img: 'bisz', social: { instagram: 'https://www.instagram.com/bisz_official/', youtube: 'https://www.youtube.com/user/pchamytensyfpl', spotify: 'https://open.spotify.com/artist/4PpHZwqxdYMMnLkYJ83vUJ?si=g6Fs-JY4TTqXZz4njyTc0Q' } },
    { id: 'abradab', name: 'Abradab', img: 'abradab', social: { instagram: 'https://www.instagram.com/abradab_44/', spotify: 'https://open.spotify.com/artist/0wip5D37aCfjuD39Pmbp1q?si=Sg7nf9goS4So7HnKFDnR0w' } },
    { id: 'slon', name: 'Słoń', img: 'slon', social: { instagram: 'https://www.instagram.com/braindeadslon/', youtube: 'https://www.youtube.com/@BrainDeadSlon', spotify: 'https://open.spotify.com/artist/0wm6v5GU6VbR1wtsm0YiTV?si=HEe5bHweT3Cp2ngfDCZNVg' } },
    { id: 'miuosh', name: 'Miuosh', img: 'miuosh', social: { instagram: 'https://www.instagram.com/miuosh/', spotify: 'https://open.spotify.com/artist/3BroLrMp9Q01yOnhLn9qxX?si=aOFuFwToR-6seNpdg-yP-A' } },
    { id: 'fisz', name: 'Fisz', img: 'fisz', social: { instagram: 'https://www.instagram.com/fisz_emade_official/', spotify: 'https://open.spotify.com/artist/0YYxsW13yGiA2e80fu4VIA?si=VUoDc0seSOKhSt5bLNOoRw' } },
    { id: 'avi', name: 'AVI', img: 'avi', social: { instagram: 'https://www.instagram.com/avi_sycylijczyk/', spotify: 'https://open.spotify.com/artist/5NmRijhUHZnaADekOLcOyl?si=CDywPGXBTeifaezrro9geA' } },
    { id: 'reto', name: 'ReTo', img: 'reto', social: { spotify: 'https://open.spotify.com/artist/6QfFTZJHFSe9Xyes6DkAli?si=tp-3AUs3Rm6_ksPhWVqQ9gE', instagram: 'https://www.instagram.com/reto_syn_andrzeja/', } },
    { id: 'sobel', name: 'Sobel', img: 'sobel', social: { spotify: 'https://open.spotify.com/artist/56VhOZOF6hwqrbNYwkmcsH?si=kFDPHOJARQizUaJPTB5Qww', instagram: 'https://www.instagram.com/szymonsobel/' } },
    { id: 'otsochodzi', name: 'Otsochodzi', img: 'otsochodzi', social: { spotify: 'https://open.spotify.com/artist/4zvO09rVUIVTeALhs6xLoB?si=LPOBCfggRhW2MgR3XJiUtA', instagram: 'https://www.instagram.com/otsochodzi/' } },
    { id: 'bonson', name: 'BonSon', img: 'bonson', social: { instagram: 'https://www.instagram.com/bonsonsbejbi/', spotify: 'https://open.spotify.com/artist/2kJ63OVxHAPMMu0AfKa22d?si=MMDLC3WrQEqleAFBOdmCQA' } },
    { id: 'kozik', name: 'Oki', img: 'oki', social: { spotify: 'https://open.spotify.com/artist/1oxn6cQ37twQ7yGnlE3ETd?si=uyiFf7KDQbe2K3hkWywn1Q', instagram: 'https://www.instagram.com/spietadresiara/' } },
    { id: 'chivas', name: 'Chivas', img: 'chivas', social: { instagram: 'https://www.instagram.com/_chivas_042_/', youtube: 'https://www.youtube.com/channel/UCcrFx-FV2T521aOggKyGuiQ', spotify: 'https://open.spotify.com/artist/1fZAAHNWdSM5gqbi9o5iEA?si=fBgR6ofUSFeQ0qO80jQceA' } },
    { id: 'bambi', name: 'Bambi', img: 'bambi', social: { instagram: 'https://www.instagram.com/bambi.ofc/', spotify: 'https://open.spotify.com/artist/5ic8bWWvZHWf0dDBi9ThNk?si=jPku7isaQiOpUmlAq9hkJg' } },
    { id: 'intruz', name: 'Intruz', img: 'intruz', social: { instagram: 'https://www.instagram.com/intruzik_opole/', youtube: 'https://www.youtube.com/@intruz_opole', spotify: 'https://open.spotify.com/artist/2FTm53gPBRcAedc1rIFYn8?si=SyYmL9DvS7ay_Nyx3BCF4A' } },
    { id: 'koras', name: 'Koras', img: 'koras', social: { instagram: 'https://www.instagram.com/koras_zip/', spotify: 'https://open.spotify.com/artist/1Q8oXY9a2XWdL8fBcOBuR7?si=9jtQJ-qjRzqXNNPcTtIWuQ' } },
    { id: 'rado', name: 'Rado Radosny', img: 'rado_radosny', social: { instagram: 'https://www.instagram.com/dwaslawy/', youtube: 'https://www.youtube.com/@dwaslawy', spotify: 'https://open.spotify.com/artist/1CEONobXawu0XPgPhgTD5a?si=Kby5N9yUQASObsGvvtY_Jw' } },
    // Rest of Underground
    { id: 'adi_nowak', name: 'Adi Nowak', img: 'adi_nowak', social: { instagram: 'https://www.instagram.com/adi_nowak/', youtube: 'https://www.youtube.com/@adinowaking', spotify: 'https://open.spotify.com/artist/2TyQ1OI79kcdS0CLsNb3Ax?si=ilnbl8-2SBabFXVGNmVHow' } },
    { id: 'adma', name: 'Adma', img: 'adma', social: { instagram: 'https://www.instagram.com/adma_exorientelux/', youtube: 'https://www.youtube.com/@AdMaMusic', spotify: 'https://open.spotify.com/artist/1xTIcf4zbJmtd9FTD8UFXj?si=aV7-icnGTKqZANzzFkU1bg' } },
    { id: 'arab', name: 'Arab', img: 'arab', social: { instagram: 'https://www.instagram.com/gabrys_arabski/', spotify: 'https://open.spotify.com/artist/6duZcnErFKn6m2kGyCAVhY?si=jhodyqJfRjyhgYR3aQ32PA' } },
    { id: 'astek', name: 'Astek', img: 'astek', social: { instagram: 'https://www.instagram.com/dwaslawy/', youtube: 'https://www.youtube.com/@dwaslawy', spotify: 'https://open.spotify.com/artist/1CEONobXawu0XPgPhgTD5a?si=Kby5N9yUQASObsGvvtY_Jw' } },
    { id: 'atutowy', name: 'Atutowy', img: 'atutowy', social: { instagram: 'https://www.instagram.com/atutowy/', spotify: 'https://open.spotify.com/artist/53UpeT3katrOaJmhSiRp2a?si=tx590nDCSzG43FQPIUsG3Q' } },
    { id: 'bardal', name: 'Bardal', img: 'bardal', social: { spotify: 'https://open.spotify.com/artist/7G7Cn1swPVhPV4V3PNNXP1?si=CPaQpoKRQLOZ1HeAHl4dbA', instagram: 'https://www.instagram.com/ruwbabicze/', youtube: 'https://www.youtube.com/@polskaniegotowa' } },
    { id: 'belmondo', name: 'Belmondo', img: 'belmondo', social: { spotify: 'https://open.spotify.com/artist/41OErJWZbkNcNzYPoy0PWJ?si=tZuyYJ-aTu6aLb8m8htjmg', instagram: 'https://www.instagram.com/belmondawg', } },
    { id: 'biak', name: 'Biak', img: 'biak', social: { spotify: 'https://open.spotify.com/artist/6TgOhsXlg8Lnh2ZuQtSNFf?si=78MXtidqQYuKMgl_APHVag', instagram: 'https://www.instagram.com/nieodbieramtelefonow/', } },
    { id: 'bilon', name: 'Bilon', img: 'bilon', social: { instagram: 'https://www.instagram.com/bilon_hempg/', youtube: 'https://www.youtube.com/@DIILTV', spotify: 'https://open.spotify.com/artist/73H8JOCla1oYmdXbGoURAr?si=b6XcYLvmSCWy5hUxWdvxOA' } },
    { id: 'blacha', name: 'Blacha', img: 'blacha_2115', social: { instagram: 'https://www.instagram.com/blacha_2115/', spotify: 'https://open.spotify.com/artist/71tiWMKZ5wpl6E0BdwVQza?si=ePpcAQarTv6kZ4C1iQIbUQ' } },
    { id: 'kabe', name: 'Kabe', img: 'kabe', social: { spotify: 'https://open.spotify.com/artist/4Q3xLVaD2uBZGVxmCYuSkt?si=q4jox8shSv6C9HQ4G7QVXw', instagram: 'https://www.instagram.com/kabe.gcbw/', youtube: 'https://www.youtube.com/@gcbwofficial/videos' } },
    { id: 'bosski', name: 'Bosski Roman', img: 'bosski_roman', social: { instagram: 'https://www.instagram.com/bosskiroman/', youtube: 'https://www.youtube.com/user/BosskiRomanFirma', spotify: 'https://open.spotify.com/artist/040SDzfzE2xQL8HKkBja92?si=bQlKaL8jRLK6Nlxpz3X2BQ' } },
    { id: 'catchup', name: 'Catchup', img: 'catchup', social: { instagram: 'https://www.instagram.com/catchupxxl/', youtube: 'https://www.youtube.com/@TomSchklaneck', spotify: 'https://open.spotify.com/search/Catchup' } },
    { id: 'cielog', name: 'Cielog', img: 'cielog', social: { spotify: 'https://open.spotify.com/artist/2KDDRiSQUC2X5Mb9j0Y2G6?si=uSOYQUBHQMCnlgz7Pm52sw', instagram: 'https://www.instagram.com/cielog_cm3/', youtube: '' } },
    { id: 'dawid_szynol', name: 'Dawid Szynol', img: 'dawid_szynol', social: {} },
    { id: 'dizkret', name: 'Dizkret', img: 'dizkret', social: { spotify: 'https://open.spotify.com/artist/5r7hanNIrLe99HTjW5ksF5?si=RIE5zJb_QH6sHD7AVe5yMg', instagram: 'https://www.instagram.com/dizkret', youtube: '' } },
    { id: 'dziarma', name: 'Dziarma', img: 'dziarma', social: { instagram: 'https://www.instagram.com/dziarmadziarma/', youtube: 'https://www.youtube.com/@dziarmaofficial', spotify: 'https://open.spotify.com/artist/6LwJ1zgqEFyIwXzDD44Qsn?si=jlhWtyGDQAiKmUh62dEFHQ' } },
    { id: 'eripe', name: 'Eripe', img: 'eripe', social: { youtube: 'https://www.youtube.com/@patokalipsa', spotify: 'https://open.spotify.com/artist/2E2h76dKcZsiyHgrQqEeyL?si=1I0zWYF6Q86_eMrwYtXlLQ' } },
    { id: 'erking', name: 'Erking', img: 'erking', social: { spotify: 'https://open.spotify.com/artist/0xDJAQAgs6MNwGhEok9vt6?si=LOCpDNe_S-aHxxZaCW7f0Q', instagram: 'https://www.instagram.com/mr_erking/', youtube: '' } },
    { id: 'fagata', name: 'Fagata', img: 'fagata', social: { instagram: 'https://www.instagram.com/fagataaa/', spotify: 'https://open.spotify.com/artist/0zzP72k8pbLySGH1TPUZW8?si=ifCh4ZkuS9-j9WP2ozGUUw' } },
    { id: 'flexxy', name: 'Flexxy', img: 'flexxy_2115', social: { instagram: 'https://www.instagram.com/flexxy2115/', spotify: 'https://open.spotify.com/artist/56znIsN2NyCMzIctR2xknQ?si=yuqzSHuiTOGpH_nmsWLJVA' } },
    { id: 'frosti', name: 'Frosti Rege', img: 'frosti', social: { instagram: 'https://www.instagram.com/frostirege/', spotify: 'https://open.spotify.com/artist/1gy83FHMv1GVuqYu3sxYxY?si=sA9puEZaTk2nWY4iN3WiNw' } },
    { id: 'fu', name: 'Fu', img: 'fu', social: { instagram: 'https://www.instagram.com/fu_official/', spotify: 'https://open.spotify.com/artist/1YndPrAiVJTC3YmvExp4WR?si=VVPi3KEXTOiEvMRyA6ED3Q' } },
    { id: 'gospel', name: 'Gospel', img: 'gospel', social: { instagram: 'https://www.instagram.com/gospelgos/', youtube: 'https://www.youtube.com/@polipy44' } },
    { id: 'gsp', name: 'GSP', img: 'gsp', social: { spotify: 'https://open.spotify.com/artist/6G3dmv5rpN2KpMyPdU0tOn?si=hcKWvg13Rv-KPK6mB706Uw', instagram: 'https://www.instagram.com/gun_d_the_mahatma/', youtube: '' } },
    { id: 'gural', name: 'Gural', img: 'gural', social: { instagram: 'https://www.instagram.com/djdziadzior/', spotify: 'https://open.spotify.com/artist/7kaEEK2cQh07aEfEEBd4Hn?si=GwDSeyHnTzGExe7VscFgxg' } },
    { id: 'indeb', name: 'Indeb', img: 'indeb', social: { instagram: 'https://www.instagram.com/i.n.d.e.b/', spotify: 'https://open.spotify.com/artist/6Nlyt1MUEBe1jN0h7F4hn0?si=bTt5DAe0RUirn6YkJAejbw' } },
    { id: 'jan_rapowanie', name: 'Jan Rapowanie', img: 'jan_rapowanie', social: { instagram: 'https://www.instagram.com/janekoficjalnie/', spotify: 'https://open.spotify.com/artist/43yekIowVCHkR6TGGg9gSp?si=Hdo_R5oqQsWd64u7Z8vL8w' } },
    { id: 'jedker', name: 'Jedker', img: 'jedker', social: { instagram: 'https://www.instagram.com/jedker_aka_jd/', youtube: 'https://www.youtube.com/@Jedker_Official', spotify: 'https://open.spotify.com/artist/4gAAZZN7ZC7WrExFPXg8yT?si=TDHGDsB5QouEZkaCQ9f7sQ' } },
    { id: 'juras', name: 'Juras', img: 'juras', social: { instagram: 'https://www.instagram.com/jurekwronski/', spotify: 'https://open.spotify.com/artist/1FWpxJCnMdG6w35UZSDcsm?si=jiwK_CgqSgmz3T30yW79fA' } },
    { id: 'kaczor', name: 'Kaczor', img: 'kaczor', social: { instagram: 'https://www.instagram.com/kaczorboss/', spotify: 'https://open.spotify.com/artist/6WIjuTnfwFnp9GAU8dIMrU?si=1vG0rxR7QUSuMU74Xe82sQ' } },
    { id: 'kafar', name: 'Kafar Dixon37', img: 'kafar_dixon37', social: { instagram: 'https://www.instagram.com/kafar_dixon37/', spotify: 'https://open.spotify.com/artist/2uDAvSGVgVBeuTLNzCgm54?si=Y4Jb4B7sTPOy68hj02qg1Q' } },
    { id: 'kara', name: 'Kara', img: 'kara', social: { instagram: 'https://www.instagram.com/kara_official_yo/', youtube: 'https://www.youtube.com/@KARAKRK-f7g', spotify: 'https://open.spotify.com/artist/3BirXmy3kNcWZZkbpjeP2C?si=4J93wax2QgaU_Rg9NpXgJg' } },
    { id: 'kazek', name: 'KAZ', img: 'kazek', social: { instagram: 'https://www.instagram.com/be_do_gie_official/', spotify: 'https://open.spotify.com/artist/2GzZAv52VCMdVli7QzkteT?si=1_kqDMm0QA2DQoZWDLylHQ' } },
    { id: 'keke', name: 'Kękę', img: 'keke', social: { instagram: 'https://www.instagram.com/kekeoficjalnie/', spotify: 'https://open.spotify.com/artist/11ohMXkA2KIq5F1DoWH2jj?si=RoGuS7LWT42QSU3tq1l2OA', youtube: 'https://www.youtube.com/@TakieRzeczyLabel' } },
    { id: 'krzy', name: 'Krży Krzysztof', img: 'krzy_krzysztof', social: { instagram: 'https://www.instagram.com/krzy.krzysztof/', youtube: 'https://www.youtube.com/@KrzyKrzysztof' } },
    { id: 'kuban', name: 'Kuban', img: 'kuban', social: { instagram: 'https://www.instagram.com/kubanofficial/', youtube: 'https://www.youtube.com/@KubanXD', spotify: 'https://open.spotify.com/artist/2RIWb22QZmud0Ik6Ad7dS1?si=qmZAHhuEQrO4xvFwFTb0OQ' } },
    { id: 'kubanczyk', name: 'Kubańczyk', img: 'kubanczyk', social: { instagram: 'https://www.instagram.com/kubanczyk.official/', spotify: 'https://open.spotify.com/artist/76Uu7lnLuTOmH2eZsKZTan?si=P7-mbtbOT5qaqndGhnGwCQ' } },
    { id: 'kuqe', name: 'Kuqe', img: 'kuqe_2115', social: { instagram: 'https://www.instagram.com/kuqe2115/', spotify: 'https://open.spotify.com/artist/2FtYzWBUVhZ2vfy8S207Zf?si=RjzXkKzaQRiCOKtAA8Q_Lw', youtube: 'https://www.youtube.com/@2115', } },
    { id: 'laikike1', name: 'Laikike1', img: 'laikike1', social: { spotify: 'https://open.spotify.com/artist/4EqxNZ4CPKBBJ9sG1O5YS3?si=ZckK9ZCqQT6hwMrMYPTFNQ' } },
    { id: 'lajzol', name: 'Lajzol', img: 'lajzol', social: { instagram: 'https://www.instagram.com/lajzol/', spotify: 'https://open.spotify.com/artist/1nwcBZHeNpgC6OnXGl3wEz?si=obR13_byS8SnTOVgMzPNTA' } },
    { id: 'lech', name: 'Lech Roch Pawlak', img: 'lech_roch_pawlak', social: { spotify: 'https://open.spotify.com/search/Lech%20Roch%20Pawlak', instagram: '', youtube: '' } },
    { id: 'livka', name: 'Livka', img: 'livka', social: { instagram: 'https://www.instagram.com/jestemlivka/', spotify: 'https://open.spotify.com/artist/0eWYWLizN5us1MOF1rdyh9?si=I3GfBFMMT0yN6Nzwmg6mqQ' } },
    { id: 'lj_karwel', name: 'LJ Karwel', img: 'lj_karwel', social: { instagram: 'https://www.instagram.com/lj_karwel/', spotify: 'https://open.spotify.com/artist/6RQXRtqg3ybLOOOZ7so1FY?si=q4uaq8l-SreX9UvuDzuuDA' } },
    { id: 'lona', name: 'Lona', img: 'lona', social: { spotify: 'https://open.spotify.com/artist/6YpCzWpIXRTdLlpPgDcMJZ?si=DINYcEVERyuaWHubgO2MLg', instagram: 'https://www.instagram.com/lona_szn/', youtube: '' } },
    { id: 'louis_v', name: 'Louis V', img: 'louis_v', social: { spotify: 'https://open.spotify.com/artist/5k96hVqrpJoo0zmlVggVzv?si=6BsuA3A4T3qKEjkL1iWpWA', instagram: 'https://www.instagram.com/louis_villain/', youtube: 'https://www.youtube.com/@MoyaLabel' } },
    { id: 'malpa', name: 'Małpa', img: 'malpa', social: { instagram: 'https://www.instagram.com/lukasz_malpa_malkiewicz/', spotify: 'https://open.spotify.com/artist/4Oy0tTQfhCKKaBPkQJhZHK?si=UtVwlAb-TMKF-ItCDXPYKw' } },
    { id: 'mielzky', name: 'Mielzky', img: 'mielzky', social: { spotify: 'https://open.spotify.com/artist/6f3oixxZSgRKOW2CSqOFqM?si=yVyaBAtGQl66iZ0Fte3-aA', instagram: 'https://www.instagram.com/iammielzky/', kick: 'https://kick.com/iammielzky', youtube: 'https://www.youtube.com/@iammielzky' } },
    { id: 'og_olgierd', name: 'OG Olgierd', img: 'og_olgierd', social: { instagram: 'https://www.instagram.com/og_olgierd/', spotify: 'https://open.spotify.com/artist/1tWY5EJcOod5ZhW3Lwg9D3?si=rWMpnuHaSquh4rdy2tN84A' } },
    { id: 'okon', name: 'Okoń', img: 'okon_pzw', social: { instagram: 'https://www.instagram.com/ruwbabicze/', youtube: 'https://www.youtube.com/@POLSKANIEGOTOWA', spotify: 'https://open.spotify.com/artist/0hpE3BfytlNZdaqaWJ0cEy?si=ffLs4ZNnQJeMAfUWQ6F7nQ' } },
    { id: 'opal', name: 'Opal', img: 'opal', social: { spotify: 'https://open.spotify.com/artist/28WXX79U4jzq1kfjx5QXPy?si=-S-XgXJKSKKGQe_KGCkNQA', instagram: 'https://www.instagram.com/opalclown', youtube: '' } },
    { id: 'oskar', name: 'Oskar', img: 'oskar', social: { instagram: 'https://www.instagram.com/oskaaa83/', youtube: 'https://www.youtube.com/@PRO8L3M', spotify: 'https://open.spotify.com/artist/7v49oVVUhvIQG5EK0jkcF7?si=QUHaj6T3QfiKfqDbempt7A' } },
    { id: 'pers', name: 'Pers', img: 'pers', social: { instagram: 'https://www.instagram.com/codziennieinnymarcel/', spotify: 'https://open.spotify.com/artist/6C3KMofGcxnVUqmg8jPgp4?si=cThvi-voSFCE8h9TAghcyA' } },
    { id: 'planet_anm', name: 'Planet ANM', img: 'planet_anm', social: { spotify: 'https://open.spotify.com/artist/3uGlyGgYrMUAvqTSR8132Q?si=1eUK0-2pRvibyy3XdnKaPw', instagram: 'https://www.instagram.com/planetanm/', youtube: '' } },
    { id: 'pyskaty', name: 'Pyskaty', img: 'pyskaty', social: { spotify: 'https://open.spotify.com/artist/1uHMNXVaAUGxl23xsBWzTA?si=AL42LOfNS_SFpB5-kdToeQ', instagram: 'https://www.instagram.com/pyskwpysk/', youtube: '' } },
    {
        id: 'ras', name: 'RAS', img: 'ras', social: {
            spotify: 'https://open.spotify.com/artist/5qgCrzMzASs1YpEMSp7tGt?si=AA6VG9_URjqY-QQxNvZ38A', instagram: 'https://www.instagram.com/ras_rsmt/'
        }
    },
    { id: 'schafter', name: 'Schafter', img: 'schafter', social: { instagram: 'https://www.instagram.com/restaurant_posse/', spotify: 'https://open.spotify.com/artist/2aDaFARm4U9hf5DI9Fhbnh?si=1ux84gBOSM-f8lYhXf0Dog' } },
    { id: 'shhieda', name: 'Shhieda', img: 'shhieda', social: { instagram: 'https://www.instagram.com/shhiedae/', spotify: 'https://open.spotify.com/artist/3SmlmvX2qQzGJDn2QZkMFW?si=O3AdGBMRTR2b9lVq2kWjCA' } },
    { id: 'sitek', name: 'Sitek', img: 'sitek', social: { instagram: 'https://www.instagram.com/sitekofficial_/', spotify: 'https://open.spotify.com/album/01JxaHYHAEJ67rSdJVlkj4?si=WNPs34w2QSqlmL30dmsExQ' } },
    { id: 'smarki', name: 'Smarki Smark', img: 'smarki_smark', social: { youtube: 'https://www.youtube.com/watch?v=6T-sVamsbLs&list=RD6T-sVamsbLs&start_radio=1' } },
    { id: 'ten_typ_mes', name: 'Ten Typ Mes', img: 'ten_typ_mes', social: { instagram: 'https://www.instagram.com/mestentyp/', youtube: 'https://www.youtube.com/@mestentyp', spotify: 'https://open.spotify.com/artist/3AU8FAva0w5qdrf5IVu620?si=UDEKGD16SomyVekaCSYdHg' } },
    { id: 'tetris', name: 'Tetris', img: 'tetris', social: { instagram: 'https://www.instagram.com/tetmusic/', spotify: 'https://open.spotify.com/artist/10iF348LBI6gOnLue1qnG5?si=LLWZq8idSZCFN5CGeLyjSw' } },
    { id: 'vbs', name: 'VBS', img: 'vbs', social: { instagram: 'https://www.instagram.com/vbsik/', youtube: 'https://www.youtube.com/channel/UCpz8wNJZ67YjEiFGlZhxIyw', spotify: 'https://open.spotify.com/artist/6dLmkDJ0rahtzUgcpUyxGQ?si=MyaeGvVDRmuwJk3CyaFqqQ' } },
    { id: 'vienio', name: 'Vienio', img: 'vienio', social: { instagram: 'https://www.instagram.com/piotrvienio/', spotify: 'https://open.spotify.com/artist/7wFpB8b5ALTKo9IwK3Y5Tq?si=wr_vC8vwRKefBu78SbP1Tw' } },
    { id: 'vnm', name: 'VNM', img: 'vnm', social: { instagram: 'https://www.instagram.com/fau_enem/', spotify: 'https://open.spotify.com/artist/5mlPiCqcoz6pDrRj90xbJ2?si=EIRJmlZVS9unci7JA6eYag' } },
    { id: 'wena', name: 'Wena', img: 'wena', social: { instagram: 'https://www.instagram.com/wudoe/', youtube: 'https://www.youtube.com/@Wudoe', spotify: 'https://open.spotify.com/artist/183C4P5B8pmW1zmI4himpF?si=Dpzq0njqQ5CZyDGbryz4-Q' } },
    { id: 'wilku', name: 'Wilku', img: 'wilku', social: { instagram: 'https://www.instagram.com/wdzone/', spotify: 'https://open.spotify.com/artist/2W0PvL5xnsP59i2dgTkRF2?si=QnOqzVeyRiiaffB077VNgQ' } },
    { id: 'jan_rapowanie', name: 'Jan-Rapowanie', img: 'jan_rapowanie', social: { spotify: 'https://open.spotify.com/artist/43yekIowVCHkR6TGGg9gSp?si=KMwkTwEdS-etNVEbRF0lVA', instagram: 'https://www.instagram.com/janekoficjalnie/', youtube: 'https://www.youtube.com/@JanRapowanie' } },
    { id: 'wlodi', name: 'Włodi', img: 'wlodi', social: { instagram: 'https://www.instagram.com/wlodi_osad/', spotify: 'https://open.spotify.com/artist/2FBmYj55zZwng9GlsCCn9j?si=VgnwmhWHTwKtMWRPZzKERg' } },
    { id: 'zyto', name: 'Żyto', img: 'zyto', social: { instagram: 'https://www.instagram.com/michalzytniak/', youtube: 'https://www.youtube.com/@ZytoJinksiarz', spotify: 'https://open.spotify.com/artist/1Rekrd5mODb3KCUUEoOVnc?si=Eq-k_23TS2CjKp6P6enjxg' } },
    { id: 'mrozu', name: 'Mrozu', img: 'mrozu', social: { instagram: 'https://www.instagram.com/mrozu_/', youtube: 'https://www.youtube.com/@MrozuMusic', spotify: 'https://open.spotify.com/artist/5QWz0kPELXKHSiINe7mFjX?si=MXmfXDiZTAS7ypdrp67q0Q' } },
    { id: 'mily_atz', name: 'Miły ATZ', img: 'mily_atz', social: { instagram: 'https://www.instagram.com/___atz/', youtube: 'https://www.youtube.com/@Mily_ATZ', spotify: 'https://open.spotify.com/artist/1PKW5LFWjU0jJGK2dYS1IE?si=XmpUCzM8TOmOTrMXf7RGdw' } },
    { id: 'fukaj', name: 'Fukaj', img: 'fukaj', social: { instagram: 'https://www.instagram.com/fukajot/', spotify: 'https://open.spotify.com/artist/3bS0MLzGAoO6lLUy7gguHY?si=L10LL-qkTFmeCja0VJUotw' } },
    { id: '2sty', name: '2sty', img: '2sty', social: { instagram: 'https://www.instagram.com/2styk0t/', youtube: 'https://www.youtube.com/@2stykot', spotify: 'https://open.spotify.com/artist/51l0iMcifP7Eir4XYHiVKX?si=cvP4JFuhTyiE3-8N3_Clzg' } },
    { id: 'janusz_walczuk', name: 'Janusz Walczuk', img: 'janusz_walczuk', social: { instagram: 'https://www.instagram.com/januszwalczuk/', youtube: 'https://www.youtube.com/@JNWalczuk', spotify: 'https://open.spotify.com/artist/44FnIf8PhG6EQRIoENsXu3?si=rgdyObhZSI2imDV0e0X-iA' } },
    { id: 'hans_52debiec', name: 'Hans 52Dębiec', img: 'hans_52debiec', social: { instagram: 'https://www.instagram.com/hans52debiec/', youtube: 'https://www.youtube.com/@PiecDwa', spotify: 'https://open.spotify.com/artist/2us3I6vBlyMnrTztfFBaEl?si=Lswj68dfQjuFBUlWDoXlHg' } },
    { id: 'eis', name: 'Eis', img: 'eis', social: { spotify: 'https://open.spotify.com/search/Eis' } },
    { id: 'kabe', name: 'Kabe', img: 'kabe', social: { instagram: 'https://www.instagram.com/kabe.gcbw/', spotify: 'https://open.spotify.com/artist/4Q3xLVaD2uBZGVxmCYuSkt?si=vTNv-BFzTZCrZM-HIhbU_w' } },
    { id: 'malolat', name: 'Małolat', img: 'malolat', social: { instagram: 'https://www.instagram.com/malolat_official/', youtube: 'https://www.youtube.com/@malolat_official', spotify: 'https://open.spotify.com/artist/4OKOsK6RUI0hFfxEXjt1kH?si=qAqQvzcwTheVUckvFEUsqQ' } },
    { id: 'emas', name: 'Emas', img: 'emas', social: { spotify: 'https://open.spotify.com/artist/3zCQzAHbiIh0hIGzKd1zn0?si=pBfOeF8kSJSfVbDjpmF67g', instagram: 'https://www.instagram.com/emdoas/' } },
    { id: 'deobson', name: 'Deobson', img: 'deobson', social: { instagram: 'https://www.instagram.com/deobson_/', spotify: 'https://open.spotify.com/artist/2UhbevgZSPu3v5FO4yw3Eo?si=ficMU3sCSx-nInrS67qWKw' } },
    { id: 'kosi', name: 'Kosi', img: 'kosi', social: { spotify: 'https://open.spotify.com/artist/2PlWtRtsOofohkow3Ht1Co?si=ZqqHu8aPTiafEBoLGR33DQ' } },
    { id: 'wojek', name: 'Wojek', img: 'wojek', social: { instagram: 'https://www.instagram.com/wojek_b24/', youtube: 'https://www.youtube.com/@BIGWOJEK' } },
    { id: 'oliwka_brazil', name: 'Oliwka Brazil', img: 'oliwka_brazil', social: { instagram: 'https://www.instagram.com/oliwka_brazil/', youtube: 'https://www.youtube.com/@oliwka_brazil', spotify: 'https://open.spotify.com/artist/7HhC70MoKQYjd2lnF5Znhs?si=-alp7N3cQ829DbEpUdEq7w' } },
    { id: 'matheo', name: 'Matheo', img: 'matheo', social: { instagram: 'https://www.instagram.com/officialmatheo', youtube: 'https://www.youtube.com/@MatheoProductions', spotify: 'https://open.spotify.com/search/Matheo' } },
    { id: 'zeppy_zep', name: 'Zeppy Zep', img: 'zeppy_zep', social: { spotify: 'https://open.spotify.com/search/Zeppy%20Zep', instagram: 'https://www.instagram.com/zeppyzep', youtube: 'https://www.youtube.com/@zeppyzep' } },
    { id: 'waima', name: 'Waima', img: 'waima', social: { instagram: 'https://www.instagram.com/waimaziomaleo/', youtube: 'https://www.youtube.com/@waimaziomaleo', spotify: 'https://open.spotify.com/artist/1gfxO9EsNea8tyDzrHexdp?si=AKNHKoVSQGu6E907GVDrrA' } },
    { id: 'juras_mma', name: 'Juras MMA', img: 'juras_mma', social: { instagram: 'https://www.instagram.com/jurasmma/', } },
    { id: 'stasiak', name: 'Stasiak', img: 'stasiak', social: { spotify: 'https://open.spotify.com/artist/2L8LlTCi1oFZCEhPgonJmq?si=hdqk--m1QHWhqzenmbBgPA', instagram: 'https://www.instagram.com/stasiaklukasz/', } }
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
