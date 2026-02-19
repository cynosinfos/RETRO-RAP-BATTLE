// Achievement Tiers
const ACHIEVEMENT_TIERS = {
    BRONZE: { name: 'BRONZE', color: '#cd7f32', points: 10 },
    SILVER: { name: 'SILVER', color: '#c0c0c0', points: 25 },
    GOLD: { name: 'GOLD', color: '#ffd700', points: 50 },
    PLATINUM: { name: 'PLATINUM', color: '#e5e4e2', points: 100 },
    DIAMOND: { name: 'DIAMOND', color: '#b9f2ff', points: 250 }
};

// Achievement Categories
const ACHIEVEMENT_CATEGORIES = {
    CARDS: { name: 'KARTY', icon: '🎴', color: '#ff00ff' },
    PACKS: { name: 'PACZKI', icon: '📦', color: '#00ff00' },
    FIGHTS: { name: 'WALKI', icon: '⚔️', color: '#ff0055' },
    ECONOMY: { name: 'EKONOMIA', icon: '💰', color: '#ffaa00' },
    COLLECTION: { name: 'KOLEKCJA', icon: '🏆', color: '#9933ff' },
    SKILL: { name: 'SKILL', icon: '🎯', color: '#00ffff' },
    PROGRESS: { name: 'POSTEP', icon: '🌆', color: '#ffff00' },
    SOCIAL: { name: 'SPOLECZNOSC', icon: '📱', color: '#00ccff' },
    SECRETS: { name: 'SEKRETY', icon: '🔒', color: '#888888' }
};

