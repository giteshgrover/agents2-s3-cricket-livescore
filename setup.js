// Setup script for Cricket Live Scores Extension
// This script helps users configure their API keys and settings

class ExtensionSetup {
    constructor() {
        this.configTemplate = null;
        this.loadTemplate();
    }

    loadTemplate() {
        // This would normally load from config.template.js
        // For now, we'll provide the template content
        this.configTemplate = `
// Configuration file for Cricket Live Scores Extension
// Add your API keys and configuration here

const CONFIG = {
    // Gemini AI Configuration
    GEMINI_API_KEY: '', // Add your Gemini API key here
    GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta',
    
    // Extension Settings
    AUTO_REFRESH_INTERVAL: 30000, // 30 seconds in milliseconds
    MAX_SUBSCRIPTIONS: 50, // Maximum number of matches user can subscribe to
    
    // API Endpoints (for future real API integration)
    CRICKET_API: {
        BASE_URL: '', // Add your cricket API base URL here
        LIVE_MATCHES_ENDPOINT: '/matches/live',
        UPCOMING_MATCHES_ENDPOINT: '/matches/upcoming',
        LIVE_SCORES_ENDPOINT: '/scores/live',
        API_KEY: '' // Add your cricket API key here if needed
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
}`;
    }

    // Check if config file exists
    checkConfigExists() {
        try {
            // In a real implementation, this would check if config.js exists
            return typeof CONFIG !== 'undefined';
        } catch (error) {
            return false;
        }
    }

    // Get setup instructions
    getSetupInstructions() {
        return {
            steps: [
                {
                    step: 1,
                    title: "Get Gemini API Key",
                    description: "Visit Google AI Studio to get your Gemini API key",
                    url: "https://makersuite.google.com/app/apikey",
                    action: "Get API Key"
                },
                {
                    step: 2,
                    title: "Create Config File",
                    description: "Copy config.template.js to config.js and add your API key",
                    action: "Copy Template"
                },
                {
                    step: 3,
                    title: "Add API Key",
                    description: "Replace 'YOUR_GEMINI_API_KEY_HERE' with your actual API key",
                    action: "Edit Config"
                },
                {
                    step: 4,
                    title: "Reload Extension",
                    description: "Reload the extension in Chrome to apply changes",
                    action: "Reload Extension"
                }
            ],
            status: this.checkConfigExists() ? "configured" : "not_configured"
        };
    }

    // Validate configuration
    validateConfig() {
        const issues = [];
        
        if (!this.checkConfigExists()) {
            issues.push("Config file not found");
            return { valid: false, issues };
        }

        try {
            if (!CONFIG.GEMINI_API_KEY || CONFIG.GEMINI_API_KEY === '') {
                issues.push("Gemini API key not set");
            }
            
            if (!CONFIG.GEMINI_API_KEY || CONFIG.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
                issues.push("Gemini API key is still using template value");
            }

            return {
                valid: issues.length === 0,
                issues
            };
        } catch (error) {
            issues.push("Error reading configuration");
            return { valid: false, issues };
        }
    }

    // Get configuration status
    getConfigStatus() {
        const validation = this.validateConfig();
        const instructions = this.getSetupInstructions();
        
        return {
            configured: validation.valid,
            issues: validation.issues,
            instructions: instructions.steps,
            nextStep: validation.valid ? null : instructions.steps[0]
        };
    }
}

// Create global setup instance
const extensionSetup = new ExtensionSetup();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ExtensionSetup;
}
