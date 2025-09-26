// Gemini AI Orchestrator for Cricket Match Management

class CricketOrchestrator {
    constructor() {
        this.apiKey = null; // Will be set from config
        this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
        this.config = null;
        this.loadConfig();
    }

    // Load configuration
    loadConfig() {
        try {
            // Try to load config from global CONFIG object
            if (typeof CONFIG !== 'undefined') {
                this.config = CONFIG;
                this.apiKey = CONFIG.GEMINI_API_KEY;
                this.baseUrl = CONFIG.GEMINI_API_URL;
            }
        } catch (error) {
            console.warn('Config not loaded, using default settings:', error);
        }
    }

    // Set API key for Gemini
    setApiKey(apiKey) {
        this.apiKey = apiKey;
    }

    // Main orchestration function
    async orchestrate() {
        try {
            console.log('🏏 Starting Cricket Match Orchestration...');
            
            // Step 1: Get subscribed matches
            const subscribedMatches = await this.getSubscribedMatches();
            console.log(`📋 Found ${subscribedMatches.length} subscribed matches`);
            
            // Step 2: Get live scores for subscribed matches
            const liveScores = await this.getLiveScoresForSubscribedMatches(subscribedMatches);
            console.log(`⚡ Retrieved live scores for ${liveScores.length} matches`);
            
            // Step 3: Process and return results
            return {
                subscribedMatches,
                liveScores,
                timestamp: new Date().toISOString()
            };
            
        } catch (error) {
            console.error('❌ Orchestration failed:', error);
            throw error;
        }
    }

    // Get subscribed matches using storage functions
    async getSubscribedMatches() {
        try {
            // Import storage functions dynamically
            const subscribedMatches = await getSubscribedMatchesFromStorage();
            
            // Sort subscribed matches: live matches first, then by subscription time
            return subscribedMatches.sort((a, b) => {
                // Live matches first
                if (a.status === 'live' && b.status !== 'live') return -1;
                if (a.status !== 'live' && b.status === 'live') return 1;
                
                // Then by subscription time (most recent first)
                return new Date(b.subscribedAt) - new Date(a.subscribedAt);
            });
            
        } catch (error) {
            console.error('Error getting subscribed matches:', error);
            return [];
        }
    }

    // Get live scores for all subscribed matches
    async getLiveScoresForSubscribedMatches(subscribedMatches) {
        const liveScores = [];
        
        for (const match of subscribedMatches) {
            try {
                if (match.status === 'live') {
                    const liveScore = await getLiveScore(match.id);
                    if (liveScore) {
                        liveScores.push(liveScore);
                    }
                }
            } catch (error) {
                console.error(`Error getting live score for match ${match.id}:`, error);
            }
        }
        
        return liveScores;
    }

    // Enhanced orchestration with Gemini AI (for future implementation)
    async orchestrateWithGemini() {
        if (!this.apiKey) {
            console.warn('⚠️ Gemini API key not set. Using mock data.');
            return await this.orchestrate();
        }

        try {
            // This is where you would integrate with Gemini AI
            // For now, we'll use the basic orchestration
            const result = await this.orchestrate();
            
            // Future: Use Gemini to analyze match data, provide insights, etc.
            // const geminiAnalysis = await this.analyzeWithGemini(result);
            
            return result;
            
        } catch (error) {
            console.error('Gemini orchestration failed:', error);
            // Fallback to basic orchestration
            return await this.orchestrate();
        }
    }

    // Analyze match data with Gemini (placeholder for future implementation)
    async analyzeWithGemini(matchData) {
        if (!this.apiKey) {
            return null;
        }

        try {
            const prompt = `
            Analyze the following cricket match data and provide insights:
            
            Subscribed Matches: ${JSON.stringify(matchData.subscribedMatches, null, 2)}
            Live Scores: ${JSON.stringify(matchData.liveScores, null, 2)}
            
            Please provide:
            1. Key highlights from live matches
            2. Interesting upcoming matches
            3. Any notable statistics or trends
            `;

            // This would make an actual API call to Gemini
            // const response = await this.callGeminiAPI(prompt);
            
            return {
                insights: "Gemini analysis will be implemented here",
                highlights: [],
                recommendations: []
            };
            
        } catch (error) {
            console.error('Gemini analysis failed:', error);
            return null;
        }
    }

    // Call Gemini API (placeholder for future implementation)
    async callGeminiAPI(prompt) {
        if (!this.apiKey) {
            throw new Error('Gemini API key not configured');
        }

        // This is where you would implement the actual Gemini API call
        // For now, return a mock response
        return {
            candidates: [{
                content: {
                    parts: [{
                        text: "This is a placeholder response. Gemini API integration will be implemented here."
                    }]
                }
            }]
        };
    }

    // Get match recommendations using Gemini
    async getMatchRecommendations() {
        try {
            const allMatches = await getAllMatches();
            
            // For now, return basic recommendations
            // Future: Use Gemini to analyze and recommend matches
            const recommendations = {
                trending: allMatches.live.slice(0, 2),
                upcoming: allMatches.upcoming.slice(0, 3),
                insights: "Recommendations will be enhanced with Gemini AI"
            };
            
            return recommendations;
            
        } catch (error) {
            console.error('Error getting recommendations:', error);
            return { trending: [], upcoming: [], insights: "Unable to get recommendations" };
        }
    }

    // Refresh all data
    async refreshData() {
        console.log('🔄 Refreshing cricket data...');
        
        try {
            const result = await this.orchestrate();
            console.log('✅ Data refresh completed');
            return result;
            
        } catch (error) {
            console.error('❌ Data refresh failed:', error);
            throw error;
        }
    }

    // Get orchestration status
    getStatus() {
        return {
            apiKeyConfigured: !!this.apiKey,
            lastRefresh: new Date().toISOString(),
            version: '1.0.0',
            configLoaded: !!this.config,
            features: this.config?.FEATURES || {}
        };
    }

    // Get configuration value
    getConfigValue(key, defaultValue = null) {
        if (!this.config) return defaultValue;
        
        const keys = key.split('.');
        let value = this.config;
        
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return defaultValue;
            }
        }
        
        return value;
    }
}

// Create global orchestrator instance
const cricketOrchestrator = new CricketOrchestrator();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CricketOrchestrator;
}