// Complete Achievements Database (200 total)
const ACHIEVEMENTS_DATABASE = [
    // 🎴 KARTY (30 achievements)
    { id: 'first_card', name: 'Pierwsza Karta', desc: 'Zdobadz swoja pierwsza karte', cat: 'CARDS', tier: 'BRONZE', req: { type: 'cards_owned', val: 1 }, reward: { mk: 100 }, icon: '🎴' },
    { id: 'collector_10', name: 'Kolekcjoner', desc: 'Zbierz 10 kart', cat: 'CARDS', tier: 'BRONZE', req: { type: 'cards_owned', val: 10 }, reward: { mk: 500 }, icon: '📚' },
    { id: 'collector_25', name: 'Entuzjasta', desc: 'Zbierz 25 kart', cat: 'CARDS', tier: 'SILVER', req: { type: 'cards_owned', val: 25 }, reward: { mk: 1000 }, icon: '📚' },
    { id: 'collector_50', name: 'Pasjonat', desc: 'Zbierz 50 kart', cat: 'CARDS', tier: 'SILVER', req: { type: 'cards_owned', val: 50 }, reward: { mk: 2500, pack: 'STREET' }, icon: '📚' },
    { id: 'collector_100', name: 'Ekspert', desc: 'Zbierz 100 kart', cat: 'CARDS', tier: 'GOLD', req: { type: 'cards_owned', val: 100 }, reward: { mk: 5000, pack: 'STUDIO' }, icon: '📚' },
    { id: 'collector_150', name: 'Mistrz', desc: 'Zbierz 150 kart', cat: 'CARDS', tier: 'PLATINUM', req: { type: 'cards_owned', val: 150 }, reward: { mk: 10000, pack: 'PLATINUM' }, icon: '📚' },
    { id: 'completionist', name: 'Kompletny Zbior', desc: 'Zbierz minimum 800 kart', cat: 'CARDS', tier: 'DIAMOND', req: { type: 'cards_owned', val: 800 }, reward: { mk: 50000 }, icon: '💎' },

    { id: 'underground_10', name: 'Underground', desc: 'Zbierz 10 kart UNDERGROUND', cat: 'CARDS', tier: 'BRONZE', req: { type: 'tier_cards', tier: 'UNDERGROUND', val: 10 }, reward: { mk: 300 }, icon: '🎤' },
    { id: 'mainstream_5', name: 'Mainstream', desc: 'Zbierz 5 kart MAINSTREAM', cat: 'CARDS', tier: 'SILVER', req: { type: 'tier_cards', tier: 'MAINSTREAM', val: 5 }, reward: { mk: 750 }, icon: '📻' },
    { id: 'star_3', name: 'Gwiazda', desc: 'Zbierz 3 karty STAR', cat: 'CARDS', tier: 'GOLD', req: { type: 'tier_cards', tier: 'STAR', val: 3 }, reward: { mk: 1500 }, icon: '⭐' },
    { id: 'icon_1', name: 'Ikona', desc: 'Zdobadz karte ICON', cat: 'CARDS', tier: 'GOLD', req: { type: 'tier_cards', tier: 'ICON', val: 1 }, reward: { mk: 2000 }, icon: '👑' },
    { id: 'goat_1', name: 'G.O.A.T.', desc: 'Zdobadz karte G.O.A.T.', cat: 'CARDS', tier: 'PLATINUM', req: { type: 'tier_cards', tier: 'GOAT', val: 1 }, reward: { mk: 5000 }, icon: '🐐' },

    { id: 'duplicate_5', name: '5x Duplikat', desc: 'Zdobadz 5 kopii tej samej karty', cat: 'CARDS', tier: 'SILVER', req: { type: 'max_duplicates', val: 5 }, reward: { mk: 1000 }, icon: '🔄' },
    { id: 'duplicate_10', name: '10x Duplikat', desc: 'Zdobadz 10 kopii tej samej karty', cat: 'CARDS', tier: 'GOLD', req: { type: 'max_duplicates', val: 10 }, reward: { mk: 2500 }, icon: '🔄' },
    { id: 'duplicate_25', name: '25x Duplikat', desc: 'Zdobadz 25 kopii tej samej karty', cat: 'CARDS', tier: 'PLATINUM', req: { type: 'max_duplicates', val: 25 }, reward: { mk: 10000 }, icon: '🔄' },

    { id: 'all_rappers', name: 'Hip-Hop Head', desc: 'Zbierz wszystkich raperow', cat: 'CARDS', tier: 'PLATINUM', req: { type: 'type_complete', cardType: 'RAPER' }, reward: { mk: 15000 }, icon: '🎤' },
    { id: 'all_albums', name: 'Plytowy Fan', desc: 'Zbierz wszystkie albumy', cat: 'CARDS', tier: 'GOLD', req: { type: 'type_complete', cardType: 'PLYTA' }, reward: { mk: 5000 }, icon: '💿' },
    { id: 'all_groups', name: 'Crew Love', desc: 'Zbierz wszystkie sklady', cat: 'CARDS', tier: 'SILVER', req: { type: 'type_complete', cardType: 'SKLAD' }, reward: { mk: 2000 }, icon: '👥' },
    { id: 'all_journalists', name: 'Dziennikarz', desc: 'Zbierz wszystkich dziennikarzy', cat: 'CARDS', tier: 'SILVER', req: { type: 'type_complete', cardType: 'DZIENNIKARZ' }, reward: { mk: 1500 }, icon: '📰' },

    { id: 'warsaw_set', name: 'Warszawa 100%', desc: 'Zbierz wszystkie karty z Warszawy', cat: 'CARDS', tier: 'GOLD', req: { type: 'region_complete', region: 'WARSAW' }, reward: { mk: 3000 }, icon: '🏙️' },
    { id: 'gdansk_set', name: 'Trojmiasto 100%', desc: 'Zbierz wszystkie karty z Trojmiasta', cat: 'CARDS', tier: 'SILVER', req: { type: 'region_complete', region: 'GDANSK' }, reward: { mk: 2000 }, icon: '⚓' },
    { id: 'katowice_set', name: 'Slask 100%', desc: 'Zbierz wszystkie karty ze Slaska', cat: 'CARDS', tier: 'SILVER', req: { type: 'region_complete', region: 'KATOWICE' }, reward: { mk: 2000 }, icon: '⛏️' },
    { id: 'poznan_set', name: 'Poznan 100%', desc: 'Zbierz wszystkie karty z Poznania', cat: 'CARDS', tier: 'SILVER', req: { type: 'region_complete', region: 'POZNAN' }, reward: { mk: 1500 }, icon: '🦌' },
    { id: 'wroclaw_set', name: 'Wroclaw 100%', desc: 'Zbierz wszystkie karty z Wroclawia', cat: 'CARDS', tier: 'SILVER', req: { type: 'region_complete', region: 'WROCLAW' }, reward: { mk: 1500 }, icon: '🌉' },

    { id: 'all_djs', name: 'DJ Master', desc: 'Zbierz wszystkich DJ', cat: 'CARDS', tier: 'GOLD', req: { type: 'tag_complete', tag: 'DJ' }, reward: { mk: 4000 }, icon: '🎧' },
    { id: 'old_school', name: 'Old School', desc: 'Zbierz wszystkie karty z lat 90', cat: 'CARDS', tier: 'GOLD', req: { type: 'tag_complete', tag: '90s' }, reward: { mk: 5000 }, icon: '📼' },
    { id: 'new_school', name: 'New Wave', desc: 'Zbierz wszystkie karty z lat 2020+', cat: 'CARDS', tier: 'SILVER', req: { type: 'tag_complete', tag: '2020s' }, reward: { mk: 2500 }, icon: '📱' },
    { id: 'producer_pack', name: 'Beat Maker', desc: 'Zbierz wszystkich producentow', cat: 'CARDS', tier: 'SILVER', req: { type: 'tag_complete', tag: 'PRODUCER' }, reward: { mk: 2000 }, icon: '🎹' },
    { id: 'female_power', name: 'Girl Power', desc: 'Zbierz wszystkie karty kobiet', cat: 'CARDS', tier: 'SILVER', req: { type: 'tag_complete', tag: 'FEMALE' }, reward: { mk: 3000 }, icon: '👸' },

    // 📦 PACZKI (25 achievements)
    { id: 'first_pack', name: 'Pierwsza Paczka', desc: 'Otworz swoja pierwsza paczke', cat: 'PACKS', tier: 'BRONZE', req: { type: 'packs_opened', val: 1 }, reward: { mk: 100 }, icon: '📦' },
    { id: 'pack_10', name: 'Rozpakowywacz', desc: 'Otworz 10 paczek', cat: 'PACKS', tier: 'BRONZE', req: { type: 'packs_opened', val: 10 }, reward: { mk: 500 }, icon: '📦' },
    { id: 'pack_50', name: 'Pack Addict', desc: 'Otworz 50 paczek', cat: 'PACKS', tier: 'SILVER', req: { type: 'packs_opened', val: 50 }, reward: { mk: 2000, pack: 'STREET' }, icon: '📦' },
    { id: 'pack_100', name: 'Uzalezniony', desc: 'Otworz 100 paczek', cat: 'PACKS', tier: 'GOLD', req: { type: 'packs_opened', val: 100 }, reward: { mk: 5000, pack: 'STUDIO' }, icon: '📦' },
    { id: 'pack_500', name: 'Pack Master', desc: 'Otworz 500 paczek', cat: 'PACKS', tier: 'PLATINUM', req: { type: 'packs_opened', val: 500 }, reward: { mk: 20000, pack: 'PLATINUM' }, icon: '📦' },
    { id: 'pack_1000', name: 'Gambling King', desc: 'Otworz 1000 paczek', cat: 'PACKS', tier: 'DIAMOND', req: { type: 'packs_opened', val: 1000 }, reward: { mk: 50000 }, icon: '🎰' },

    { id: 'free_pack', name: 'Darmowa Probka', desc: 'Otworz paczke FREE', cat: 'PACKS', tier: 'BRONZE', req: { type: 'pack_type', packType: 'FREE', val: 1 }, reward: { mk: 50 }, icon: '🎁' },
    { id: 'street_pack', name: 'Street Cred', desc: 'Otworz paczke STREET', cat: 'PACKS', tier: 'BRONZE', req: { type: 'pack_type', packType: 'STREET', val: 1 }, reward: { mk: 200 }, icon: '🏙️' },
    { id: 'studio_pack', name: 'Studio Session', desc: 'Otworz paczke STUDIO', cat: 'PACKS', tier: 'SILVER', req: { type: 'pack_type', packType: 'STUDIO', val: 1 }, reward: { mk: 500 }, icon: '🎙️' },
    { id: 'platinum_pack', name: 'Platinum Status', desc: 'Otworz paczke PLATINUM', cat: 'PACKS', tier: 'GOLD', req: { type: 'pack_type', packType: 'PLATINUM', val: 1 }, reward: { mk: 1000 }, icon: '💎' },

    { id: 'goat_pull', name: 'G.O.A.T. Pull', desc: 'Wyciagnij G.O.A.T. z paczki', cat: 'PACKS', tier: 'PLATINUM', req: { type: 'pulled_tier', tier: 'GOAT', val: 1 }, reward: { mk: 5000 }, icon: '🐐' },
    { id: 'icon_pull_3', name: 'Ikona x3', desc: 'Wyciagnij 3 ICON z paczek', cat: 'PACKS', tier: 'GOLD', req: { type: 'pulled_tier', tier: 'ICON', val: 3 }, reward: { mk: 3000 }, icon: '👑' },
    { id: 'lucky_streak', name: 'Lucky Streak', desc: 'Wyciagnij 3 STAR+ z rzedu', cat: 'PACKS', tier: 'GOLD', req: { type: 'pull_streak', minTier: 'STAR', val: 3 }, reward: { mk: 5000 }, icon: '🍀' },
    { id: 'golden_day', name: 'Zloty Dzien', desc: 'Wyciagnij 5 ICON w jednym dniu', cat: 'PACKS', tier: 'PLATINUM', req: { type: 'daily_pulls', tier: 'ICON', val: 5 }, reward: { mk: 10000 }, icon: '🌟' },

    { id: 'spent_10k', name: 'Big Spender', desc: 'Wydaj 10k MK na paczki', cat: 'PACKS', tier: 'SILVER', req: { type: 'money_spent_packs', val: 10000 }, reward: { mk: 2000 }, icon: '💸' },
    { id: 'spent_50k', name: 'Whale Alert', desc: 'Wydaj 50k MK na paczki', cat: 'PACKS', tier: 'GOLD', req: { type: 'money_spent_packs', val: 50000 }, reward: { mk: 10000 }, icon: '🐋' },
    { id: 'spent_100k', name: 'Gambling Addict', desc: 'Wydaj 100k MK na paczki', cat: 'PACKS', tier: 'PLATINUM', req: { type: 'money_spent_packs', val: 100000 }, reward: { mk: 25000 }, icon: '🎰' },

    { id: 'daily_pack_7', name: 'Tygodniowa Rutyna', desc: 'Otworz FREE pack 7 dni z rzedu', cat: 'PACKS', tier: 'SILVER', req: { type: 'daily_streak', val: 7 }, reward: { mk: 1000, pack: 'STREET' }, icon: '📅' },
    { id: 'daily_pack_30', name: 'Miesieczna Dedykacja', desc: 'Otworz FREE pack 30 dni z rzedu', cat: 'PACKS', tier: 'GOLD', req: { type: 'daily_streak', val: 30 }, reward: { mk: 5000, pack: 'PLATINUM' }, icon: '📅' },

    { id: 'perfect_pack', name: 'Perfect Pack', desc: 'Wyciagnij 5 kart tego samego tieru', cat: 'PACKS', tier: 'GOLD', req: { type: 'same_tier_pack', val: 5 }, reward: { mk: 3000 }, icon: '🎯' },
    { id: 'rainbow_pack', name: 'Rainbow Pack', desc: 'Wyciagnij wszystkie tiery w jednej paczce', cat: 'PACKS', tier: 'PLATINUM', req: { type: 'all_tiers_pack' }, reward: { mk: 10000 }, icon: '🌈' },
    { id: 'no_duplicates', name: 'Bez Duplikatow', desc: 'Otworz paczke bez duplikatow', cat: 'PACKS', tier: 'SILVER', req: { type: 'no_dup_pack' }, reward: { mk: 1500 }, icon: '✨' },
    { id: 'all_duplicates', name: 'Same Zawsze', desc: 'Otworz paczke gdzie wszystkie to duplikaty', cat: 'PACKS', tier: 'SILVER', req: { type: 'all_dup_pack' }, reward: { mk: 1000 }, icon: '🔄' },

    { id: 'fast_opener', name: 'Speed Demon', desc: 'Otworz 10 paczek w 5 minut', cat: 'PACKS', tier: 'SILVER', req: { type: 'packs_in_time', val: 10, time: 300 }, reward: { mk: 2000 }, icon: '⚡' },
    { id: 'patient_collector', name: 'Cierpliwy Kolekcjoner', desc: 'Czekaj 7 dni bez otwierania paczki', cat: 'PACKS', tier: 'SILVER', req: { type: 'no_pack_days', val: 7 }, reward: { mk: 3000, pack: 'STUDIO' }, icon: '⏳', secret: true },



    // 💰 EKONOMIA
    { id: 'earn_1000', name: 'Kieszonkowe', desc: 'Zdobadz lacznie 1,000 MK', cat: 'ECONOMY', tier: 'BRONZE', req: { type: 'money_earned', val: 1000 }, reward: { mk: 100 }, icon: '💰' },
    { id: 'earn_10k', name: 'Wyplata', desc: 'Zdobadz lacznie 10,000 MK', cat: 'ECONOMY', tier: 'SILVER', req: { type: 'money_earned', val: 10000 }, reward: { mk: 1000 }, icon: '💵' },
    { id: 'earn_100k', name: 'Bogacz', desc: 'Zdobadz lacznie 100,000 MK', cat: 'ECONOMY', tier: 'GOLD', req: { type: 'money_earned', val: 100000 }, reward: { mk: 5000 }, icon: '🏦' },
    { id: 'earn_1m', name: 'Milioner', desc: 'Zdobadz lacznie 1,000,000 MK', cat: 'ECONOMY', tier: 'PLATINUM', req: { type: 'money_earned', val: 1000000 }, reward: { mk: 50000 }, icon: '💎' },

    { id: 'hoard_10k', name: 'Sknera', desc: 'Miej 10,000 MK w portfelu', cat: 'ECONOMY', tier: 'BRONZE', req: { type: 'money_owned', val: 10000 }, reward: { mk: 500 }, icon: '👜' },
    { id: 'hoard_100k', name: 'Inwestor', desc: 'Miej 100,000 MK w portfelu', cat: 'ECONOMY', tier: 'GOLD', req: { type: 'money_owned', val: 100000 }, reward: { mk: 5000 }, icon: '💼' },

    // 🎯 SKILL
    { id: 'beat_kasztan', name: 'Pogromca Kasztanow', desc: 'Pokonaj AI na poziomie Easy', cat: 'SKILL', tier: 'BRONZE', req: { type: 'difficulty_win', diff: 'KASZTAN' }, reward: { mk: 200 }, icon: '👶' },
    { id: 'beat_ogor', name: 'Ogorek Kiszony', desc: 'Pokonaj AI na poziomie Normal', cat: 'SKILL', tier: 'SILVER', req: { type: 'difficulty_win', diff: 'OGOR' }, reward: { mk: 500 }, icon: '🥒' },
    { id: 'beat_levy', name: 'Pogromca Levy-ego', desc: 'Pokonaj AI Levy', cat: 'SKILL', tier: 'GOLD', req: { type: 'difficulty_win', diff: 'LEVY' }, reward: { mk: 1000 }, icon: '😈' },
    { id: 'beat_chuck', name: 'Chuck Who?', desc: 'Pokonaj AI Chuck Norris', cat: 'SKILL', tier: 'PLATINUM', req: { type: 'difficulty_win', diff: 'CHUCKNORRIS' }, reward: { mk: 5000, pack: 'PLATINUM' }, icon: '🤠' },

    // 📱 SOCIAL
    { id: 'social_10', name: 'Socialite', desc: 'Otworz 10 linkow social media', cat: 'SOCIAL', tier: 'BRONZE', req: { type: 'social_links_clicked', val: 10 }, reward: { mk: 500 }, icon: '📱' },
    { id: 'social_50', name: 'Stalker', desc: 'Otworz 50 linkow social media', cat: 'SOCIAL', tier: 'SILVER', req: { type: 'social_links_clicked', val: 50 }, reward: { mk: 2000 }, icon: '🕵️' },
    { id: 'social_100', name: 'Influencer', desc: 'Otworz 100 linkow social media', cat: 'SOCIAL', tier: 'GOLD', req: { type: 'social_links_clicked', val: 100 }, reward: { mk: 5000 }, icon: '🌟' },
    { id: 'social_150', name: 'Networker', desc: 'Otworz 150 linkow social media', cat: 'SOCIAL', tier: 'PLATINUM', req: { type: 'social_links_clicked', val: 150 }, reward: { mk: 10000 }, icon: '🌐' },
    { id: 'social_media_follower', name: 'Ziomek z Instagrama', desc: 'Zaobserwuj tworce gry. Nagroda: 1000 MK + Wszystkie Miasta', cat: 'SOCIAL', tier: 'GOLD', req: { type: 'social_links_clicked', val: 1 }, reward: { mk: 1000 }, icon: '📸' },
    { id: 'share_5', name: 'Promotor', desc: 'Udostepnij gre/karte 5 razy', cat: 'SOCIAL', tier: 'BRONZE', req: { type: 'shared_count', val: 5 }, reward: { mk: 1000 }, icon: '📢' },

    // 🔒 SECRETS
    { id: 'konami_code', name: 'Retro Hacker', desc: 'Wpisz Konami Code w menu', cat: 'SECRETS', tier: 'PLATINUM', req: { type: 'secret_code', code: 'konami' }, reward: { mk: 50000 }, icon: '🎮', secret: true },
    { id: 'click_logo', name: 'Touchy', desc: 'Kliknij logo gry 10 razy', cat: 'SECRETS', tier: 'BRONZE', req: { type: 'click_count', target: 'logo', val: 10 }, reward: { mk: 500 }, icon: '👆', secret: true },

    // ⚔️ WALKI (Extracted from Part 2)
    { id: 'first_win', name: 'Pierwsza Wygrana', desc: 'Wygraj pierwsza walke', cat: 'FIGHTS', tier: 'BRONZE', req: { type: 'wins', val: 1 }, reward: { mk: 200 }, icon: '🥊' },
    { id: 'win_10', name: 'Wojownik', desc: 'Wygraj 10 walk', cat: 'FIGHTS', tier: 'BRONZE', req: { type: 'wins', val: 10 }, reward: { mk: 1000 }, icon: '⚔️' },
    { id: 'win_50', name: 'Weteran', desc: 'Wygraj 50 walk', cat: 'FIGHTS', tier: 'SILVER', req: { type: 'wins', val: 50 }, reward: { mk: 3000 }, icon: '⚔️' },
    { id: 'win_100', name: 'Mistrz', desc: 'Wygraj 100 walk', cat: 'FIGHTS', tier: 'GOLD', req: { type: 'wins', val: 100 }, reward: { mk: 7500 }, icon: '⚔️' },
    { id: 'win_500', name: 'Legend', desc: 'Wygraj 500 walk', cat: 'FIGHTS', tier: 'PLATINUM', req: { type: 'wins', val: 500 }, reward: { mk: 25000 }, icon: '⚔️' },
    { id: 'win_1000', name: 'Champion', desc: 'Wygraj 1000 walk', cat: 'FIGHTS', tier: 'DIAMOND', req: { type: 'wins', val: 1000 }, reward: { mk: 100000 }, icon: '🏆' },

    { id: 'streak_3', name: 'Goraca Passa', desc: '3 wygrane z rzedu', cat: 'FIGHTS', tier: 'BRONZE', req: { type: 'win_streak', val: 3 }, reward: { mk: 500 }, icon: '🔥' },
    { id: 'streak_5', name: 'Niepokonany', desc: '5 wygranych z rzedu', cat: 'FIGHTS', tier: 'SILVER', req: { type: 'win_streak', val: 5 }, reward: { mk: 1500 }, icon: '🔥' },
    { id: 'streak_10', name: 'Dominacja', desc: '10 wygranych z rzedu', cat: 'FIGHTS', tier: 'GOLD', req: { type: 'win_streak', val: 10 }, reward: { mk: 5000 }, icon: '🔥' },
    { id: 'streak_25', name: 'Unstoppable', desc: '25 wygranych z rzedu', cat: 'FIGHTS', tier: 'PLATINUM', req: { type: 'win_streak', val: 25 }, reward: { mk: 20000 }, icon: '🔥' },

    { id: 'perfect_10', name: 'Bez Obrazen', desc: 'Wygraj 10 rund bez obra zen', cat: 'FIGHTS', tier: 'SILVER', req: { type: 'perfect_rounds', val: 10 }, reward: { mk: 2000 }, icon: '💯' },
    { id: 'perfect_50', name: 'Perfekcjonista', desc: 'Wygraj 50 rund bez obrazen', cat: 'FIGHTS', tier: 'GOLD', req: { type: 'perfect_rounds', val: 50 }, reward: { mk: 7500 }, icon: '💯' },
    { id: 'perfect_100', name: 'Untouchable', desc: 'Wygraj 100 rund bez obrazen', cat: 'FIGHTS', tier: 'PLATINUM', req: { type: 'perfect_rounds', val: 100 }, reward: { mk: 25000 }, icon: '💯' },

    { id: 'hard_10', name: 'Hard Mode', desc: 'Wygraj 10 walk na Hard', cat: 'FIGHTS', tier: 'SILVER', req: { type: 'difficulty_wins', diff: 'hard', val: 10 }, reward: { mk: 3000 }, icon: '💀' },
    { id: 'hard_50', name: 'Hardkorowy', desc: 'Wygraj 50 walk na Hard', cat: 'FIGHTS', tier: 'GOLD', req: { type: 'difficulty_wins', diff: 'hard', val: 50 }, reward: { mk: 10000 }, icon: '💀' },
    { id: 'hard_100', name: 'Masochista', desc: 'Wygraj 100 walk na Hard', cat: 'FIGHTS', tier: 'PLATINUM', req: { type: 'difficulty_wins', diff: 'hard', val: 100 }, reward: { mk: 30000 }, icon: '💀' },

    { id: 'online_10', name: 'Online Warrior', desc: 'Wygraj 10 walk online', cat: 'FIGHTS', tier: 'SILVER', req: { type: 'online_wins', val: 10 }, reward: { mk: 2500 }, icon: '🌐' },
    { id: 'online_50', name: 'PvP Master', desc: 'Wygraj 50 walk online', cat: 'FIGHTS', tier: 'GOLD', req: { type: 'online_wins', val: 50 }, reward: { mk: 10000 }, icon: '🌐' },
    { id: 'online_100', name: 'Ranked King', desc: 'Wygraj 100 walk online', cat: 'FIGHTS', tier: 'PLATINUM', req: { type: 'online_wins', val: 100 }, reward: { mk: 25000 }, icon: '🌐' },

    { id: 'beat_quebo', name: 'Pokonaj Quebo', desc: 'Wygraj walke vs Quebonafide', cat: 'FIGHTS', tier: 'GOLD', req: { type: 'beat_fighter', fighter: 'quebonafide' }, reward: { mk: 3000 }, icon: '👊' },
    { id: 'beat_taco', name: 'Pokonaj Taco', desc: 'Wygraj walke vs Taco', cat: 'FIGHTS', tier: 'GOLD', req: { type: 'beat_fighter', fighter: 'taco' }, reward: { mk: 3000 }, icon: '👊' },
    { id: 'beat_all', name: 'Wszyscy Pokonani', desc: 'Wygraj vs kazdego rapera', cat: 'FIGHTS', tier: 'DIAMOND', req: { type: 'beat_all_fighters' }, reward: { mk: 50000 }, icon: '👑' },

    { id: 'comeback', name: 'Comeback Kid', desc: 'Wygraj majac <10% HP', cat: 'FIGHTS', tier: 'GOLD', req: { type: 'low_hp_win', hp: 10 }, reward: { mk: 5000 }, icon: '💪' },
    { id: 'last_second', name: 'Last Second', desc: 'Wygraj w ostatniej sekundzie', cat: 'FIGHTS', tier: 'GOLD', req: { type: 'clutch_win' }, reward: { mk: 5000 }, icon: '⏱️' },
    { id: 'double_ko', name: 'Double KO', desc: 'Zremisuj przez podwojne KO', cat: 'FIGHTS', tier: 'SILVER', req: { type: 'double_ko' }, reward: { mk: 2000 }, icon: '💥' },
    { id: 'timeout_master', name: 'Timeout King', desc: 'Wygraj 10 walk przez timeout', cat: 'FIGHTS', tier: 'SILVER', req: { type: 'timeout_wins', val: 10 }, reward: { mk: 1500 }, icon: '⏳' },
    { id: 'flawless_fight', name: 'Flawless Victory', desc: 'Wygraj cala walke bez obrazen', cat: 'FIGHTS', tier: 'PLATINUM', req: { type: 'flawless_fight' }, reward: { mk: 10000 }, icon: '🌟' },

    { id: 'quick_ko', name: 'Speed KO', desc: 'Wygraj runde w <10 sekund', cat: 'FIGHTS', tier: 'SILVER', req: { type: 'fast_round', time: 10 }, reward: { mk: 2000 }, icon: '⚡' },
    { id: 'marathon', name: 'Maraton', desc: 'Wygraj runde >90 sekund', cat: 'FIGHTS', tier: 'SILVER', req: { type: 'long_round', time: 90 }, reward: { mk: 1500 }, icon: '🏃' },
    { id: 'no_block', name: 'Zero Blokow', desc: 'Wygraj nie uzywajac bloku', cat: 'FIGHTS', tier: 'GOLD', req: { type: 'no_block_win' }, reward: { mk: 5000 }, icon: '🚫' },
    { id: 'only_kicks', name: 'Tylko Kopniecia', desc: 'Wygraj uzywajac tylko kopniec', cat: 'FIGHTS', tier: 'SILVER', req: { type: 'only_kicks_win' }, reward: { mk: 3000 }, icon: '🦵' },
    { id: 'only_punches', name: 'Tylko Ciosy', desc: 'Wygraj uzywajac tylko ciosow', cat: 'FIGHTS', tier: 'SILVER', req: { type: 'only_punches_win' }, reward: { mk: 3000 }, icon: '👊' },

    { id: 'grudge_match', name: 'Zemsta', desc: 'Wygraj vs przeciwnika ktory cie pobil', cat: 'FIGHTS', tier: 'BRONZE', req: { type: 'revenge_win' }, reward: { mk: 1000 }, icon: '😈' },
    { id: 'world_tour', name: 'World Tour', desc: 'Wygraj na wszystkich mapach', cat: 'FIGHTS', tier: 'GOLD', req: { type: 'all_maps_win' }, reward: { mk: 5000 }, icon: '🌍' },
    { id: '2v2_win', name: '2v2 Champion', desc: 'Wygraj walke 2v2', cat: 'FIGHTS', tier: 'SILVER', req: { type: 'mode_win', mode: '2v2' }, reward: { mk: 2000 }, icon: '👥' },
    { id: 'survival_10', name: 'Survival King', desc: 'Pokonaj 10 przeciwnikow w Survival', cat: 'FIGHTS', tier: 'GOLD', req: { type: 'survival_score', val: 10 }, reward: { mk: 5000 }, icon: '🏰' },

    // 💰 EKONOMIA (Extracted from Part 2)
    { id: 'earn_10k', name: 'Pierwsza Wyplata', desc: 'Zarobic 10k MK total', cat: 'ECONOMY', tier: 'BRONZE', req: { type: 'money_earned', val: 10000 }, reward: { mk: 500 }, icon: '💵' },
    { id: 'earn_50k', name: 'Biznesmen', desc: 'Zarobic 50k MK total', cat: 'ECONOMY', tier: 'SILVER', req: { type: 'money_earned', val: 50000 }, reward: { mk: 2500 }, icon: '💵' },
    { id: 'earn_100k', name: 'Entrepreneur', desc: 'Zarobic 100k MK total', cat: 'ECONOMY', tier: 'GOLD', req: { type: 'money_earned', val: 100000 }, reward: { mk: 5000 }, icon: '💵' },
    { id: 'earn_500k', name: 'Millionaire Path', desc: 'Zarobic 500k MK total', cat: 'ECONOMY', tier: 'PLATINUM', req: { type: 'money_earned', val: 500000 }, reward: { mk: 25000 }, icon: '💵' },
    { id: 'earn_1m', name: 'Milioner', desc: 'Zarobic 1M MK total', cat: 'ECONOMY', tier: 'DIAMOND', req: { type: 'money_earned', val: 1000000 }, reward: { mk: 100000 }, icon: '💎' },

    { id: 'rich_50k', name: 'Bogacz', desc: 'Posiadaj 50k MK naraz', cat: 'ECONOMY', tier: 'GOLD', req: { type: 'money_owned', val: 50000 }, reward: { mk: 5000 }, icon: '🤑' },
    { id: 'rich_100k', name: 'Bardzo Bogaty', desc: 'Posiadaj 100k MK naraz', cat: 'ECONOMY', tier: 'PLATINUM', req: { type: 'money_owned', val: 100000 }, reward: { mk: 10000 }, icon: '🤑' },

    { id: 'big_win', name: 'Wielka Wygrana', desc: 'Zarobic 1k MK w jednej walce', cat: 'ECONOMY', tier: 'SILVER', req: { type: 'single_fight_earn', val: 1000 }, reward: { mk: 1000 }, icon: '💰' },
    { id: 'huge_win', name: 'Ogromna Wypl ata', desc: 'Zarobic 5k MK w jednej walce', cat: 'ECONOMY', tier: 'GOLD', req: { type: 'single_fight_earn', val: 5000 }, reward: { mk: 3000 }, icon: '💰' },
    { id: 'jackpot', name: 'Jackpot', desc: 'Zarobic 10k MK w jednej walce', cat: 'ECONOMY', tier: 'PLATINUM', req: { type: 'single_fight_earn', val: 10000 }, reward: { mk: 10000 }, icon: '💰' },

    { id: 'spent_100k', name: 'Big Spender', desc: 'Wydaj 100k MK total', cat: 'ECONOMY', tier: 'GOLD', req: { type: 'money_spent', val: 100000 }, reward: { mk: 5000 }, icon: '💸' },
    { id: 'spent_500k', name: 'Szafujacy', desc: 'Wydaj 500k MK total', cat: 'ECONOMY', tier: 'PLATINUM', req: { type: 'money_spent', val: 500000 }, reward: { mk: 25000 }, icon: '💸' },
    { id: 'spent_1m', name: 'Money Burner', desc: 'Wydaj 1M MK total', cat: 'ECONOMY', tier: 'DIAMOND', req: { type: 'money_spent', val: 1000000 }, reward: { mk: 100000 }, icon: '💸' },

    { id: 'broke', name: 'Bankrut', desc: 'Miej 0 MK przez 24h', cat: 'ECONOMY', tier: 'BRONZE', req: { type: 'broke_duration', hours: 24 }, reward: { mk: 5000 }, icon: '😭', secret: true },
    { id: 'day_trader', name: 'Day Trader', desc: 'Zarobic i wydac 10k w jednym dniu', cat: 'ECONOMY', tier: 'SILVER', req: { type: 'daily_volume', val: 10000 }, reward: { mk: 2000 }, icon: '📈' },
    { id: 'hoarder', name: 'Oszczedny', desc: 'Nie wydawaj MK przez 7 dni', cat: 'ECONOMY', tier: 'SILVER', req: { type: 'no_spending_days', val: 7 }, reward: { mk: 5000 }, icon: '🏦' },

    { id: 'lucky_penny', name: 'Lucky Penny', desc: 'Wygraj walke z dokladnie 777 MK', cat: 'ECONOMY', tier: 'GOLD', req: { type: 'exact_money', val: 777 }, reward: { mk: 7777 }, icon: '🍀', secret: true },
    { id: 'profit_margin', name: 'Profit Margin', desc: 'Zarobic wiecej niz wydales (net +50k)', cat: 'ECONOMY', tier: 'GOLD', req: { type: 'net_profit', val: 50000 }, reward: { mk: 10000 }, icon: '📊' },
    { id: 'loss_leader', name: 'Loss Leader', desc: 'Wydaj wiecej niz zarobiles (net -50k)', cat: 'ECONOMY', tier: 'SILVER', req: { type: 'net_loss', val: 50000 }, reward: { pack: 'PLATINUM' }, icon: '📉', secret: true },

    { id: 'card_flipper', name: 'Card Flipper', desc: 'Sprzedaj karte (future feature)', cat: 'ECONOMY', tier: 'BRONZE', req: { type: 'cards_sold', val: 1 }, reward: { mk: 500 }, icon: '🔄' },
    { id: 'merchant', name: 'Kupiec', desc: 'Sprzedaj 50 kart', cat: 'ECONOMY', tier: 'GOLD', req: { type: 'cards_sold', val: 50 }, reward: { mk: 5000 }, icon: '🏪' },

    { id: 'free_only', name: 'Free to Play', desc: 'Zbierz 50 kart bez kupowania paczek', cat: 'ECONOMY', tier: 'PLATINUM', req: { type: 'f2p_cards', val: 50 }, reward: { mk: 10000 }, icon: '🎁', secret: true },
    { id: 'whale', name: 'Whale Status', desc: 'Wydaj 100k MK na paczki w tydzien', cat: 'ECONOMY', tier: 'PLATINUM', req: { type: 'weekly_pack_spending', val: 100000 }, reward: { mk: 25000 }, icon: '🐋' },
    { id: 'rags_to_riches', name: 'Z Ničego', desc: 'Zarobic 100k startujac z 0 MK', cat: 'ECONOMY', tier: 'GOLD', req: { type: 'zero_to_hero', val: 100000 }, reward: { mk: 15000 }, icon: '👑' },

    // 🆕 NEW ACHIEVEMENTS (Expansion to 200+)

    // 🌍 REGION MASTERY (Extra Collection)
    { id: 'warsaw_king', name: 'Krol Warszawy', desc: 'Wygraj 50 walk postaciami z Warszawy', cat: 'COLLECTION', tier: 'GOLD', req: { type: 'region_wins', region: 'WARSAW', val: 50 }, reward: { mk: 5000 }, icon: '👑' },
    { id: 'poznan_king', name: 'Krol Poznania', desc: 'Wygraj 50 walk postaciami z Poznania', cat: 'COLLECTION', tier: 'GOLD', req: { type: 'region_wins', region: 'POZNAN', val: 50 }, reward: { mk: 5000 }, icon: '👑' },
    { id: 'slask_king', name: 'Krol Slaska', desc: 'Wygraj 50 walk postaciami ze Slaska', cat: 'COLLECTION', tier: 'GOLD', req: { type: 'region_wins', region: 'KATOWICE', val: 50 }, reward: { mk: 5000 }, icon: '👑' },
    { id: '3city_king', name: 'Krol Trojmiasta', desc: 'Wygraj 50 walk postaciami z 3City', cat: 'COLLECTION', tier: 'GOLD', req: { type: 'region_wins', region: 'GDANSK', val: 50 }, reward: { mk: 5000 }, icon: '👑' },

    // 👊 CHARACTER MASTERY (Specific Fighter Wins) - Adding 20
    { id: 'master_mata', name: 'Mata Master', desc: 'Wygraj 10 walk jako Mata', cat: 'SKILL', tier: 'SILVER', req: { type: 'fighter_wins', fighter: 'mata', val: 10 }, reward: { mk: 1000 }, icon: '🥋' },
    { id: 'master_bedoes', name: 'Bedoes Master', desc: 'Wygraj 10 walk jako Bedoes', cat: 'SKILL', tier: 'SILVER', req: { type: 'fighter_wins', fighter: 'bedoes', val: 10 }, reward: { mk: 1000 }, icon: '🥋' },
    { id: 'master_quebo', name: 'Quebo Master', desc: 'Wygraj 10 walk jako Quebonafide', cat: 'SKILL', tier: 'SILVER', req: { type: 'fighter_wins', fighter: 'quebonafide', val: 10 }, reward: { mk: 1000 }, icon: '🥋' },
    { id: 'master_taco', name: 'Taco Master', desc: 'Wygraj 10 walk jako Taco', cat: 'SKILL', tier: 'SILVER', req: { type: 'fighter_wins', fighter: 'taco', val: 10 }, reward: { mk: 1000 }, icon: '🥋' },
    { id: 'master_peja', name: 'Peja Master', desc: 'Wygraj 10 walk jako Peja', cat: 'SKILL', tier: 'SILVER', req: { type: 'fighter_wins', fighter: 'peja', val: 10 }, reward: { mk: 1000 }, icon: '🥋' },
    { id: 'master_sokol', name: 'Sokol Master', desc: 'Wygraj 10 walk jako Sokol', cat: 'SKILL', tier: 'SILVER', req: { type: 'fighter_wins', fighter: 'sokol', val: 10 }, reward: { mk: 1000 }, icon: '🥋' },
    { id: 'master_ok', name: 'Oki Master', desc: 'Wygraj 10 walk jako Oki', cat: 'SKILL', tier: 'SILVER', req: { type: 'fighter_wins', fighter: 'oki', val: 10 }, reward: { mk: 1000 }, icon: '🥋' },
    { id: 'master_young_leosia', name: 'Leosia Master', desc: 'Wygraj 10 walk jako Young Leosia', cat: 'SKILL', tier: 'SILVER', req: { type: 'fighter_wins', fighter: 'young_leosia', val: 10 }, reward: { mk: 1000 }, icon: '🥋' },
    { id: 'master_bambik', name: 'Bambi Master', desc: 'Wygraj 10 walk jako Bambi', cat: 'SKILL', tier: 'SILVER', req: { type: 'fighter_wins', fighter: 'bambi', val: 10 }, reward: { mk: 1000 }, icon: '🥋' },
    { id: 'master_kizo', name: 'Kizo Master', desc: 'Wygraj 10 walk jako Kizo', cat: 'SKILL', tier: 'SILVER', req: { type: 'fighter_wins', fighter: 'kizo', val: 10 }, reward: { mk: 1000 }, icon: '🥋' },

    // ⚔️ COMBAT CHALLENGES
    { id: 'glass_cannon', name: 'Glass Cannon', desc: 'Wygraj majac 1 HP (Secret)', cat: 'FIGHTS', tier: 'PLATINUM', req: { type: 'hp_finish', val: 1 }, reward: { mk: 20000 }, icon: '🩸', secret: true },
    { id: 'pacifist', name: 'Pacyfista', desc: 'Wygraj przez timeout majac wiecej HP', cat: 'FIGHTS', tier: 'GOLD', req: { type: 'timeout_win' }, reward: { mk: 5000 }, icon: '🕊️' },
    { id: 'spammer', name: 'Spammer', desc: 'Uzyj tego samego ataku 20 razy w walce', cat: 'SKILL', tier: 'BRONZE', req: { type: 'spam_move', val: 20 }, reward: { mk: 100 }, icon: '🔁' },
    { id: 'untouchable_god', name: 'Untouchable God', desc: 'Wygraj 3 walki z rzedu bez drasniecia', cat: 'SKILL', tier: 'DIAMOND', req: { type: 'perfect_streak', val: 3 }, reward: { mk: 50000 }, icon: '✨' },

    // 🛍️ SHOPPING SPREE
    { id: 'window_shopper', name: 'Ogladacz', desc: 'Wejdz do sklepu 50 razy', cat: 'ECONOMY', tier: 'BRONZE', req: { type: 'visit_shop', val: 50 }, reward: { mk: 500 }, icon: '👀' },
    { id: 'collector_pro', name: 'Koneser', desc: 'Kup 10 przedmiotow (future)', cat: 'ECONOMY', tier: 'SILVER', req: { type: 'items_bought', val: 10 }, reward: { mk: 2000 }, icon: '🛍️' },

    // 🃏 DECK BUILDER (Future Proofing)
    { id: 'deck_builder', name: 'Strateg', desc: 'Stworz wlasny deck', cat: 'SKILL', tier: 'SILVER', req: { type: 'create_deck', val: 1 }, reward: { mk: 1000 }, icon: '🃏' },
    { id: 'full_house', name: 'Full House', desc: 'Miej deck z samych Legend', cat: 'SKILL', tier: 'PLATINUM', req: { type: 'full_legend_deck' }, reward: { mk: 10000 }, icon: '🃏' },

    // 🕒 TIME BASED
    { id: 'night_owl', name: 'Nocny Marek', desc: 'Graj miedzy 3:00 a 5:00 w nocy', cat: 'SECRETS', tier: 'GOLD', req: { type: 'play_time', start: 3, end: 5 }, reward: { mk: 5000 }, icon: '🦉', secret: true },
    { id: 'early_bird', name: 'Ranny Ptaszek', desc: 'Graj miedzy 6:00 a 8:00 rano', cat: 'SECRETS', tier: 'GOLD', req: { type: 'play_time', start: 6, end: 8 }, reward: { mk: 5000 }, icon: '🐔', secret: true },
    { id: 'weekend_warrior', name: 'Weekendowiec', desc: 'Graj w Sobote i Niedziele', cat: 'PROGRESS', tier: 'SILVER', req: { type: 'weekend_play' }, reward: { mk: 2000 }, icon: '📅' },

    // 🔢 NUMBERS
    { id: 'level_10', name: 'Level 10', desc: 'Wbij 10 poziom (future)', cat: 'PROGRESS', tier: 'BRONZE', req: { type: 'level_up', val: 10 }, reward: { mk: 1000 }, icon: '⬆️' },
    { id: 'level_50', name: 'Level 50', desc: 'Wbij 50 poziom (future)', cat: 'PROGRESS', tier: 'GOLD', req: { type: 'level_up', val: 50 }, reward: { mk: 10000 }, icon: '⬆️' },
    { id: 'level_100', name: 'Max Level', desc: 'Wbij 100 poziom (future)', cat: 'PROGRESS', tier: 'PLATINUM', req: { type: 'level_up', val: 100 }, reward: { mk: 50000 }, icon: '⬆️' },

    // 🏆 RANKED (Online)
    { id: 'rank_bronze', name: 'Braz', desc: 'Osiagnij range Braz w Online', cat: 'SKILL', tier: 'BRONZE', req: { type: 'rank_reach', rank: 'BRONZE' }, reward: { mk: 500 }, icon: '🥉' },
    { id: 'rank_silver', name: 'Srebro', desc: 'Osiagnij range Srebro w Online', cat: 'SKILL', tier: 'SILVER', req: { type: 'rank_reach', rank: 'SILVER' }, reward: { mk: 2000 }, icon: '🥈' },
    { id: 'rank_gold', name: 'Zloto', desc: 'Osiagnij range Zloto w Online', cat: 'SKILL', tier: 'GOLD', req: { type: 'rank_reach', rank: 'GOLD' }, reward: { mk: 10000 }, icon: '🥇' },
    { id: 'rank_diamond', name: 'Diament', desc: 'Osiagnij range Diament w Online', cat: 'SKILL', tier: 'DIAMOND', req: { type: 'rank_reach', rank: 'DIAMOND' }, reward: { mk: 50000 }, icon: '💎' },

    // 🗺️ MAPS
    { id: 'win_waw_10', name: 'Obronca Stolicy', desc: 'Wygraj 10 razy na mapie Warszawa', cat: 'FIGHTS', tier: 'BRONZE', req: { type: 'map_wins', map: 'WARSAW', val: 10 }, reward: { mk: 500 }, icon: '🏙️' },
    { id: 'win_block_10', name: 'Blokers', desc: 'Wygraj 10 razy na mapie Blokowisko', cat: 'FIGHTS', tier: 'BRONZE', req: { type: 'map_wins', map: 'BLOCK', val: 10 }, reward: { mk: 500 }, icon: '🏢' },
    { id: 'win_club_10', name: 'Klubowicz', desc: 'Wygraj 10 razy na mapie Klub', cat: 'FIGHTS', tier: 'BRONZE', req: { type: 'map_wins', map: 'CLUB', val: 10 }, reward: { mk: 500 }, icon: '🎉' },
    { id: 'win_studio_10', name: 'Nagrywka', desc: 'Wygraj 10 razy na mapie Studio', cat: 'FIGHTS', tier: 'BRONZE', req: { type: 'map_wins', map: 'STUDIO', val: 10 }, reward: { mk: 500 }, icon: '🎙️' },

    // 🤡 FUN
    { id: 'troll_win', name: 'Troll', desc: 'Wygraj uciekajac przez caly czas', cat: 'SKILL', tier: 'GOLD', req: { type: 'troll_win' }, reward: { mk: 2000 }, icon: '🤡', secret: true },
    { id: 'button_masher', name: 'Button Masher', desc: 'Wykonaj 500 atakow w jednej walce', cat: 'SKILL', tier: 'SILVER', req: { type: 'attacks_count', val: 500 }, reward: { mk: 1000 }, icon: '🎮' },
    { id: 'afk_win', name: 'AFK', desc: 'Wygraj nic nie robiac (AI vs AI?)', cat: 'SECRETS', tier: 'PLATINUM', req: { type: 'afk_win' }, reward: { mk: 10000 }, icon: '💤', secret: true },

    // 🤝 FRIENDSHIP
    { id: 'friend_fight', name: 'Sparing', desc: 'Zagraj walke z przyjacielem (Local)', cat: 'SOCIAL', tier: 'BRONZE', req: { type: 'local_matches', val: 1 }, reward: { mk: 100 }, icon: '🤝' },
    { id: 'friend_50', name: 'Rywale', desc: 'Zagraj 50 walk z przyjacielem', cat: 'SOCIAL', tier: 'SILVER', req: { type: 'local_matches', val: 50 }, reward: { mk: 5000 }, icon: '🤜🤛' },

    // 📦 MORE PACK TYPES
    { id: 'glitch_pack', name: 'Glitch Hunter', desc: 'Otworz paczke podczas laga (fake)', cat: 'SECRETS', tier: 'DIAMOND', req: { type: 'glitch_pack' }, reward: { pack: 'PLATINUM' }, icon: '👾', secret: true },
    { id: 'bulk_buyer', name: 'Hurtownik', desc: 'Kup 10 paczek za jednym razem', cat: 'PACKS', tier: 'GOLD', req: { type: 'bulk_buy', val: 10 }, reward: { mk: 5000 }, icon: '📦' },

    // 🎲 LUCK & FUN (Final Batch)
    { id: 'lucky_7', name: 'Lucky 7', desc: 'Wygraj majac 7% HP', cat: 'SKILL', tier: 'SILVER', req: { type: 'hp_exact_percent', val: 7 }, reward: { mk: 777 }, icon: '🎰' },
    { id: 'unlucky_13', name: 'Pechowa 13', desc: 'Przegraj 13 razy z rzedu', cat: 'SECRETS', tier: 'BRONZE', req: { type: 'loss_streak', val: 13 }, reward: { mk: 666 }, icon: '💀', secret: true },
    { id: 'mirror_match', name: 'Lustrzane Odbicie', desc: 'Wygraj vs ta sama postac', cat: 'SKILL', tier: 'SILVER', req: { type: 'mirror_match_win' }, reward: { mk: 1000 }, icon: '🪞' },
    { id: 'david_goliath', name: 'Dawid i Goliat', desc: 'Wygraj vs Boss uzywajac najslabszej postaci', cat: 'SKILL', tier: 'GOLD', req: { type: 'weak_vs_strong' }, reward: { mk: 5000 }, icon: '⚔️' },

    // 🕐 GRIND
    { id: 'dedicated', name: 'Dedykacja', desc: 'Zagraj 1000 rund total', cat: 'PROGRESS', tier: 'PLATINUM', req: { type: 'total_rounds', val: 1000 }, reward: { mk: 10000 }, icon: '⏳' },
    { id: 'nightmare_survivor', name: 'Koszmar', desc: 'Przetrwaj 20 rund w Survivalu', cat: 'SKILL', tier: 'PLATINUM', req: { type: 'survival_rounds', val: 20 }, reward: { mk: 20000 }, icon: '👹' },
    { id: 'pacifist_run', name: 'Pacyfista Run', desc: 'Przejdz Arcade bez zabijania (timeouty)', cat: 'SECRETS', tier: 'DIAMOND', req: { type: 'arcade_pacifist' }, reward: { mk: 50000 }, icon: '🕊️', secret: true },

    // 🎭 MEME
    { id: 'papaj', name: '21:37', desc: 'Wygraj walke o 21:37', cat: 'SECRETS', tier: 'GOLD', req: { type: 'time_win', time: '21:37' }, reward: { mk: 2137 }, icon: '🇻🇦', secret: true },
    { id: 'stonoga', name: 'Ziobro', desc: 'Przegraj przez timeout majac 0 HP (bug?)', cat: 'SECRETS', tier: 'SILVER', req: { type: 'bug_loss' }, reward: { mk: 1000 }, icon: '📉', secret: true },

    // 🎼 MUSIC
    { id: 'music_lover', name: 'Meloman', desc: 'Posluchaj calej playlisty w menu', cat: 'SOCIAL', tier: 'BRONZE', req: { type: 'listen_all_tracks' }, reward: { mk: 500 }, icon: '🎵' },
    { id: 'mute_king', name: 'Cisza', desc: 'Wygraj walke z wyciszonym dzwiekiem', cat: 'SECRETS', tier: 'BRONZE', req: { type: 'mute_win' }, reward: { mk: 500 }, icon: '🔇' },

    // 🏟️ ARENA
    { id: 'cage_fighter', name: 'Klatka', desc: 'Wygraj 20 walk w Klatce', cat: 'FIGHTS', tier: 'SILVER', req: { type: 'map_wins', map: 'CAGE', val: 20 }, reward: { mk: 2000 }, icon: '🥊' },
    { id: 'ring_master', name: 'Ring', desc: 'Wygraj 20 walk na Ringu', cat: 'FIGHTS', tier: 'SILVER', req: { type: 'map_wins', map: 'RING', val: 20 }, reward: { mk: 2000 }, icon: '🔔' },

    // 🥋 MOVES
    { id: 'upper_master', name: 'Uppercut God', desc: 'Traf 50 uppercutow w jednej walce', cat: 'SKILL', tier: 'GOLD', req: { type: 'move_count', move: 'uppercut', val: 50 }, reward: { mk: 3000 }, icon: '🤜' },
    { id: 'kick_master', name: 'Kickboxer', desc: 'Traf 50 kopniec w jednej walce', cat: 'SKILL', tier: 'GOLD', req: { type: 'move_count', move: 'kick', val: 50 }, reward: { mk: 3000 }, icon: '🦵' },
    { id: 'block_master', name: 'Mur', desc: 'Zablokuj 1000 obrazen w jednej walce', cat: 'SKILL', tier: 'PLATINUM', req: { type: 'damage_blocked', val: 1000 }, reward: { mk: 5000 }, icon: '🛡️' }
];

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ACHIEVEMENT_TIERS, ACHIEVEMENT_CATEGORIES, ACHIEVEMENTS_DATABASE };
}
