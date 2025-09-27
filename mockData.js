// Mock data for cricket matches and live scores

// Mock live matches data
const mockLiveMatches = [
    {
        id: 'live_1',
        team1: 'India',
        team2: 'Australia',
        venue: 'Melbourne Cricket Ground',
        status: 'live',
        startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        currentScore: {
            team1: { runs: 245, wickets: 3, overs: 45.2 },
            team2: { runs: 0, wickets: 0, overs: 0 }
        },
        matchType: 'ODI',
        series: 'India Tour of Australia 2024'
    },
    {
        id: 'live_2',
        team1: 'England',
        team2: 'Pakistan',
        venue: 'Lord\'s Cricket Ground',
        status: 'live',
        startTime: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        currentScore: {
            team1: { runs: 0, wickets: 0, overs: 0 },
            team2: { runs: 189, wickets: 5, overs: 38.5 }
        },
        matchType: 'Test',
        series: 'Pakistan Tour of England 2024'
    },
    {
        id: 'live_3',
        team1: 'South Africa',
        team2: 'New Zealand',
        venue: 'Newlands, Cape Town',
        status: 'live',
        startTime: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        currentScore: {
            team1: { runs: 312, wickets: 7, overs: 50.0 },
            team2: { runs: 156, wickets: 2, overs: 25.3 }
        },
        matchType: 'T20',
        series: 'New Zealand Tour of South Africa 2024'
    }
];

// Mock upcoming matches data
const mockUpcomingMatches = [
    {
        id: 'upcoming_1',
        team1: 'India',
        team2: 'South Africa',
        venue: 'Wankhede Stadium, Mumbai',
        status: 'upcoming',
        startTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        matchType: 'ODI',
        series: 'South Africa Tour of India 2024'
    },
    {
        id: 'upcoming_2',
        team1: 'Australia',
        team2: 'England',
        venue: 'Sydney Cricket Ground',
        status: 'upcoming',
        startTime: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
        matchType: 'Test',
        series: 'Ashes 2024'
    },
    {
        id: 'upcoming_3',
        team1: 'Pakistan',
        team2: 'Bangladesh',
        venue: 'Gaddafi Stadium, Lahore',
        status: 'upcoming',
        startTime: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
        matchType: 'T20',
        series: 'Bangladesh Tour of Pakistan 2024'
    },
    {
        id: 'upcoming_4',
        team1: 'West Indies',
        team2: 'Sri Lanka',
        venue: 'Kensington Oval, Barbados',
        status: 'upcoming',
        startTime: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours from now
        matchType: 'ODI',
        series: 'Sri Lanka Tour of West Indies 2024'
    },
    {
        id: 'upcoming_5',
        team1: 'Afghanistan',
        team2: 'Ireland',
        venue: 'Sharjah Cricket Stadium',
        status: 'upcoming',
        startTime: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours from now
        matchType: 'T20',
        series: 'Ireland Tour of Afghanistan 2024'
    }
];

// Mock live scores data
const mockLiveScores = {
    'live_1': {
        matchId: 'live_1',
        team1: 'India',
        team2: 'Australia',
        venue: 'Melbourne Cricket Ground',
        status: 'India batting - 2nd Innings',
        currentInnings: 2,
        scores: [
            {
                team: 'Australia',
                runs: 289,
                wickets: 10,
                overs: 50.0,
                isBatting: false
            },
            {
                team: 'India',
                runs: 245,
                wickets: 3,
                overs: 45.2,
                isBatting: true
            }
        ],
        lastUpdated: new Date(),
        requiredRunRate: 4.5,
        currentRunRate: 5.4
    },
    'live_2': {
        matchId: 'live_2',
        team1: 'England',
        team2: 'Pakistan',
        venue: 'Lord\'s Cricket Ground',
        status: 'Pakistan batting - 1st Innings',
        currentInnings: 1,
        scores: [
            {
                team: 'Pakistan',
                runs: 189,
                wickets: 5,
                overs: 38.5,
                isBatting: true
            },
            {
                team: 'England',
                runs: 0,
                wickets: 0,
                overs: 0,
                isBatting: false
            }
        ],
        lastUpdated: new Date(),
        requiredRunRate: null,
        currentRunRate: 4.9
    },
    'live_3': {
        matchId: 'live_3',
        team1: 'South Africa',
        team2: 'New Zealand',
        venue: 'Newlands, Cape Town',
        status: 'New Zealand batting - 2nd Innings',
        currentInnings: 2,
        scores: [
            {
                team: 'South Africa',
                runs: 312,
                wickets: 7,
                overs: 50.0,
                isBatting: false
            },
            {
                team: 'New Zealand',
                runs: 156,
                wickets: 2,
                overs: 25.3,
                isBatting: true
            }
        ],
        lastUpdated: new Date(),
        requiredRunRate: 6.2,
        currentRunRate: 6.1
    }
};

// Function to get live matches (mock implementation)
async function getLiveMatches() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockLiveMatches;
}

// Function to get upcoming matches (mock implementation)
async function getUpcomingMatches() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockUpcomingMatches;
}

// Function to get live score for a specific match (mock implementation)
async function getLiveScore(matchId) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    if (mockLiveScores[matchId]) {
        // Simulate score updates
        const score = { ...mockLiveScores[matchId] };
        score.lastUpdated = new Date();
        
        // Add some random variation to make it feel live
        if (score.scores[1].isBatting) {
            score.scores[1].runs += Math.floor(Math.random() * 3);
            score.scores[1].overs += 0.1;
            if (score.scores[1].overs >= 50) {
                score.scores[1].overs = 50.0;
            }
        }
        
        return score;
    }
    
    return null;
}

// Function to get all matches (both live and upcoming)
async function getAllMatches() {
    const [liveMatches, upcomingMatches] = await Promise.all([
        getLiveMatches(),
        getUpcomingMatches()
    ]);
    
    return {
        live: liveMatches,
        upcoming: upcomingMatches
    };
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        // getLiveMatches,
        // getUpcomingMatches,
        // getLiveScore,
        // getAllMatches,
        // mockLiveMatches,
        // mockUpcomingMatches,
        // mockLiveScores
    };
}
