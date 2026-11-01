import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const WIN_VIDEO_ID = '1ojkAo0G4_s';
const POWERUP_TYPES = [
  'expand', 'multiball', 'laser', 'shield', 'triplepaddle',
  'pin', 'gravity', 'pipeline', 'revert', 'amend',
  'copilot', 'bump', 'upvote', 'xray', 'kill', 'origin', 'yank', 'jitter', 'rebase',
  'theme', 'duck', 'skin', 'storm', 'lgtm', 'disco', 'plumber', 'chomper', 'snake',
  'halloween', 'matrix', 'paintball', 'lava', 'ufo', 'bomber', 'merge', 'dino', 'tetromino', 'pong',
  'hunter', 'flapper', 'slash', 'frog',
  'invert', 'downgrade', 'hotfix', 'zip', 'issue', 'dark', 'coffee', 'credits',
];
// Power-downs: all red, so a player learns to dodge them. They drop half as often.
const NEGATIVE_POWERUPS = new Set(['invert', 'downgrade', 'hotfix', 'zip', 'issue', 'dark', 'coffee', 'credits']);
const NEGATIVE_COLOR = '#F85149';
const POWERUP_COLORS = {
  expand: '#26A641',
  multiball: '#39D353',
  laser: '#58A6FF',
  shield: '#3FB8FF',
  pin: '#E3B341',
  gravity: '#D2A8FF',
  pipeline: '#FFA657',
  revert: '#7EE7E7',
  amend: '#C9D1D9',
  invert: NEGATIVE_COLOR,
  downgrade: NEGATIVE_COLOR,
  hotfix: NEGATIVE_COLOR,
  copilot: '#A5D6FF',
  bump: '#F0F6FC',
  upvote: '#56D364',
  xray: '#B392F0',
  kill: '#FF9492',
  triplepaddle: '#A371F7',
  theme: '#FFD33D',
  skin: '#7EE787',
  storm: '#FFA7C4',
  plumber: '#FFB86B',
  chomper: '#FFE14D',
  snake: '#FF5CA8',
  lgtm: '#3FB950',
  disco: '#E879F9',
  halloween: '#FA7A18',
  matrix: '#00FF66',
  paintball: '#4DD8FF',
  lava: '#FF6A3D',
  ufo: '#9BE9A8',
  bomber: '#D0D7DE',
  merge: '#A371F7',
  dino: '#C9D1D9',
  tetromino: '#39C5CF',
  hunter: '#C9A36A',
  flapper: '#FFD33D',
  slash: '#FF7B72',
  frog: '#A5E75A',
  pong: '#FFFFFF',
  duck: '#FFE066',
  dark: NEGATIVE_COLOR,
  coffee: NEGATIVE_COLOR,
  credits: NEGATIVE_COLOR,
  origin: '#BC8CFF',
  yank: '#F2A6FF',
  jitter: '#7CE38B',
  rebase: '#FFC680',
  zip: NEGATIVE_COLOR,
  issue: NEGATIVE_COLOR,
};
const POWERUP_LETTERS = {
  expand: 'E',
  multiball: 'F',
  laser: 'A',
  shield: 'B',
  pin: 'T',
  gravity: 'L',
  pipeline: 'Lp',
  revert: 'R',
  amend: 'W',
  invert: 'M',
  downgrade: 'N',
  hotfix: 'H',
  copilot: 'G',
  bump: 'V',
  upvote: 'U',
  xray: 'X',
  kill: 'K',
  triplepaddle: 'Oc',
  theme: 'Th',
  skin: 'Gf',
  storm: 'Cs',
  plumber: 'Pl',
  chomper: 'Ch',
  snake: 'Sn',
  lgtm: 'Lg',
  disco: 'Dc',
  halloween: 'Hw',
  matrix: 'Mx',
  paintball: 'Pb',
  lava: 'Lv',
  ufo: 'Uf',
  bomber: 'Bm',
  merge: 'Mg',
  dino: 'Dn',
  tetromino: 'Tt',
  hunter: 'Hn',
  flapper: 'Fb',
  slash: 'Fr',
  frog: 'Fg',
  pong: 'Pg',
  duck: 'Rd',
  dark: 'Dk',
  coffee: 'Cf',
  credits: 'Cr',
  origin: 'O',
  yank: 'Y',
  jitter: 'J',
  rebase: 'Rb',
  zip: 'Z',
  issue: 'I',
};
// Shown for a moment when a power-up is caught, so the letter (and the Git joke) makes sense.
const POWERUP_NAMES = {
  expand: 'Enterprise: bigger paddle',
  multiball: 'fork: more balls',
  laser: 'Actions: lasers',
  shield: 'branch protection: safety net',
  pin: 'tag: sticky bomb',
  gravity: 'LFS: heavy ball',
  pipeline: 'infinite loop: what falls comes back from the top',
  revert: 'revert: slow motion',
  amend: 'WIP: catch & aim',
  invert: 'merge conflict: controls reversed',
  downgrade: 'nitpick: tiny paddle',
  hotfix: 'hotfix: speed up',
  copilot: 'GitHub Copilot: autopilot paddle',
  bump: 'version bump: bigger ball',
  upvote: 'upvote: +1 life',
  xray: 'x-ray: every TNT revealed',
  kill: 'kill -9: ten commits gone',
  triplepaddle: 'Octocat: three mini paddles',
  theme: 'theme: new ball',
  skin: 'skin: new paddle',
  storm: 'commit storm: incoming!',
  plumber: "It's-a me, Plumber!",
  chomper: 'chomper: waka waka',
  snake: 'snake: it eats commits',
  lgtm: 'LGTM: everything gets approved',
  disco: 'disco: commits on the dance floor',
  halloween: 'halloween: spooky contributions',
  matrix: 'matrix: there is no spoon',
  paintball: 'paintball: splat!',
  lava: 'lava: the floor is commits',
  ufo: 'ufo: abducting commits',
  bomber: 'bomber: run!',
  merge: 'Ready to merge! Get your paddle to main, on the right',
  dino: 'dino: no internet, no problem',
  tetromino: 'tetromino: line clear!',
  hunter: 'hunter: duck season!',
  flapper: 'flapper: mind the pipes',
  slash: 'slash: fresh cut commits',
  frog: 'frog: crossing the graph',
  pong: 'pong: you control the top paddle too',
  duck: 'rubber duck: explain your bug to it',
  dark: 'dark mode: good luck',
  coffee: 'coffee overflow: too much caffeine',
  credits: "-1 life. You've run out of credits. Consider switching to a cheaper model.",
  origin: 'origin: reverse gravity',
  yank: 'yank: sideways gravity',
  jitter: 'jitter: zigzag ball',
  rebase: 'rebase: ball curves in arcs',
  zip: 'zipped: tiny ball',
  issue: 'issue reopened: five commits are back',
};
// Effects that run alongside the classic ones instead of replacing them.
const MOD_DURATIONS = {
  invert: 6000,
  downgrade: 8000,
  hotfix: 6000,
  gravity: 8000,
  revert: 6000,
  amend: 10000,
  pipeline: 15000,
  copilot: 12000,
  bump: 10000,
  zip: 8000,
  origin: 8000,
  yank: 8000,
  jitter: 8000,
  rebase: 8000,
  theme: 12000,
  skin: 12000,
  snake: 8000,
  lgtm: 8000,
  disco: 8000,
  halloween: 8000,
  matrix: 10000,
  paintball: 8000,
  lava: 8000,
  merge: 10000,
  pong: 15000,
  duck: 10000,
  dark: 6000,
  coffee: 6000,
};
const MAX_LIVES = 5;
const PIN_FUSE_MS = 2000;
const OCTOCAT_GAP = 70;
const BEST_TIME_KEY = 'arkanoid-best-seconds';

// Personal best, kept in this browser only. Storage can be blocked, and the game must not care.
const saveBestTime = (seconds) => {
  try {
    const stored = Number(localStorage.getItem(BEST_TIME_KEY));
    const previous = stored > 0 ? stored : null;
    const isNew = previous === null || seconds < previous;
    if (isNew) localStorage.setItem(BEST_TIME_KEY, String(seconds));
    return { seconds: isNew ? seconds : previous, isNew };
  } catch {
    return null;
  }
};
const DISCO_BEAT_MS = 700;
// With few blocks left, a hit is much more likely to drop a capsule.
const ENDGAME_BLOCKS = 5;
const ENDGAME_DROP_CHANCE = 0.7;
const ENDGAME_COOLDOWN = 1000;
const MERGE_PORTAL_WIDTH = 34; // how close to the right edge the paddle has to get
// The colors of GitHub's real Halloween contribution graph, plus some purple.
const HALLOWEEN_COLORS = { 1: '#631C03', 2: '#BD561D', 3: '#FA7A18', 4: '#FDDF68' };
const PAINT_COLORS = ['#FF3D71', '#FFAA00', '#FFE14D', '#2EE6A6', '#4DD8FF', '#7B61FF', '#FF5CF0'];
const MATRIX_TAIL = 6; // cells lit behind the head of each stream
// The film's look: half-width katakana, plus a few digits
const MATRIX_GLYPHS = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789';
const TOAST_MS = 3500;

// Color of a commit, given the active color power-ups. Returns null for its normal color.
const blockFill = (block, mods, now) => {
  if (mods.paintball && block.paint) return block.paint;
  if (mods.disco) return `hsl(${(now / 6 + block.col * 18 + block.row * 30) % 360}, 90%, 58%)`;
  // Nearly black, like the film: the falling glyphs are what shines
  if (mods.matrix) return `hsl(140, 55%, ${4 + block.level * 2}%)`;
  if (mods.lava) {
    // Heat waves rising from the bottom row
    const wave = Math.sin(now / 220 + block.row * 0.9 + block.col * 0.25);
    return `hsl(${18 + wave * 16}, 100%, ${44 + wave * 14}%)`;
  }
  if (mods.halloween) return (block.col + block.row) % 5 === 0 ? '#8957E5' : HALLOWEEN_COLORS[block.level];
  return null;
};
// The credits joke costs a life, so it drops less often than the other power-downs.
// The favorites drop more often. Everything else weighs 1, or 0.5 if it's a power-down.
const POWERUP_WEIGHTS = {
  matrix: 4,
  credits: 0.25,
  merge: 0.6, // wins the game on the spot, so it has to be a rare find
  skin: 2,
  duck: 4,
  snake: 4,
  plumber: 4,
  pipeline: 4,
  paintball: 4,
  gravity: 4,
  origin: 2,
  yank: 2,
  ufo: 3,
  dino: 3,
  tetromino: 3,
  hunter: 3,
  flapper: 3,
  slash: 3,
  frog: 3,
  pong: 1.5,
  bomber: 3,
};
const BALL_SKINS = [
  { id: 'soccer', label: 'soccer ball', r: 17 },
  { id: 'basketball', label: 'basketball', r: 20 },
  { id: 'tennis', label: 'tennis ball', r: 13 },
  { id: 'baseball', label: 'baseball', r: 14 },
  { id: 'eight', label: 'eight ball', r: 16 },
];

// Things you can swing: click (or Space) and the paddle hits the ball away, fast.
const PADDLE_SKINS = [
  { id: 'golf', label: 'golf club', sound: 'FORE!' },
];
const SWING_MS = 180;
const SWING_COOLDOWN_MS = 350;
const SWING_REACH = 48; // how far above the paddle a swing connects
const SWING_BOOST = 1.7;
const SWING_BOOST_MS = 1500;

// Same hitbox as the normal paddle: only the drawing changes. The handle is on the left, and a
// swing rotates the whole thing around it.
const drawPaddleSkin = (ctx, id, x, y, w, h, swing) => {
  const midY = y + h / 2;
  ctx.save();
  ctx.shadowBlur = 0;
  if (swing > 0) {
    ctx.translate(x + 6, midY);
    ctx.rotate(-1.15 * Math.sin(swing * Math.PI));
    ctx.translate(-(x + 6), -midY);
  }
  if (id === 'golf') {
    ctx.fillStyle = '#C9D1D9';
    ctx.fillRect(x + w * 0.2, midY - 1, w * 0.72, 2);
    ctx.fillStyle = '#2B2B2B';
    ctx.fillRect(x, midY - 2.5, w * 0.24, 5);
    ctx.fillStyle = '#8B949E';
    ctx.beginPath();
    ctx.moveTo(x + w * 0.88, midY - 2);
    ctx.lineTo(x + w, midY - 2);
    ctx.quadraticCurveTo(x + w + 3, midY + h * 0.9, x + w * 0.9, midY + h * 0.9);
    ctx.quadraticCurveTo(x + w * 0.86, midY + h * 0.4, x + w * 0.88, midY - 2);
    ctx.fill();
  }
  ctx.restore();
};

// Runners: they cross the board fast and break commits as they pass, instead of stopping.
const RUNNER_SPEED = 5.5;
const RUNNER_REACH = 30; // how far from the character a commit can be broken
const PLUMBER_MAX = 6;
const PLUMBER_STOP = 150; // pixels between the commits it stops at
const PLUMBER_BUMPS = 3; // head-butts per commit, each one pops a coin
const PLUMBER_JUMP_MS = 340;
const PLUMBER_CLEARANCE = 40; // gap between its head and the bottom row
const PLUMBER_PIXEL = 3.5;
const PLUMBER_HEIGHT = 12 * PLUMBER_PIXEL;
const CHOMPER_SPEED = 6;
const MAX_EATEN = 15; // chomper and snake stop here, so neither clears the board alone

// A little original pixel character: orange cap, blue overalls.
const drawPlumber = (ctx, x, feetY, dir, running, airborne) => {
  const u = PLUMBER_PIXEL;
  const px = (col, row, w, h, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x + (dir > 0 ? col : -col - w) * u, feetY + (row - 12) * u, w * u, h * u);
  };
  px(-3, 0, 6, 2, '#E52521'); // cap
  px(1, 1, 4, 1, '#E52521'); // visor
  px(-3, 2, 6, 3, '#F6C9A0'); // face
  px(1, 3, 1, 1, '#111111'); // eye
  px(-3, 5, 6, 4, '#0B5CD7'); // overalls
  px(-3, 5, 6, 1, '#E52521'); // shirt
  px(-4, 5, 1, 3, '#E52521'); // arm
  px(3, airborne ? 3 : 5, 1, 3, '#E52521'); // arm, raised when jumping
  const step = running ? 1 : 0;
  px(-3 - step, 9, 2, 2, '#0B5CD7'); // legs
  px(1 + step, 9, 2, 2, '#0B5CD7');
  px(-3 - step, 11, 2, 1, '#6E3B1E'); // shoes
  px(1 + step, 11, 2, 1, '#6E3B1E');
};

