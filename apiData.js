// Function to get all matches (both live and upcoming)
async function getAllMatches(config) {
    var [liveMatches, upcomingMatches] = await Promise.all([
        getLiveMatches(config),
        getUpcomingMatches(config)
    ]);

    // TODO Limit the numbers for LLM 
    if (liveMatches.length > 3) {
        liveMatches = liveMatches[0, 3]
    }
    if (upcomingMatches.length > 3) {
        upcomingMatches = upcomingMatches[0,3]
    }

    return {
        live: liveMatches,
        upcoming: upcomingMatches
    };

    // TODO
    // return {
    //     "live": {
    //         "id": 113661,
    //         "series": "County Championship Division Two 2025",
    //         "match": "54th Match",
    //         "matchType": "TEST",
    //         "status": "live",
    //         "team1": "Derbyshire",
    //         "team2": "Kent",
    //         "currentScore": {
    //             "team1": "698/6 (144.6)",
    //             "team2": "271/10 (85.4)"
    //         },
    //         "venue": "St Lawrence Ground, Canterbury",
    //         "startTime": "1758706200000"
    //     },
    //     "upcoming": {
    //         "id": 117359,
    //         "series": "West Indies tour of India, 2025",
    //         "match": "1st Test",
    //         "matchType": "TEST",
    //         "status": "upcoming",
    //         "team1": "India",
    //         "team2": "West Indies",
    //         "currentScore": {
    //             "team1": "",
    //             "team2": ""
    //         },
    //         "venue": "Narendra Modi Stadium, Ahmedabad",
    //         "startTime": "1759377600000"
    //     }
    // }
}

async function getLiveMatches(config) {
    console.log('In getLiveMatches')
    // const apiResponse = await callExternalAPI(config, "matches/v1/live");
    const apiResponse = liveAPICachedResponse;
    console.log('Live Match API Response: ', apiResponse);
    return transformMatchApiResponse(apiResponse, 'live');
}
async function getUpcomingMatches(config) {
    console.log('In getUpcomingMatches')
    // const apiResponse = await callExternalAPI(config, "matches/v1/upcoming");
    const apiResponse = upcomingAPICachedResponse;
    console.log('Upcoming Match API Response: ', apiResponse);
    return transformMatchApiResponse(apiResponse, 'upcoming');
}

async function getLiveScore(config, matchId) {

    console.log('In getLiveScore for matchId', matchId)
    const apiResponse = await callExternalAPI(config, `mcenter/v1/${matchId}/scard`);
    console.log('Live SCORE API Response: ', apiResponse);
    return transformScoreApiResponse(apiResponse, matchId);

}


function transformMatchApiResponse(data, status) {
    console.log('In transformMatchApiResponse - ', data)
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

function transformScoreApiResponse(data, matchId) {
    console.log('In transformScoreApiResponse - ', data)

    const matchKey = `${matchId}`

    // the API response may have multiple scorecards (innings)
    if (!data.scorecard) return result;

    // assume one match per response (scorecard has multiple innings)
    const innings = data.scorecard;

    // team names
    const team1 = innings[0]?.batteamname || "Team 1";
    const team2 = innings[1]?.batteamname || "Team 2";

    // figure out which team is currently batting (last innings usually)
    const currentInnings = innings.length;
    const battingTeam = innings[currentInnings - 1]?.batteamname;

    // build scores array
    const scores = innings.map(inn => ({
        team: inn.batteamname,
        runs: inn.score,
        wickets: inn.wickets,
        overs: parseFloat(inn.overs),
        isBatting: inn.batteamname === battingTeam
    }));

    // compute CRR
    const battingInnings = innings[currentInnings - 1];
    const currentRunRate = battingInnings && battingInnings.overs > 0
        ? +(battingInnings.score / battingInnings.overs).toFixed(2)
        : null;

    const result = {
        matchId: matchKey,
        team1,
        team2,
        venue: data.venue || "Unknown Venue",
        status: `${battingTeam} batting - ${currentInnings} Innings`,
        currentInnings,
        scores,
        lastUpdated: new Date(),
        requiredRunRate: null, // need target/overs left to compute
        currentRunRate
    };

    console.log("live Score: ", result)
    return result;
}

async function callExternalAPI(config, endpoint, params) {
    // await new Promise(resolve => setTimeout(resolve, 15000));
    // teams/v1/international
    const baseurl = "https://cricbuzz-cricket.p.rapidapi.com/"
    // Build query string
    const queryString = new URLSearchParams(params).toString();
    var fullUrl = `${baseurl}${endpoint}`;
    if (params) {
        fullUrl += `?${queryString}`;
    }
    console.log(fullUrl)

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
            console.error(response)
            throw new Error("Network response was not ok " + response.statusText);
        }

        console.log("response ok", response)
        // Parse the JSON response
        const data = await response.json();

        console.log("data", data)
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
        getAllMatches,
        getLiveScore
    };
}