const Utils = {
    deepClone: function(obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    formatTime: function(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    },

    positionsEqual: function(pos1, pos2) {
        return pos1.x === pos2.x && pos1.y === pos2.y;
    },

    getAdjacentPosition: function(pos, direction) {
        return {
            x: pos.x + direction.dx,
            y: pos.y + direction.dy
        };
    },

    getDirectionFromKey: function(keyCode, playerId) {
        const controls = CONFIG.PLAYER_CONTROLS[playerId];
        if (!controls) return null;

        switch (keyCode) {
            case controls.moveUp:
                return 'UP';
            case controls.moveDown:
                return 'DOWN';
            case controls.moveLeft:
                return 'LEFT';
            case controls.moveRight:
                return 'RIGHT';
            default:
                return null;
        }
    },

    isPushKey: function(keyCode, playerId) {
        const controls = CONFIG.PLAYER_CONTROLS[playerId];
        return controls && keyCode === controls.push;
    },

    saveToLocalStorage: function(data) {
        try {
            localStorage.setItem(
                CONFIG.GAME_SETTINGS.localStorageKey,
                JSON.stringify(data)
            );
            return true;
        } catch (e) {
            console.error('Failed to save to localStorage:', e);
            return false;
        }
    },

    loadFromLocalStorage: function() {
        try {
            const data = localStorage.getItem(CONFIG.GAME_SETTINGS.localStorageKey);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Failed to load from localStorage:', e);
            return null;
        }
    },

    clearLocalStorage: function() {
        try {
            localStorage.removeItem(CONFIG.GAME_SETTINGS.localStorageKey);
            return true;
        } catch (e) {
            console.error('Failed to clear localStorage:', e);
            return false;
        }
    },

    randomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    shuffleArray: function(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },

    delay: function(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};