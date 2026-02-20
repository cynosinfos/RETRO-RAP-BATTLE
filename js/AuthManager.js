class AuthManager {
    constructor() {
        // Render production URL - Ensure this matches your Render service!
        const renderUrl = 'https://retro-rap-battle.onrender.com';

        // Use localhost if running locally, otherwise use Render
        const isLocal = window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1' ||
            window.location.protocol === 'file:';

        this.apiBase = isLocal ? 'http://localhost:3000/api' : `${renderUrl}/api`;
        this.token = localStorage.getItem('jwt_token');

        // Restore currentUser from localStorage if exists
        const savedUser = localStorage.getItem('user_info');
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
                localStorage.setItem('jwt_token', data.token);
                this.currentUser = data.user;
                localStorage.setItem('user_info', JSON.stringify(data.user));
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
                localStorage.setItem('jwt_token', data.token);
                this.currentUser = data.user;
                localStorage.setItem('user_info', JSON.stringify(data.user)); // Persist user info
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
        this.token = null;
        this.currentUser = null;
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user_info');
        localStorage.removeItem('rrb_current_profile');

        // Redirect to base index.html to clear query params (like ?view=playerMenu)
        // that cause auto-entry logic to fire.
        window.location.href = 'index.html';
    }
}

// Global instance
window.authManager = new AuthManager();
