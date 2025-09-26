// Configuration Template for Cricket Live Scores Extension
// Copy this file to config.js and add your API keys

const CONFIG = {
    // Gemini AI Configuration
    GEMINI_API_KEY: 'YOUR_GEMINI_API_KEY_HERE', // Get from https://makersuite.google.com/app/apikey
    GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta',
    
    // Extension Settings
    AUTO_REFRESH_INTERVAL: 30000, // 30 seconds in milliseconds
    MAX_SUBSCRIPTIONS: 50, // Maximum number of matches user can subscribe to
    
    // API Endpoints (for future real API integration)
    CRICKET_API: {
        BASE_URL: 'YOUR_CRICKET_API_BASE_URL', // e.g., 'https://api.cricket.com/v1'
        LIVE_MATCHES_ENDPOINT: '/matches/live',
        UPCOMING_MATCHES_ENDPOINT: '/matches/upcoming',
        LIVE_SCORES_ENDPOINT: '/scores/live',
        API_KEY: 'YOUR_CRICKET_API_KEY' // Add your cricket API key here if needed
    },
    
    // Feature Flags
    FEATURES: {
        ENABLE_GEMINI_AI: true,
        ENABLE_NOTIFICATIONS: false,
        ENABLE_DARK_MODE: false,
        ENABLE_MATCH_PREDICTIONS: false
    },
    
    // UI Configuration
    UI: {
        POPUP_WIDTH: 800,
        POPUP_HEIGHT: 600,
        THEME_COLORS: {
            PRIMARY: '#ff6b6b',
            SECONDARY: '#ee5a24',
            SUCCESS: '#28a745',
            WARNING: '#ffc107',
            DANGER: '#dc3545'
        }
    }
};

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} else {
    // For browser environment
    window.CONFIG = CONFIG;
}
