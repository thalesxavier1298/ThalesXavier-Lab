# Jarvis: Skybound

Original browser platform game at /jarvis/, linked from the English and Portuguese Projects page.

## Play
Move: arrows or A/D. Jump: Space, W or Up. Power: X or K. Pause: P or Escape. Restart stage: R.
Touch buttons support simultaneous movement, jump and power.
Clear 15 regular stages, the Sentinel Tower after stage 8, and the Storm King Castle.
The world map unlocks stages in order and stores cleared-stage progress in localStorage.
A reset button asks before clearing progress. If storage is blocked, the current session still works.

## Powers
Cloud creates a temporary platform (three charges, reset on landing).
Fire fires bouncing projectiles. Ice freezes regular enemies; touching frozen enemies shatters them.
Hammer throws a projectile in an arc. Helicopter boosts once per landing and slows falling while Jump is held.
Contact damage removes the current power. Bosses take damage from stomps and projectiles.

## Development and verification
Run npm ci, npm run dev, npm run build.
Run node scripts/test-jarvis.mjs for deterministic game logic checks using a stubbed DOM/canvas.
The game itself has no new package dependencies or backend.
Vite copies public/jarvis into dist/jarvis during builds.
Existing Wrangler static asset configuration serves the directory.

## Current scope
This is a first playable version with original geometric pixel-style characters and procedural variations of platform layouts across four palettes.
Stage names are destination names; towers and castles use horizontal boss arenas.
No Nintendo artwork, music, characters or level layouts are included.
Audio consists of optional synthesized effects. The only external game-page resources are optional Google Fonts with local font fallbacks.
Tested: production build; automated level counts, geometry, persistence fallback, movement, jump, all five powers, health, boss gates, victory, pause and death.
Browser smoke test: map, stage entry, movement, cloud pickup, pause and rendering.
A complete human playthrough of all 17 stages and real-device touch/difficulty testing remain outstanding.
