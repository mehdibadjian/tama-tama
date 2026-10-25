// Tiny WebAudio blips so correct answers feel rewarding without audio files.
// The existing pages already unlock audio on first tap (splash screen TTS).

let ctx: AudioContext | null = null;

function audioCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  ctx ??= new Ctor();
  return ctx;
}

function tone(freq: number, start: number, duration: number, gain = 0.16) {
  const ac = audioCtx();
  if (!ac) return;
  const osc = ac.createOscillator();
  const vol = ac.createGain();
  osc.type = 'sine';
  osc.frequency.value = freq;
  const t0 = ac.currentTime + start;
  vol.gain.setValueAtTime(0.0001, t0);
  vol.gain.exponentialRampToValueAtTime(gain, t0 + 0.02);
  vol.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(vol).connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

/** Rising major arpeggio — right answer. */
export function playChime() {
  tone(523.25, 0, 0.18);      // C5
  tone(659.25, 0.09, 0.18);   // E5
  tone(783.99, 0.18, 0.3);    // G5
}

/** Soft low wobble — wrong answer, gentle not scary. */
export function playRetry() {
  tone(311.13, 0, 0.16, 0.1);    // Eb4
  tone(233.08, 0.1, 0.22, 0.1);  // Bb3
}

/** Happy fanfare for finishing a track. */
export function playFanfare() {
  [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.11, 0.24));
}
