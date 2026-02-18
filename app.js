// Main Application Entry Point
const gameManager = new GameManager();
const rosterManager = new RosterManager();

// Screen Management
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// Initialize App
function initApp() {
    setupEventListeners();
    
    // Route to correct screen based on game state
    switch (gameManager.gameFlowState) {
        case 'creatingPlayer':
            showScreen('player-creation-screen');
            break;
        case 'selectingSchool':
            showScreen('school-selection-screen');
            displayTeams();
            break;
        case 'inGame':
            showScreen('main-game-screen');
            updateMainGameUI();
            break;
    }
}

// Event Listeners
function setupEventListeners() {
    // Player Creation
    document.getElementById('create-player-btn').addEventListener('click', () => {
        const firstName = document.getElementById('first-name').value.trim();
        const lastName = document.getElementById('last-name').value.trim();
        
        if (firstName && lastName) {
            gameManager.createPlayer(firstName, lastName);
            showScreen('school-selection-screen');
            displayTeams();
        } else {
            alert('Please enter both first and last name');
        }
    });
    
    // Advance Week
    document.getElementById('advance-week-btn').addEventListener('click', () => {
        gameManager.advanceOneWeek();
        updateMainGameUI();
    });
    
    // Tab Navigation
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab;
            switchTab(tabName);
        });
    });
    
    // Training
    document.getElementById('save-training-btn').addEventListener('click', () => {
        const selected = Array.from(document.querySelectorAll('.training-item.selected'))
            .map(el => el.dataset.skill);
        gameManager.setTrainingFocus(selected);
        alert('Training plan saved!');
    });
    
    // End Game
    document.getElementById('end-game-btn').addEventListener('click', () => {
        gameManager.endLiveGame();
        showScreen('main-game-screen');
        updateMainGameUI();
    });
}

// Display Teams for Selection
function displayTeams() {
    const teamsList = document.getElementById('teams-list');
    teamsList.innerHTML = '';
    
    const highSchoolTeams = getTeamsForLeague(9);
    
    highSchoolTeams.forEach(team => {
        const teamCard = document.createElement('div');
        teamCard.className = 'team-card';
        teamCard.innerHTML = `
            <h3>${team.name}</h3>
            <p>${team.city}</p>
            <p>Rating: ${team.rating}</p>
        `;
        teamCard.addEventListener('click', () => {
            gameManager.selectTeam(team.id);
            showScreen('main-game-screen');
            updateMainGameUI();
        });
        teamsList.appendChild(teamCard);
    });
}

// Tab Switching
function switchTab(tabName) {
    // Update buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        }
    });
    
    // Update content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Load content for active tab
    if (tabName === 'schedule') {
        displaySchedule();
    } else if (tabName === 'skills') {
        displaySkills();
    } else if (tabName === 'training') {
        displayTraining();
    } else if (tabName === 'profile') {
        displayProfile();
    } else if (tabName === 'shop') {
        displayShop();
    } else if (tabName === 'news') {
        displayNews();
    } else if (tabName === 'nhl-rosters') {
        setupNHLRostersTab();
    } else if (tabName === 'junior-rosters') {
        setupJuniorRostersTab();
    }
}

// Display Schedule
function displaySchedule() {
    const scheduleList = document.getElementById('schedule-list');
    scheduleList.innerHTML = '';
    
    // Add simulation controls at the top
    const controls = document.createElement('div');
    controls.className = 'schedule-controls';
    controls.innerHTML = `
        <button onclick="simNextGame()" class="btn-secondary">Sim Next Game</button>
        <button onclick="simWeek()" class="btn-secondary">Sim Week</button>
    `;
    scheduleList.appendChild(controls);
    
    gameManager.seasonSchedule.forEach((game, index) => {
        const gameItem = document.createElement('div');
        gameItem.className = `game-item ${game.wasPlayed ? 'played' : ''}`;
        
        const dateStr = game.gameDate.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            weekday: 'short'
        });
        
        let resultHTML = '';
        if (game.wasPlayed && game.result) {
            const won = game.result.playerScore > game.result.opponentScore;
            resultHTML = `<span class="game-result ${won ? 'win' : 'loss'}">
                ${won ? 'W' : 'L'} ${game.result.playerScore}-${game.result.opponentScore}
            </span>`;
        } else if (!game.wasPlayed) {
            resultHTML = `<button class="btn-play" onclick="playGame(${index})">Play</button>`;
        }
        
        gameItem.innerHTML = `
            <div class="game-info">
                <div class="game-date">${dateStr}</div>
                <div class="game-opponent">vs ${game.opponent.name}</div>
            </div>
            <div class="game-action">${resultHTML}</div>
        `;
        
        scheduleList.appendChild(gameItem);
    });
}

