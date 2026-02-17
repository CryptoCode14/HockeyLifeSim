# Hockey Life Sim - Web Edition

A realistic NHL career simulation game playable in your web browser. Build your hockey player from high school to the professional leagues!

## Features

### Career Mode
- **Create Your Player**: Customize your player's name and start your journey at age 14
- **Team Selection**: Choose from authentic high school teams in Minnesota
- **Season Schedule**: Play through a full season of games with realistic scheduling
- **Skill Development**: Train and improve 10 different hockey skills including skating, shooting, passing, and more
- **Career Progression**: Advance from high school through junior leagues to college and eventually the NHL
- **Stats Tracking**: Full season statistics including goals, assists, points, and plus/minus

### Live Game Simulation
- **Real-Time Physics**: Advanced 2D physics engine with realistic puck and player movement
- **AI Players**: Intelligent computer-controlled players with offensive and defensive strategies
- **Dynamic Gameplay**: Watch your team compete in real-time with accurate hockey mechanics
- **Scoreboard**: Live game clock, period tracking, and shot counters
- **Interactive Canvas**: Smooth 60 FPS rendering on HTML5 canvas

### Training System
- **Weekly Training**: Select up to 3 skills to focus on each week
- **Skill Progression**: Improve your ratings through dedicated training
- **Skill Atrophy**: Untrained skills may decline over time, requiring strategic planning

## How to Play

### Getting Started
1. Open `index.html` in a modern web browser
2. Enter your player's first and last name
3. Select a high school team to start your career

### Playing Games
1. Navigate to the **Schedule** tab to see your season games
2. Click **Play Game** to watch your team compete in real-time
3. The game simulates automatically with AI-controlled players
4. Click **End Game** when finished to return to career mode

### Developing Your Player
1. Go to the **Skills** tab to view your current ratings
2. Visit the **Training** tab to select skills to improve
3. Choose up to 3 skills per week to focus on
4. Click **Advance 1 Week** to progress and apply training

### Career Progression
- Play through your high school season
- Earn stats to increase your draft stock
- Receive scholarship offers based on performance
- Progress through junior leagues, college, and professional hockey

## Technology Stack

- **HTML5**: Modern semantic markup
- **CSS3**: Responsive design with flexbox and grid layouts
- **JavaScript (ES6+)**: Modular architecture with classes
- **Canvas API**: Real-time 2D game rendering
- **LocalStorage**: Save game persistence

## File Structure

```
├── index.html          # Main HTML structure
├── styles.css          # All styling and responsive design
├── data.js            # Teams, leagues, and game data
├── physics-engine.js  # 2D physics simulation
├── ai-controller.js   # AI player behavior
├── game-scene.js      # Live game rendering and logic
├── game-manager.js    # Career mode management
└── app.js             # Main application entry point
```

## Game Mechanics

### Physics System
- Collision detection between players and puck
- Realistic friction and momentum
- Boundary constraints to keep entities on the rink
- Elastic collisions with proper impulse calculations

### AI System
- **Goalies**: Track puck position and defend the net
- **Forwards**: Aggressive offensive play when in possession
- **Defensemen**: Pressure the puck and defensive positioning
- **Shooting**: AI players take shots when in scoring position

### Skill System
Each player has 10 rated skills (20-99 scale):
- Skating
- Shooting Accuracy
- Shooting Power
- Puck Control
- Passing
- Checking
- Defensive Positioning
- Hockey IQ
- Strength
- Conditioning

## Browser Compatibility

Recommended browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Running Locally

### Option 1: Simple HTTP Server (Python)
```bash
python3 -m http.server 8080
# Then open http://localhost:8080/index.html
```

### Option 2: Node.js HTTP Server
```bash
npx http-server -p 8080
# Then open http://localhost:8080/index.html
```

### Option 3: VS Code Live Server
1. Install Live Server extension
2. Right-click index.html
3. Select "Open with Live Server"

## Future Enhancements

Potential additions for future versions:
- Multiplayer game modes
- More detailed player customization
- Enhanced AI with team strategies
- Playoff tournaments
- Draft system
- Contract negotiations
- Injury system
- Equipment and training facilities
- Historical season records

## Credits

Original concept based on hockey career simulation games. This web version features:
- Custom physics engine
- AI behavior system
- Real NHL, AHL, and junior league teams
- Authentic Minnesota high school hockey teams

## License

This is a fan-made project for educational and entertainment purposes.

## Support

For issues or questions, please visit the GitHub repository.

---

**Start your journey to the NHL today!**
