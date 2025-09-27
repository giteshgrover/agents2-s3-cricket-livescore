// Main popup functionality for Cricket Live Scores extension

class CricketPopup {
    constructor() {
        this.currentTab = 'live';
        this.selectedMatchId = null;
        this.refreshInterval = null;
        this.init();
    }

    async init() {
        console.log('🏏 Initializing Cricket Live Scores popup...');
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Load initial data
        await this.loadData();
        
        // Start auto-refresh for live scores
        this.startAutoRefresh();
        
        console.log('✅ Popup initialized successfully');
    }

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Refresh button
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.refreshData();
        });

        // Window close - stop auto-refresh
        window.addEventListener('beforeunload', () => {
            this.stopAutoRefresh();
        });
    }

    async loadData() {
        try {
            // Show loading states
            this.showLoading('live');
            this.showLoading('upcoming');

            // Get all matches using orchestrator
            const result = await cricketOrchestrator.orchestrate();
            
            // Render matches
            await this.renderMatches(result);
            
            // Hide loading states
            this.hideLoading('live');
            this.hideLoading('upcoming');

        } catch (error) {
            console.error('Error loading data:', error);
            this.showError('Failed to load match data');
        }
    }

    async renderMatches(result) {
        // Render match lists
        this.renderMatchList('live-matches-list', result.liveMatches);
        this.renderMatchList('upcoming-matches-list', result.upcomingMatches);
    }


    renderMatchList(containerId, matches) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';

        if (matches.length === 0) {
            container.innerHTML = '<div class="no-matches">No matches available</div>';
            return;
        }

        matches.forEach(match => {
            const matchElement = this.createMatchElement(match);
            container.appendChild(matchElement);
        });
    }

    createMatchElement(match) {
        const matchDiv = document.createElement('div');
        matchDiv.className = `match-item ${match.isSubscribed ? 'subscribed' : ''} ${match.status}`;
        matchDiv.dataset.matchId = match.id;

        const statusBadge = match.status === 'live' ? 'LIVE' : 'UPCOMING';
        const statusClass = match.status === 'live' ? 'live' : 'upcoming';
        
        const timeStr = this.formatMatchTime(match.startTime);
        const buttonText = match.isSubscribed ? 'Subscribed' : 'Subscribe';
        const buttonClass = match.isSubscribed ? 'subscribed' : 'subscribe';

        matchDiv.innerHTML = `
            <div class="match-header">
                <div class="match-teams">${match.team1} vs ${match.team2}</div>
                <div class="match-status-badge ${statusClass}">${statusBadge}</div>
            </div>
            <div class="match-details">
                <div class="match-venue">📍 ${match.venue}</div>
                <div class="match-time">🕐 ${timeStr}</div>
                <div class="match-series">${match.series || match.matchType}</div>
            </div>
            <button class="subscribe-btn ${buttonClass}" data-match-id="${match.id}">
                ${buttonText}
            </button>
        `;

        // Add click handlers
        this.addMatchEventListeners(matchDiv, match);

        return matchDiv;
    }

    addMatchEventListeners(matchElement, match) {
        // Subscribe/unsubscribe button
        const subscribeBtn = matchElement.querySelector('.subscribe-btn');
        subscribeBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            await this.handleSubscription(match, subscribeBtn, matchElement);
        });

        // Match selection for live scores
        if (match.isSubscribed && match.status === 'live') {
            matchElement.style.cursor = 'pointer';
            matchElement.addEventListener('click', () => {
                this.selectMatch(match.id);
            });
        }
    }

    async handleSubscription(match, button, matchElement) {
        try {
            if (match.isSubscribed) {
                // Unsubscribe
                const success = await cricketOrchestrator.unsubscribeMatch(match);
                if (success) {
                    match.isSubscribed = false;
                    button.textContent = 'Subscribe';
                    button.className = 'subscribe-btn subscribe';
                    matchElement.classList.remove('subscribed');
                    
                    // If this was the selected match, clear selection
                    if (this.selectedMatchId === match.id) {
                        this.clearMatchSelection();
                    }
                }
            } else {
                // Subscribe
                const success = await cricketOrchestrator.subscribeMatch(match);
                if (success) {
                    match.isSubscribed = true;
                    button.textContent = 'Subscribed';
                    button.className = 'subscribe-btn subscribed';
                    matchElement.classList.add('subscribed');
                    
                    // If it's a live match, make it selectable
                    if (match.status === 'live') {
                        matchElement.style.cursor = 'pointer';
                        matchElement.addEventListener('click', () => {
                            this.selectMatch(match.id);
                        });
                    }
                }
            }
        } catch (error) {
            console.error('Error handling subscription:', error);
            this.showError('Failed to update subscription');
        }
    }

    async selectMatch(matchId) {
        console.log('Selected matchId - ', matchId);
        this.selectedMatchId = matchId;
        
        // Update UI to show selection
        document.querySelectorAll('.match-item').forEach(item => {
            item.classList.remove('selected');
        });
        
        const selectedElement = document.querySelector(`[data-match-id="${matchId}"]`);
        if (selectedElement) {
            selectedElement.classList.add('selected');
        }
        
        console.log('Displaying LiveScore for - ', matchId);
        // Load and display live score
        await this.displayLiveScore(matchId);
    }

    async displayLiveScore(matchId) {
        try {
            const [liveScore] = await cricketOrchestrator.getLiveScoresForMatches([matchId]);
            console.log('liveScore: ' + liveScore);
            if (liveScore) {
                this.renderLiveScore(liveScore);
            } else {
                this.showNoScoreAvailable();
            }
        } catch (error) {
            console.error('Error loading live score:', error);
            this.showError('Failed to load live score');
        }
    }

    renderLiveScore(scoreData) {
        const noSelection = document.getElementById('no-selection');
        const scoreDisplay = document.getElementById('score-display');
        
        noSelection.style.display = 'none';
        scoreDisplay.style.display = 'block';
        
        // Update match info
        const matchInfo = document.getElementById('match-info');
        matchInfo.innerHTML = `
            <h3>${scoreData.team1} vs ${scoreData.team2}</h3>
            <div class="venue">📍 ${scoreData.venue}</div>
        `;
        
        // Update score details
        const scoreDetails = document.getElementById('score-details');
        scoreDetails.innerHTML = scoreData.scores.map(score => `
            <div class="team-score">
                <div class="team-name">${score.team} ${score.isBatting ? '🏏' : ''}</div>
                <div class="team-runs">${score.runs}/${score.wickets} (${score.overs} ov)</div>
            </div>
        `).join('');
        
        // Update match status
        const matchStatus = document.getElementById('match-status');
        matchStatus.textContent = scoreData.status;
    }

    clearMatchSelection() {
        this.selectedMatchId = null;
        
        document.querySelectorAll('.match-item').forEach(item => {
            item.classList.remove('selected');
        });
        
        const noSelection = document.getElementById('no-selection');
        const scoreDisplay = document.getElementById('score-display');
        
        noSelection.style.display = 'flex';
        scoreDisplay.style.display = 'none';
    }

    showNoScoreAvailable() {
        const scoreDisplay = document.getElementById('score-display');
        scoreDisplay.innerHTML = `
            <div class="no-selection-content">
                <div class="cricket-icon">📊</div>
                <p>Live score not available for this match</p>
            </div>
        `;
    }

    switchTab(tab) {
        this.currentTab = tab;
        
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        
        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tab}-matches`).classList.add('active');
    }

    showLoading(tab) {
        const loadingElement = document.getElementById(`${tab}-loading`);
        if (loadingElement) {
            loadingElement.style.display = 'block';
        }
    }

    hideLoading(tab) {
        const loadingElement = document.getElementById(`${tab}-loading`);
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
    }

    showError(message) {
        // Simple error display - could be enhanced
        console.error(message);
        alert(message);
    }

    formatMatchTime(startTime) {
        const now = new Date();
        const matchTime = new Date(+startTime); // +str converts a string to num
        // const diffMs = matchTime - now;
        // console.log('diffMs', diffMs)
        
        if (matchTime < now) {
            return 'Started';
        } else {
            return matchTime.toLocaleDateString();
        }
    }

    async refreshData() {
        console.log('🔄 Refreshing data...');
        
        try {
            await this.loadData();
            
            // If a match is selected, refresh its live score
            if (this.selectedMatchId) {
                await this.displayLiveScore(this.selectedMatchId);
            }
            
        } catch (error) {
            console.error('Error refreshing data:', error);
            this.showError('Failed to refresh data');
        }
    }

    startAutoRefresh() {
        // Get refresh interval from config or use default
        const refreshInterval = cricketOrchestrator.getConfigValue('AUTO_REFRESH_INTERVAL', 30000);
        
        // Refresh live scores at configured interval
        this.refreshInterval = setInterval(() => {
            if (this.selectedMatchId) {
                this.displayLiveScore(this.selectedMatchId);
            }
        }, refreshInterval);
    }

    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CricketPopup();
});
