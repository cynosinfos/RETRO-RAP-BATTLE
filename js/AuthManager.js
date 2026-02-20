class AuthManager {
    constructor() {
        // Render production URL - Ensure this matches your Render service!
        const renderUrl = 'https://retro-rap-battle.onrender.com';

        // Use localhost if running locally, otherwise use Render OR relative path
        // If we are on rrbt.pl, we might need to hit the Render URL directly if the backend isn't proxied.
        // Assuming rrbt.pl is just static files, we MUST hit Render.

        // Use localhost if running locally, otherwise use Render
        const isLocal = window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1';

        // FORCE HTTPS for Render if not local. 
        // NOTE: If serving from rrbt.pl (http/https), we need to hit the backend at Render.
        this.apiBase = isLocal ? 'http://localhost:3000/api' : 'https://retro-rap-battle.onrender.com/api';

        console.log(`[AuthManager] Initialized. API Base: ${this.apiBase}`);

        try {
            this.token = localStorage.getItem('jwt_token');
        } catch (e) {
            console.warn("[AuthManager] LocalStorage blocked (token)", e);
            this.token = null;
        }

        // Restore currentUser from localStorage if exists
        let savedUser = null;
        try {
            savedUser = localStorage.getItem('user_info');
        } catch (e) {
            console.warn("[AuthManager] LocalStorage blocked (user_info)", e);
        }
        if (savedUser) {
            try {
                this.currentUser = JSON.parse(savedUser);
            } catch (e) {
                console.warn("[AuthManager] Failed to parse saved user_info", e);
                this.currentUser = null;
            }
        } else {
            this.currentUser = null;
        }
    }

    isLoggedIn() {
        return !!this.token;
    }

    getAuthHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
        };
    }

    async login(username, password) {
        try {
            const response = await fetch(`${this.apiBase}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (data.success) {
                this.token = data.token;
                try {
                    localStorage.setItem('jwt_token', data.token);
                } catch (e) { console.warn("[AuthManager] LS set failed (token)", e); }

                this.currentUser = data.user;
                try {
                    localStorage.setItem('user_info', JSON.stringify(data.user));
                } catch (e) { console.warn("[AuthManager] LS set failed (user)", e); }

                // Initialize SaveManager
                window.saveManager = new SaveManager();

                return { success: true };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Blad polaczenia z serwerem.' };
        }
    }

    async register(username, email, password) {
        try {
            const response = await fetch(`${this.apiBase}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();

            if (data.success) {
                this.token = data.token;
                try {
                    localStorage.setItem('jwt_token', data.token);
                } catch (e) { console.warn("[AuthManager] LS set failed (token)", e); }

                this.currentUser = data.user;
                try {
                    localStorage.setItem('user_info', JSON.stringify(data.user)); // Persist user info
                } catch (e) { console.warn("[AuthManager] LS set failed (user)", e); }

                // Initialize SaveManager
                window.saveManager = new SaveManager();

                return { success: true };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, message: 'Blad polaczenia z serwerem: ' + (error.message || 'Unknown error') };
        }
    }

    async forgotPassword(email) {
        try {
            const response = await fetch(`${this.apiBase}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Forgot password error:', error);
            return { success: false, message: 'Blad polaczenia z serwerem.' };
        }
    }

    logout() {
        if (window.saveManager) {
            // Force a final sync before clearing everything
            window.saveManager.syncProfile();
            window.saveManager.stopAutosave();
        }

        this.token = null;
        this.currentUser = null;
        try {
            localStorage.removeItem('jwt_token');
            localStorage.removeItem('user_info');
            localStorage.removeItem('rrb_current_profile');
        } catch (e) {
            console.warn("[AuthManager] LS remove failed", e);
        }

        // Redirect to base index.html to clear query params (like ?view=playerMenu)
        // that cause auto-entry logic to fire.
        window.location.href = 'index.html';
    }
}

// Global instance
window.authManager = new AuthManager();