// Sim next game
function simNextGame() {
    gameManager.simNextGame();
    updateMainGameUI();
}

// Sim week
function simWeek() {
    gameManager.advanceOneWeek();
    updateMainGameUI();
}

// Play a specific game
function playGame(gameIndex) {
    const game = gameManager.seasonSchedule[gameIndex];
    if (!game.wasPlayed) {
        gameManager.startLiveGame(game);
        showScreen('live-game-screen');
    }
}

// Display Skills
function displaySkills() {
    const skillsList = document.getElementById('skills-list');
    skillsList.innerHTML = '';
    
    SKILLS.forEach(skill => {
        const value = gameManager.player.skills[skill] || 50;
        const skillItem = document.createElement('div');
        skillItem.className = 'skill-item';
        skillItem.innerHTML = `
            <div class="skill-name">${skill}</div>
            <div class="skill-bar">
                <div class="skill-fill" style="width: ${value}%">${value}</div>
            </div>
        `;
        skillsList.appendChild(skillItem);
    });
}

// Display Training Options
function displayTraining() {
    const trainingList = document.getElementById('training-list');
    trainingList.innerHTML = '';
    
    SKILLS.forEach(skill => {
        const trainingItem = document.createElement('div');
        trainingItem.className = 'training-item';
        trainingItem.dataset.skill = skill;
        trainingItem.textContent = skill;
        
        trainingItem.addEventListener('click', () => {
            const selected = document.querySelectorAll('.training-item.selected');
            
            if (trainingItem.classList.contains('selected')) {
                trainingItem.classList.remove('selected');
            } else if (selected.length < 3) {
                trainingItem.classList.add('selected');
            } else {
                alert('You can only train 3 skills per week!');
            }
        });
        
        trainingList.appendChild(trainingItem);
    });
}

