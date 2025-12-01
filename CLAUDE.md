# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the Chrome T-Rex Runner game, extracted from Chrome's offline error page. It's a simple browser-based game where a dinosaur runs and jumps over obstacles. The codebase is a single-file JavaScript application from Chromium source code.

**Source**: [Chromium offline.js](https://cs.chromium.org/chromium/src/components/neterror/resources/offline.js?q=t-rex+package:%5Echromium$&dr=C&l=7)

## Project Structure

This is a minimal static website project with no build process:

```
├── index.html          # Main HTML page with embedded audio resources
├── index.js            # Complete game logic (~2750 lines, single file)
├── index.css           # Styling for game canvas and layout
└── assets/
    ├── default_100_percent/  # 1x sprite sheets
    ├── default_200_percent/  # 2x sprite sheets (HiDPI)
    └── *.gif                 # Demo/fork screenshots
```

## Running the Game

This is a pure client-side application. Simply:

1. Open `index.html` in a web browser
2. Press **Space** to start the game
3. Use **Space** or **Up Arrow** to jump
4. Use **Down Arrow** to duck

No build process, no dependencies, no server required.

## Architecture Overview

### Single-File Game Engine (index.js)

The entire game is implemented in vanilla JavaScript within a single IIFE (Immediately Invoked Function Expression). All game objects are defined as constructor functions (pre-ES6 class syntax).

**Main Components** (in order of appearance in the file):

1. **Runner** (line 13) - Main game controller, singleton pattern
   - Manages game state (playing, crashed, paused)
   - Handles canvas initialization and resizing
   - Controls game loop via `update()` method
   - Manages audio context and sound effects
   - Orchestrates all game objects

2. **GameOverPanel** (line 1043) - Game over screen UI
   - Displays restart button and current score
   - Handles high score display

3. **Collision Detection** (line 1141) - Pixel-perfect collision system
   - `checkForCollision()` - Main collision detection function
   - Uses bounding box intersection with adjustments
   - CollisionBox class for defining hit areas

4. **Obstacle** (line 1279) - Cacti and pterodactyls
   - Randomly generated obstacle types
   - Handles movement and drawing
   - Multiple size variations

5. **Trex** (line 1527) - Player character
   - Animation states: running, jumping, ducking, crashed
   - Handles physics (jumping, gravity)
   - Input handling (keyboard, touch)

6. **DistanceMeter** (line 1893) - Score display
   - Draws score as sprite-based digits
   - Flashes on milestone achievements
   - Displays high score

7. **Cloud** (line 2154) - Background decoration
   - Parallax scrolling effect
   - Random positioning

8. **NightMode** (line 2246) - Visual theme system
   - Inverts colors periodically
   - Moon and stars rendering
   - Fade transitions

9. **HorizonLine** (line 2406) - Ground rendering
   - Infinite scrolling ground
   - Bumpy terrain effect

10. **Horizon** (line 2536) - Scene manager
    - Manages obstacles, clouds, and ground
    - Controls obstacle spawning logic
    - Handles day/night cycle

### Key Game Configuration

All game parameters are in `Runner.config` (line 104):
- Physics: gravity (0.6), jump velocity (12), acceleration (0.001)
- Speed: initial (6), max (13), mobile coefficient (1.2)
- Obstacles: max length (3), gap coefficient (0.6)
- Visual: invert distance (700), cloud frequency (0.5)

### Sprite System

The game uses sprite sheets for all graphics:
- **LDPI**: 100-percent sprites (standard density)
- **HDPI**: 200-percent sprites (retina/high DPI)
- Sprite definitions in `Runner.spriteDefinition` (line 162)
- Auto-detected based on `window.devicePixelRatio`

### Game Loop

The core game loop runs at 60 FPS (defined as `FPS` constant):
1. `Runner.update()` - Main loop using `requestAnimationFrame`
2. Updates physics, collision, and rendering
3. Manages speed progression over time

### Audio System

Audio files are embedded as base64-encoded MP3 in the HTML:
- Uses Web Audio API (`AudioContext`)
- Three sound effects: button press, hit, score milestone
- iOS detection disables audio (iOS restrictions)

## Device Detection

The code includes several device-specific constants:
- `IS_HIDPI`: Detects retina displays
- `IS_IOS`: iPad/iPhone/iPod detection
- `IS_MOBILE`: Android or iOS
- `IS_TOUCH_ENABLED`: Touch support detection

These affect sprite selection, speed coefficients, and touch controls.

## Customization Notes

This codebase has spawned many forks with character reskins (see README for examples: Kumamon, KuGou, corona-runner). The sprite-based architecture makes it straightforward to swap graphics while keeping game logic intact.

To modify game difficulty:
- Adjust `Runner.config` values (gravity, speed, gap coefficient)
- Modify obstacle spawn logic in `Horizon.addNewObstacle()`

To change graphics:
- Replace sprite sheets in `assets/default_100_percent/` and `assets/default_200_percent/`
- Update `Runner.spriteDefinition` coordinates if sprite layout changes

## Code Style Notes

- Pre-ES6 JavaScript (constructor functions, not classes)
- Uses IIFE module pattern
- Chromium coding conventions (JSDoc comments, `@const`, `@enum`)
- No external dependencies or bundler
- Direct DOM manipulation, no framework
