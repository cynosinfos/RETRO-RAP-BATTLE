class QuestManager {
    constructor() {
        this.currentProfile = localStorage.getItem('rrb_current_profile') || 'default';
        this.storageKey = `rrb_quests_${this.currentProfile}`;
        this.activeQuests = this.loadQuests();

        // Database of possible quests
        this.questDatabase = {
            'first_steps': {
                name: 'POCZĄTKI KARIERY',
                desc: 'Oddaj 5 ciosów w dowolnej walce.',
                goal: 5,
                type: 'punch_count',
                reward: 200,
                rewardRespekt: 50
            },
            'local_hero': {
                name: 'LOKALNY BOHATER',
                desc: 'Wygraj 3 walki (PVE).',
                goal: 3,
                type: 'win_matches',
                reward: 1000,
                rewardRespekt: 200
            },
            'rich_kid': {
                name: 'DROGA NA SZCZYT',
                desc: 'Zarób łącznie 2000 MK.',
                goal: 2000,
                type: 'earn_money',
                reward: 500,
                rewardRespekt: 300
            }
        };

        // Initialize default quests if empty
        if (Object.keys(this.activeQuests).length === 0) {
            this.activeQuests = {
                'first_steps': { progress: 0, completed: false },
                'local_hero': { progress: 0, completed: false },
                'rich_kid': { progress: 0, completed: false }
            };
            this.saveQuests();
        }
    }

    loadQuests() {
        const saved = localStorage.getItem(this.storageKey);
        return saved ? JSON.parse(saved) : {};
    }

    saveQuests() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.activeQuests));
    }

    trackProgress(type, amount = 1) {
        let changed = false;
        Object.keys(this.activeQuests).forEach(id => {
            const status = this.activeQuests[id];
            const quest = this.questDatabase[id];

            if (quest && quest.type === type && !status.completed) {
                status.progress += amount;
                if (status.progress >= quest.goal) {
                    this.completeQuest(id);
                }
                changed = true;
            }
        });
        if (changed) this.saveQuests();
    }

    completeQuest(id) {
        const status = this.activeQuests[id];
        const quest = this.questDatabase[id];
        if (status.completed) return;

        status.completed = true;
        status.progress = quest.goal;

        // Give Rewards
        if (window.collectionManager) window.collectionManager.updateMoney(quest.reward);
        if (window.statsManager) window.statsManager.updateRpgStat('respect', quest.rewardRespekt);

        console.log(`[QuestManager] Quest Completed: ${quest.name}`);
        // Optional: Notify user (could use global notification system if exists)
    }

    getQuestStatus(id) {
        return this.activeQuests[id];
    }
}

window.questManager = new QuestManager();
