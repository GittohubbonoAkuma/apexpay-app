/**
 * Web Audio API synthesizer for fintech payment success sound effect.
 * Generates a clean, harmonious chime (D-Major chord chime + bell harmonics)
 * without needing external MP3/WAV files.
 */

export function playSuccessChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;

    // Harmonic frequencies for payment success chime
    const notes = [
      { freq: 587.33, start: 0.0, dur: 0.35, gain: 0.25 }, // D5
      { freq: 739.99, start: 0.08, dur: 0.40, gain: 0.3 }, // F#5
      { freq: 880.00, start: 0.16, dur: 0.65, gain: 0.35 }, // A5
      { freq: 1174.66, start: 0.22, dur: 0.85, gain: 0.2 } // D6
    ];

    notes.forEach(({ freq, start, dur, gain }) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + start);

      // Envelope: Instant attack, gentle exponential decay
      gainNode.gain.setValueAtTime(0.001, now + start);
      gainNode.gain.linearRampToValueAtTime(gain, now + start + 0.03);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + start + dur);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now + start);
      osc.stop(now + start + dur + 0.05);
    });
  } catch (err) {
    console.warn('Audio chime playback error:', err);
  }
}
