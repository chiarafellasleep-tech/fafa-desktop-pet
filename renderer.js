const pet = document.querySelector('#pet');
const cat = document.querySelector('#cat');
const bubble = document.querySelector('#bubble');
const sleepButton = document.querySelector('#sleep');
const hideButton = document.querySelector('#hide');
const motions = ['motion-pet', 'motion-feed', 'motion-play', 'motion-look', 'motion-stretch', 'motion-hide'];
let bubbleTimer;
let stepTimers = [];
let mode = 'idle';
let busy = false;
let drag;
let firstIdle = true;
let petStreak = 0;
let lastPetAt = 0;
let reactionUntil = 0;
let petCooldownUntil = 0;

function pose(name) { pet.dataset.pose = name; }
function motion(name) {
  pet.classList.remove(...motions);
  if (name) {
    void pet.offsetWidth;
    pet.classList.add(`motion-${name}`);
  }
}
function schedule(delay, callback) { stepTimers.push(setTimeout(callback, delay)); }
function cancelSequence() {
  stepTimers.forEach(clearTimeout);
  stepTimers = [];
  busy = false;
  motion(null);
}
function say(message, duration = 2200) {
  bubble.textContent = message;
  bubble.classList.add('show');
  clearTimeout(bubbleTimer);
  bubbleTimer = setTimeout(() => bubble.classList.remove('show'), duration);
}
function syncButtons() {
  sleepButton.innerHTML = mode === 'sleep' ? '☀️ <span>Wake</span>' : '💤 <span>Nap</span>';
  hideButton.innerHTML = mode === 'hide' ? '🐾 <span>Come out</span>' : '📦 <span>Hide</span>';
  sleepButton.setAttribute('aria-pressed', mode === 'sleep');
  hideButton.setAttribute('aria-pressed', mode === 'hide');
  pet.classList.toggle('sleeping', mode === 'sleep');
}
function startAction() {
  cancelSequence();
  mode = 'idle';
  syncButtons();
  busy = true;
}
function finishAction() {
  pose('sit');
  motion(null);
  busy = false;
  stepTimers = [];
}
function petFafa() {
  const now = Date.now();
  if (now < reactionUntil) return;
  if (now - lastPetAt > 7000) petStreak = 0;
  lastPetAt = now;
  if (now >= petCooldownUntil) petStreak += 1;
  if (petStreak >= 4) {
    petStreak = 0;
    reactionUntil = now + 3200;
    petCooldownUntil = now + 9000;
    startAction();
    pose('look');
    motion('look');
    say("I've had enough pets, human! 😼", 3200);
    schedule(3200, finishAction);
    return;
  }
  startAction();
  pose('sit');
  motion('pet');
  say(['Purr... thank you! 🐾', 'More pets, please!', 'Fafa likes you 💛'][Math.floor(Math.random() * 3)]);
  schedule(1200, finishAction);
}

cat.addEventListener('pointerdown', event => {
  if (event.button !== 0) return;
  drag = { startX: event.screenX, startY: event.screenY, x: window.screenX, y: window.screenY, moved: false };
  cat.setPointerCapture(event.pointerId);
});
cat.addEventListener('pointermove', event => {
  if (!drag) return;
  const dx = event.screenX - drag.startX;
  const dy = event.screenY - drag.startY;
  if (Math.abs(dx) + Math.abs(dy) > 5) drag.moved = true;
  if (drag.moved) {
    pet.classList.add('dragging');
    window.desktopPet?.move(drag.x + dx, drag.y + dy);
  }
});
cat.addEventListener('pointerup', () => {
  if (drag && !drag.moved) petFafa();
  drag = null;
  pet.classList.remove('dragging');
});
cat.addEventListener('pointercancel', () => { drag = null; pet.classList.remove('dragging'); });
cat.addEventListener('keydown', event => {
  if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); petFafa(); }
});

document.querySelector('#feed').addEventListener('click', () => {
  startAction(); pose('lick'); motion('feed'); say('Mmm, tasty! 😋');
  schedule(600, () => pose('sit'));
  schedule(950, () => pose('lick'));
  schedule(1550, finishAction);
});
document.querySelector('#play').addEventListener('click', () => {
  startAction(); pose('paw'); motion('play'); say('Catch the yarn! 🧶', 3000);
  schedule(550, () => pose('reach'));
  schedule(1100, () => pose('paw'));
  schedule(1650, () => pose('reach'));
  schedule(2300, finishAction);
});
sleepButton.addEventListener('click', () => {
  if (mode === 'sleep') {
    startAction();
    pose('lounge');
    say("Why wake me up? I don't need to go to work! 😾", 3500);
    schedule(2300, finishAction);
  } else {
    startAction(); pose('recline'); say('Zzz... sweet dreams 💤');
    schedule(500, () => pose('lounge'));
    schedule(1250, () => { pose('sleep'); mode = 'sleep'; busy = false; stepTimers = []; syncButtons(); });
  }
});
document.querySelector('#stretch').addEventListener('click', () => {
  startAction(); pose('stretch'); motion('stretch'); say('A biiig stretch! 🐈'); schedule(1900, finishAction);
});
hideButton.addEventListener('click', () => {
  if (mode === 'hide') {
    startAction(); pose('sit'); motion('pet'); say('There you are! 💛'); schedule(900, finishAction);
  } else {
    startAction(); pose('hide'); motion('hide'); mode = 'hide'; busy = false; syncButtons(); say('Peekaboo! 📦');
    schedule(1200, () => motion(null));
  }
});
document.querySelector('#close').addEventListener('click', () => window.desktopPet?.quit());

setInterval(() => {
  if (mode !== 'idle' || busy || drag || document.hidden) return;
  busy = true;
  const choice = firstIdle ? 0 : Math.random();
  firstIdle = false;
  if (choice < .4) { pose('look'); motion('look'); schedule(1800, finishAction); }
  else if (choice < .7) { pose('paw'); motion('look'); schedule(1500, finishAction); }
  else { pose('stretch'); motion('stretch'); schedule(1900, finishAction); }
}, 12000);
syncButtons();
setTimeout(() => say('Hi, I’m Fafa! 🐾', 3000), 450);