const drawCoin = (ctx, x, y, r, spin) => {
  ctx.fillStyle = '#FFD33D';
  ctx.beginPath();
  ctx.ellipse(x, y, Math.max(1, r * Math.abs(Math.cos(spin))), r, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#B8860B';
  ctx.lineWidth = 1;
  ctx.stroke();
};

const UFO_MAX = 10;
const UFO_BEAM_MS = 200;
const BOMB_THROWS = 4;
const BOMB_STRIDE = 240; // pixels between bombs
const DINO_MAX = 10;
const DINO_HOP = 120; // pixels between landings
const HUNTER_DUCKS = 3;
const HUNTER_BREAK = 3; // commits each duck takes on the way down
const HUNTER_GAP = 130; // pixels between ducks
const HUNTER_FALL_SPEED = 9;
const HUNTER_BANG_MS = 350;
const FLAPPER_MAX = 10;
const FLAPPER_STRIDE = 85; // pixels between broken commits
const FLAPPER_GRAVITY = 0.45;
const FLAPPER_FLAP = 6;
const FROG_MAX = 10;
const FROG_HOP_MS = 110;
const FROG_SIDE_COLS = 3; // columns covered by a sideways hop
const SLASH_RISE_MS = 650;
const SLASH_SWEEP_MS = 260;
const SLASH_STAGGER_MS = 600; // between one fruit and the next
const SLASH_FALL_MS = 900; // how long the halves stay after the last cut
const SLASH_REACH = 80; // half the length of each blade stroke
const SLASH_FRUIT_BREAK = 3; // commits around each fruit
const SLASH_FRUIT_REACH = 34;
const SLASH_FRUITS = [
  { rind: '#2EA043', flesh: '#F85149' },
  { rind: '#F0883E', flesh: '#FFD8A8' },
  { rind: '#E5534B', flesh: '#FFF1D6' },
];
const TETROMINO_PIECES = 3;
const TETROMINO_TICK_MS = 170;
const TETROMINOES = [
  { color: '#39C5CF', cells: [[0, 0], [1, 0], [2, 0], [3, 0]] }, // I
  { color: '#F2CC60', cells: [[0, 0], [1, 0], [0, 1], [1, 1]] }, // O
  { color: '#BC8CFF', cells: [[0, 0], [1, 0], [2, 0], [1, 1]] }, // T
  { color: '#FF9E4A', cells: [[0, 0], [0, 1], [0, 2], [1, 2]] }, // L
  { color: '#56D364', cells: [[1, 0], [2, 0], [0, 1], [1, 1]] }, // S
];
const PONG_HEIGHT = 8;
const BOMB_FLIGHT_MS = 200;
const BOMB_FUSE_MS = 450;
const BOMB_RANGE = 2; // cells in each direction of the cross
const FLAME_MS = 380;
// Size of the characters on the board
const UFO_SCALE = 1.05;
const BOMBER_SCALE = 1.15;

const roundRect = (ctx, x, y, w, h, r, fill) => {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
};

const drawUfoBeam = (ctx, x, y, bottom) => {
  const grad = ctx.createLinearGradient(0, y, 0, bottom);
  grad.addColorStop(0, 'rgba(155, 233, 168, 0.5)');
  grad.addColorStop(1, 'rgba(155, 233, 168, 0.04)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(x - 12, y);
  ctx.lineTo(x + 12, y);
  ctx.lineTo(x + 40, bottom);
  ctx.lineTo(x - 40, bottom);
  ctx.closePath();
  ctx.fill();
};

const drawUfo = (ctx, x, y, now) => {
  const bob = Math.sin(now / 180) * 2;
  ctx.save();
  ctx.translate(x, y + bob);
  // glass dome with a tiny pilot
  ctx.fillStyle = 'rgba(140, 220, 255, 0.35)';
  ctx.beginPath();
  ctx.arc(0, -5, 15, Math.PI, 0);
  ctx.fill();
  circle(ctx, 0, -11, 6, '#7CE38B');
  circle(ctx, -2.3, -12, 1.7, '#0B1F12');
  circle(ctx, 2.3, -12, 1.7, '#0B1F12');
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(0, -5, 15, Math.PI * 1.15, Math.PI * 1.45);
  ctx.stroke();
  // hull
  const hull = ctx.createLinearGradient(0, -6, 0, 9);
  hull.addColorStop(0, '#E8EEF4');
  hull.addColorStop(1, '#7D8B99');
  ctx.fillStyle = hull;
  ctx.beginPath();
  ctx.ellipse(0, 0, 34, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  roundRect(ctx, -14, 6, 28, 4, 2, '#56636F');
  // running lights
  const lights = ['#FF5C5C', '#FFD33D', '#4DD8FF', '#7CE38B', '#FF5CF0'];
  for (let i = 0; i < 5; i++) {
    const on = (Math.floor(now / 130) + i) % 2 === 0;
    circle(ctx, -24 + i * 12, 1, 2.3, on ? lights[i] : '#3A444E');
  }
  ctx.restore();
};

// A gray pixel dinosaur, the one you meet when the internet is down.
const drawDino = (ctx, x, feetY, dir, airborne, now) => {
  const u = 2.6;
  const gray = '#C9D1D9';
  const px = (col, row, w, h, color = gray) => {
    ctx.fillStyle = color;
    ctx.fillRect(x + (dir > 0 ? col : -col - w) * u, feetY + (row - 15) * u, w * u, h * u);
  };
  px(2, 0, 8, 1);
  px(1, 1, 10, 4);
  px(4, 2, 1, 1, '#0D1117'); // eye
  px(1, 5, 6, 1);
  px(5, 6, 4, 1); // mouth
  px(0, 6, 5, 4);
  px(-2, 7, 2, 3); // body
  px(-4, 6, 2, 3); // tail
  px(-6, 5, 2, 2);
  px(-7, 3, 1, 2);
  px(4, 8, 2, 1); // arm
  const step = !airborne && Math.floor(now / 90) % 2 === 0;
  px(-1, 10, 5, 2);
  px(-1, 12, 2, step ? 1 : 3); // legs
  px(2, 12, 2, step ? 3 : 1);
};

// A pixel mallard, flying or shot and falling upside down.
const drawHuntedDuck = (ctx, x, y, dir, falling, now) => {
  const u = 2.4;
  const px = (col, row, w, h, color) => {
    ctx.fillStyle = color;
    ctx.fillRect((dir > 0 ? col : -col - w) * u, (row - 2) * u, w * u, h * u);
  };
  ctx.save();
  ctx.translate(x, y);
  if (falling) ctx.scale(1, -1);
  px(-5, 1, 9, 4, '#8A5A2B'); // body
  px(-7, 0, 2, 2, '#5C3D1E'); // tail
  px(4, -1, 3, 3, '#2EA043'); // head
  px(4, 2, 2, 1, '#FFFFFF'); // neck ring
  px(5, -1, 1, 1, '#111111'); // eye
  px(7, 0, 2, 1, '#FFB000'); // beak
  px(-3, Math.floor(now / 80) % 2 === 0 ? -2 : 3, 4, 3, '#C9A36A'); // wing
  ctx.restore();
};

const drawCrosshair = (ctx, x, y) => {
  ctx.strokeStyle = '#FF4D4D';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, 15, 0, Math.PI * 2);
  ctx.moveTo(x - 21, y);
  ctx.lineTo(x + 21, y);
  ctx.moveTo(x, y - 21);
  ctx.lineTo(x, y + 21);
  ctx.stroke();
};

// A round yellow bird that never stops flapping.
const drawFlapper = (ctx, x, y, dir, wingUp) => {
  const u = 4.5;
  const px = (col, row, w, h, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x + (dir > 0 ? col : -col - w) * u, y + row * u, w * u, h * u);
  };
  px(-4, -3, 8, 6, '#FFD33D'); // body
  px(-3, -4, 6, 1, '#FFD33D');
  px(-3, 3, 6, 1, '#F0B429');
  px(1, -3, 3, 3, '#FFFFFF'); // eye
  px(3, -2, 1, 1, '#111111');
  px(4, 0, 3, 2, '#F0883E'); // beak
  px(-5, wingUp ? -2 : 1, 4, 2, '#FFF1A8'); // wing
};

// A frog seen from above, legs out while it's in the air.
const drawFrog = (ctx, x, y, airborne) => {
  const u = 2.2;
  const px = (col, row, w, h, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x + col * u, y + row * u, w * u, h * u);
  };
  const green = '#A5E75A';
  const legs = '#6BBF3A';
  px(-3, -3, 6, 7, green); // body
  px(-4, -5, 3, 3, green); // eyes
  px(1, -5, 3, 3, green);
  px(-3, -5, 1, 1, '#111111');
  px(2, -5, 1, 1, '#111111');
  px(-5, airborne ? 3 : 0, 2, 3, legs); // back legs
  px(3, airborne ? 3 : 0, 2, 3, legs);
  px(-5, airborne ? -4 : -2, 2, 2, legs); // front legs
  px(3, airborne ? -4 : -2, 2, 2, legs);
};

const drawFruit = (ctx, x, y, fruit) => {
  circle(ctx, x, y, 13, fruit.rind);
  circle(ctx, x - 4, y - 4, 3, 'rgba(255, 255, 255, 0.45)');
};

// Half a fruit, flesh side showing.
const drawFruitHalf = (ctx, half) => {
  ctx.save();
  ctx.translate(half.x, half.y);
  ctx.rotate(half.spin);
  ctx.fillStyle = half.fruit.rind;
  ctx.beginPath();
  ctx.arc(0, 0, 13, 0, Math.PI);
  ctx.fill();
  ctx.fillStyle = half.fruit.flesh;
  ctx.beginPath();
  ctx.arc(0, 0, 10, 0, Math.PI);
  ctx.fill();
  ctx.restore();
};

const drawTetrominoCell = (ctx, x, y, w, h, color) => {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.fillRect(x, y, w, 3);
  ctx.fillRect(x, y, 3, h);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(x, y + h - 3, w, 3);
  ctx.fillRect(x + w - 3, y, 3, h);
};

// Pixel art, like the plumber: white helmet, peach face, blue suit and purple gloves and boots.
const BOMBER_PIXEL = 2.6;
const drawBomberKid = (ctx, x, feetY, dir, moving, now) => {
  const u = BOMBER_PIXEL;
  const px = (col, row, w, h, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x + (dir > 0 ? col : -col - w) * u, feetY + (row - 15) * u, w * u, h * u);
  };
  const step = moving && Math.floor(now / 90) % 2 === 0 ? 1 : 0;
  px(-1, 0, 2, 1, '#FFFFFF'); // top of the helmet
  px(-3, 1, 6, 1, '#FFFFFF');
  px(-4, 2, 8, 6, '#FFFFFF');
  px(-3, 8, 6, 1, '#FFFFFF');
  px(-5, 4, 1, 2, '#8B3FD9'); // side knobs
  px(4, 4, 1, 2, '#8B3FD9');
  px(-3, 3, 6, 4, '#F6C9A0'); // face
  px(-2, 4, 1, 2, '#111111'); // eyes
  px(1, 4, 1, 2, '#111111');
  px(-3, 9, 6, 2, '#2F6FEB'); // suit
  px(-3, 11, 6, 1, '#111111'); // belt
  px(-1, 11, 2, 1, '#FFD33D'); // buckle
  px(-5, 9, 2, 2, '#2F6FEB'); // arms
  px(3, 9, 2, 2, '#2F6FEB');
  px(-6, 10, 2, 2, '#8B3FD9'); // gloves
  px(4, 10, 2, 2, '#8B3FD9');
  px(-3, 12, 2, 2, '#FFFFFF'); // legs
  px(1, 12, 2, 2, '#FFFFFF');
  px(-4 - step, 14, 3, 1, '#8B3FD9'); // boots
  px(1 + step, 14, 3, 1, '#8B3FD9');
};

const drawBomb = (ctx, x, y, r, now, urgent) => {
  const pulse = urgent ? 1 + Math.sin(now / 45) * 0.14 : 1;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(pulse, pulse);
  ctx.strokeStyle = '#C9A26B';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(r * 0.55, -r * 0.75);
  ctx.quadraticCurveTo(r * 1.1, -r * 1.5, r * 1.45, -r * 1.1);
  ctx.stroke();
  roundRect(ctx, r * 0.3, -r * 1.05, r * 0.65, r * 0.45, 1, '#30363D');
  const body = ctx.createRadialGradient(-r * 0.3, -r * 0.35, r * 0.1, 0, 0, r);
  body.addColorStop(0, '#6E7681');
  body.addColorStop(1, '#0D1117');
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();
  circle(ctx, r * 1.45, -r * 1.1, 2.6 + Math.sin(now / 40), '#FF7B00');
  circle(ctx, r * 1.45, -r * 1.1, 1.3, '#FFF3B0');
  ctx.restore();
};

const drawFlame = (ctx, x0, y0, x1, y1, thickness, alpha) => {
  ctx.save();
  ctx.lineCap = 'round';
  ctx.globalAlpha = alpha;
  ctx.shadowColor = '#FF7B00';
  ctx.shadowBlur = 16;
  for (const [t, color] of [[1, '#FF5A1F'], [0.65, '#FFB02E'], [0.3, '#FFF3B0']]) {
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness * t;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
  }
  ctx.restore();
};

// Drawn by hand instead of with emoji, so they look the same on every system.
const circle = (ctx, x, y, r, fill) => {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
};

