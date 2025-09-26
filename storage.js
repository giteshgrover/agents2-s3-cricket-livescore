// Chrome storage management for subscribed matches

const STORAGE_KEY = 'cricket_subscribed_matches';

// Get all subscribed matches from Chrome storage
async function getSubscribedMatchesFromStorage() {
    return new Promise((resolve) => {
        chrome.storage.local.get([STORAGE_KEY], (result) => {
            const subscribedMatches = result[STORAGE_KEY] || [];
            resolve(subscribedMatches);
        });
    });
}

// Save subscribed matches to Chrome storage
async function saveSubscribedMatchesFromStorage(subscribedMatches) {
    return new Promise((resolve) => {
        chrome.storage.local.set({ [STORAGE_KEY]: subscribedMatches }, () => {
            resolve();
        });
    });
}

// Subscribe to a match
async function subscribeToMatchFromStorage(matchId, matchData) {
    const subscribedMatches = await getSubscribedMatchesFromStorage();
    
    // Check if already subscribed
    const existingIndex = subscribedMatches.findIndex(match => match.id === matchId);
    
    if (existingIndex === -1) {
        // Add new subscription
        subscribedMatches.push({
            id: matchId,
            ...matchData,
            subscribedAt: new Date().toISOString()
        });
        
        await saveSubscribedMatchesFromStorage(subscribedMatches);
        return true; // Successfully subscribed
    }
    
    return false; // Already subscribed
}

// Unsubscribe from a match
async function unsubscribeFromMatchFromStorage(matchId) {
    const subscribedMatches = await getSubscribedMatchesFromStorage();
    
    const filteredMatches = subscribedMatches.filter(match => match.id !== matchId);
    
    if (filteredMatches.length !== subscribedMatches.length) {
        await saveSubscribedMatchesFromStorage(filteredMatches);
        return true; // Successfully unsubscribed
    }
    
    return false; // Match was not subscribed
}

// Check if a match is subscribed
// async function isMatchSubscribedFromStorage(matchId) {
//     const subscribedMatches = await getSubscribedMatchesFromStorage();
//     return subscribedMatches.some(match => match.id === matchId);
// }

// Get subscribed match data
async function getSubscribedMatchDataFromStorage(matchId) {
    const subscribedMatches = await getSubscribedMatchesFromStorage();
    return subscribedMatches.find(match => match.id === matchId);
}

// Clear all subscriptions
async function clearAllSubscriptions() {
    await saveSubscribedMatches([]);
}

// Get subscription count
async function getSubscriptionCountFromStorage() {
    const subscribedMatches = await getSubscribedMatchesFromStorage();
    return subscribedMatches.length;
}

// Update match data for subscribed matches
async function updateSubscribedMatchDataFromStorage(matchId, updatedData) {
    const subscribedMatches = await getSubscribedMatchesFromStorage();
    
    const matchIndex = subscribedMatches.findIndex(match => match.id === matchId);
    
    if (matchIndex !== -1) {
        subscribedMatches[matchIndex] = {
            ...subscribedMatches[matchIndex],
            ...updatedData,
            lastUpdated: new Date().toISOString()
        };
        
        await saveSubscribedMatchesFromStorage(subscribedMatches);
        return true;
    }
    
    return false;
}

// Get all subscribed match IDs
async function getSubscribedMatchIdsFromStorage() {
    const subscribedMatches = await getSubscribedMatchesFromStorage();
    return subscribedMatches.map(match => match.id);
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getSubscribedMatchesFromStorage,
        saveSubscribedMatchesFromStorage,
        subscribeToMatchFromStorage,
        unsubscribeFromMatchFromStorage,
        // isMatchSubscribedFromStorage,
        getSubscribedMatchDataFromStorage,
        clearAllSubscriptions,
        getSubscriptionCountFromStorage,
        updateSubscribedMatchDataFromStorage,
        getSubscribedMatchIdsFromStorage
    };
}
