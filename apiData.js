// Function to get all matches (both live and upcoming)
async function getAllMatches(config) {
    const [liveMatches, upcomingMatches] = await Promise.all([
        getLiveMatches(config),
        getUpcomingMatches(config)
    ]);

    return {
        live: liveMatches,
        upcoming: upcomingMatches
    };
}

async function getLiveMatches(config) {
    console.log('In getLiveMatches')
    const apiResponse = await callExternalAPI(config, "matches/v1/live");
    return transformApiResponse(apiResponse, 'live');
}
async function getUpcomingMatches(config) {
    console.log('In getUpcomingMatches')
    const apiResponse = await callExternalAPI(config, "matches/v1/upcoming");
    return transformApiResponse(apiResponse, 'upcoming');
}

function transformApiResponse(data, status) {
    console.log('In transformApiResponse - ', data)
    let result = [];

    data.typeMatches.forEach(typeMatch => {
        typeMatch.seriesMatches.forEach(seriesMatch => {
            if (!seriesMatch.seriesAdWrapper) return;

            const series = seriesMatch.seriesAdWrapper.seriesName;

            seriesMatch.seriesAdWrapper.matches.forEach(match => {
                const info = match.matchInfo;
                const score = match.matchScore || {};

                // team1
                let t1 = info.team1?.teamName || "";
                let t1Score = score.team1Score?.inngs1
                    ? `${score.team1Score.inngs1.runs}/${score.team1Score.inngs1.wickets} (${score.team1Score.inngs1.overs})`
                    : "";

                // team2
                let t2 = info.team2?.teamName || "";
                let t2Score = score.team2Score?.inngs1
                    ? `${score.team2Score.inngs1.runs}/${score.team2Score.inngs1.wickets} (${score.team2Score.inngs1.overs})`
                    : "";

                result.push({
                    id: info.matchId,
                    series: series,
                    match: info.matchDesc,
                    matchType: info.matchFormat,
                    status,
                    team1: t1,
                    team2: t2,
                    currentScore: {
                        team1: t1Score,
                        team2: t2Score
                    },
                    venue: `${info.venueInfo.ground}, ${info.venueInfo.city}`,
                    startTime: info.startDate
                });
            });
        });
    });

    // {
    //     id: 'live_1',
    //     team1: 'India',
    //     team2: 'Australia',
    //     venue: 'Melbourne Cricket Ground',
    //     status: 'live',
    //     startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    //     currentScore: {
    //         team1: { runs: 245, wickets: 3, overs: 45.2 },
    //         team2: { runs: 0, wickets: 0, overs: 0 }
    //     },
    //     matchType: 'ODI',
    //     series: 'India Tour of Australia 2024'
    // }

    return result;
}



async function callExternalAPI(config, endpoint, params) {
    // teams/v1/international
    const baseurl = "https://cricbuzz-cricket.p.rapidapi.com/"
    // Build query string
    const queryString = new URLSearchParams(params).toString();
    var fullUrl = `${baseurl}${endpoint}`;
    if (params) {
        fullUrl += `?${queryString}`;
    }

    // Call API
    try {
        // Send a GET request to the specified URL
        const response = await fetch(fullUrl, {
            method: "GET",
            headers: {
                "X-RapidAPI-Key": config.RAPID_API_KEY,
                "X-RapidAPI-Host": "cricbuzz-cricket.p.rapidapi.com"
            }
        });

        // Check if the request was successful (status code 200-299)
        if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
        }

        // Parse the JSON response
        const data = await response.json();

        // Return the fetched data
        return data;
    } catch (error) {
        // Handle any errors that occurred during the fetch operation
        console.error("Error fetching data:", error);
        throw error; // Re-throw the error for further handling if needed
    }

}


// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getLiveMatches,
        getUpcomingMatches,
        getAllMatches
    };
}