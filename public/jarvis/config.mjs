// World units remain compatible with the original 960 x 540 levels.
export const PHYSICS = Object.freeze({
 walkSpeed:210, crawlSpeed:70, runSpeed:330, acceleration:1450, airAcceleration:1050,
 friction:1650, iceFriction:620, gravity:1450, maxFall:850,
 jumpSpeed:610, jumpCut:220, coyoteTime:.1, jumpBuffer:.1,
 invincibility:1.6, transformDuration:.5, damageDuration:.32,
 smallHeight:28, largeHeight:48, crouchHeight:28, width:24,
 fixedStep:1/120, maxSubstep:4, mushroomSpeed:58
});
export const STATES=Object.freeze({SMALL:'SMALL',SUPER:'SUPER',FIRE:'FIRE',ICE:'ICE',CLOUD:'CLOUD',HAMMER:'HAMMER',HELICOPTER:'HELICOPTER'});
export const STATE_COLORS={SMALL:'#6fe1b7',SUPER:'#54cdb6',FIRE:'#ff8b55',ICE:'#91e7ff',CLOUD:'#f6f5df',HAMMER:'#c2a4ff',HELICOPTER:'#ffdc6e'};