const drawBallSkin = (ctx, id, x, y, r, spin) => {
  ctx.save();
  ctx.shadowBlur = 0;
  ctx.translate(x, y);
  if (id === 'duck') {
    circle(ctx, 0, 0, r, '#FFD84D');
    circle(ctx, r * 0.35, -r * 0.3, r * 0.17, '#111111');
    ctx.fillStyle = '#FF8C1A';
    ctx.beginPath();
    ctx.moveTo(r * 0.75, -r * 0.2);
    ctx.lineTo(r * 1.45, r * 0.05);
    ctx.lineTo(r * 0.75, r * 0.3);
    ctx.fill();
    ctx.restore();
    return;
  }
  ctx.rotate(spin);
  ctx.lineWidth = Math.max(1, r * 0.13);
  if (id === 'soccer') {
    circle(ctx, 0, 0, r, '#FFFFFF');
    circle(ctx, 0, 0, r * 0.32, '#111111');
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      circle(ctx, Math.cos(a) * r * 0.8, Math.sin(a) * r * 0.8, r * 0.2, '#111111');
    }
  } else if (id === 'basketball') {
    circle(ctx, 0, 0, r, '#E8742A');
    ctx.strokeStyle = '#3A1D0A';
    ctx.beginPath();
    ctx.moveTo(-r, 0);
    ctx.lineTo(r, 0);
    ctx.moveTo(0, -r);
    ctx.lineTo(0, r);
    ctx.moveTo(-r * 0.7, -r * 0.7);
    ctx.quadraticCurveTo(-r * 0.2, 0, -r * 0.7, r * 0.7);
    ctx.moveTo(r * 0.7, -r * 0.7);
    ctx.quadraticCurveTo(r * 0.2, 0, r * 0.7, r * 0.7);
    ctx.stroke();
  } else if (id === 'tennis') {
    circle(ctx, 0, 0, r, '#D7F03C');
    ctx.strokeStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(-r * 1.1, 0, r, -0.8, 0.8);
    ctx.moveTo(r * 0.4, -r * 0.7);
    ctx.arc(r * 1.1, 0, r, Math.PI - 0.8, Math.PI + 0.8, false);
    ctx.stroke();
  } else if (id === 'baseball') {
    circle(ctx, 0, 0, r, '#F4F1E8');
    ctx.strokeStyle = '#D23B3B';
    ctx.beginPath();
    ctx.arc(-r * 1.2, 0, r, -0.7, 0.7);
    ctx.moveTo(r * 0.45, -r * 0.65);
    ctx.arc(r * 1.2, 0, r, Math.PI - 0.7, Math.PI + 0.7, false);
    ctx.stroke();
  } else if (id === 'eight') {
    circle(ctx, 0, 0, r, '#111111');
    circle(ctx, 0, 0, r * 0.5, '#FFFFFF');
    ctx.fillStyle = '#111111';
    ctx.font = `bold ${Math.round(r * 0.8)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('8', 0, 0.5);
  }
  ctx.restore();
};
// While one of these is on, the paddle doesn't follow the cursor directly.
const DETACHED_MODS = new Set(['invert', 'copilot']);
const isDetached = (s) => [...DETACHED_MODS].some(k => s.mods[k]);
// Full width the paddle takes up: the three Octocat paddles count as one block.
const paddleSpan = (s) => (s.effects.triplepaddle ? s.paddle.w * 3 + OCTOCAT_GAP * 2 : s.paddle.w);
const BALL_PATH_MODS = new Set(['gravity', 'origin', 'yank', 'rebase']);
const POWERUP_DURATIONS = {
  triplepaddle: 15000,
  expand: 15000,
  laser: 10000,
  shield: 8000,
};
const POWERUP_DROP_CHANCE = 0.25;
const POWERUP_COOLDOWN = 3000;
const LASER_COOLDOWN = 200;
const LASER_SPEED = 8;
const INITIAL_LIVES = 3;
// Real commits broken so far. TNT days go all at once.
const commitsDestroyed = (blocks) => blocks.reduce((sum, b) => {
  if (!b.alive) return sum + b.maxHp;
  return b.isTnt ? sum : sum + b.maxHp - Math.max(0, b.hp);
}, 0);


const ArkanoidGame = ({ active, onExit, gridRef }) => {
  const canvasRef = useRef(null);
  const stateRef = useRef(null);
  const [status, setStatus] = useState('playing');
  const [score, setScore] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [runId, setRunId] = useState(0);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [outOfCredits, setOutOfCredits] = useState(false);
  const [mergedToMain, setMergedToMain] = useState(false);
  const [best, setBest] = useState(null);
  const [totalCommits, setTotalCommits] = useState(0);
  const onExitRef = useRef(onExit);

  useEffect(() => {
    onExitRef.current = onExit;
  }, [onExit]);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    const grid = gridRef.current;
    if (!canvas || !grid) return;

    const gridRect = grid.getBoundingClientRect();
    const canvasRect = canvas.parentElement.getBoundingClientRect();

    const calendar = grid.closest('.github-calendar');
    const divider = calendar ? calendar.previousElementSibling : null;
    const ceilingBottom = divider ? divider.getBoundingClientRect().bottom : gridRect.top;
    const topExtension = Math.max(0, gridRect.top - ceilingBottom);

    const offsetX = gridRect.left - canvasRect.left;
    const offsetY = gridRect.top - canvasRect.top - topExtension;

    const width = gridRect.width;
    const paddleAreaHeight = 280;
    const height = topExtension + gridRect.height + paddleAreaHeight;
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.style.left = `${offsetX}px`;
    canvas.style.top = `${offsetY}px`;

    const days = Array.from(grid.querySelectorAll('.github-day'));
    days.forEach(el => {
      el.dataset.originalLevel = el.dataset.level;
    });
    const weekEls = Array.from(grid.querySelectorAll('.github-week'));
    const blocks = [];
    weekEls.forEach((weekEl, col) => {
      const dayEls = Array.from(weekEl.querySelectorAll('.github-day'));
      dayEls.forEach((el, row) => {
        const level = Number(el.dataset.level);
        if (level === 0) return;
        const rect = el.getBoundingClientRect();
        const count = Number(el.dataset.count) || 1;
        const isTnt = count >= 30;
        blocks.push({
          el,
          col,
          row,
          x: rect.left - gridRect.left,
          y: rect.top - gridRect.top + topExtension,
          w: rect.width,
          h: rect.height,
          level,
          maxHp: count,
          hp: count,
          hit: false,
          alive: true,
          isTnt,
          tntRevealed: false,
        });
      });
    });

    setTotalCommits(blocks.reduce((sum, b) => sum + b.maxHp, 0));
    setScore(0);
    setElapsed(0);
    setStatus('playing');
    setLives(INITIAL_LIVES);
    setOutOfCredits(false);
    setMergedToMain(false);
    setBest(null);

    const paddleBaseW = 120;
    const paddleH = 10;
    const paddle = { x: width / 2 - paddleBaseW / 2, y: height - 40, w: paddleBaseW, h: paddleH, baseW: paddleBaseW };
    const balls = [{
      x: width / 2,
      y: height - 60,
      r: 6,
      vx: 3 * (Math.random() > 0.5 ? 1 : -1),
      vy: -4.5,
    }];
    const powerUps = [];
    const projectiles = [];
    const effects = { expand: 0, laser: 0, shield: 0, triplepaddle: 0 };
    const mods = { invert: 0, downgrade: 0, hotfix: 0, gravity: 0, revert: 0, amend: 0, pin: 0, pipeline: 0, copilot: 0, bump: 0, zip: 0, origin: 0, yank: 0, jitter: 0, rebase: 0, theme: 0, skin: 0, snake: 0, lgtm: 0, disco: 0, halloween: 0, matrix: 0, paintball: 0, lava: 0, merge: 0, pong: 0, duck: 0, dark: 0, coffee: 0 };

    stateRef.current = {
      blocks, paddle, balls, powerUps, projectiles, effects, mods, width, height,
      toast: null,
      ballSkin: BALL_SKINS[0],
      paddleSkin: PADDLE_SKINS[0],
      swingAt: 0,
      swingRequested: false,
      quacks: [],
      plumber: null,
      coins: [],
      discoNext: 0,
      chomper: null,
      snake: null,
      ufo: null,
      dino: null,
      tetromino: null,
      hunter: null,
      flapper: null,
      slash: null,
      frog: null,
      bomber: null,
      bombs: [],
      flames: [],
      lastQuack: 0,
      pointerX: null, // last cursor position, null when playing with the keyboard
      targetX: null,
      gliding: false,
      paddleSpan: paddleBaseW,
      keys: {}, mouseDown: false, lastShot: 0,
      lives: INITIAL_LIVES,
      combo: 0,
      paddleHits: 0,
      lastPowerUpSpawn: 0,
      respawnEnd: 0,
      explosions: [],
    };

    const startTime = performance.now();
    let lastFrameTime = startTime;
    const TARGET_FRAME_MS = 1000 / 60;
    let animationId;
    let lastElapsed = 0;

    const keyDown = (e) => {
      if (['ArrowLeft', 'ArrowRight', 'a', 'd', 'A', 'D'].includes(e.key)) {
        stateRef.current.keys[e.key] = true;
        e.preventDefault();
      }
      if (e.key === ' ' && stateRef.current.mods.skin) {
        stateRef.current.swingRequested = true;
        e.preventDefault();
      }
      if (e.key === 'Escape') onExitRef.current();
    };
    const keyUp = (e) => {
      stateRef.current.keys[e.key] = false;
    };
    const mouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const s = stateRef.current;
      const rawX = e.clientX - rect.left;
      if (s.mods.invert) {
        // Reversed controls move the paddle relative to the cursor, so it never teleports.
        const delta = s.pointerX === null ? 0 : rawX - s.pointerX;
        s.targetX = (s.targetX ?? s.paddle.x) - delta;
      } else {
        s.targetX = rawX - paddleSpan(s) / 2;
      }
      s.pointerX = rawX;
    };
    const mouseDown = (e) => {
      if (e.button === 0) {
        stateRef.current.mouseDown = true;
        stateRef.current.swingRequested = true;
        e.preventDefault();
      }
    };
    const mouseUp = (e) => {
      if (e.button === 0) stateRef.current.mouseDown = false;
    };

    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);
    canvas.addEventListener('mousemove', mouseMove);
    canvas.addEventListener('mousedown', mouseDown);
    window.addEventListener('mouseup', mouseUp);

    const ctx = canvas.getContext('2d');
    const levelColors = {
      1: '#0E4429',
      2: '#006D32',
      3: '#26A641',
      4: '#39D353',
    };

    let currentStatus = 'playing';

    // Characters take a commit quietly. Only bombs set off TNT, or one TNT chain could clear half
    // the board.
    const destroyBlock = (block, now, chainTnt = false) => {
      block.alive = false;
      block.el.dataset.level = '0';
      if (block.isTnt && chainTnt) triggerTntExplosion(block, now);
    };

    // Chomper: crosses the fullest row eating commits, up to MAX_EATEN.
    const startChomper = (s) => {
      const perRow = new Map();
      for (const b of s.blocks) {
        if (b.alive) perRow.set(b.row, (perRow.get(b.row) || 0) + 1);
      }
      if (!perRow.size) return;
      const row = [...perRow.entries()].sort((a, b) => b[1] - a[1])[0][0];
      const sample = s.blocks.find(b => b.row === row);
      const dir = Math.random() > 0.5 ? 1 : -1;
      s.chomper = { row, y: sample.y + sample.h / 2, r: sample.h * 0.75, x: dir > 0 ? -20 : width + 20, dir, eaten: 0 };
    };

    const updateChomper = (s, dt, now) => {
      const c = s.chomper;
      if (!c) return;
      c.x += c.dir * CHOMPER_SPEED * dt;
      if (c.eaten < MAX_EATEN) {
        for (const b of s.blocks) {
          if (b.alive && b.row === c.row && Math.abs(b.x + b.w / 2 - c.x) < c.r) {
            destroyBlock(b, now);
            c.eaten += 1;
          }
        }
      }
      if (c.x < -30 || c.x > width + 30) s.chomper = null;
    };

    // Snake: moves cell by cell over the commit grid toward the nearest live block.
    const startSnake = (s, now) => {
      const first = s.blocks[0];
      const otherCol = s.blocks.find(b => b.col !== first.col);
      const otherRow = s.blocks.find(b => b.row !== first.row);
      if (!first || !otherCol || !otherRow) return;
      const stepX = (otherCol.x - first.x) / (otherCol.col - first.col);
      const stepY = (otherRow.y - first.y) / (otherRow.row - first.row);
      s.snake = {
        cells: [{ col: 0, row: Math.floor(Math.random() * 7) }],
        length: 4,
        next: now,
        eaten: 0,
        stepX,
        stepY,
        originX: first.x - first.col * stepX,
        originY: first.y - first.row * stepY,
        w: first.w,
        h: first.h,
      };
    };

    const updateSnake = (s, now) => {
      const sn = s.snake;
      if (!sn) return;
      if (!s.mods.snake || sn.eaten >= MAX_EATEN) {
        s.snake = null;
        s.mods.snake = 0;
        return;
      }
      if (now < sn.next) return;
      sn.next = now + 70;
      const head = sn.cells[sn.cells.length - 1];
      let target = null;
      let best = Infinity;
      for (const b of s.blocks) {
        if (!b.alive) continue;
        const d = Math.abs(b.col - head.col) + Math.abs(b.row - head.row);
        if (d < best) { best = d; target = b; }
      }
      if (!target) return;
      const dCol = target.col - head.col;
      const dRow = target.row - head.row;
      const next = Math.abs(dCol) >= Math.abs(dRow)
        ? { col: head.col + Math.sign(dCol), row: head.row }
        : { col: head.col, row: head.row + Math.sign(dRow) };
      sn.cells.push(next);
      for (const b of s.blocks) {
        if (b.alive && b.col === next.col && b.row === next.row) {
          destroyBlock(b, now);
          sn.eaten += 1;
          sn.length += 1;
        }
      }
      while (sn.cells.length > sn.length) sn.cells.shift();
    };

    const blockColor = (b, s, now) => blockFill(b, s.mods, now) ?? levelColors[b.level];
    const gridTop = (s) => Math.min(...s.blocks.map(b => b.y));
    const gridBottom = (s) => Math.max(...s.blocks.map(b => b.y + b.h));

    // UFO: crosses above the graph and beams commits up.
    const startUfo = (s) => {
      const dir = Math.random() > 0.5 ? 1 : -1;
      s.ufo = { x: dir > 0 ? -50 : width + 50, y: Math.max(34, gridTop(s) - 28), dir, next: 0, taken: 0, rising: [] };
    };

    const updateUfo = (s, dt, now) => {
      const u = s.ufo;
      if (!u) return;
      u.x += u.dir * CHOMPER_SPEED * dt;
      if (now >= u.next && u.taken < UFO_MAX) {
        const reach = s.blocks.filter(b => b.alive && Math.abs(b.x + b.w / 2 - u.x) < 30);
        if (reach.length) {
          const b = reach[Math.floor(Math.random() * reach.length)];
          u.rising.push({ x: b.x + b.w / 2, y: b.y + b.h / 2, w: b.w, h: b.h, color: blockColor(b, s, now), start: now });
          destroyBlock(b, now);
          u.taken += 1;
          u.next = now + 150;
        }
      }
      u.rising = u.rising.filter(r => now - r.start < UFO_BEAM_MS);
      if (!u.rising.length && (u.x < -50 || u.x > width + 50)) s.ufo = null;
    };

    // Bomber: runs along the top of the graph, dropping short-fuse bombs on the way.
    const startBomber = (s) => {
      const dir = Math.random() > 0.5 ? 1 : -1;
      s.bomber = { x: dir > 0 ? -50 : width + 50, y: gridTop(s) - 3, dir, stride: null, throws: 0 };
    };

    const explodeBomb = (s, bomb, now) => {
      const { col, row, x, y, stepX, stepY } = bomb;
      for (const b of s.blocks) {
        if (!b.alive) continue;
        const inRow = b.row === row && Math.abs(b.col - col) <= BOMB_RANGE;
        const inCol = b.col === col && Math.abs(b.row - row) <= BOMB_RANGE;
        if (inRow || inCol) destroyBlock(b, now, true);
      }
      s.flames.push({ x, y, reachX: stepX * (BOMB_RANGE + 0.4), reachY: stepY * (BOMB_RANGE + 0.4), start: now });
    };

    const updateBomber = (s, dt, now) => {
      const p = s.bomber;
      if (p) {
        p.x += p.dir * RUNNER_SPEED * dt;
        const stride = Math.floor(p.x / BOMB_STRIDE);
        if (stride !== p.stride) {
          p.stride = stride;
          const t = p.throws < BOMB_THROWS ? commitNear(s, p.x) : null;
          if (t) {
            const sameRow = s.blocks.find(b => b.row === t.row && b.col !== t.col);
            const sameCol = s.blocks.find(b => b.col === t.col && b.row !== t.row);
            s.bombs.push({
              col: t.col,
              row: t.row,
              x: t.x + t.w / 2,
              y: t.y + t.h / 2,
              fromX: p.x,
              fromY: p.y - 24,
              stepX: sameRow ? Math.abs((sameRow.x - t.x) / (sameRow.col - t.col)) : t.w + 3,
              stepY: sameCol ? Math.abs((sameCol.y - t.y) / (sameCol.row - t.row)) : t.h + 3,
              start: now,
            });
            p.throws += 1;
          }
        }
        if (p.x < -60 || p.x > width + 60) s.bomber = null;
      }
      for (let i = s.bombs.length - 1; i >= 0; i--) {
        if (now - s.bombs[i].start > BOMB_FLIGHT_MS + BOMB_FUSE_MS) {
          explodeBomb(s, s.bombs[i], now);
          s.bombs.splice(i, 1);
        }
      }
      s.flames = s.flames.filter(f => now - f.start < FLAME_MS);
    };

    // The commit a runner breaks next: the nearest live one on top of (or under) the graph.
    const commitNear = (s, x, fromBelow) => {
      const near = s.blocks.filter(b => b.alive && Math.abs(b.x + b.w / 2 - x) < RUNNER_REACH);
      return near.sort((a, b) => (fromBelow ? b.y - a.y : a.y - b.y))[0];
    };

    // Dino: runs along the top of the graph, and each landing breaks the commit underneath.
    const startDino = (s) => {
      const dir = Math.random() > 0.5 ? 1 : -1;
      s.dino = { x: dir > 0 ? -30 : width + 30, ground: gridTop(s) - 3, dir, hop: null, broken: 0 };
    };

    const updateDino = (s, dt, now) => {
      const d = s.dino;
      if (!d) return;
      d.x += d.dir * RUNNER_SPEED * dt;
      const hop = Math.floor(d.x / DINO_HOP);
      if (hop !== d.hop) {
        d.hop = hop;
        if (d.broken < DINO_MAX) {
          const live = s.blocks.filter(b => b.alive && Math.abs(b.x + b.w / 2 - d.x) < 30);
          const col = live.sort((a, b) => a.y - b.y)[0];
          if (col) {
            s.explosions.push({ x: col.x + col.w / 2, y: col.y + col.h / 2, startTime: now, duration: 250 });
            destroyBlock(col, now);
            d.broken += 1;
          }
        }
      }
      if (d.x < -40 || d.x > width + 40) s.dino = null;
    };

    // Hunter: three ducks fly over the top of the graph. Each one is shot above a live commit and
    // takes the commits below it on the way down.
    const startHunter = (s) => {
      const live = s.blocks.filter(b => b.alive);
      if (!live.length) return;
      const dir = Math.random() > 0.5 ? 1 : -1;
      const top = gridTop(s);
      const bottom = gridBottom(s);
      // The lead duck gets the nearest target, so the shots come one after the other
      const targets = Array.from({ length: HUNTER_DUCKS }, () => {
        const b = live[Math.floor(Math.random() * live.length)];
        return b.x + b.w / 2;
      }).sort((a, b) => (a - b) * dir);
      const ducks = targets.map((shootX, i) => ({
        x: dir > 0 ? -30 - i * HUNTER_GAP : width + 30 + i * HUNTER_GAP,
        y: top,
        lane: top + (bottom - top) * (0.05 + i * 0.1),
        dir,
        shootX,
        falling: false,
        broken: 0,
      }));
      s.hunter = { ducks, shots: [], bottom };
    };

    const updateHunter = (s, dt, now) => {
      const h = s.hunter;
      if (!h) return;
      for (const d of h.ducks) {
        if (!d.falling) {
          d.x += d.dir * CHOMPER_SPEED * dt;
          d.y = d.lane + Math.sin(d.x / 45) * 16;
          if ((d.x - d.shootX) * d.dir >= 0) {
            d.falling = true;
            h.shots.push({ x: d.x, y: d.y, start: now });
          }
          continue;
        }
        d.y += HUNTER_FALL_SPEED * dt;
        if (d.broken >= HUNTER_BREAK) continue;
        for (const b of s.blocks) {
          if (b.alive && Math.abs(b.x + b.w / 2 - d.x) < b.w * 0.6 && Math.abs(b.y + b.h / 2 - d.y) < 12) {
            s.explosions.push({ x: b.x + b.w / 2, y: b.y + b.h / 2, startTime: now, duration: 220 });
            destroyBlock(b, now);
            d.broken += 1;
          }
        }
      }
      h.shots = h.shots.filter(shot => now - shot.start < HUNTER_BANG_MS);
      if (h.ducks.every(d => d.falling && d.y > h.bottom + 30)) s.hunter = null;
    };

    // Flapper: crosses the graph falling and flapping, breaking a commit every so often.
    const startFlapper = (s) => {
      const dir = Math.random() > 0.5 ? 1 : -1;
      const top = gridTop(s);
      const bottom = gridBottom(s);
      s.flapper = { x: dir > 0 ? -30 : width + 30, y: (top + bottom) / 2, vy: 0, dir, top, bottom, flapAt: bottom, lastFlap: 0, stride: null, broken: 0 };
    };

    const updateFlapper = (s, dt, now) => {
      const f = s.flapper;
      if (!f) return;
      f.x += f.dir * CHOMPER_SPEED * dt;
      f.vy += FLAPPER_GRAVITY * dt;
      f.y += f.vy * dt;
      if (f.y < f.top) {
        f.y = f.top;
        f.vy = 0;
      }
      if (f.y >= f.flapAt) {
        f.vy = -FLAPPER_FLAP;
        f.lastFlap = now;
        f.flapAt = f.top + 20 + Math.random() * (f.bottom - f.top - 20);
      }
      const stride = Math.floor(f.x / FLAPPER_STRIDE);
      if (stride !== f.stride) {
        f.stride = stride;
        const near = s.blocks
          .filter(b => b.alive && Math.hypot(b.x + b.w / 2 - f.x, b.y + b.h / 2 - f.y) < RUNNER_REACH)
          .sort((a, b) => Math.hypot(a.x - f.x, a.y - f.y) - Math.hypot(b.x - f.x, b.y - f.y));
        if (near.length && f.broken < FLAPPER_MAX) {
          const b = near[0];
          s.explosions.push({ x: b.x + b.w / 2, y: b.y + b.h / 2, startTime: now, duration: 220 });
          destroyBlock(b, now);
          f.broken += 1;
        }
      }
      if (f.x < -40 || f.x > width + 40) s.flapper = null;
    };

    // Slash: three fruits fly up, one at a time, to different parts of the graph. A blade stroke
    // cuts each one and breaks the commits around it.
    const startSlash = (s, now) => {
      const live = s.blocks.filter(b => b.alive);
      if (!live.length) return;
      const zone = width / SLASH_FRUITS.length;
      const zones = SLASH_FRUITS.map((_, i) => i).sort(() => Math.random() - 0.5);
      const fruits = SLASH_FRUITS.map((fruit, i) => {
        const inZone = live.filter(b => Math.floor((b.x + b.w / 2) / zone) === zones[i]);
        const pool = inZone.length ? inZone : live;
        const target = pool[Math.floor(Math.random() * pool.length)];
        const x = target.x + target.w / 2;
        const y = target.y + target.h / 2;
        const flip = Math.random() > 0.5 ? 1 : -1;
        return {
          fruit,
          x,
          y,
          fromX: x + (Math.random() - 0.5) * 80,
          from: { x: x - flip * SLASH_REACH, y: y + SLASH_REACH * 0.6 },
          to: { x: x + flip * SLASH_REACH, y: y - SLASH_REACH * 0.6 },
          start: now + i * SLASH_STAGGER_MS,
          cut: false,
          halves: [],
        };
      });
      s.slash = { fruits, end: fruits[fruits.length - 1].start + SLASH_RISE_MS + SLASH_SWEEP_MS + SLASH_FALL_MS };
    };

    const updateSlash = (s, dt, now) => {
      const c = s.slash;
      if (!c) return;
      for (const f of c.fruits) {
        // The fruit is cut when the blade reaches the middle of its stroke
        if (!f.cut && now - f.start >= SLASH_RISE_MS + SLASH_SWEEP_MS / 2) {
          f.cut = true;
          s.blocks
            .filter(b => b.alive && Math.hypot(b.x + b.w / 2 - f.x, b.y + b.h / 2 - f.y) < SLASH_FRUIT_REACH)
            .sort((a, b) => Math.hypot(a.x + a.w / 2 - f.x, a.y + a.h / 2 - f.y) - Math.hypot(b.x + b.w / 2 - f.x, b.y + b.h / 2 - f.y))
            .slice(0, SLASH_FRUIT_BREAK)
            .forEach((b) => {
              s.explosions.push({ x: b.x + b.w / 2, y: b.y + b.h / 2, startTime: now, duration: 220 });
              destroyBlock(b, now);
            });
          for (const side of [-1, 1]) {
            f.halves.push({ fruit: f.fruit, x: f.x, y: f.y, vx: side * 2.4, vy: -2.5, spin: side > 0 ? 0 : Math.PI });
          }
        }
        for (const half of f.halves) {
          half.vy += 0.4 * dt;
          half.x += half.vx * dt;
          half.y += half.vy * dt;
          half.spin += 0.12 * dt;
        }
      }
      if (now > c.end) s.slash = null;
    };

    // Frog: hops up the graph, two rows then sideways, breaking the commit it lands on.
    const nextFrogHop = (f) => {
      const sideways = f.hop % 3 === 2;
      if (sideways && (f.col + f.dir * FROG_SIDE_COLS < 0 || f.col + f.dir * FROG_SIDE_COLS > f.maxCol)) f.dir = -f.dir;
      const to = { col: sideways ? f.col + f.dir * FROG_SIDE_COLS : f.col, row: sideways ? f.row : f.row - 1 };
      if (sideways) f.dir = -f.dir;
      return to;
    };

    const startFrog = (s, now) => {
      const maxCol = Math.max(...s.blocks.map(b => b.col));
      const maxRow = Math.max(...s.blocks.map(b => b.row));
      const f = {
        ...gridGeometry(s),
        maxCol,
        col: FROG_SIDE_COLS + Math.floor(Math.random() * (maxCol - FROG_SIDE_COLS * 2)),
        row: maxRow + 1,
        dir: Math.random() > 0.5 ? 1 : -1,
        hop: 0,
        hopStart: now,
        broken: 0,
      };
      f.to = nextFrogHop(f);
      s.frog = f;
    };

    const updateFrog = (s, now) => {
      const f = s.frog;
      if (!f || now - f.hopStart < FROG_HOP_MS) return;
      f.col = f.to.col;
      f.row = f.to.row;
      if (f.row < 0) {
        s.frog = null;
        return;
      }
      const x = f.originX + f.col * f.stepX + f.w / 2;
      const y = f.originY + f.row * f.stepY + f.h / 2;
      const near = s.blocks
        .filter(b => b.alive && Math.hypot(b.x + b.w / 2 - x, b.y + b.h / 2 - y) < f.stepX * 1.6)
        .sort((a, b) => Math.hypot(a.x + a.w / 2 - x, a.y + a.h / 2 - y) - Math.hypot(b.x + b.w / 2 - x, b.y + b.h / 2 - y))[0];
      if (near && f.broken < FROG_MAX) {
        s.explosions.push({ x: near.x + near.w / 2, y: near.y + near.h / 2, startTime: now, duration: 220 });
        destroyBlock(near, now);
        f.broken += 1;
      }
      f.hop += 1;
      f.hopStart = now;
      f.to = nextFrogHop(f);
    };

    // Tetromino: three pieces fall one at a time and clear what they land on.
    const gridGeometry = (s) => {
      const first = s.blocks[0];
      const otherCol = s.blocks.find(b => b.col !== first.col);
      const otherRow = s.blocks.find(b => b.row !== first.row);
      const stepX = (otherCol.x - first.x) / (otherCol.col - first.col);
      const stepY = (otherRow.y - first.y) / (otherRow.row - first.row);
      return { stepX, stepY, originX: first.x - first.col * stepX, originY: first.y - first.row * stepY, w: first.w, h: first.h };
    };

    const nextTetromino = (s, now) => {
      const t = s.tetromino;
      const live = s.blocks.filter(b => b.alive);
      if (!t.left || !live.length) {
        s.tetromino = null;
        return;
      }
      t.left -= 1;
      const shape = TETROMINOES[Math.floor(Math.random() * TETROMINOES.length)];
      const target = live[Math.floor(Math.random() * live.length)];
      t.piece = { ...shape, col: target.col, row: -4 };
      t.next = now + TETROMINO_TICK_MS;
    };

    const startTetromino = (s, now) => {
      s.tetromino = { ...gridGeometry(s), left: TETROMINO_PIECES, piece: null, next: 0 };
      nextTetromino(s, now);
    };

    const updateTetromino = (s, now) => {
      const t = s.tetromino;
      if (!t || now < t.next) return;
      t.next = now + TETROMINO_TICK_MS;
      const p = t.piece;
      p.row += 1;
      const hitsAt = (rowOffset) => s.blocks.filter(b => b.alive
        && p.cells.some(([cx, cy]) => b.col === p.col + cx && b.row === p.row + rowOffset + cy));
      if (hitsAt(0).length) {
        // Lands: clears the commits under it, and the row right below
        for (const b of [...hitsAt(0), ...hitsAt(1)]) {
          s.explosions.push({ x: b.x + b.w / 2, y: b.y + b.h / 2, startTime: now, duration: 220 });
          destroyBlock(b, now);
        }
        nextTetromino(s, now);
      } else if (p.row > 8) {
        nextTetromino(s, now);
      }
    };

    // Pong: a second paddle above the commits, moving exactly like yours.
    const updatePong = (s) => {
      if (!s.mods.pong) {
        s.pong = null;
        return;
      }
      if (!s.pong) s.pong = { y: gridTop(s) - 18 };
      const top = s.pong.y;
      for (const b of s.balls) {
        if (b.frozen || b.held || b.stuck) continue;
        const touching = b.y - b.r <= top + PONG_HEIGHT && b.y + b.r >= top;
        if (!touching) continue;
        for (const px of getPaddlePositions(s)) {
          if (b.x < px || b.x > px + s.paddle.w) continue;
          const hitPos = (b.x - (px + s.paddle.w / 2)) / (s.paddle.w / 2);
          const speed = Math.hypot(b.vx, b.vy);
          const fromBelow = b.vy < 0;
          b.vx = hitPos * speed * 0.8;
          b.vy = (fromBelow ? 1 : -1) * Math.sqrt(Math.max(speed * speed - b.vx * b.vx, 1));
          b.y = fromBelow ? top + PONG_HEIGHT + b.r : top - b.r;
          normalizeBallAngle(b);
          break;
        }
      }
    };


    // Plumber: runs under the graph and stops under a commit, head-butting it a few times. Every
    // bump pops a coin, and the last one breaks the commit.
    const startPlumber = (s) => {
      const dir = Math.random() > 0.5 ? 1 : -1;
      const ground = gridBottom(s) + PLUMBER_HEIGHT + PLUMBER_CLEARANCE;
      const x = dir > 0 ? -20 : width + 20;
      s.plumber = { x, ground, dir, stop: Math.floor(x / PLUMBER_STOP), broken: 0, jump: null };
    };

    const plumberJump = (p, block, bumps, now) => ({
      block,
      bumps,
      start: now,
      fromX: p.x,
      height: p.ground - (block.y + block.h + PLUMBER_HEIGHT),
      bumped: false,
    });

    const updatePlumber = (s, dt, now) => {
      const p = s.plumber;
      if (!p) return;
      if (p.jump) {
        const j = p.jump;
        const b = j.block;
        const t = (now - j.start) / PLUMBER_JUMP_MS;
        p.x = j.fromX + (b.x + b.w / 2 - j.fromX) * Math.min(1, t * 2);
        // The head reaches the commit at the top of the jump
        if (!j.bumped && t >= 0.5) {
          j.bumped = true;
          if (b.alive) {
            s.coins.push({ x: b.x + b.w / 2, y: b.y, vy: -6.5, vx: (Math.random() - 0.5) * 1.2, start: now });
            if (j.bumps === 1) {
              s.explosions.push({ x: b.x + b.w / 2, y: b.y + b.h / 2, startTime: now, duration: 220 });
              destroyBlock(b, now);
              p.broken += 1;
            }
          }
        }
        if (t >= 1) p.jump = j.bumps > 1 && b.alive ? plumberJump(p, b, j.bumps - 1, now) : null;
        return;
      }
      p.x += p.dir * RUNNER_SPEED * dt;
      const stop = Math.floor(p.x / PLUMBER_STOP);
      if ((stop - p.stop) * p.dir > 0) {
        p.stop = stop;
        const b = p.broken < PLUMBER_MAX ? commitNear(s, p.x, true) : null;
        if (b) p.jump = plumberJump(p, b, PLUMBER_BUMPS, now);
      }
      if (p.x < -30 || p.x > width + 30) s.plumber = null;
    };

    const dropCapsule = (x, y) => {
      const weights = POWERUP_TYPES.map(t => POWERUP_WEIGHTS[t] ?? (NEGATIVE_POWERUPS.has(t) ? 0.5 : 1));
      let roll = Math.random() * weights.reduce((a, b) => a + b, 0);
      let type = POWERUP_TYPES[0];
      for (let i = 0; i < POWERUP_TYPES.length; i++) {
        roll -= weights[i];
        if (roll <= 0) { type = POWERUP_TYPES[i]; break; }
      }
      stateRef.current.powerUps.push({ x: x - 16, y, w: 32, h: 18, vy: 2, type });
    };

    const isEndgame = (s) => s.blocks.filter(b => b.alive).length <= ENDGAME_BLOCKS;
    const dropChance = (s) => (isEndgame(s) ? ENDGAME_DROP_CHANCE : POWERUP_DROP_CHANCE);

    const spawnPowerUp = (x, y) => {
      const s = stateRef.current;
      const now = performance.now();
      if (now - s.lastPowerUpSpawn < (isEndgame(s) ? ENDGAME_COOLDOWN : POWERUP_COOLDOWN)) return;
      dropCapsule(x, y);
      s.lastPowerUpSpawn = now;
    };

    // Paddle width combines expand (bigger), downgrade (smaller) and Octocat (three mini paddles).
    // It resizes around the cursor, or around its own center with the keyboard, so it never jumps.
    const updatePaddleWidth = () => {
      const s = stateRef.current;
      const followsCursor = s.pointerX !== null && !isDetached(s) && !s.gliding;
      const center = followsCursor ? s.pointerX : s.paddle.x + s.paddleSpan / 2;
      s.paddle.w = s.paddle.baseW
        * (s.effects.expand ? 2.5 : 1)
        * (s.mods.downgrade ? 0.55 : 1)
        * (s.effects.triplepaddle ? 0.5 : 1);
      // Three expanded paddles must still fit on the board.
      if (s.effects.triplepaddle) s.paddle.w = Math.min(s.paddle.w, (width - OCTOCAT_GAP * 2) / 3);
      s.paddleSpan = paddleSpan(s);
      s.paddle.x = Math.max(0, Math.min(width - s.paddleSpan, center - s.paddleSpan / 2));
      if (followsCursor) s.targetX = s.paddle.x;
    };

    // When the paddle was detached from the cursor, it glides back instead of teleporting.
    const glideToCursor = (s) => {
      if (s.pointerX === null || isDetached(s)) return;
      s.targetX = s.pointerX - paddleSpan(s) / 2;
      s.gliding = true;
    };

    const clearMods = () => {
      const s = stateRef.current;
      for (const k of Object.keys(s.mods)) s.mods[k] = 0;
      updatePaddleWidth();
      glideToCursor(s);
    };

    const clearActiveEffects = () => {
      const s = stateRef.current;
      if (s.effects.expand) {
        s.effects.expand = 0;
        updatePaddleWidth();
      }
      if (s.effects.laser) {
        s.effects.laser = 0;
      }
      if (s.effects.shield) {
        s.effects.shield = 0;
      }
      if (s.effects.triplepaddle) {
        s.effects.triplepaddle = 0;
        updatePaddleWidth();
      }
    };

    const applyPowerUp = (type, now) => {
      const s = stateRef.current;
      s.toast = { text: POWERUP_NAMES[type], color: POWERUP_COLORS[type], until: now + TOAST_MS };
      if (type === 'credits') {
        // The joke costs a life, even the last one.
        s.toast.until = now + 4000;
        s.lives -= 1;
        setLives(s.lives);
        if (s.lives <= 0) setOutOfCredits(true);
        return;
      }
      if (type === 'plumber') {
        if (!s.plumber) startPlumber(s);
        return;
      }
      if (type === 'chomper') {
        if (!s.chomper) startChomper(s);
        return;
      }
      if (type === 'ufo') {
        if (!s.ufo) startUfo(s);
        return;
      }
      if (type === 'dino') {
        if (!s.dino) startDino(s);
        return;
      }
      if (type === 'tetromino') {
        if (!s.tetromino) startTetromino(s, now);
        return;
      }
      if (type === 'hunter') {
        if (!s.hunter) startHunter(s);
        return;
      }
      if (type === 'flapper') {
        if (!s.flapper) startFlapper(s);
        return;
      }
      if (type === 'slash') {
        if (!s.slash) startSlash(s, now);
        return;
      }
      if (type === 'frog') {
        if (!s.frog) startFrog(s, now);
        return;
      }
      if (type === 'bomber') {
        if (!s.bomber) startBomber(s);
        return;
      }
      if (type === 'storm') {
        // Commit storm: three capsules at once, good or bad, ignoring the drop cooldown
        for (let k = 0; k < 3; k++) dropCapsule(40 + Math.random() * (width - 80), height * 0.45 - k * 30);
        return;
      }
      if (type === 'theme') {
        s.ballSkin = BALL_SKINS[Math.floor(Math.random() * BALL_SKINS.length)];
        s.toast.text = `theme: it's a ${s.ballSkin.label} now`;
      }
      if (type === 'skin') {
        s.paddleSkin = PADDLE_SKINS[Math.floor(Math.random() * PADDLE_SKINS.length)];
        s.toast.text = 'client meeting at the golf course: click to hit the ball!';
        s.toast.until = now + 4000;
      }
      if (type === 'pin') {
        s.mods.pin = 1; // one charge, used on the next block hit
        return;
      }
      if (type === 'xray') {
        for (const b of s.blocks) {
          if (b.alive && b.isTnt && !b.tntRevealed) { b.tntRevealed = true; b.hp = 1; }
        }
        return;
      }
      if (type === 'kill') {
        // kill -9: ten random live commits disappear at once
        const alive = s.blocks.filter(b => b.alive);
        for (let k = 0; k < 10 && alive.length; k++) {
          const b = alive.splice(Math.floor(Math.random() * alive.length), 1)[0];
          b.alive = false;
          b.el.dataset.level = '0';
          s.explosions.push({ x: b.x + b.w / 2, y: b.y + b.h / 2, startTime: now, duration: 300 });
        }
        return;
      }
      if (type === 'issue') {
        // Issue reopened: five destroyed commits come back
        const dead = s.blocks.filter(b => !b.alive);
        for (let k = 0; k < 5 && dead.length; k++) {
          const b = dead.splice(Math.floor(Math.random() * dead.length), 1)[0];
          b.alive = true;
          b.hit = false;
          b.hp = b.maxHp;
          b.tntRevealed = false;
          b.el.dataset.level = String(b.level);
        }
        return;
      }
      if (type === 'upvote') {
        if (s.lives < MAX_LIVES) {
          s.lives += 1;
          setLives(s.lives);
        }
        return;
      }
      if (MOD_DURATIONS[type]) {
        s.mods[type] = now + MOD_DURATIONS[type];
        if (type === 'downgrade') updatePaddleWidth();
        if (type === 'invert') s.targetX = s.paddle.x;
        if (type === 'snake' && !s.snake) startSnake(s, now);
        if (type === 'merge') s.toast.until = now + 4000;
        if (type === 'paintball') s.blocks.forEach((b) => { b.paint = null; });
        if (type === 'matrix') {
          // One stream per column of the graph, running cell by cell over the commits
          const grid = gridGeometry(s);
          const cols = Math.max(...s.blocks.map(b => b.col)) + 1;
          s.matrixRain = {
            ...grid,
            streams: Array.from({ length: cols }, () => ({
              head: Math.random() * 12 - 6, // already falling when it starts
              speed: 0.09 + Math.random() * 0.14,
            })),
          };
        }
        return;
      }
      if (type === 'multiball') {
        const maxBalls = 3;
        if (s.balls.length < maxBalls) {
          const b = s.balls[0];
          if (s.balls.length === 1) {
            s.balls.push({ ...b, vx: -b.vx, vy: b.vy });
            s.balls.push({ ...b, vx: b.vy, vy: -b.vx });
          } else if (s.balls.length === 2) {
            s.balls.push({ ...b, vx: -b.vx, vy: b.vy });
          }
        }
        return;
      }
      // Power-ups stack: catching one never cancels another, and catching an active one renews its time.
      if (type === 'expand') {
        s.effects.expand = now + POWERUP_DURATIONS.expand;
        updatePaddleWidth();
      } else if (type === 'laser') {
        s.effects.laser = now + POWERUP_DURATIONS.laser;
      } else if (type === 'shield') {
        s.effects.shield = now + POWERUP_DURATIONS.shield;
      } else if (type === 'triplepaddle') {
        s.effects.triplepaddle = now + POWERUP_DURATIONS.triplepaddle;
        updatePaddleWidth();
      }
    };

    const expireEffects = (now) => {
      const s = stateRef.current;
      if (s.effects.expand && now > s.effects.expand) {
        s.effects.expand = 0;
        updatePaddleWidth();
      }
      for (const k of Object.keys(MOD_DURATIONS)) {
        if (s.mods[k] && now > s.mods[k]) {
          s.mods[k] = 0;
          if (k === 'downgrade') updatePaddleWidth();
          if (BALL_PATH_MODS.has(k)) s.balls.forEach(restoreBall);
          if (DETACHED_MODS.has(k)) glideToCursor(s);
        }
      }
      if (s.effects.laser && now > s.effects.laser) {
        s.effects.laser = 0;
      }
      if (s.effects.shield && now > s.effects.shield) {
        s.effects.shield = 0;
      }
      if (s.effects.triplepaddle && now > s.effects.triplepaddle) {
        s.effects.triplepaddle = 0;
        updatePaddleWidth();
      }
    };

    const getPaddlePositions = (s) => {
      if (!s.effects.triplepaddle) return [s.paddle.x];
      const step = s.paddle.w + OCTOCAT_GAP;
      return [s.paddle.x, s.paddle.x + step, s.paddle.x + step * 2];
    };

    const triggerTntExplosion = (block, now) => {
      const s = stateRef.current;
      s.explosions.push({
        x: block.x + block.w / 2,
        y: block.y + block.h / 2,
        startTime: now,
        duration: 400,
      });
      // Destroy 5x5 grid around the TNT (radius 2)
      const recursiveTnts = [];
      for (const other of s.blocks) {
        if (!other.alive) continue;
        if (Math.abs(other.col - block.col) <= 2 && Math.abs(other.row - block.row) <= 2) {
          if (other === block) continue;
          other.alive = false;
          other.el.dataset.level = '0';
          // chain TNTs
          if (other.isTnt) recursiveTnts.push(other);
        }
      }
      // Trigger chain explosions
      for (const t of recursiveTnts) {
        triggerTntExplosion(t, now);
      }
    };

    // Sticky bomb: destroys the pinned block and its 3x3 neighbourhood.
    const triggerPinExplosion = (block, now) => {
      const s = stateRef.current;
      s.explosions.push({ x: block.x + block.w / 2, y: block.y + block.h / 2, startTime: now, duration: 400 });
      for (const other of s.blocks) {
        if (!other.alive) continue;
        if (Math.abs(other.col - block.col) <= 1 && Math.abs(other.row - block.row) <= 1) {
          other.alive = false;
          other.el.dataset.level = '0';
          if (other.isTnt) triggerTntExplosion(other, now);
        }
      }
    };

    const expiringAlpha = (endTime, now) => {
      if (!endTime) return 1;
      const remaining = endTime - now;
      if (remaining >= 2000) return 1;
      return Math.floor(remaining / 200) % 2 === 0 ? 0.3 : 1;
    };

    const expiringAlphaStrong = (endTime, now) => {
      if (!endTime) return 1;
      const remaining = endTime - now;
      if (remaining >= 2000) return 1;
      // More aggressive blink: full visibility ↔ near invisible, faster
      return Math.floor(remaining / 130) % 2 === 0 ? 0.15 : 1;
    };

    const normalizeBallAngle = (ball) => {
      const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
      const minVy = speed * 0.5;
      if (Math.abs(ball.vy) < minVy) {
        const sign = ball.vy >= 0 ? 1 : -1;
        ball.vy = minVy * sign;
        const newVxAbs = Math.sqrt(Math.max(0, speed * speed - minVy * minVy));
        ball.vx = newVxAbs * (ball.vx >= 0 ? 1 : -1);
      }
    };

    // After gravity or curves end, the ball gets back a playable angle and speed.
    const restoreBall = (ball) => {
      if (ball.frozen || ball.held || ball.stuck) return;
      const speed = Math.hypot(ball.vx, ball.vy);
      if (speed < 4.5) {
        const k = speed > 0 ? 4.5 / speed : 0;
        ball.vx = k ? ball.vx * k : 3;
        ball.vy = k ? ball.vy * k : -3.4;
      }
      normalizeBallAngle(ball);
    };

    // Paintball: each hit splats one color over the commits around it
    const paintSplat = (block) => {
      const s = stateRef.current;
      if (!s.mods.paintball) return;
      const color = PAINT_COLORS[Math.floor(Math.random() * PAINT_COLORS.length)];
      for (const b of s.blocks) {
        const d = Math.abs(b.col - block.col) + Math.abs(b.row - block.row);
        if (d === 0 || (d <= 3 && Math.random() < 1 - d * 0.22)) b.paint = color;
      }
    };

    const quack = (ball, now) => {
      const s = stateRef.current;
      if ((!s.mods.duck && !s.mods.lgtm) || now - s.lastQuack < 300) return;
      s.lastQuack = now;
      const text = s.mods.duck ? 'quack!' : 'LGTM';
      s.quacks.push({ x: ball.x, y: ball.y - 14, start: now, text, color: s.mods.duck ? '#FFE066' : '#3FB950' });
    };

    const render = (now) => {
      const s = stateRef.current;
      const dt = Math.min(2, (now - lastFrameTime) / TARGET_FRAME_MS);
      lastFrameTime = now;
      const elapsedMs = now - startTime;
      const elapsedSec = Math.floor(elapsedMs / 1000);
      if (elapsedSec !== lastElapsed) {
        lastElapsed = elapsedSec;
        setElapsed(elapsedSec);
      }

      expireEffects(now);

      const totalWidth = paddleSpan(s);
      const maxX = width - totalWidth;
      const leftKey = s.keys['ArrowLeft'] || s.keys['a'] || s.keys['A'];
      const rightKey = s.keys['ArrowRight'] || s.keys['d'] || s.keys['D'];
      const goLeft = s.mods.invert ? rightKey : leftKey;
      const goRight = s.mods.invert ? leftKey : rightKey;
      const paddleSpeed = 6;
      if (s.mods.copilot) {
        // GitHub Copilot: the paddle tracks the lowest falling ball on its own.
        const falling = s.balls.filter(b => !b.frozen && b.vy > 0);
        const ref = falling.sort((a, b) => b.y - a.y)[0] || s.balls[0];
        if (ref) {
          const target = Math.max(0, Math.min(maxX, ref.x - totalWidth / 2));
          const step = 9 * dt;
          s.paddle.x += Math.max(-step, Math.min(step, target - s.paddle.x));
        }
      } else {
        if (goLeft || goRight) {
          // Keyboard takes over from the mouse
          s.pointerX = null;
          s.targetX = null;
          s.gliding = false;
        }
        if (goLeft) {
          s.paddle.x = Math.max(0, s.paddle.x - paddleSpeed * dt);
        }
        if (goRight) {
          s.paddle.x = Math.min(maxX, s.paddle.x + paddleSpeed * dt);
        }
        if (s.targetX !== null) {
          const target = Math.max(0, Math.min(maxX, s.targetX));
          if (s.gliding) {
            const step = 18 * dt;
            s.paddle.x += Math.max(-step, Math.min(step, target - s.paddle.x));
            if (s.gliding && Math.abs(target - s.paddle.x) < 1) s.gliding = false;
          } else {
            s.paddle.x = target;
          }
        }
      }
      // Swing: only with a swingable paddle, and with a short cooldown so it can't be spammed
      if (s.swingRequested) {
        s.swingRequested = false;
        if (s.mods.skin && now - s.swingAt > SWING_COOLDOWN_MS) s.swingAt = now;
      }
      const swinging = s.mods.skin && now - s.swingAt < SWING_MS;
      // Ball speed multiplier: hotfix rush speeds it up, git revert slows it down.
      const speedFactor = (s.mods.hotfix ? 1.4 : 1) * (s.mods.revert ? 0.5 : 1);

      // Release frozen ball when countdown ends
      if (s.respawnEnd && now >= s.respawnEnd) {
        for (const ball of s.balls) {
          if (ball.frozen) {
            ball.vx = 3 * (Math.random() > 0.5 ? 1 : -1);
            ball.vy = -4.5;
            ball.frozen = false;
          }
        }
        s.respawnEnd = 0;
      }

      // Update balls
      for (let i = s.balls.length - 1; i >= 0; i--) {
        const ball = s.balls[i];
        const skinR = s.mods.theme ? s.ballSkin.r : s.mods.duck ? 17 : 6;
        ball.r = s.mods.bump && !s.mods.zip ? 13 : s.mods.zip && !s.mods.bump ? 3.5 : skinR; // version bump: bigger, zipped: tiny
        if (ball.frozen) {
          ball.x = s.paddle.x + paddleSpan(s) / 2;
          ball.y = s.paddle.y - ball.r;
          continue;
        }
        // Amend (magnet): the ball rides the paddle until a click or 1.5 s pass.
        if (ball.held) {
          // The paddle may have shrunk or lost its Octocat copies since it caught the ball
          const heldBase = s.effects.triplepaddle ? ball.held.base : 0;
          ball.held.offset = Math.min(ball.held.offset, s.paddle.w);
          ball.x = s.paddle.x + heldBase + ball.held.offset;
          ball.y = s.paddle.y - ball.r;
          if (now > ball.held.until || (s.mouseDown && now > ball.held.since + 150)) {
            const hitPos = (ball.held.offset - s.paddle.w / 2) / (s.paddle.w / 2);
            ball.vx = hitPos * ball.held.speed * 0.8;
            ball.vy = -ball.held.speed;
            normalizeBallAngle(ball);
            ball.held = null;
          }
          continue;
        }
        // Pin (sticky bomb): the ball waits on the block, then the block blows up.
        if (ball.stuck) {
          if (now > ball.stuck.until) {
            if (ball.stuck.block.alive) triggerPinExplosion(ball.stuck.block, now);
            ball.vx = ball.stuck.vx;
            ball.vy = Math.abs(ball.stuck.vy);
            ball.stuck = null;
          }
          continue;
        }
        if (s.mods.gravity) {
          ball.vy = Math.min(10, ball.vy + 0.09 * dt);
        }
        if (s.mods.origin) {
          ball.vy = Math.max(-10, ball.vy - 0.09 * dt); // gravity pulls up
        }
        if (s.mods.yank) {
          // Gravity pulls sideways and swaps direction every 2 seconds
          const dir = Math.floor(now / 2000) % 2 === 0 ? 1 : -1;
          ball.vx = Math.max(-10, Math.min(10, ball.vx + dir * 0.12 * dt));
        }
        if (s.mods.rebase) {
          // Steady spin: the ball travels in wide arcs
          const angle = 0.03 * dt;
          const { vx, vy } = ball;
          ball.vx = vx * Math.cos(angle) - vy * Math.sin(angle);
          ball.vy = vx * Math.sin(angle) + vy * Math.cos(angle);
        }
        // A swing that connects sends the ball off where the paddle hit it, much faster
        if (swinging && ball.swungAt !== s.swingAt
          && ball.y >= s.paddle.y - SWING_REACH && ball.y <= s.paddle.y + s.paddle.h + 10) {
          for (const px of getPaddlePositions(s)) {
            if (ball.x < px - 22 || ball.x > px + s.paddle.w + 22) continue;
            const hitPos = Math.max(-1, Math.min(1, (ball.x - (px + s.paddle.w / 2)) / (s.paddle.w / 2)));
            const speed = Math.max(5, Math.hypot(ball.vx, ball.vy));
            ball.vx = hitPos * speed * 0.85;
            ball.vy = -Math.sqrt(speed * speed - ball.vx * ball.vx);
            ball.swungAt = s.swingAt;
            ball.boostUntil = now + SWING_BOOST_MS;
            s.combo = 0;
            s.quacks.push({ x: ball.x, y: ball.y - 14, start: now, text: s.paddleSkin.sound, color: '#FFFFFF' });
            break;
          }
        }
        const boost = ball.boostUntil > now ? SWING_BOOST : 1;
        ball.x += ball.vx * dt * speedFactor * boost;
        ball.y += ball.vy * dt * speedFactor * boost;
        if (s.mods.jitter) ball.x += Math.cos(now / 110) * 2.4 * dt; // zigzag

        if (ball.x - ball.r < 0) {
          ball.x = ball.r;
          ball.vx = -ball.vx;
        }
        if (ball.x + ball.r > width) {
          ball.x = width - ball.r;
          ball.vx = -ball.vx;
        }
        if (ball.y - ball.r < 0) {
          ball.y = ball.r;
          ball.vy = -ball.vy;
        }

        // Paddle collision (handles wrap-around + double paddle: paddle can be in multiple positions)
        let paddleHit = null;
        if (
          ball.y + ball.r >= s.paddle.y &&
          ball.y - ball.r <= s.paddle.y + s.paddle.h &&
          ball.vy > 0
        ) {
          for (const px of getPaddlePositions(s)) {
            if (ball.x >= px && ball.x <= px + s.paddle.w) {
              paddleHit = px;
              break;
            }
          }
        }
        if (paddleHit !== null) {
          ball.y = s.paddle.y - ball.r;
          ball.vy = -Math.abs(ball.vy);
          const hitPos = (ball.x - (paddleHit + s.paddle.w / 2)) / (s.paddle.w / 2);
          const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
          ball.vx = hitPos * speed * 0.8;
          // Progressive speed increase: every 10 paddle hits, balls get 5% faster
          s.paddleHits += 1;
          if (s.paddleHits % 10 === 0) {
            const maxSpeed = 12;
            for (const b of s.balls) {
              const sp = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
              if (sp < maxSpeed) {
                b.vx *= 1.05;
                b.vy *= 1.05;
              }
            }
          }
          normalizeBallAngle(ball);
          s.combo = 0;
          quack(ball, now);
          if (s.mods.amend) {
            ball.held = { base: paddleHit - s.paddle.x, offset: ball.x - paddleHit, until: now + 1500, since: now, speed: Math.hypot(ball.vx, ball.vy) };
          }
        }

        // Shield bounce (full-width safety net below the paddle)
        if (s.effects.shield && ball.vy > 0) {
          const shieldY = s.paddle.y + s.paddle.h + 30;
          if (ball.y + ball.r >= shieldY && ball.y - ball.r <= shieldY + 6) {
            ball.y = shieldY - ball.r;
            ball.vy = -Math.abs(ball.vy);
            normalizeBallAngle(ball);
          }
        }

        // Fell off bottom. With pipeline on, it comes back in from the top.
        if (ball.y - ball.r > height) {
          if (s.mods.pipeline) {
            ball.y = ball.r;
            ball.vy = Math.abs(ball.vy);
            continue;
          }
          s.balls.splice(i, 1);
          continue;
        }

        // Block collision
        for (const block of s.blocks) {
          if (!block.alive) continue;
          if (
            ball.x + ball.r > block.x &&
            ball.x - ball.r < block.x + block.w &&
            ball.y + ball.r > block.y &&
            ball.y - ball.r < block.y + block.h
          ) {
            if (s.mods.pin) {
              s.mods.pin = 0;
              ball.stuck = { block, until: now + PIN_FUSE_MS, vx: ball.vx, vy: ball.vy };
              block.hit = true;
              break;
            }
            block.hit = true;
            if (block.isTnt && !block.tntRevealed) {
              block.tntRevealed = true;
              block.hp = 1;
            } else if (block.isTnt) {
              block.hp = 0;
            } else {
              block.hp = s.mods.lgtm ? 0 : block.hp - 1;
            }
            const destroyed = block.hp <= 0;

            if (Math.random() < dropChance(s)) {
              spawnPowerUp(block.x + block.w / 2, block.y + block.h);
            }

            s.combo += 1;
            quack(ball, now);
            paintSplat(block);

            if (destroyed) {
              block.alive = false;
              block.el.dataset.level = '0';
              if (block.isTnt) triggerTntExplosion(block, now);
            }

            const overlapLeft = ball.x + ball.r - block.x;
            const overlapRight = block.x + block.w - (ball.x - ball.r);
            const overlapTop = ball.y + ball.r - block.y;
            const overlapBottom = block.y + block.h - (ball.y - ball.r);
            const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

            if (minOverlap === overlapLeft || minOverlap === overlapRight) {
              ball.vx = -ball.vx;
            } else {
              ball.vy = -ball.vy;
            }
            normalizeBallAngle(ball);
            break;
          }
        }
      }

      // All balls fell
      if (s.balls.length === 0) {
        s.lives -= 1;
        s.combo = 0;
        setLives(s.lives);
        if (s.lives <= 0) {
          currentStatus = 'lost';
          setStatus('lost');
          cancelAnimationFrame(animationId);
          return;
        }
        // Clear active power-up effects on life loss
        clearActiveEffects();
        clearMods();
        s.powerUps.length = 0;
        s.projectiles.length = 0;
        s.explosions.length = 0;
        // Respawn frozen ball with countdown
        s.paddle.x = width / 2 - paddleSpan(s) / 2;
        glideToCursor(s);
        s.balls.push({
          x: width / 2,
          y: s.paddle.y - 6,
          r: 6,
          vx: 0,
          vy: 0,
          frozen: true,
        });
        s.respawnEnd = now + 3000;
        lastFrameTime = now;
      }

      updatePlumber(s, dt, now);
      updateChomper(s, dt, now);
      updateSnake(s, now);
      updateUfo(s, dt, now);
      updateBomber(s, dt, now);
      updateDino(s, dt, now);
      updateTetromino(s, now);
      updatePong(s);
      updateHunter(s, dt, now);
      updateFlapper(s, dt, now);
      updateSlash(s, dt, now);
      updateFrog(s, now);
      // Disco: a random commit pops on every beat
      if (s.mods.disco && now >= s.discoNext) {
        s.discoNext = now + DISCO_BEAT_MS;
        const live = s.blocks.filter(b => b.alive);
        if (live.length) {
          const b = live[Math.floor(Math.random() * live.length)];
          s.explosions.push({ x: b.x + b.w / 2, y: b.y + b.h / 2, startTime: now, duration: 250 });
          destroyBlock(b, now);
        }
      }
      for (let i = s.coins.length - 1; i >= 0; i--) {
        const c = s.coins[i];
        c.vy += 0.3 * dt;
        c.y += c.vy * dt;
        c.x += c.vx * dt;
        if (now - c.start > 800) s.coins.splice(i, 1);
      }

      // Update power-ups
      for (let i = s.powerUps.length - 1; i >= 0; i--) {
        const p = s.powerUps[i];
        p.y += p.vy * dt * (s.mods.revert ? 0.5 : 1);

        // Collision with any paddle (handles wrap + double)
        let caught = false;
        if (p.y + p.h >= s.paddle.y && p.y <= s.paddle.y + s.paddle.h) {
          for (const px of getPaddlePositions(s)) {
            if (p.x + p.w >= px && p.x <= px + s.paddle.w) {
              caught = true;
              break;
            }
          }
        }
        if (caught) {
          applyPowerUp(p.type, now);
          s.powerUps.splice(i, 1);
          continue;
        }

        // Off bottom
        if (p.y > height) {
          s.powerUps.splice(i, 1);
        }
      }

      // Out of credits can take the last life while the ball is still in play
      if (s.lives <= 0 && currentStatus === 'playing') {
        currentStatus = 'lost';
        setStatus('lost');
        cancelAnimationFrame(animationId);
        return;
      }

      // Shooting (laser active + mouse down + cooldown)
      if (s.effects.laser && now - s.lastShot > LASER_COOLDOWN) { // fires on its own, no click needed
        for (const px of getPaddlePositions(s)) {
          s.projectiles.push({ x: px + 4, y: s.paddle.y, w: 3, h: 12 });
          s.projectiles.push({ x: px + s.paddle.w - 7, y: s.paddle.y, w: 3, h: 12 });
        }
        s.lastShot = now;
      }

      // Update projectiles
      for (let i = s.projectiles.length - 1; i >= 0; i--) {
        const proj = s.projectiles[i];
        proj.y -= LASER_SPEED * dt;

        if (proj.y + proj.h < 0) {
          s.projectiles.splice(i, 1);
          continue;
        }

        let hit = false;
        for (const block of s.blocks) {
          if (!block.alive) continue;
          if (
            proj.x + proj.w > block.x &&
            proj.x < block.x + block.w &&
            proj.y + proj.h > block.y &&
            proj.y < block.y + block.h
          ) {
            block.hit = true;
            if (block.isTnt && !block.tntRevealed) {
              block.tntRevealed = true;
              block.hp = 1;
            } else {
              block.hp = block.isTnt ? 0 : block.hp - 1;
            }
            if (Math.random() < dropChance(s)) {
              spawnPowerUp(block.x + block.w / 2, block.y + block.h);
            }
            if (block.hp <= 0) {
              block.alive = false;
              block.el.dataset.level = '0';
              if (block.isTnt) triggerTntExplosion(block, now);
            }
            hit = true;
            break;
          }
        }
        if (hit) s.projectiles.splice(i, 1);
      }

      setScore(commitsDestroyed(s.blocks));
      const remaining = s.blocks.filter(b => b.alive).length;
      // Merge to main: reaching the portal wins the game, whatever is left on the board
      const merged = s.mods.merge && s.paddle.x + paddleSpan(s) >= width - MERGE_PORTAL_WIDTH;
      if (merged && currentStatus === 'playing') setMergedToMain(true);
      if ((remaining === 0 || merged) && currentStatus === 'playing') {
        currentStatus = 'won';
        setStatus('won');
        // The record is for clearing the board: the merge portal is a lucky shortcut
        if (!merged) setBest(saveBestTime(Math.max(1, Math.floor((now - startTime) / 1000))));
        cancelAnimationFrame(animationId);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      ctx.save();
      // Coffee overflow: the whole board shakes
      if (s.mods.coffee) ctx.translate((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6);

      // Matrix: a black backdrop hides the empty days of the graph underneath
      if (s.mods.matrix && s.matrixRain) {
        const rain = s.matrixRain;
        ctx.fillStyle = '#000000';
        ctx.fillRect(rain.originX - 2, rain.originY - 2, rain.streams.length * rain.stepX + 2, 7 * rain.stepY + 2);
      }

      // Blocks
      for (const block of s.blocks) {
        if (!block.alive) continue;
        // TNT revealed: green color + bomb icon
        if (block.tntRevealed && block.hp > 0) {
          ctx.fillStyle = '#39D353';
          ctx.shadowColor = '#39D353';
          ctx.shadowBlur = 8;
          ctx.fillRect(block.x, block.y, block.w, block.h);
          ctx.shadowBlur = 0;
          const cx = block.x + block.w / 2;
          const cy = block.y + block.h / 2;
          const r = Math.min(block.w, block.h) * 0.28;
          // Bomb body
          ctx.fillStyle = '#000000';
          ctx.beginPath();
          ctx.arc(cx, cy + 1, r, 0, Math.PI * 2);
          ctx.fill();
          // Fuse
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(cx + r * 0.5, cy + 1 - r * 0.85);
          ctx.lineTo(cx + r * 1.1, cy + 1 - r * 1.5);
          ctx.stroke();
          // Spark
          ctx.fillStyle = '#FF7B00';
          ctx.beginPath();
          ctx.arc(cx + r * 1.1, cy + 1 - r * 1.5, 1.2, 0, Math.PI * 2);
          ctx.fill();
          continue;
        }
        ctx.fillStyle = blockFill(block, s.mods, now) ?? levelColors[block.level];
        ctx.fillRect(block.x, block.y, block.w, block.h);
        if (block.hit && block.hp > 0) {
          const cx = block.x + block.w / 2;
          const cy = block.y + block.h / 2;
          const radius = Math.min(block.w, block.h) / 2 - 1;
          ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#ffffff';
          ctx.shadowBlur = 4;
          ctx.font = 'bold 9px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(block.hp, cx, cy + 1);
          ctx.shadowBlur = 0;
        }
      }

      // Matrix: streams of 0s and 1s run down the graph itself, cell by cell, and nowhere else
      if (s.mods.matrix && s.matrixRain) {
        const rain = s.matrixRain;
        ctx.save();
        ctx.font = `bold ${Math.round(rain.h * 0.72)}px ui-monospace, Menlo, monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        rain.streams.forEach((stream, col) => {
          stream.head += stream.speed * dt;
          if (stream.head - MATRIX_TAIL > 7) stream.head = -Math.random() * 8;
          const headRow = Math.floor(stream.head);
          for (let k = 0; k < MATRIX_TAIL; k++) {
            const row = headRow - k;
            if (row < 0 || row > 6) continue;
            const x = rain.originX + col * rain.stepX;
            const y = rain.originY + row * rain.stepY;
            const isHead = k === 0;
            const fade = 1 - k / MATRIX_TAIL;
            ctx.shadowColor = '#00FF66';
            ctx.shadowBlur = isHead ? 12 : 4;
            ctx.fillStyle = isHead ? '#E6FFEE' : `rgba(0, 255, 102, ${0.2 + fade * 0.8})`;
            // The glyph depends on position and time, so it flickers without storing anything
            const glyph = MATRIX_GLYPHS[(Math.floor(now / 110) * 3 + col * 7 + row * 13) % MATRIX_GLYPHS.length];
            ctx.fillText(glyph, x + rain.w / 2, y + rain.h / 2 + 1);
          }
        });
        ctx.restore();
      }

      // Explosions
      for (let i = s.explosions.length - 1; i >= 0; i--) {
        const ex = s.explosions[i];
        const elapsed = now - ex.startTime;
        if (elapsed >= ex.duration) {
          s.explosions.splice(i, 1);
          continue;
        }
        const progress = elapsed / ex.duration;
        const radius = 20 + progress * 80;
        const alpha = 1 - progress;
        ctx.fillStyle = `rgba(255, 123, 0, ${alpha * 0.6})`;
        ctx.shadowColor = '#FF4040';
        ctx.shadowBlur = 30;
        ctx.beginPath();
        ctx.arc(ex.x, ex.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Paddle (single or double, no wrap)
      const laserActive = s.effects.laser > 0;
      const paddleColor = laserActive ? '#58A6FF' : '#39D353';
      const paddleAlpha = Math.min(
        expiringAlphaStrong(s.effects.expand, now),
        expiringAlphaStrong(s.effects.laser, now),
        expiringAlphaStrong(s.effects.triplepaddle, now)
      );
      ctx.globalAlpha = paddleAlpha;
      ctx.fillStyle = paddleColor;
      ctx.shadowColor = paddleColor;
      ctx.shadowBlur = 8;
      const drawPaddleAt = (px) => {
        if (s.mods.skin) {
          const swing = (now - s.swingAt) / SWING_MS;
          drawPaddleSkin(ctx, s.paddleSkin.id, px, s.paddle.y, s.paddle.w, s.paddle.h, swing < 1 ? swing : 0);
        }
        else ctx.fillRect(px, s.paddle.y, s.paddle.w, s.paddle.h);
        if (laserActive) {
          ctx.fillRect(px + 2, s.paddle.y - 4, 4, 4);
          ctx.fillRect(px + s.paddle.w - 6, s.paddle.y - 4, 4, 4);
        }
      };
      for (const px of getPaddlePositions(s)) {
        drawPaddleAt(px);
      }
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

      // Shield (safety net below the paddle, pulsing + visible)
      if (s.effects.shield) {
        const shieldY = s.paddle.y + s.paddle.h + 30;
        const blink = expiringAlpha(s.effects.shield, now);
        const pulse = 0.85 + Math.sin(now / 200) * 0.15;
        // Outer glow band
        ctx.fillStyle = `rgba(63, 184, 255, ${0.35 * blink})`;
        ctx.shadowColor = '#3FB8FF';
        ctx.shadowBlur = 20;
        ctx.fillRect(0, shieldY - 2, width, 10);
        // Solid bright core line
        ctx.fillStyle = `rgba(150, 220, 255, ${pulse * blink})`;
        ctx.shadowBlur = 14;
        ctx.fillRect(0, shieldY, width, 6);
        ctx.shadowBlur = 0;
      }

      // Merge portal: a swirl of GitHub's merged purple, on the right at paddle height
      if (s.mods.merge) {
        const cx = width - 22;
        const cy = s.paddle.y + s.paddle.h / 2;
        const blink = expiringAlpha(s.mods.merge, now);
        ctx.save();
        ctx.globalAlpha = blink;
        ctx.shadowColor = '#A371F7';
        ctx.shadowBlur = 22;
        ctx.lineCap = 'round';
        [['#8957E5', 30, 5], ['#A371F7', 22, 4], ['#D2A8FF', 14, 3]].forEach(([color, r, line], i) => {
          const spin = (now / (240 + i * 90)) * (i % 2 === 0 ? 1 : -1);
          ctx.strokeStyle = color;
          ctx.lineWidth = line;
          ctx.beginPath();
          ctx.ellipse(cx, cy, r * 0.62, r, 0, spin, spin + Math.PI * 1.55);
          ctx.stroke();
        });
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 11px ui-monospace, Menlo, monospace';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText('main', width - 2, cy - 42);
        ctx.restore();
      }

      // Countdown of every active power-up, floating above the paddle: seconds in a thin ring
      // that empties in the power-up's color.
      const timers = [];
      for (const k of Object.keys(POWERUP_DURATIONS)) {
        if (s.effects[k]) timers.push({ k, end: s.effects[k], total: POWERUP_DURATIONS[k] });
      }
      for (const k of Object.keys(MOD_DURATIONS)) {
        if (s.mods[k]) timers.push({ k, end: s.mods[k], total: MOD_DURATIONS[k] });
      }
      if (timers.length) {
        const r = 11;
        const gap = 6;
        const rowWidth = timers.length * (r * 2) + (timers.length - 1) * gap;
        const center = s.paddle.x + paddleSpan(s) / 2;
        const startX = Math.max(r + 2, Math.min(width - rowWidth + r - 2, center - rowWidth / 2 + r));
        const cy = s.paddle.y - r - 10;
        ctx.save();
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        timers.forEach((t, i) => {
          const cx = startX + i * (r * 2 + gap);
          const left = Math.max(0, t.end - now);
          const color = POWERUP_COLORS[t.k];
          ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.fill();
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.stroke();
          ctx.strokeStyle = color;
          ctx.beginPath();
          ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.min(1, left / t.total));
          ctx.stroke();
          ctx.fillStyle = '#ffffff';
          ctx.fillText(String(Math.ceil(left / 1000)), cx, cy + 0.5);
        });
        ctx.restore();
      }

      // Pipeline: the bottom edge burns like a portal while it is active, and the ball comes back
      // in from the top.
      if (s.mods.pipeline) {
        const blink = expiringAlpha(s.mods.pipeline, now);
        const barH = 8;
        const grad = ctx.createLinearGradient(0, height - barH * 2, 0, height);
        grad.addColorStop(0, 'rgba(255, 166, 87, 0)');
        grad.addColorStop(0.5, `rgba(255, 123, 0, ${0.55 * blink})`);
        grad.addColorStop(1, `rgba(248, 81, 73, ${0.95 * blink})`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, height - barH * 2, width, barH * 2);
        ctx.fillStyle = `rgba(255, 220, 120, ${(0.6 + Math.sin(now / 90) * 0.3) * blink})`;
        for (let fx = (now / 12) % 24; fx < width; fx += 24) {
          const fh = 3 + Math.abs(Math.sin(fx * 0.3 + now / 120)) * 5;
          ctx.fillRect(fx, height - fh, 10, fh);
        }
      }

      // Projectiles
      ctx.fillStyle = '#58A6FF';
      ctx.shadowColor = '#58A6FF';
      ctx.shadowBlur = 10;
      for (const proj of s.projectiles) {
        ctx.fillRect(proj.x, proj.y, proj.w, proj.h);
      }
      ctx.shadowBlur = 0;

      // Balls
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#39D353';
      ctx.shadowBlur = 10;
      const baseAlpha = ctx.globalAlpha;
      const skin = s.mods.duck ? 'duck' : s.mods.theme ? s.ballSkin.id : null;
      for (const ball of s.balls) {
        ctx.globalAlpha = baseAlpha;
        if (skin) {
          drawBallSkin(ctx, skin, ball.x, ball.y, ball.r, (ball.x + ball.y) / 18);
        } else {
          ctx.beginPath();
          ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
          ctx.fill();
        }
        if (ball.stuck) {
          const left = ball.stuck.until - now;
          const blink = Math.floor(now / (left < 700 ? 70 : 160)) % 2 === 0;
          ctx.save();
          ctx.globalAlpha = 1;
          ctx.strokeStyle = blink ? '#E3B341' : '#FF4040';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(ball.x, ball.y, ball.r + 4, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
      }
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

      // Combo number floating near ball (only if combo > 1)
      if (s.combo > 1 && s.balls.length > 0) {
        const refBall = s.balls[0];
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#39D353';
        ctx.shadowBlur = 6;
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(`x${s.combo}`, refBall.x, refBall.y - 12);
        ctx.shadowBlur = 0;
      }

      // Power-ups
      for (const p of s.powerUps) {
        const color = POWERUP_COLORS[p.type];
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 8;
        ctx.fillRect(p.x, p.y, p.w, p.h);
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#000';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(POWERUP_LETTERS[p.type], p.x + p.w / 2, p.y + p.h / 2 + 1);
      }


      // Snake
      if (s.snake) {
        const sn = s.snake;
        ctx.save();
        ctx.shadowBlur = 0;
        sn.cells.forEach((cell, i) => {
          const isHead = i === sn.cells.length - 1;
          const x = sn.originX + cell.col * sn.stepX;
          const y = sn.originY + cell.row * sn.stepY;
          ctx.fillStyle = isHead ? '#FF5CA8' : '#D6337F';
          ctx.fillRect(x, y, sn.w, sn.h);
        });
        ctx.restore();
      }

      // Chomper
      if (s.chomper) {
        const c = s.chomper;
        const mouth = 0.08 + Math.abs(Math.sin(now / 70)) * 0.28;
        ctx.save();
        ctx.shadowBlur = 0;
        ctx.translate(c.x, c.y);
        if (c.dir < 0) ctx.scale(-1, 1);
        ctx.fillStyle = '#FFE14D';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, c.r, mouth * Math.PI, (2 - mouth) * Math.PI);
        ctx.closePath();
        ctx.fill();
        circle(ctx, c.r * 0.15, -c.r * 0.5, Math.max(1.5, c.r * 0.12), '#111111');
        ctx.restore();
      }

      // UFO
      if (s.ufo) {
        const u = s.ufo;
        ctx.save();
        ctx.shadowBlur = 0;
        drawUfoBeam(ctx, u.x, u.y + 9, gridBottom(s) + 10);
        for (const r of u.rising) {
          const t = (now - r.start) / UFO_BEAM_MS;
          const size = 1 - t * 0.75;
          ctx.save();
          ctx.globalAlpha = 1 - t * 0.3;
          ctx.translate(r.x + (u.x - r.x) * t, r.y + (u.y - r.y) * t);
          ctx.fillStyle = r.color;
          ctx.fillRect((-r.w * size) / 2, (-r.h * size) / 2, r.w * size, r.h * size);
          ctx.restore();
        }
        ctx.translate(u.x, u.y);
        ctx.scale(UFO_SCALE, UFO_SCALE);
        drawUfo(ctx, 0, 0, now);
        ctx.restore();
      }

      // Dino, tetromino and the top paddle
      if (s.dino) {
        const d = s.dino;
        const phase = ((d.x % DINO_HOP) + DINO_HOP) % DINO_HOP / DINO_HOP;
        const air = Math.sin(phase * Math.PI) * 26;
        ctx.save();
        ctx.shadowBlur = 0;
        drawDino(ctx, d.x, d.ground - air, d.dir, air > 2, now);
        ctx.restore();
      }
      if (s.tetromino) {
        const t = s.tetromino;
        ctx.save();
        ctx.shadowBlur = 0;
        for (const [cx, cy] of t.piece.cells) {
          drawTetrominoCell(ctx, t.originX + (t.piece.col + cx) * t.stepX, t.originY + (t.piece.row + cy) * t.stepY, t.w, t.h, t.piece.color);
        }
        ctx.restore();
      }
      if (s.pong) {
        ctx.save();
        ctx.shadowColor = '#FFFFFF';
        ctx.shadowBlur = 10;
        ctx.globalAlpha = expiringAlpha(s.mods.pong, now);
        ctx.fillStyle = '#FFFFFF';
        for (const px of getPaddlePositions(s)) ctx.fillRect(px, s.pong.y, s.paddle.w, PONG_HEIGHT);
        ctx.restore();
      }

      // Hunter, flapper, slash and frog
      if (s.hunter) {
        ctx.save();
        ctx.shadowBlur = 0;
        for (const d of s.hunter.ducks) drawHuntedDuck(ctx, d.x, d.y, d.dir, d.falling, now);
        const target = s.hunter.ducks.find(d => !d.falling);
        if (target) drawCrosshair(ctx, target.x, target.y);
        ctx.fillStyle = '#FFD33D';
        ctx.font = 'bold 15px Inter, sans-serif';
        ctx.textAlign = 'center';
        for (const shot of s.hunter.shots) ctx.fillText('bang!', shot.x, shot.y - 18);
        ctx.restore();
      }
      if (s.flapper) {
        const f = s.flapper;
        ctx.save();
        ctx.shadowBlur = 0;
        drawFlapper(ctx, f.x, f.y, f.dir, now - f.lastFlap < 130);
        ctx.restore();
      }
      if (s.slash) {
        ctx.save();
        ctx.shadowBlur = 0;
        for (const f of s.slash.fruits) {
          const age = now - f.start;
          if (age < 0) continue;
          const rise = 1 - (1 - Math.min(1, age / SLASH_RISE_MS)) ** 2;
          if (!f.cut) drawFruit(ctx, f.fromX + (f.x - f.fromX) * rise, height + 20 + (f.y - height - 20) * rise, f.fruit);
          for (const half of f.halves) drawFruitHalf(ctx, half);
          const sweep = (age - SLASH_RISE_MS) / SLASH_SWEEP_MS;
          if (sweep > 0 && sweep < 3) {
            const head = Math.min(1, sweep);
            const tail = Math.min(1, Math.max(0, (sweep - 0.4) / 2));
            ctx.save();
            ctx.globalAlpha = 1 - sweep / 3;
            ctx.strokeStyle = '#FFFFFF';
            ctx.shadowColor = '#FFFFFF';
            ctx.shadowBlur = 12;
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(f.from.x + (f.to.x - f.from.x) * tail, f.from.y + (f.to.y - f.from.y) * tail);
            ctx.lineTo(f.from.x + (f.to.x - f.from.x) * head, f.from.y + (f.to.y - f.from.y) * head);
            ctx.stroke();
            ctx.restore();
          }
        }
        ctx.restore();
      }
      if (s.frog) {
        const f = s.frog;
        const hop = Math.min(1, (now - f.hopStart) / FROG_HOP_MS);
        const col = f.col + (f.to.col - f.col) * hop;
        const row = f.row + (f.to.row - f.row) * hop;
        ctx.save();
        ctx.shadowBlur = 0;
        drawFrog(ctx, f.originX + col * f.stepX + f.w / 2, f.originY + row * f.stepY + f.h / 2 - Math.sin(hop * Math.PI) * 8, hop > 0.1 && hop < 0.9);
        ctx.restore();
      }

      // Bombs, flames and the kid who throws them
      for (const bomb of s.bombs) {
        const age = now - bomb.start;
        const fly = Math.min(1, age / BOMB_FLIGHT_MS);
        const x = bomb.fromX + (bomb.x - bomb.fromX) * fly;
        const y = bomb.fromY + (bomb.y - bomb.fromY) * fly - Math.sin(fly * Math.PI) * 30;
        ctx.save();
        ctx.shadowBlur = 0;
        drawBomb(ctx, x, y, 10, now, age > BOMB_FLIGHT_MS + BOMB_FUSE_MS * 0.6);
        ctx.restore();
      }
      for (const f of s.flames) {
        const age = (now - f.start) / FLAME_MS;
        const grow = Math.min(1, age * 3.5);
        const alpha = 1 - Math.max(0, age - 0.5) * 2;
        drawFlame(ctx, f.x - f.reachX * grow, f.y, f.x + f.reachX * grow, f.y, 20, alpha);
        drawFlame(ctx, f.x, f.y - f.reachY * grow, f.x, f.y + f.reachY * grow, 20, alpha);
      }
      if (s.bomber) {
        ctx.save();
        ctx.shadowBlur = 0;
        ctx.translate(s.bomber.x, s.bomber.y);
        ctx.scale(BOMBER_SCALE, BOMBER_SCALE);
        drawBomberKid(ctx, 0, 0, s.bomber.dir, true, now);
        ctx.restore();
      }

      // Plumber and coins
      for (const c of s.coins) {
        ctx.save();
        ctx.globalAlpha = Math.min(1, (800 - (now - c.start)) / 250);
        drawCoin(ctx, c.x, c.y, 7, (now - c.start) / 60);
        ctx.restore();
      }
      if (s.plumber) {
        const p = s.plumber;
        ctx.save();
        ctx.shadowBlur = 0;
        const air = p.jump ? Math.sin(Math.min(1, (now - p.jump.start) / PLUMBER_JUMP_MS) * Math.PI) * p.jump.height : 0;
        drawPlumber(ctx, p.x, p.ground - air, p.dir, !p.jump && Math.floor(now / 90) % 2 === 0, !!p.jump);
        ctx.restore();
      }

      // Floating words: the duck's quacks and LGTM approvals
      for (let i = s.quacks.length - 1; i >= 0; i--) {
        const q = s.quacks[i];
        const age = (now - q.start) / 700;
        if (age >= 1) {
          s.quacks.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = 1 - age;
        ctx.fillStyle = q.color;
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(q.text, q.x, q.y - age * 18);
        ctx.restore();
      }

      // Dark mode: only the ball and the paddle stay lit
      if (s.mods.dark) {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.96)';
        ctx.beginPath();
        ctx.rect(-10, -10, width + 20, height + 20);
        for (const ball of s.balls) {
          ctx.moveTo(ball.x + 80, ball.y);
          ctx.arc(ball.x, ball.y, 80, 0, Math.PI * 2);
        }
        ctx.rect(0, s.paddle.y - 44, width, 70);
        ctx.fill('evenodd');
        ctx.restore();
      }

      // Name of the power-up just caught
      if (s.toast && now < s.toast.until) {
        const left = s.toast.until - now;
        ctx.save();
        ctx.globalAlpha = Math.min(1, left / 300);
        ctx.fillStyle = s.toast.color;
        ctx.shadowColor = s.toast.color;
        ctx.shadowBlur = 10;
        ctx.font = 'bold 15px ui-monospace, SFMono-Regular, Menlo, monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(s.toast.text, width / 2, height - 90);
        ctx.restore();
      }

      // Respawn countdown (3, 2, 1)
      if (s.respawnEnd && now < s.respawnEnd) {
        const msLeft = s.respawnEnd - now;
        const number = Math.ceil(msLeft / 1000);
        const phaseProgress = 1 - (msLeft % 1000) / 1000;
        const scale = 0.7 + Math.min(phaseProgress * 2, 1) * 0.5;
        const alpha = phaseProgress > 0.85 ? (1 - phaseProgress) / 0.15 : 1;
        ctx.save();
        ctx.globalAlpha = alpha;
        // In the empty strip above the paddle, not over the blocks, so it stays readable
        ctx.translate(width / 2, height - 150);
        ctx.scale(scale, scale);
        ctx.fillStyle = '#39D353';
        ctx.shadowColor = '#39D353';
        ctx.shadowBlur = 25;
        ctx.font = 'bold 96px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(number), 0, 0);
        ctx.restore();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }

      ctx.restore(); // undoes the coffee shake
      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('keydown', keyDown);
      window.removeEventListener('keyup', keyUp);
      canvas.removeEventListener('mousemove', mouseMove);
      canvas.removeEventListener('mousedown', mouseDown);
      window.removeEventListener('mouseup', mouseUp);
      days.forEach(el => {
        if (el.dataset.originalLevel !== undefined) {
          el.dataset.level = el.dataset.originalLevel;
          delete el.dataset.originalLevel;
        }
      });
    };
  }, [active, runId]);

  const handlePlayAgain = () => {
    const grid = gridRef.current;
    if (grid) {
      grid.querySelectorAll('.github-day').forEach(el => {
        if (el.dataset.originalLevel !== undefined) {
          el.dataset.level = el.dataset.originalLevel;
        }
      });
    }
    setRunId(id => id + 1);
  };

  if (!active) return null;

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="arkanoid-overlay">
      <div className="arkanoid-hud">
        <span className="arkanoid-lives">
          <span className="arkanoid-lives-label">Lives:</span>
          {Array.from({ length: Math.max(INITIAL_LIVES, lives) }).map((_, i) => (
            <span
              key={i}
              className={`arkanoid-life${i < lives ? '' : ' arkanoid-life-lost'}`}
              aria-hidden="true"
            />
          ))}
        </span>
        <span>Commits destroyed: {score.toLocaleString('en-US')} / {totalCommits.toLocaleString('en-US')}</span>
        <span>Time: {formatTime(elapsed)}</span>
        <button onClick={onExit} className="arkanoid-exit">Exit (Esc)</button>
      </div>
      <canvas ref={canvasRef} className={`arkanoid-canvas${status === 'playing' ? ' arkanoid-canvas-playing' : ''}`} />
      {/* Rendered into <body> so the win screen sits above the sticky header, centered on the viewport */}
      {status === 'won' && createPortal(
        <div className="arkanoid-result arkanoid-result--reward">
          <div>{mergedToMain ? 'Merged to main' : 'Code cleared'} in {formatTime(elapsed)}</div>
          {best && <div className="arkanoid-best">{best.isNew ? 'New record!' : `Best: ${formatTime(best.seconds)}`}</div>}
          <div className="arkanoid-reward-message">
            <div className="arkanoid-reward-headline">All tests passed.<br />You're a super player!</div>
            <div className="arkanoid-reward-subhead">Release notes for real life:</div>
          </div>
          {/* Winners' reward: only mounted on a win, so YouTube never loads otherwise. No-cookie domain;
              loop needs playlist set to the same id. */}
          <iframe
            className="arkanoid-reward-video"
            src={`https://www.youtube-nocookie.com/embed/${WIN_VIDEO_ID}?autoplay=1&loop=1&playlist=${WIN_VIDEO_ID}&rel=0&playsinline=1`}
            title="Robin Williams: Make Your Life Spectacular"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
          <div className="arkanoid-result-buttons">
            <button onClick={handlePlayAgain} className="arkanoid-exit">Play again</button>
            <button onClick={onExit} className="arkanoid-exit">Back to portfolio</button>
          </div>
        </div>,
        document.body,
      )}
      {status === 'lost' && (
        <div className="arkanoid-result">
          <div>{outOfCredits ? "-1 life. You've run out of credits. Consider switching to a cheaper model." : `Game over - ${score.toLocaleString('en-US')} commit${score === 1 ? '' : 's'} destroyed`}</div>
          <div className="arkanoid-result-buttons">
            <button onClick={handlePlayAgain} className="arkanoid-exit">Play again</button>
            <button onClick={onExit} className="arkanoid-exit">Back to portfolio</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArkanoidGame;