// Update Main Game UI
function updateMainGameUI() {
    if (!gameManager.player) return;
    
    // Player Info
    document.getElementById('player-name').textContent = gameManager.player.fullName;
    document.getElementById('player-age').textContent = gameManager.player.age;
    document.getElementById('player-team').textContent = gameManager.player.teamName;
    document.getElementById('player-league').textContent = gameManager.player.currentLeague;
    
    // Stats
    document.getElementById('stat-gp').textContent = gameManager.player.gamesPlayed;
    document.getElementById('stat-goals').textContent = gameManager.player.goals;
    document.getElementById('stat-assists').textContent = gameManager.player.assists;
    document.getElementById('stat-points').textContent = gameManager.player.points;
    
    // Bank
    document.getElementById('player-bank').textContent = gameManager.player.bankBalance.toFixed(2);
    
    // Date
    document.getElementById('current-date').textContent = gameManager.currentDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Update schedule display if we're on that tab
    const scheduleTab = document.getElementById('schedule-tab');
    if (scheduleTab.classList.contains('active')) {
        displaySchedule();
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Display Profile
function displayProfile() {
    if (!gameManager.player) return;
    
    document.getElementById('profile-personality').textContent = gameManager.player.personality.name;
    document.getElementById('profile-morale').textContent = gameManager.player.morale;
    document.getElementById('profile-energy').textContent = gameManager.player.energy;
    document.getElementById('profile-confidence').textContent = gameManager.player.confidence;
    document.getElementById('profile-reputation').textContent = gameManager.player.reputation;
    
    // Injury status
    const injuryEl = document.getElementById('injury-status');
    if (gameManager.player.injuryStatus) {
        injuryEl.textContent = `${gameManager.player.injuryStatus.type} - ${gameManager.player.injuryStatus.gamesRemaining} games remaining`;
        injuryEl.className = 'injured';
    } else {
        injuryEl.textContent = 'Healthy';
        injuryEl.className = '';
    }
    
    // Awards
    const awardsList = document.getElementById('awards-list');
    if (gameManager.player.awards && gameManager.player.awards.length > 0) {
        awardsList.innerHTML = gameManager.player.awards.map(award => `
            <div class="award-item">
                <strong>${award.name}</strong><br>
                <small>${award.description} (${award.season})</small>
            </div>
        `).join('');
    } else {
        awardsList.innerHTML = '<p>No awards yet. Keep playing to earn awards!</p>';
    }
}

// Display Shop
function displayShop() {
    const shopItems = document.getElementById('shop-items');
    shopItems.innerHTML = '';
    
    EQUIPMENT.forEach(item => {
        const owned = gameManager.player.equipment.stick === item.id ||
                     gameManager.player.equipment.skates === item.id ||
                     gameManager.player.equipment.extras.includes(item.id);
        
        const shopItem = document.createElement('div');
        shopItem.className = `shop-item ${owned ? 'owned' : ''}`;
        
        let bonuses = [];
        if (item.shooting) bonuses.push(`+${item.shooting} Shooting`);
        if (item.puckControl) bonuses.push(`+${item.puckControl} Puck Control`);
        if (item.skating) bonuses.push(`+${item.skating} Skating`);
        if (item.allSkills) bonuses.push(`+${item.allSkills} All Skills`);
        if (item.conditioning) bonuses.push(`+${item.conditioning} Conditioning`);
        if (item.strength) bonuses.push(`+${item.strength} Strength`);
        
        shopItem.innerHTML = `
            <h3>${item.name}</h3>
            <div class="price">$${item.price}</div>
            <div class="stats">${bonuses.join(', ')}</div>
            <button onclick="buyEquipment('${item.id}')" ${owned ? 'disabled' : ''}>
                ${owned ? 'Owned' : 'Purchase'}
            </button>
        `;
        
        shopItems.appendChild(shopItem);
    });
}

function buyEquipment(itemId) {
    const result = gameManager.purchaseEquipment(itemId);
    alert(result.message);
    if (result.success) {
        updateMainGameUI();
        displayShop();
    }
}

// Display News
function displayNews() {
    const newsFeed = document.getElementById('news-feed');
    const news = gameManager.generateNews();
    
    if (news.length === 0) {
        newsFeed.innerHTML = '<p>No news at this time. Keep playing to generate headlines!</p>';
        return;
    }
    
    newsFeed.innerHTML = news.map(item => `
        <div class="news-item ${item.type}">
            <h3>${item.title}</h3>
            <p>${item.content}</p>
            <div class="timestamp">${new Date().toLocaleDateString()}</div>
        </div>
    `).join('');
}

// Setup NHL Rosters Tab
function setupNHLRostersTab() {
    const teamSelect = document.getElementById('team-select');
    if (!teamSelect.hasAttribute('data-initialized')) {
        teamSelect.addEventListener('change', (e) => {
            displayNHLRoster(parseInt(e.target.value));
        });
        teamSelect.setAttribute('data-initialized', 'true');
    }
}

// Display NHL Team Roster
function displayNHLRoster(teamId) {
    const rosterDisplay = document.getElementById('roster-display');
    
    if (!teamId) {
        rosterDisplay.innerHTML = '<p class="roster-placeholder">Select a team to view their roster</p>';
        return;
    }
    
    const roster = getNHLTeamRoster(teamId);
    
    if (!roster) {
        rosterDisplay.innerHTML = '<p class="roster-placeholder">Roster data not available for this team</p>';
        return;
    }
    
    // Create roster display with forwards, defense, and goalies
    let html = '';
    
    // Forwards
    html += '<div class="roster-section">';
    html += '<h3>Forwards</h3>';
    html += '<table class="roster-table">';
    html += '<thead><tr><th>#</th><th>Player</th><th>Pos</th><th>Age</th><th>OVR</th><th>POT</th><th>Contract</th></tr></thead>';
    html += '<tbody>';
    roster.forwards.forEach(player => {
        const ovrClass = player.overall >= 90 ? 'elite' : player.overall >= 85 ? 'star' : '';
        html += `<tr>
            <td class="player-number">${player.number}</td>
            <td class="player-name">${player.firstName} ${player.lastName}</td>
            <td>${player.position}</td>
            <td>${player.age}</td>
            <td class="overall-rating ${ovrClass}">${player.overall}</td>
            <td>${player.potential}</td>
            <td class="contract-value">$${(player.contract.aav / 1000000).toFixed(2)}M x ${player.contract.years}</td>
        </tr>`;
    });
    html += '</tbody></table></div>';
    
    // Defense
    html += '<div class="roster-section">';
    html += '<h3>Defense</h3>';
    html += '<table class="roster-table">';
    html += '<thead><tr><th>#</th><th>Player</th><th>Pos</th><th>Age</th><th>OVR</th><th>POT</th><th>Contract</th></tr></thead>';
    html += '<tbody>';
    roster.defense.forEach(player => {
        const ovrClass = player.overall >= 90 ? 'elite' : player.overall >= 85 ? 'star' : '';
        html += `<tr>
            <td class="player-number">${player.number}</td>
            <td class="player-name">${player.firstName} ${player.lastName}</td>
            <td>${player.position}</td>
            <td>${player.age}</td>
            <td class="overall-rating ${ovrClass}">${player.overall}</td>
            <td>${player.potential}</td>
            <td class="contract-value">$${(player.contract.aav / 1000000).toFixed(2)}M x ${player.contract.years}</td>
        </tr>`;
    });
    html += '</tbody></table></div>';
    
    // Goalies
    html += '<div class="roster-section">';
    html += '<h3>Goalies</h3>';
    html += '<table class="roster-table">';
    html += '<thead><tr><th>#</th><th>Player</th><th>Pos</th><th>Age</th><th>OVR</th><th>POT</th><th>Contract</th></tr></thead>';
    html += '<tbody>';
    roster.goalies.forEach(player => {
        const ovrClass = player.overall >= 90 ? 'elite' : player.overall >= 85 ? 'star' : '';
        html += `<tr>
            <td class="player-number">${player.number}</td>
            <td class="player-name">${player.firstName} ${player.lastName}</td>
            <td>${player.position}</td>
            <td>${player.age}</td>
            <td class="overall-rating ${ovrClass}">${player.overall}</td>
            <td>${player.potential}</td>
            <td class="contract-value">$${(player.contract.aav / 1000000).toFixed(2)}M x ${player.contract.years}</td>
        </tr>`;
    });
    html += '</tbody></table></div>';
    
    rosterDisplay.innerHTML = html;
}

// Setup Junior Rosters Tab
function setupJuniorRostersTab() {
    const leagueSelect = document.getElementById('league-select');
    const teamSelector = document.getElementById('junior-team-selector');
    const juniorTeamSelect = document.getElementById('junior-team-select');
    
    if (!leagueSelect.hasAttribute('data-initialized')) {
        leagueSelect.addEventListener('change', (e) => {
            const league = e.target.value;
            if (league) {
                populateJuniorTeams(league);
                teamSelector.style.display = 'block';
            } else {
                teamSelector.style.display = 'none';
                document.getElementById('junior-roster-display').innerHTML = 
                    '<p class="roster-placeholder">Select a league and team to view their roster</p>';
            }
        });
        leagueSelect.setAttribute('data-initialized', 'true');
    }
    
    if (!juniorTeamSelect.hasAttribute('data-initialized')) {
        juniorTeamSelect.addEventListener('change', (e) => {
            const league = leagueSelect.value;
            const team = e.target.value;
            if (league && team) {
                displayJuniorRoster(league, team);
            }
        });
        juniorTeamSelect.setAttribute('data-initialized', 'true');
    }
}

// Populate Junior Teams Dropdown
function populateJuniorTeams(league) {
    const juniorTeamSelect = document.getElementById('junior-team-select');
    const rosters = rosterManager.getLeagueRosters(league);
    
    let html = '<option value="">-- Choose a Team --</option>';
    for (let teamName in rosters) {
        html += `<option value="${teamName}">${teamName}</option>`;
    }
    
    juniorTeamSelect.innerHTML = html;
}

// Display Junior Team Roster
function displayJuniorRoster(league, teamName) {
    const rosterDisplay = document.getElementById('junior-roster-display');
    
    if (!league || !teamName) {
        rosterDisplay.innerHTML = '<p class="roster-placeholder">Select a league and team to view their roster</p>';
        return;
    }
    
    const roster = rosterManager.getTeamRoster(league, teamName);
    
    if (!roster) {
        rosterDisplay.innerHTML = '<p class="roster-placeholder">Roster data not available for this team</p>';
        return;
    }
    
    // Create roster display with forwards, defense, and goalies
    let html = '';
    
    // Forwards
    if (roster.forwards && roster.forwards.length > 0) {
        html += '<div class="roster-section">';
        html += '<h3>Forwards</h3>';
        html += '<table class="roster-table">';
        html += '<thead><tr><th>Player</th><th>Pos</th><th>Age</th><th>OVR</th><th>POT</th><th>Draft Year</th></tr></thead>';
        html += '<tbody>';
        roster.forwards.forEach(player => {
            const ovrClass = player.overall >= 75 ? 'star' : player.overall >= 70 ? 'good' : '';
            const draftYear = player.draftYear ? `<span class="draft-year">${player.draftYear}</span>` : '-';
            html += `<tr>
                <td class="player-name">${player.firstName} ${player.lastName}</td>
                <td>${player.position}</td>
                <td>${player.age}</td>
                <td class="overall-rating ${ovrClass}">${player.overall}</td>
                <td>${player.potential}</td>
                <td>${draftYear}</td>
            </tr>`;
        });
        html += '</tbody></table></div>';
    }
    
    // Defense
    if (roster.defense && roster.defense.length > 0) {
        html += '<div class="roster-section">';
        html += '<h3>Defense</h3>';
        html += '<table class="roster-table">';
        html += '<thead><tr><th>Player</th><th>Pos</th><th>Age</th><th>OVR</th><th>POT</th><th>Draft Year</th></tr></thead>';
        html += '<tbody>';
        roster.defense.forEach(player => {
            const ovrClass = player.overall >= 75 ? 'star' : player.overall >= 70 ? 'good' : '';
            const draftYear = player.draftYear ? `<span class="draft-year">${player.draftYear}</span>` : '-';
            html += `<tr>
                <td class="player-name">${player.firstName} ${player.lastName}</td>
                <td>${player.position}</td>
                <td>${player.age}</td>
                <td class="overall-rating ${ovrClass}">${player.overall}</td>
                <td>${player.potential}</td>
                <td>${draftYear}</td>
            </tr>`;
        });
        html += '</tbody></table></div>';
    }
    
    // Goalies
    if (roster.goalies && roster.goalies.length > 0) {
        html += '<div class="roster-section">';
        html += '<h3>Goalies</h3>';
        html += '<table class="roster-table">';
        html += '<thead><tr><th>Player</th><th>Pos</th><th>Age</th><th>OVR</th><th>POT</th><th>Draft Year</th></tr></thead>';
        html += '<tbody>';
        roster.goalies.forEach(player => {
            const ovrClass = player.overall >= 75 ? 'star' : player.overall >= 70 ? 'good' : '';
            const draftYear = player.draftYear ? `<span class="draft-year">${player.draftYear}</span>` : '-';
            html += `<tr>
                <td class="player-name">${player.firstName} ${player.lastName}</td>
                <td>${player.position}</td>
                <td>${player.age}</td>
                <td class="overall-rating ${ovrClass}">${player.overall}</td>
                <td>${player.potential}</td>
                <td>${draftYear}</td>
            </tr>`;
        });
        html += '</tbody></table></div>';
    }
    
    rosterDisplay.innerHTML = html;
}
