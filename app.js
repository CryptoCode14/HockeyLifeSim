// Main Application Entry Point
const gameManager = new GameManager();

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
    }
}

// Display Schedule
function displaySchedule() {
    const scheduleList = document.getElementById('schedule-list');
    scheduleList.innerHTML = '';
    
    gameManager.seasonSchedule.forEach((game, index) => {
        const gameItem = document.createElement('div');
        gameItem.className = `game-item ${game.wasPlayed ? 'played' : ''}`;
        
        const dateStr = game.gameDate.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
        });
        
        let resultHTML = '';
        if (game.wasPlayed && game.result) {
            const won = game.result.playerScore > game.result.opponentScore;
            resultHTML = `<span class="game-result ${won ? 'win' : 'loss'}">
                ${won ? 'W' : 'L'} ${game.result.playerScore}-${game.result.opponentScore}
            </span>`;
        } else if (!game.wasPlayed) {
            resultHTML = `<button class="btn-primary" onclick="playGame(${index})">Play Game</button>`;
        }
        
        gameItem.innerHTML = `
            <div>
                <div class="game-date">${dateStr}</div>
                <div class="game-opponent">vs ${game.opponent.name}</div>
            </div>
            ${resultHTML}
        `;
        
        scheduleList.appendChild(gameItem);
    });
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
