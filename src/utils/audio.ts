// Lightweight synthetic Web Audio effects (zero external files required)
class SoundFXManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private ambientGain: GainNode | null = null;
  private ambientOscs: OscillatorNode[] = [];
  private noiseBuffer: AudioBuffer | null = null;

  unlockAudio() {
    this.initCtx();
  }

  private initCtx() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  private getNoiseBuffer(): AudioBuffer | null {
    if (!this.ctx) return null;
    if (!this.noiseBuffer) {
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.15);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      this.noiseBuffer = buffer;
    }
    return this.noiseBuffer;
  }

  /**
   * Realistic footsteps on road/pavement surface for walking and running.
   * Alternates subtle pitch between left and right feet to create an authentic human pace.
   */
  playFootstep(isRunning: boolean = false, isRightFoot: boolean = false) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // 1. Transient low-frequency thump (shoe sole impact on asphalt)
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();

      const baseFreq = isRunning ? 96 : 82;
      const footVariance = isRightFoot ? 1.06 : 0.94;
      const startFreq = baseFreq * footVariance;

      osc.type = "sine";
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(32, now + (isRunning ? 0.075 : 0.055));

      const oscVol = isRunning ? 0.08 : 0.048;
      oscGain.gain.setValueAtTime(oscVol, now);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + (isRunning ? 0.075 : 0.055));

      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + (isRunning ? 0.08 : 0.06));

      // 2. High-frequency pavement friction/tap (shoe tread contact)
      const noise = this.getNoiseBuffer();
      if (noise) {
        const noiseSource = this.ctx.createBufferSource();
        noiseSource.buffer = noise;

        const noiseFilter = this.ctx.createBiquadFilter();
        noiseFilter.type = "bandpass";
        noiseFilter.frequency.setValueAtTime(isRunning ? 920 : 720, now);
        noiseFilter.Q.setValueAtTime(2.2, now);

        const noiseGain = this.ctx.createGain();
        const noiseVol = isRunning ? 0.055 : 0.032;
        noiseGain.gain.setValueAtTime(noiseVol, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + (isRunning ? 0.045 : 0.035));

        noiseSource.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(this.ctx.destination);

        noiseSource.start(now);
        noiseSource.stop(now + (isRunning ? 0.045 : 0.035));
      }
    } catch {
      // Audio autoplay restriction
    }
  }

  playHover() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(660, this.ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {
      // Audio autoplay restriction
    }
  }

  playClick() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch {
      // Audio autoplay restriction
    }
  }

  playPlayButton() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(554.37, now + 0.25); // C#
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    } catch {
      // Audio autoplay restriction
    }
  }

  // Start peaceful ambient atmospheric sound
  startAmbient() {
    if (this.ambientOscs.length > 0 || this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.05, this.ctx.currentTime + 2);
      masterGain.connect(this.ctx.destination);
      this.ambientGain = masterGain;

      // Ancient temple drone chords (C, G, E harmonic overtone)
      const frequencies = [130.81, 196.0, 261.63, 329.63];
      frequencies.forEach((freq) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        osc.connect(masterGain);
        osc.start();
        this.ambientOscs.push(osc);
      });
    } catch {
      // Autoplay policy
    }
  }

  // Stop ambient sound
  stopAmbient() {
    if (this.ambientGain && this.ctx) {
      try {
        this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
        setTimeout(() => {
          this.ambientOscs.forEach((o) => {
            try {
              o.stop();
              o.disconnect();
            } catch {
              // Ignore
            }
          });
          this.ambientOscs = [];
          this.ambientGain = null;
        }, 500);
      } catch {
        this.ambientOscs = [];
        this.ambientGain = null;
      }
    }
  }

  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopAmbient();
    } else {
      this.startAmbient();
    }
    return this.isMuted;
  }

  getMuted(): boolean {
    return this.isMuted;
  }
}

export const soundFX = new SoundFXManager();
