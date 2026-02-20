class SaveManager {
    constructor() {
        this.saveInterval = null;
        this.intervalMs = 20000; // 20 seconds
        this.isSaving = false;

        console.log('[SaveManager] Initialized. Autosave every', this.intervalMs / 1000, 'seconds.');
    }

    startAutosave() {
        if (this.saveInterval) {
            clearInterval(this.saveInterval);
        }

        console.log('[SaveManager] Starting autosave loop.');
        this.saveInterval = setInterval(() => {
            this.syncProfile();
        }, this.intervalMs);
    }

    stopAutosave() {
        if (this.saveInterval) {
            clearInterval(this.saveInterval);
            this.saveInterval = null;
            console.log('[SaveManager] Stopped autosave loop.');
        }
    }

    async syncProfile() {
        // Prevent concurrent saves
        if (this.isSaving) return;

        // Only save if logged in
        if (!window.authManager || !window.authManager.isLoggedIn()) {
            return;
        }

        this.isSaving = true;

        try {
            // Gather all data from managers with fallbacks
            const payload = {
                collection: window.collectionManager ? window.collectionManager.getCollectionData() : { cards: {}, selected_card_id: null, money: 0 },
                economy: window.inventoryManager ? { money: window.inventoryManager.mk } : { money: 0 },
                achievements: window.achievementManager ? {
                    stats: window.achievementManager.stats || {},
                    unlocked: window.achievementManager.unlocked ? Array.from(window.achievementManager.unlocked) : [],
                    rewards_claimed: window.achievementManager.rewardsClaimed ? Array.from(window.achievementManager.rewardsClaimed) : []
                } : null,
                inventory: window.inventoryManager ? (window.inventoryManager.getInventory ? window.inventoryManager.getInventory() : {}) : {},
                perks: window.perkManager ? {
                    learned: window.perkManager.learnedPerks || [],
                    totalSpentSP: window.perkManager.totalSpentSP || 0
                } : { learned: [], totalSpentSP: 0 },
                stats: window.statsManager ? (window.statsManager.stats || {}) : {}
            };

            const response = await fetch(`${window.authManager.apiBase}/auth/profile/sync`, {
                method: 'PUT',
                headers: window.authManager.getAuthHeaders(),
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (data.success) {
                console.log('[SaveManager] Autosave successful at', new Date().toLocaleTimeString());

                // Show a subtle save indicator
                this.showSaveIndicator();
            } else {
                console.warn('[SaveManager] Autosave failed:', data.message);
            }

        } catch (error) {
            console.error('[SaveManager] Error during autosave:', error);
        } finally {
            this.isSaving = false;
        }
    }

    showSaveIndicator() {
        let indicator = document.getElementById('saveIndicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'saveIndicator';
            indicator.innerHTML = '<span style="font-size: 10px;">💾 Zapisano</span>';
            indicator.style.cssText = `
                position: fixed;
                bottom: 10px;
                right: 10px;
                background: rgba(0, 255, 0, 0.2);
                color: #00ff00;
                border: 1px solid #00ff00;
                padding: 4px 8px;
                border-radius: 4px;
                font-family: "Press Start 2P";
                z-index: 10000;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.5s;
            `;
            document.body.appendChild(indicator);
        }

        indicator.style.opacity = '1';
        setTimeout(() => {
            indicator.style.opacity = '0';
        }, 2000);
    }
}

// Global instance created later in AuthManager when needed
