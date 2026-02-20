class InventoryManager {
    constructor() {
        this.updateStorageKey();
        this.inventory = this.loadInventory();
        this.dataFetchedFromServer = false;

        // Define available items
        this.itemsDatabase = {
            // GEAR (Clothing/Equipment - slight stat boosts)
            'mic_2001': { name: 'Mikrofon 2001', type: 'gear', icon: '🎤', desc: 'Klasyczny majk. Zwieksza Respekt o 10.', stats: { respect: 10 }, price: 400 },
            'gold_chain': { name: 'Zloty Lancuch', type: 'gear', icon: '⛓️', desc: 'Blyszczacy lancuch. +50 do Respektu.', stats: { respect: 50 }, price: 2500 },
            'cap_wpierdolka': { name: 'Czapka Wpierdolka', type: 'gear', icon: '🧢', desc: 'Stylowka z osiedla. +5 do Respektu.', stats: { respect: 5 }, price: 300 },
            'mpc_2000': { name: 'Sampler MPC', type: 'gear', icon: '🎹', desc: 'Legendarna maszyna. +150 do Respektu.', stats: { respect: 150 }, price: 8000 },
            'sneakers_og': { name: 'Air Bajer WWA', type: 'gear', icon: '👟', desc: 'Limitowane kicksy. +20 do stylu i szybkosci na miescie.', stats: { respect: 30, speed: 5 }, price: 1200 },
            'hoodie_2115': { name: 'Bluza BRD SRC', type: 'gear', icon: '🧥', desc: 'Rodzina ponad wszystko. Ciepla i stylowa.', stats: { respect: 40, defense: 5 }, price: 800 },
            'glasses_thug': { name: 'Okulary Thug Life', type: 'gear', icon: '🕶️', desc: 'Deal with it. Wygladasz w nich jak szef.', stats: { respect: 20, charisma: 10 }, price: 600 },
            'gold_timberlands': { name: 'Zlote Timberlandy', type: 'gear', icon: '🥾', desc: 'Klasyk w wersji deluxe. Nie do zdarcia.', stats: { respect: 100, defense: 10 }, price: 4500 },
            'silver_watch': { name: 'Srebrna Sikora', type: 'gear', icon: '⌚', desc: 'Czas to pieniadz. Blyszczy na nadgarstku.', stats: { respect: 60, speed: 5 }, price: 2200 },
            'leather_jacket': { name: 'Skora Klasyk', type: 'gear', icon: '🧥', desc: 'Styl starej szkoly z lat 90. Budzi respekt.', stats: { respect: 45, defense: 15 }, price: 1800 },
            'bandana_red': { name: 'Czerwona Bandana', type: 'gear', icon: '🧣', desc: 'Reprezentuj rewir. Wszyscy wiedza skad jestes.', stats: { respect: 15, power: 3 }, price: 250 },
            'diamond_ring': { name: 'Sygnet z Diamentem', type: 'gear', icon: '💍', desc: 'Ciezka reka w walce i przy podpisywaniu kontraktow.', stats: { respect: 200, power: 10 }, price: 15000 },
            'backpack_classic': { name: 'Plecak Kostka', type: 'gear', icon: '🎒', desc: 'Na spraye i vlepki. Obowiazkowy ekwipunek.', stats: { respect: 10, inventory_slots: 2 }, price: 220 },
            'headphones_studio': { name: 'Sluchawki Studio', type: 'gear', icon: '🎧', desc: 'Slyszysz kazdy detal w podkladzie.', stats: { respect: 55, focus: 15 }, price: 1900 },
            'grillz_silver': { name: 'Srebrne Grillzy', type: 'gear', icon: '🦷', desc: 'Usmiech wart tysiace. Styl prosto z USA.', stats: { respect: 85, charisma: 20 }, price: 4800 },

            // SOUVENIRS / ROOM ITEMS (Higher Respect, can be USED for Stamina/Respect)
            'vinyl_classic': { name: 'Klasyczny Wosk', type: 'souvenir', icon: '💿', desc: 'Unikatowa plyta. +50 Respektu po wystawieniu.', stats: { respect: 50 }, price: 1500 },
            'poster_concert': { name: 'Plakat Koncertowy', type: 'souvenir', icon: '📜', desc: 'Z oryginalnym autografem gwiazdy.', stats: { respect: 25 }, price: 300 },
            'award_gold': { name: 'Zlota Plyta', type: 'souvenir', icon: '📀', desc: 'Symbol sukcesu. +1000 Respektu!', stats: { respect: 1000 }, price: 50000 },
            'cassette_demo': { name: 'Kaseta Demo', type: 'souvenir', icon: '📼', desc: 'Unikatowy material z poczatkow sceny.', stats: { respect: 150 }, price: 2800 },
            'wutang_vinyl': { name: 'Plyta Wu-Tang', type: 'souvenir', icon: '💎', desc: 'SWIETY GRAAL. +50000 Respektu.', stats: { respect: 50000 }, price: 21150000 },
            'magazine_hiphop': { name: 'Czasopismo Slizg', type: 'souvenir', icon: '📖', desc: 'Archiwalny numer z kultowymi tekstami.', stats: { respect: 30 }, price: 150 },
            'vhs_skate': { name: 'VHS Skate Film', type: 'souvenir', icon: '📽️', desc: 'Klasyczne montaze video z lat 90.', stats: { respect: 40 }, price: 450 },
            'walkman_retro': { name: 'Walkman Retro', type: 'souvenir', icon: '📻', desc: 'Kultowy odtwarzacz kaset w idealnym stanie.', stats: { respect: 70 }, price: 1200 },
            'autograph_card': { name: 'Karta z Podpisem', type: 'souvenir', icon: '✍️', desc: 'Reczny podpis legendy rapu.', stats: { respect: 250 }, price: 5000 },
            'ticket_frontrow': { name: 'Bilet pod Scena', type: 'souvenir', icon: '🎟️', desc: 'Pamiatka z koncertu ktory zmienil wszystko.', stats: { respect: 35 }, price: 400 },
            'spray_can': { name: 'Puszka Farby', type: 'souvenir', icon: '🥫', desc: 'Uzyj w pokoju, aby zyskac +20 Respektu (zuzywa sie).', stats: { respect: 20 }, price: 250, consumable: true },
            'kebab_box': { name: 'Kebab w Boxie', type: 'souvenir', icon: '🥙', desc: 'Ustaw w pokoju i zjedz, by odnowic 40 Staminy.', stats: { stamina: 40 }, price: 200, consumable: true },
            'energy_drink': { name: 'Energetyk', type: 'souvenir', icon: '⚡', desc: 'Szybki strzal energii (+50 Stamina).', stats: { stamina: 50 }, price: 400, consumable: true },
            'pizza_slice': { name: 'Pizza', type: 'souvenir', icon: '🍕', desc: 'Sycacy posilek (+25 Stamina).', stats: { stamina: 25 }, price: 150, consumable: true },
            'zapiekanka': { name: 'Zapiekanka Giga', type: 'consumable', icon: '🥖', desc: 'Chrupiacy klasyk z dworca.', stats: { stamina: 15 }, price: 125 },
            'yerba_mate': { name: 'Yerba Mate', type: 'consumable', icon: '🧉', desc: 'Naturalne pobudzenie i koncentracja.', stats: { stamina: 40 }, price: 300 },
            'hot_dog': { name: 'Hot Dog ze Stacji', type: 'consumable', icon: '🌭', desc: 'Szybka przekaska w trasie koncertowej.', stats: { stamina: 10 }, price: 75 },
            'burger_underground': { name: 'Burger Podziemie', type: 'consumable', icon: '🍔', desc: 'Sycacy, tlusty i pelen kalorii.', stats: { stamina: 60 }, price: 350 },
            'coffee_black': { name: 'Czarna Kawa', type: 'consumable', icon: '☕', desc: 'Pobudza lepiej niz cokolwiek innego.', stats: { stamina: 25 }, price: 100 },
            'donut_glaze': { name: 'Paczek z Lukrem', type: 'consumable', icon: '🍩', desc: 'Cukrowy strzal energii dla rapera.', stats: { stamina: 12 }, price: 50 },

            // EXCLUSIVE (Very High Price/Respect)
            'platinum_mic': { name: 'Platynowy Majk', type: 'gear', icon: '🎤', desc: 'Wykuty z platyny. Dla najwiekszych gwiazd.', stats: { respect: 2000, power: 25 }, price: 150000 },
            'diamond_chain': { name: 'Diamentowy Lancuch', type: 'gear', icon: '⛓️', desc: 'Oslepiasz konkurencje swoim blaskiem.', stats: { respect: 5000, style: 100 }, price: 450000 },
            'exclusive_demo': { name: 'Album Widmo', type: 'souvenir', icon: '💿', desc: 'Tylko 10 sztuk na calym świecie.', stats: { respect: 10000 }, price: 800000 },
            'golden_kazoo': { name: 'Zlote Kazoo', type: 'gear', icon: '🎷', desc: 'Najdrozszy zart w historii hip-hopu.', stats: { respect: 1, luck: 100 }, price: 999999 },
            'rare_hoodie': { name: 'Bialy Kruk HK', type: 'gear', icon: '🧥', desc: 'Limitowany drop, ktorego nikt nie ma.', stats: { respect: 500, defense: 30 }, price: 25000 },

            // PROPERTIES (References for Dealer)
            'prop_tent': { name: 'Namiot', type: 'property', icon: '⛺', desc: 'Prowizoryczne lokum. Slaba regeneracja.', stats: { regen: 1 }, price: 800 },
            'prop_camper': { name: 'Kamper', type: 'property', icon: '🚐', desc: 'Wolnosc i dom na kolkach.', stats: { regen: 3 }, price: 8500 },
            'prop_flat': { name: 'Mieszkanie', type: 'property', icon: '🏢', desc: 'Kawalerka na blokowisku, twoj rewir.', stats: { regen: 8 }, price: 75000 },
            'prop_house': { name: 'Dom', type: 'property', icon: '🏠', desc: 'Przedmiejskie luksusy i cisza.', stats: { regen: 15 }, price: 450000 },
            'prop_apt': { name: 'Apartament', type: 'property', icon: '🏢', desc: 'Penthouse z widokiem na cala stolice.', stats: { regen: 30 }, price: 1500000 },
            'prop_villa': { name: 'Willa', type: 'property', icon: '🏰', desc: 'Palacowa posiadlosc. Najlepszy odpoczynek.', stats: { regen: 100 }, price: 10000000 },

            // TRANSPORT (For Dealer)
            'car_standard': { name: 'Stary Mercedes', type: 'transport', icon: '🚗', desc: 'Zawsze dowiezie.', stats: { staminaCost: 0.8 }, price: 15000 },
            'car_luxury': { name: 'Luksusowe Coupe', type: 'transport', icon: '🏎️', desc: 'Szybko i stylowo.', stats: { staminaCost: 0.5 }, price: 100000 },
            'chauffeur': { name: 'Prywatny Kierowca', type: 'transport', icon: '👮', desc: 'Spisz w trasie.', stats: { staminaCost: 0.2 }, price: 500000 }
        };
    }

    updateStorageKey() {
        // Support for iframes - 1. Check URL Params, 2. Check parent auth, 3. Check legacy storage
        const urlParams = new URLSearchParams(window.location.search);
        const profileParam = urlParams.get('profile');
        const auth = window.authManager || (window.parent && window.parent.authManager);

        if (profileParam) {
            this.currentProfile = profileParam;
        } else if (auth && auth.currentUser) {
            this.currentProfile = auth.currentUser.username;
        } else {
            this.currentProfile = localStorage.getItem('rrb_current_profile') || 'default';
        }
        this.storageKey = `rrb_inventory_${this.currentProfile}`;
    }

    refreshProfile() {
        this.updateStorageKey();
        this.inventory = this.loadInventory();
        this.dataFetchedFromServer = false;
        console.log(`[InventoryManager] Profile refreshed: ${this.currentProfile}`);
    }

    giveStarterItems() {
        if (this.inventory.items.length === 0) {
            this.addItem('mic_2001');
            this.addItem('spray_can');
            this.addItem('sneakers_og');
            this.addItem('vinyl_classic');
            return true;
        }
        return false;
    }

    loadInventory() {
        const saved = localStorage.getItem(this.storageKey);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (!parsed.placedItems) parsed.placedItems = {};
            return parsed;
        }
        return {
            items: [],
            equipped: { head: null, body: null, accessory: null },
            placedItems: {}
        };
    }

    saveInventory() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.inventory));
        if (window.collectionManager && window.authManager && window.authManager.isLoggedIn()) {
            // REMOVED: if (!this.dataFetchedFromServer) return; 
            // We should allow saving local state to server if we are logged in, 
            // especially if the server is currently empty.

            const now = Date.now();
            if (!this.lastApiSave || (now - this.lastApiSave > 5000)) {
                this.lastApiSave = now;
                console.log(`[InventoryManager] Triggering background collection save for profile: ${this.currentProfile}`);
                setTimeout(() => {
                    const cm = window.collectionManager || (window.parent && window.parent.collectionManager);
                    if (cm && cm.saveCollection) {
                        cm.saveCollection();
                    }
                }, 100);
            }
        }
    }

    importData(data) {
        if (!data) return;
        this.dataFetchedFromServer = true;
        if (!this.inventory) this.inventory = { items: [], equipped: { head: null, body: null, accessory: null }, placedItems: {} };

        // 1. Merge Items with Total Count Strategy (Inventory + Placed)
        if (data.items && Array.isArray(data.items)) {
            const localItems = this.inventory.items || [];
            const serverItems = data.items;
            const serverPlaced = data.placedItems || {};
            const localPlaced = this.inventory.placedItems || {};

            // Helper to get total counts by ID
            const getTotals = (items, placed) => {
                const counts = {};
                items.forEach(id => counts[id] = (counts[id] || 0) + 1);
                Object.values(placed).forEach(id => {
                    if (id) counts[id] = (counts[id] || 0) + 1;
                });
                return counts;
            };

            const localTotals = getTotals(localItems, localPlaced);
            const serverTotals = getTotals(serverItems, serverPlaced);
            const allIds = [...new Set([...Object.keys(localTotals), ...Object.keys(serverTotals)])];

            // Build new inventory items list based on Max totals
            const mergedItems = [];
            allIds.forEach(id => {
                const targetTotal = Math.max(localTotals[id] || 0, serverTotals[id] || 0);
                // How many are already placed locally?
                const currentlyPlaced = Object.values(localPlaced).filter(x => x === id).length;
                // Add the remainder to the inventory
                const remainder = Math.max(0, targetTotal - currentlyPlaced);
                for (let i = 0; i < remainder; i++) {
                    mergedItems.push(id);
                }
            });

            this.inventory.items = mergedItems;
        }

        // 2. Placed Items & Equipment: Server state is preferred if NOT empty
        // If server returns an empty object, we keep local placement to be safe
        if (data.equipped && Object.keys(data.equipped).length > 0) {
            this.inventory.equipped = data.equipped;
        }
        if (data.placedItems && Object.keys(data.placedItems).length > 0) {
            this.inventory.placedItems = data.placedItems;
        }

        this.saveInventory();
    }

    getExportData() {
        this.inventory = this.loadInventory(); // SYNC BEFORE EXPORT
        return this.inventory;
    }

    addItem(itemId) {
        this.inventory = this.loadInventory(); // SYNC BEFORE CHANGE
        if (this.itemsDatabase[itemId]) {
            this.inventory.items.push(itemId);
            this.saveInventory();
            return true;
        }
        return false;
    }

    getItems() {
        return this.inventory.items.map(id => ({ id, ...this.itemsDatabase[id] }));
    }

    getItemCount(itemId) {
        return this.inventory.items.filter(id => id === itemId).length;
    }

    buyItem(itemId, priceOverride = null) {
        this.inventory = this.loadInventory(); // SYNC BEFORE CHANGE
        const item = this.itemsDatabase[itemId];
        if (!item) return { success: false, message: "Przedmiot nie istnieje." };
        const price = (priceOverride !== null) ? priceOverride : item.price;
        if (!window.collectionManager) return { success: false, message: "System ekonomii niedostepny." };
        if (window.collectionManager.getMoney() < price) return { success: false, message: `Za malo MK! Potrzebujesz ${price} MK.` };

        window.collectionManager.updateMoney(-price);
        if (item.type === 'property') {
            if (window.statsManager) window.statsManager.addProperty(itemId);
        } else if (item.type === 'transport') {
            if (window.statsManager) {
                window.statsManager.stats.rpg.transport = itemId;
                window.statsManager.saveStats();
            }
        } else {
            this.addItem(itemId);
        }
        return { success: true, message: `Kupiono ${item.name}!` };
    }

    placeItem(itemId, slotId) {
        this.inventory = this.loadInventory(); // SYNC BEFORE CHANGE
        if (!this.inventory.placedItems) this.inventory.placedItems = {};

        // MOVED: Remove from general inventory inventory.items
        const index = this.inventory.items.indexOf(itemId);
        if (index > -1) {
            this.inventory.items.splice(index, 1);
            this.inventory.placedItems[slotId] = itemId;
            this.saveInventory();
            return true;
        }
        return false;
    }

    removeItemFromRoom(slotId) {
        this.inventory = this.loadInventory(); // SYNC BEFORE CHANGE
        if (this.inventory.placedItems && this.inventory.placedItems[slotId]) {
            const itemId = this.inventory.placedItems[slotId];
            this.inventory.items.push(itemId); // Add back to szafka
            delete this.inventory.placedItems[slotId];
            this.saveInventory();
            return true;
        }
        return false;
    }

    usePlacedItem(slotId) {
        this.inventory = this.loadInventory(); // SYNC BEFORE CHANGE
        if (!this.inventory.placedItems || !this.inventory.placedItems[slotId]) {
            return { success: false, message: "Brak przedmiotu!" };
        }

        const itemId = this.inventory.placedItems[slotId];
        const item = this.itemsDatabase[itemId];

        if (!item) return { success: false, message: "Błąd bazy przedmiotów!" };

        // Apply stats
        this.applyItemEffect(item);

        // ALWAYS CONSUME when 'usePlacedItem' is called (User Request: "rzeczy jak czapka czy mikrofon sie nie zuzywaja")
        // This prevents infinite stat farming from non-consumable items that have 'Use' button enabled.
        delete this.inventory.placedItems[slotId];
        this.saveInventory();
        return { success: true, message: `Użyto: ${item.name}!`, consumed: true };
    }

    applyItemEffect(item) {
        // Support for iframes
        const sm = window.statsManager || (window.parent && window.parent.statsManager);
        const parentWindow = (window.parent && window.parent.updateStats) ? window.parent : window;

        if (sm) {
            if (item.stats) {
                if (item.stats.respect) {
                    sm.addRespect(item.stats.respect);
                }
                if (item.stats.stamina) {
                    sm.regenerateStamina(item.stats.stamina);
                }
            }

            // Notify to sync UI
            if (parentWindow.updateStats) {
                parentWindow.updateStats();
            }
        } else {
            console.error("[InventoryManager] StatsManager not found!");
        }
    }

    consumeItem(itemId) {
        this.inventory = this.loadInventory(); // SYNC BEFORE CHANGE
        const count = this.getItemCount(itemId);
        if (count <= 0) return { success: false, message: "Nie masz tego przedmiotu!" };

        const item = this.itemsDatabase[itemId];

        // ALL ITEMS SHOULD BE USABLE (User Request V9.6)
        this.applyItemEffect(item);

        // ALWAYS CONSUME (User Request: prevent infinite usage)
        const idx = this.inventory.items.indexOf(itemId);
        if (idx > -1) {
            this.inventory.items.splice(idx, 1);
            this.saveInventory();
        }
        return { success: true, message: `Użyto: ${item.name}.`, consumed: true };
    }

    sellItem(itemId) {
        this.inventory = this.loadInventory(); // SYNC BEFORE CHANGE
        const idx = this.inventory.items.indexOf(itemId);
        if (idx === -1) return { success: false, message: "Nie posiadasz tego przedmiotu!" };
        const item = this.itemsDatabase[itemId];
        const sellPrice = Math.floor(item.price * 0.5);
        this.inventory.items.splice(idx, 1);
        this.saveInventory();
        if (window.collectionManager) window.collectionManager.updateMoney(sellPrice);
        return { success: true, message: `Sprzedano ${item.name} za ${sellPrice} MK!` };
    }
}

if (typeof window !== 'undefined') {
    window.InventoryManager = InventoryManager;
}
