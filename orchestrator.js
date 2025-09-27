// Gemini AI Orchestrator for Cricket Match Management

// const { getAllMatches } = require("./apiData");

class CricketOrchestrator {
    constructor() {
        this.apiKey = null; // Will be set from config
        this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
        this.config = null;
        this.loadConfig();
        this.functionMap = this.loadFunctionMap()
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
            const liveScores = await this.getLiveScoresForMatches(subscribedMatches.filter(m => m.status === 'live').map(m => m.id));
            console.log(`⚡ Retrieved live scores for ${liveScores.length} matches`);

            const allMatches = await getAllMatches(this.config);
            console.log(`⚡ Retrieved all matches - ${allMatches.live.length} live matches and ${allMatches.upcoming.length} upcoming matches`);

            // Combine with subscription status
            const liveMatchesWithStatus = this.addSubscriptionStatus(allMatches.live, subscribedMatches);
            const upcomingMatchesWithStatus = this.addSubscriptionStatus(allMatches.upcoming, subscribedMatches);

            // Sort: subscribed matches first, then by time
            const sortedLiveMatches = this.sortMatches(liveMatchesWithStatus);
            const sortedUpcomingMatches = this.sortMatches(upcomingMatchesWithStatus);

            // Step 3: Process and return results
            return {
                liveMatches: sortedLiveMatches,
                upcomingMatches: sortedUpcomingMatches,
                liveScores,
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            console.error('❌ Orchestration failed:', error);
            throw error;
        }
    }

    async executeFunc(funcName, params) {
        console.log("functionMap ", this.functionMap)
        if (funcName in this.functionMap) {
            if (params) {
                // params = params.map(p => p.includes(',') ? p.split(",") : p)
                return await this.functionMap[funcName](params)
            } else {
                return await this.functionMap[funcName]()
            }
           
        }
        throw new Error(`functionName ${funcName} not found`);
    }

    loadFunctionMap() {
        return {
            getSubscribedMatches: async () => this.getSubscribedMatches() ,
            getLiveScoresForMatches: async (liveMatchIds) =>  this.getLiveScoresForMatches(JSON.parse(liveMatchIds)),
            getAllLiveAndUpcomingMatches: async () => getAllMatches(this.config),
            addSubscriptionStatusToMatches: (params) => this.addSubscriptionStatus(JSON.parse(params[0].replaceAll("'", '"')), JSON.parse(params[1])),
            sortMatchesBySubscription: (matches) => this.sortMatches(JSON.parse(matches))

        }

    }

    functions_description() {
        return `
       1. getSubscribedMatches() It returns a list of matches that user is subsribed to.
       2. getLiveScoresForMatches(list) It returns a list of live scores for the given list of matches
       3. getAllLiveAndUpcomingMatches() It returns a map of all live and upcoming matches. The returned map has two keys 'live' and 'upcoming'. Each key will have a list of matches as values.
       4. addSubscriptionStatusToMatches(list, list) It takes two lists as inputParam, the first list is a list of either live or upcoming mtches while the second one is the  list of subscribed matches. It returns an updated list of supplied live or upcoming matches by adding another  key 'isSubscribed' with boolean value indicating whether that match has been subscribed by the user or not
       5. sortMatchesBySubscription(list) It takes a list of live or upcoming messages with precense of 'isSubscribed' key for each element. It sorts the matches in the order of subscription and returns the sorted list
        `;
    }

