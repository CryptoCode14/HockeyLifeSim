# Hockey Life Sim - Web Edition

A realistic NHL career simulation game playable in your web browser. Build your hockey player from high school to the professional leagues with deep RPG-style progression!

## Features

### Career Mode
- **Create Your Player**: Customize your player's name and receive a unique personality trait
- **Team Selection**: Choose from authentic high school teams in Minnesota
- **Season Schedule**: Play through a full season of games with realistic scheduling
- **Skill Development**: Train and improve 10 different hockey skills including skating, shooting, passing, and more
- **Career Progression**: Advance from high school through junior leagues to college and eventually the NHL
- **Stats Tracking**: Comprehensive statistics including goals, assists, points, shots, hits, and plus/minus

### Player Attributes
- **Personality Traits**: 8 unique personalities (Leader, Clutch, Sniper, Playmaker, Grinder, Enforcer, Speedster, Defensive Specialist)
- **Mental Stats**: Morale, Energy, Confidence, and Reputation (all 0-100)
- **Physical Stats**: 10 skill ratings from 20-99
- **Injury System**: 5 types of injuries with realistic recovery times (day-to-day to major)
- **Equipment System**: Purchase upgrades to permanently boost your skills

### Live Game Simulation
- **Real-Time Physics**: Advanced 2D physics engine with realistic puck and player movement
- **AI Players**: Intelligent computer-controlled players with offensive and defensive strategies
- **Dynamic Gameplay**: Watch your team compete in real-time with accurate hockey mechanics
- **Power Plays**: Penalty system creates 5-on-4 advantages for 2 minutes
- **Momentum**: Visual momentum bar shows which team is dominating (-100 to +100)
- **Celebrations**: Goal scored animations with flashy "GOAL!" effects
- **Shot Types**: 5 different shot types (Wrist, Slap, Backhand, Snap, One-Timer) with unique characteristics

### Training System
- **Weekly Training**: Select up to 3 skills to focus on each week
- **Skill Progression**: Improve your ratings through dedicated training
- **Skill Atrophy**: Untrained skills may decline over time, requiring strategic planning
- **Equipment Bonuses**: Purchase gear to permanently boost specific skills

### Equipment Shop
Purchase upgrades with your earnings:
- **Sticks**: Basic ($150), Pro ($300), Elite Carbon ($500)
- **Skates**: Basic ($200), Pro ($400), Elite Speed ($700)
- **Training**: Personal Training ($1,000) - boosts all skills
- **Nutrition**: Nutrition Plan ($500) - improves conditioning and strength

### Awards & Achievements
Track your accomplishments:
- **MVP** - Most Valuable Player award
- **Scoring Champion** - Lead the league in points
- **Rookie of the Year** - Best first-year player
- **Best Defenseman** - Top defensive player
- **All-Star Selection** - Make the all-star team
- **Stanley Cup** - Win the championship
- **Milestones**: Hat tricks, game-winning goals, shutouts

### News & Media
- **Dynamic Headlines**: Performance-based news stories
- **Injury Reports**: Updates on recovery timelines
- **Award Announcements**: Celebrate your achievements
- **Color-Coded**: Positive (green), negative (red), achievements (gold)

## How to Play

### Getting Started
1. Open `index.html` in a modern web browser
2. Enter your player's first and last name
3. Select a high school team to start your career
4. Review your randomly assigned personality trait and initial skills

### Playing Games
1. Navigate to the **Schedule** tab to see your season games
2. Click **Play Game** to watch your team compete in real-time
3. Watch the momentum bar to see who's dominating
4. Celebrate when you score with the golden "GOAL!" animation
5. Click **End Game** when finished to return to career mode

### Developing Your Player
1. Go to the **Skills** tab to view your current ratings
2. Visit the **Training** tab to select skills to improve
3. Choose up to 3 skills per week to focus on
4. Visit the **Shop** tab to purchase permanent upgrades
5. Click **Advance 1 Week** to progress and apply training

### Managing Your Career
1. Check the **Profile** tab to monitor morale, energy, and confidence
2. Watch for injury status and recovery timelines
3. Track your awards and achievements
4. Visit the **News** tab for performance updates
5. Manage your bank balance to afford equipment upgrades

### Career Progression
- Play through your high school season (20 games)
- Earn stats to increase your draft stock and reputation
- Receive scholarship offers based on performance
- Progress through junior leagues, college, and professional hockey
- Win awards and build your reputation
- Eventually reach the NHL!

## Technology Stack

- **HTML5**: Modern semantic markup with enhanced UI
- **CSS3**: Responsive design with animations and visual effects
- **JavaScript (ES6+)**: Modular architecture with advanced game logic
- **Canvas API**: Real-time 2D game rendering at 60 FPS
- **LocalStorage**: Automatic save game persistence

## File Structure

```
├── index.html          # Main HTML with 6 tabs
├── styles.css          # Enhanced styling with animations
├── data.js            # Teams, leagues, equipment, awards
├── physics-engine.js  # 2D physics simulation
├── ai-controller.js   # AI player behavior
├── game-scene.js      # Live game with celebrations & momentum
├── game-manager.js    # Career mode with injuries & equipment
├── app.js             # UI controller with new tabs
└── README.md          # This file
```

## Game Mechanics

### Physics System
- Collision detection between players and puck
- Realistic friction and momentum
- Boundary constraints to keep entities on the rink
- Elastic collisions with proper impulse calculations
- Power/accuracy/speed variations by shot type

### AI System
- **Goalies**: Track puck position and defend the net
- **Forwards**: Aggressive offensive play when in possession
- **Defensemen**: Pressure the puck and defensive positioning
- **Shooting**: AI players take shots when in scoring position
- **Strategies**: Context-aware decision making based on game state

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

### Mental Attributes (0-100 scale)
- **Morale**: Affects overall performance, modified by wins/losses/injuries
- **Energy**: Decreases during games, recovers with rest
- **Confidence**: Affects shooting accuracy, increases with success
- **Reputation**: Influences contract offers and scout attention

### Injury System
Five severity levels with realistic recovery:
1. **Day-to-Day**: Bruised (0-1 games)
2. **Minor**: Upper body injury (1-5 games)
3. **Moderate**: Lower body injury (2-7 games)
4. **Serious**: Concussion (5-15 games)
5. **Major**: Broken bone (10-30 games)

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

## Tips for Success

1. **Balance Training**: Don't neglect any skills - atrophy is real!
2. **Save Money**: Equipment upgrades are permanent and powerful
3. **Manage Energy**: Rest is important for performance
4. **Build Confidence**: Success breeds success - momentum matters
5. **Watch Your Health**: Injuries can derail your season
6. **Track Awards**: Awards boost reputation and bank balance
7. **Read News**: Stay informed about your performance and standing

## Future Enhancements

Potential additions for future versions:
- Playoff tournaments with bracket system
- Draft combine and combine performance
- Contract negotiations with multiple teams
- Social media and fan interactions
- Historical season records and hall of fame
- Multiplayer competitive modes
- Advanced analytics and heat maps
- Custom team creation
- Trade system
- Coach interactions and chemistry

## Credits

Original concept based on hockey career simulation games. This web version features:
- Custom 2D physics engine with momentum system
- Advanced AI behavior with context awareness
- Real NHL, AHL, and junior league teams
- Authentic Minnesota high school hockey teams
- RPG-style progression with equipment upgrades
- Dynamic news and achievement systems

## License

This is a fan-made project for educational and entertainment purposes.

## Support

For issues or questions, please visit the GitHub repository.

---

**Start your journey to the NHL today!** 🏒⭐
