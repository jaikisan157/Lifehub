// LifeHub Audio Engine — synthesized sounds using Web Audio API
// No external audio files needed

let audioCtx = null;

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

// Soft wooden "tock" for completing a task
export function playTock() {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.08);
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
  osc.connect(gain).connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.15);
}

// Gentle bubble pop for adding items
export function playPop() {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(600, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.06);
  osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.12);
  gain.gain.setValueAtTime(0.25, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
  osc.connect(gain).connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.18);
}

// Copper coin clink for logging expense
export function playCoin() {
  const ctx = getCtx();
  const t = ctx.currentTime;
  [4200, 5600, 3800].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.6, t + 0.15);
    gain.gain.setValueAtTime(0.12, t + i * 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t + i * 0.02);
    osc.stop(t + 0.25);
  });
}

// Soft wind chime for reminders
export function playChime() {
  const ctx = getCtx();
  const t = ctx.currentTime;
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, t + i * 0.2);
    gain.gain.linearRampToValueAtTime(0.18, t + i * 0.2 + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.2 + 0.6);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t + i * 0.2);
    osc.stop(t + i * 0.2 + 0.65);
  });
}

// Peaceful ascending alarm — loops gently
let alarmInterval = null;

function playAlarmOnce() {
  const ctx = getCtx();
  const t = ctx.currentTime;
  const melody = [392, 440, 523.25, 587.33, 659.25]; // G4 A4 C5 D5 E5
  melody.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, t + i * 0.18);
    gain.gain.linearRampToValueAtTime(0.22, t + i * 0.18 + 0.04);
    gain.gain.linearRampToValueAtTime(0.18, t + i * 0.18 + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.18 + 0.45);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t + i * 0.18);
    osc.stop(t + i * 0.18 + 0.5);
  });
}

export function startAlarm() {
  playAlarmOnce();
  alarmInterval = setInterval(playAlarmOnce, 2500);
  return alarmInterval;
}

export function stopAlarm() {
  if (alarmInterval) {
    clearInterval(alarmInterval);
    alarmInterval = null;
  }
}

// Delete sound — soft descending
export function playDelete() {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(500, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.12);
  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
  osc.connect(gain).connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.15);
}

// Initialize audio context on first user gesture
export function initAudio() {
  getCtx();
}