    // Enhanced orchestration with Gemini AI (for future implementation)
    async orchestrateWithGemini() {
        console.log('🏏 Starting Cricket Match Orchestration with LLM...');
        if (!this.apiKey) {
            console.warn('⚠️ Gemini API key not set. Using non LLM code.');
            return await this.orchestrate();
        }

        try {
            // This is where you would integrate with Gemini AI
            // For now, we'll use the basic orchestration
            // const result = await this.orchestrate();

            const systemPrompt = `You are a cricket match fetcher agent solving problems in iterations. Respond with EXACTLY ONE of these formats:
                    1. FUNCTION_CALL: function_name|inputParam1|inputParam2|inputParam3 ...
                    2. FINAL_ANSWER: json_object
                    Where, json_object is a JSON object in following format:
                    {
                        liveMatches: sortedLiveMatches,
                        upcomingMatches: sortedUpcomingMatches,
                        liveScores,
                        timestamp: date in ISO string format
                    }
                    while function_name is one of the following (Don't forget that if more than one parameters need to be passed in, they MUST BE separated by '|' and NOT ',' when calling the function):
                    ${this.functions_description()}
                    `;

            const query = `Fetch, prepare and return the list of live matches and upcoming messages with info including status but not limited to (live or upcoming), venue, team1, team2, isSubscribed, etc. 
            This list should be sorted in the order of subscription. 
            Also, return the list of live scores for all the matches that user has subscribed to. 
            Also, add the current date in ISO format`;


            const iterationResponses = []
            var iteration = 0
            const maxIterations = 10
            while (iteration < maxIterations) {
                console.log(`--- Iteration ${iteration + 1} ---`)

                var currQuery = query;
                if (iterationResponses.length > 0) {
                    currQuery = currQuery + "\n\n" + iterationResponses.join(" ") + "  What should I do next?";
                }

                const prompt = systemPrompt + "\n\nQuery: " + currQuery
                console.log(`Prompt for ${iteration + 1}: ${prompt}`)

                const responseText = await this.callGeminiAPI(prompt);
                console.log('LLM response: ' + responseText);

                if (responseText.startsWith("FINAL_ANSWER:")) {
                    console.log("=== Agent Execution Complete === with final answer ", responseText)
                    return JSON.parse(responseText.replace("FINAL_ANSWER:", ""))
                } else {
                    const funcInfo = responseText.split("FUNCTION_CALL: ")[1]
                    const funcDetails = funcInfo.split("|")
                    const funcName = funcDetails[0].trim()
                    var params = []
                    if (funcDetails[1]) {
                        params = funcDetails.slice(1)
                    }
                    const funcResult = await this.executeFunc(funcName, params)
                    console.log(funcName, "Params: ", params)
                    iterationResponses.push(`In the ${iteration + 1} iteration you called ${funcName} with ${params} parameters, and the function returned ${JSON.stringify(funcResult, null, 2)}.`)
                }
                iteration += 1
            }



            // Future: Use Gemini to analyze match data, provide insights, etc.
            // const geminiAnalysis = await this.analyzeWithGemini(result);


            return result;

        } catch (error) {
            console.error('Gemini orchestration failed:', error);
            // Fallback to basic orchestration
            // return await this.orchestrate();
        }
    }

    // Get live scores for matches
    async getLiveScoresForMatches(liveMatchIds) {
        const liveScores = [];

        for (const liveMatchId of liveMatchIds) {
            try {
                const liveScore = await getLiveScore(this.config, liveMatchId);
                if (liveScore) {
                    liveScores.push(liveScore);
                }
            } catch (error) {
                console.error(`Error getting live score for match ${match.id}:`, error);
            }
        }

        return liveScores;
    }

    async unsubscribeMatch(match) {
        return await unsubscribeFromMatchFromStorage(match.id);
    }

    async subscribeMatch(match) {
        return await subscribeToMatchFromStorage(match.id, match);
    }

    sortMatches(matches) {
        return matches.sort((a, b) => {
            // Subscribed matches first
            if (a.isSubscribed && !b.isSubscribed) return -1;
            if (!a.isSubscribed && b.isSubscribed) return 1;

            // Then by status (live first)
            if (a.status === 'live' && b.status !== 'live') return -1;
            if (a.status !== 'live' && b.status === 'live') return 1;

            // Then by time
            return new Date(a.startTime) - new Date(b.startTime);
        });
    }

    addSubscriptionStatus(matches, subscribedMatches) {
        const matchesWithStatus = [];

        for (const match of matches) {
            const isSubscribed = subscribedMatches.some(subscribedMatch => subscribedMatch.id === match.id);
            matchesWithStatus.push({
                ...match,
                isSubscribed
            });
        }

        return matchesWithStatus;
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

        try {
            const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Goog-Api-Key': this.apiKey
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 1024,
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
                throw new Error('Invalid response from Gemini API');
            }

            return data.candidates[0].content.parts[0].text.trim();

        } catch (error) {
            console.error('Gemini API Error:', error);
            throw error;
        }
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
