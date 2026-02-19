class CrewManager {
    constructor() {
        this.currentProfile = localStorage.getItem('rrb_current_profile') || 'default';
        this.storageKey = `rrb_crew_${this.currentProfile}`;
        this.crew = this.loadCrew();

        // Database of recruitable crew members
        this.crewDatabase = {
            'bodyguard_1': {
                name: 'GORYL MAREK',
                role: 'BODYGUARD',
                desc: '+20 Max HP w walce.',
                icon: '🦍',
                price: 15000,
                effect: { type: 'max_hp', value: 20 }
            },
            'producer_kubi': {
                name: 'DJ PENDRIVE',
                role: 'PRODUCENT',
                desc: '+15% zarobków z koncertów/walk.',
                icon: '🎹',
                price: 50000,
                effect: { type: 'money_mult', value: 1.15 }
            },
            'hypeman_2115': {
                name: 'MŁODY ŁYCHA',
                role: 'HYPE MAN',
                desc: '+10 respektu za każdą wygraną walkę.',
                icon: '🗣️',
                price: 25000,
                effect: { type: 'win_respect', value: 10 }
            }
        };
    }

    loadCrew() {
        const saved = localStorage.getItem(this.storageKey);
        return saved ? JSON.parse(saved) : {
            members: [] // Array of member IDs
        };
    }

    saveCrew() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.crew));
    }

    recruitMember(memberId) {
        const member = this.crewDatabase[memberId];
        if (!member) return { success: false, message: "Kandydat nie istnieje." };
        if (this.crew.members.includes(memberId)) return { success: false, message: "Ten członek już jest w Twoim składzie." };

        if (!window.collectionManager) return { success: false, message: "Brak systemu finansowego." };
        const money = window.collectionManager.getMoney();
        if (money < member.price) return { success: false, message: `Za mało MK! Potrzebujesz: ${member.price}` };

        window.collectionManager.updateMoney(-member.price);
        this.crew.members.push(memberId);
        this.saveCrew();
        return { success: true, message: `${member.name} dołączył do ekipy!` };
    }

    getEffectValue(type) {
        let total = 0;
        let mult = 1.0;
        this.crew.members.forEach(id => {
            const member = this.crewDatabase[id];
            if (member && member.effect.type === type) {
                if (type.endsWith('_mult')) mult *= member.effect.value;
                else total += member.effect.value;
            }
        });
        return type.endsWith('_mult') ? mult : total;
    }

    hasMember(memberId) {
        return this.crew.members.includes(memberId);
    }
}

window.crewManager = new CrewManager();
