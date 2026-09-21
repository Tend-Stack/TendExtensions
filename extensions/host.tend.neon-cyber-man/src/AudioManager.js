class CyberAudio {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  unlock() {
    if (this.muted) return;
    if (!this.ctx) {
      try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        this.ctx = Ctx ? new Ctx() : null;
      } catch {
        this.ctx = null;
      }
    }
    if (this.ctx?.state === 'suspended') this.ctx.resume().catch(() => {});
  }

  tone(freq, duration = 0.08, type = 'sine', gain = 0.04, delay = 0, glideTo = null) {
    if (this.muted) return;
    this.unlock();
    if (!this.ctx) return;
    const t = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const amp = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (glideTo != null) osc.frequency.exponentialRampToValueAtTime(Math.max(1, glideTo), t + duration);
    amp.gain.setValueAtTime(Math.max(0.0001, gain), t);
    amp.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    osc.connect(amp);
    amp.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + duration + 0.02);
  }

  pellet(multiplier = 1) {
    this.tone(420 + multiplier * 65, 0.045, 'square', 0.018, 0, 560 + multiplier * 55);
  }

  power() {
    [220, 330, 495, 740].forEach((f, i) => this.tone(f, 0.15, 'sawtooth', 0.035, i * 0.035, f * 1.35));
  }

  dash() {
    this.tone(240, 0.22, 'sawtooth', 0.045, 0, 1100);
    this.tone(120, 0.18, 'triangle', 0.035, 0.02, 520);
  }

  emp() {
    [900, 620, 410, 260].forEach((f, i) => this.tone(f, 0.16, 'square', 0.028, i * 0.025, f * 0.55));
  }

  ghostEat(chain = 1) {
    const base = 540 + chain * 110;
    this.tone(base, 0.12, 'triangle', 0.05);
    this.tone(base * 1.5, 0.13, 'sine', 0.04, 0.055);
  }

  hit() {
    [220, 165, 110, 82].forEach((f, i) => this.tone(f, 0.16, 'sawtooth', 0.035, i * 0.045, f * 0.72));
  }

  achievement() {
    [523, 659, 784, 1047].forEach((f, i) => this.tone(f, 0.14, 'sine', 0.035, i * 0.055));
  }

  gameStart() {
    [262, 392, 523, 784].forEach((f, i) => this.tone(f, 0.12, 'triangle', 0.03, i * 0.07));
  }

  gameOver() {
    [392, 330, 262, 196, 147].forEach((f, i) => this.tone(f, 0.22, 'sawtooth', 0.028, i * 0.085, f * 0.8));
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  close() {
    if (this.ctx) this.ctx.close().catch(() => {});
    this.ctx = null;
  }
}

export const audio = new CyberAudio();
