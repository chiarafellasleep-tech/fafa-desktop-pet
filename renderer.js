const pet = document.querySelector('#pet');
const cat = document.querySelector('#cat');
const bubble = document.querySelector('#bubble');
const sleepButton = document.querySelector('#sleep');
let bubbleTimer;
let sleeping = false;
let drag;
let motionTimer;
let poseTimer;

const motions = ['motion-pet', 'motion-feed', 'motion-play', 'motion-look', 'motion-stretch'];
function moveFafa(motion, duration) {
  clearTimeout(motionTimer);
  pet.classList.remove(...motions);
  void pet.offsetWidth;
  pet.classList.add(`motion-${motion}`);
  motionTimer = setTimeout(() => pet.classList.remove(`motion-${motion}`), duration);
}

function showPose(pose, duration) {
  clearTimeout(poseTimer);
  pet.classList.remove('pose-paw', 'pose-recline');
  if (pose === 'sit') return;
  pet.classList.add(`pose-${pose}`);
  if (duration) poseTimer = setTimeout(() => pet.classList.remove(`pose-${pose}`), duration);
}

function say(message, duration = 2200) {
  bubble.textContent = message;
  bubble.classList.add('show');
  clearTimeout(bubbleTimer);
  bubbleTimer = setTimeout(() => bubble.classList.remove('show'), duration);
}

function wake() {
  if (!sleeping) return;
  sleeping = false;
  pet.classList.remove('sleeping');
  showPose('sit');
  sleepButton.innerHTML = '💤 <span>Nap</span>';
}

function petFafa() {
  wake();
  moveFafa('pet', 1400);
  say(['Purr... thank you! 🐾', 'More pets, please!', 'Fafa likes you 💛'][Math.floor(Math.random() * 3)]);
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

document.querySelector('#feed').addEventListener('click', () => { wake(); moveFafa('feed', 1400); say('Mmm, tasty! 😋'); });
document.querySelector('#play').addEventListener('click', () => {
  wake();
  showPose('paw', 1350);
  moveFafa('play', 1260);
  say('Catch the yarn! 🧶');
});
sleepButton.addEventListener('click', () => {
  sleeping = !sleeping;
  clearTimeout(motionTimer);
  pet.classList.remove(...motions);
  pet.classList.toggle('sleeping', sleeping);
  showPose(sleeping ? 'recline' : 'sit');
  sleepButton.innerHTML = sleeping ? '☀️ <span>Wake</span>' : '💤 <span>Nap</span>';
  say(sleeping ? 'Zzz... sweet dreams 💤' : 'Good morning! ☀️');
});
document.querySelector('#close').addEventListener('click', () => window.desktopPet?.quit());

setInterval(() => {
  if (sleeping || drag || document.hidden || motions.some(motion => pet.classList.contains(motion))) return;
  if (Math.random() < .35) {
    showPose('paw', 1800);
    moveFafa('look', 1700);
  } else {
    moveFafa('stretch', 1700);
  }
}, 9000);
setTimeout(() => say('Hi, I’m Fafa! 🐾', 3000), 450);
