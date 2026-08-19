/**
 * Safe Web Audio API synthesizer for emergency sirens, dispatch alarms, and UI chimes.
 */

let audioCtx = null;
let sirenOsc1 = null;
let sirenGain = null;
let isSirenActive = false;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

// Play a quick high-priority alert ping / chime
export function playAlertPing() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
    osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.15); // A6
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch (err) {
    console.debug('Audio not enabled yet:', err);
  }
}

export const playAlertChime = playAlertPing;

// Play urgent emergency tone
export function playEmergencyTone() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(900, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(1200, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.45);
  } catch (err) {
    console.debug('Audio error:', err);
  }
}

// Play a confirmation chime
export function playSuccessChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
      gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.08);
      osc.stop(ctx.currentTime + i * 0.08 + 0.3);
    });
  } catch (err) {
    console.debug('Audio error:', err);
  }
}

export const playSuccessTone = playSuccessChime;

// Play a continuous or toggled ambulance siren
export function startEmergencySiren() {
  try {
    if (isSirenActive) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    sirenOsc1 = ctx.createOscillator();
    sirenGain = ctx.createGain();
    sirenGain.gain.setValueAtTime(0.15, ctx.currentTime);

    sirenOsc1.type = 'sawtooth';
    // Frequency modulation for wailing siren
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(0.8, ctx.currentTime); // 0.8 Hz oscillation
    lfoGain.gain.setValueAtTime(350, ctx.currentTime); // Depth
    sirenOsc1.frequency.setValueAtTime(650, ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(sirenOsc1.frequency);

    sirenOsc1.connect(sirenGain);
    sirenGain.connect(ctx.destination);

    lfo.start();
    sirenOsc1.start();
    isSirenActive = true;
  } catch (err) {
    console.debug('Siren start error:', err);
  }
}

export function stopEmergencySiren() {
  try {
    if (!isSirenActive) return;
    if (sirenGain && audioCtx) {
      sirenGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.2);
    }
    setTimeout(() => {
      if (sirenOsc1) {
        try { sirenOsc1.stop(); sirenOsc1.disconnect(); } catch (e) {}
      }
      isSirenActive = false;
    }, 250);
  } catch (err) {
    isSirenActive = false;
  }
}
