// Web Audio Sound Engine for ANGADI Outdoor Trail Storefront
// Synthesizes instant, zero-latency tactile outdoor sounds on any touch or click.

class AngadiSound {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  getContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // 1. Crisp tactile gear snap / carabiner click (Buttons, links, controls)
  playButtonSnap() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Transient impulse (sharp snap)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2600, now);
    filter.Q.setValueAtTime(4, now);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.028);

    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);

    // Subtle metallic click overtone
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(3200, now);
    osc2.frequency.exponentialRampToValueAtTime(800, now + 0.018);

    gain2.gain.setValueAtTime(0.12, now);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.022);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc2.start(now);
    osc2.stop(now + 0.025);
  }

  // 2. "Butta lo Vey" affirmative gear packing sound (Add to bag / wishlist)
  playBagAdd() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Initial click/snap
    this.playButtonSnap();

    // Warm affirmative harmonic chime (Trail reward tone)
    const tones = [587.33, 880.00]; // D5 and A5
    tones.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      const delay = now + 0.02 + idx * 0.045;
      osc.frequency.setValueAtTime(freq, delay);

      gain.gain.setValueAtTime(0.18, delay);
      gain.gain.exponentialRampToValueAtTime(0.001, delay + 0.16);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(delay);
      osc.stop(delay + 0.18);
    });
  }

  // 3. Subtle organic trail tap (General page background clicks)
  playPebbleTap() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(650, now);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.022);

    gain.gain.setValueAtTime(0.06, now); // very soft & non-intrusive
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.03);
  }
}

export const sound = new AngadiSound();
