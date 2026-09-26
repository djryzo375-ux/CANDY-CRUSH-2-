/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Procedural Web Audio synthesizer for Candy Crush 2
class SoundSystem {
  private ctx: AudioContext | null = null;
  public sfxEnabled: boolean = true;
  public musicEnabled: boolean = false;
  private musicInterval: number | null = null;
  private melodyIndex: number = 0;
  private masterVolume: number = 0.8;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  setEnabled(enabled: boolean) {
    this.sfxEnabled = enabled;
  }

  setVolume(volume: number) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }

  // Soft swoosh for swapping candies
  playSwap() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(580, now + 0.08);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, now);

    gain.gain.setValueAtTime(0.2 * this.masterVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  // Quick pleasant click / pop
  playPop() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(850, now + 0.06);

    gain.gain.setValueAtTime(0.2 * this.masterVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.07);
  }

  // Invalid move / locked buzz
  playInvalid() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.setValueAtTime(130, now + 0.08);

    gain.gain.setValueAtTime(0.25 * this.masterVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  // Game start triumphant chime
  playStart() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const notes = [392.00, 523.25, 659.25, 783.99];
    let time = this.ctx.currentTime;
    notes.forEach((f, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, time + i * 0.08);

      gain.gain.setValueAtTime(0.25 * this.masterVolume, time + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, time + i * 0.08 + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(time + i * 0.08);
      osc.stop(time + i * 0.08 + 0.26);
    });
  }

  // Hint twinkle chime
  playHint() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [880, 1046.5, 1318.5].forEach((f, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + idx * 0.06);

      gain.gain.setValueAtTime(0.15 * this.masterVolume, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.22);
    });
  }

  // Pitch-rising chime on consecutive matches / cascades
  playMatch(streak: number = 1) {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const pentatonic = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];
    const index = Math.min((streak - 1) % pentatonic.length, pentatonic.length - 1);
    const baseFreq = pentatonic[index];

    const now = this.ctx.currentTime;
    
    // Primary chime
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(baseFreq, now);

    // Over-tone bell sparkle
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(baseFreq * 2, now);

    gain1.gain.setValueAtTime(0.25 * this.masterVolume, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    gain2.gain.setValueAtTime(0.12 * this.masterVolume, now);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc1.connect(gain1);
    osc2.connect(gain2);
    gain1.connect(this.ctx.destination);
    gain2.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.3);
    osc2.stop(now + 0.25);
  }

  // Beam laser sweep for Striped Candies
  playStriped() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.18);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.35);

    gain.gain.setValueAtTime(0.25 * this.masterVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.38);
  }

  // Booming explosion for Wrapped Candies
  playWrapped() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    
    // Sub rumble
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.4);

    gain.gain.setValueAtTime(0.35 * this.masterVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    // Pop crackle
    const pop = this.ctx.createOscillator();
    const popGain = this.ctx.createGain();
    pop.type = 'square';
    pop.frequency.setValueAtTime(600, now);
    pop.frequency.exponentialRampToValueAtTime(100, now + 0.15);
    popGain.gain.setValueAtTime(0.2 * this.masterVolume, now);
    popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    pop.connect(popGain);
    gain.connect(this.ctx.destination);
    popGain.connect(this.ctx.destination);

    osc.start(now);
    pop.start(now);
    osc.stop(now + 0.45);
    pop.stop(now + 0.2);
  }

  // Super rainbow electric zap for Color Bomb
  playColorBomb() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);

      gain.gain.setValueAtTime(0.18 * this.masterVolume, now + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.04);
      osc.stop(now + idx * 0.04 + 0.32);
    });
  }

  // Huge combo blast
  playComboBlast() {
    this.playColorBomb();
    setTimeout(() => this.playWrapped(), 120);
  }

  // Hammer smash sound
  playHammer() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.2);

    gain.gain.setValueAtTime(0.4 * this.masterVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.22);
  }

  // Special candy creation chime
  playSpecialCreate(type: string = 'striped') {
    if (type === 'color_bomb') {
      this.playColorBomb();
    } else {
      this.playMatch(4);
    }
  }

  // Lucky Wheel ticker sound
  playWheelTick() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(750 + Math.random() * 200, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.04);
    gain.gain.setValueAtTime(0.12 * this.masterVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  // Board shuffle sound
  playShuffle() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    for (let i = 0; i < 4; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(350 + i * 120, now + i * 0.07);

      gain.gain.setValueAtTime(0.18 * this.masterVolume, now + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.07);
      osc.stop(now + i * 0.07 + 0.14);
    }
  }

  // Chocolate spread sound
  playChocolate() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.25);

    gain.gain.setValueAtTime(0.15 * this.masterVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.28);
  }

  // Voice chime
  playVoice(level: 'sweet' | 'tasty' | 'delicious' | 'divine' | 'sugarcrush') {
    this.playVoiceChime(level);
  }

  // Big fanfare for Sweet / Tasty / Sugar Crush voice callout
  playVoiceChime(level: 'sweet' | 'tasty' | 'delicious' | 'divine' | 'sugarcrush') {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const chords: Record<string, number[]> = {
      sweet: [523.25, 659.25, 783.99],
      tasty: [659.25, 830.61, 987.77],
      delicious: [587.33, 739.99, 880.00, 1174.66],
      divine: [659.25, 830.61, 987.77, 1318.51, 1661.22],
      sugarcrush: [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98],
    };

    const freqs = chords[level] || chords.sweet;
    const now = this.ctx.currentTime;

    freqs.forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.05);

      gain.gain.setValueAtTime(0.2 * this.masterVolume, now + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + i * 0.05);
      osc.stop(now + i * 0.05 + 0.5);
    });
  }

  // Sugar Crush Fanfare
  playSugarCrush() {
    this.playVoiceChime('sugarcrush');
  }

  // Level Win Fanfare
  playWin() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const notes = [
      { f: 523.25, d: 0.12 },
      { f: 659.25, d: 0.12 },
      { f: 783.99, d: 0.14 },
      { f: 1046.50, d: 0.35 }
    ];
    let time = this.ctx.currentTime;
    notes.forEach((n) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, time);
      gain.gain.setValueAtTime(0.3 * this.masterVolume, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + n.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(time);
      osc.stop(time + n.d);
      time += n.d * 0.9;
    });
  }

  // Level Lose Sound
  playLose() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const notes = [440, 415.3, 392, 349.23];
    let time = this.ctx.currentTime;
    notes.forEach((f) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, time);
      gain.gain.setValueAtTime(0.25 * this.masterVolume, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(time);
      osc.stop(time + 0.25);
      time += 0.2;
    });
  }

  // UI click
  playClick() {
    this.playPop();
  }

  // Booster activate
  playBooster() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(950, now + 0.25);

    gain.gain.setValueAtTime(0.22 * this.masterVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  }

  // Background sweet candy marimba / music loop
  toggleMusic(enable?: boolean) {
    if (enable !== undefined) {
      this.musicEnabled = enable;
    } else {
      this.musicEnabled = !this.musicEnabled;
    }

    if (this.musicInterval) {
      window.clearInterval(this.musicInterval);
      this.musicInterval = null;
    }

    if (this.musicEnabled) {
      this.initCtx();
      const melody = [
        392.00, 440.00, 523.25, 659.25, 783.99, 659.25, 523.25, 440.00,
        349.23, 392.00, 440.00, 587.33, 659.25, 587.33, 440.00, 392.00,
        329.63, 392.00, 523.25, 659.25, 783.99, 880.00, 783.99, 659.25,
        587.33, 523.25, 440.00, 392.00, 349.23, 392.00, 523.25, 0
      ];

      this.musicInterval = window.setInterval(() => {
        if (!this.musicEnabled || !this.ctx) return;
        const note = melody[this.melodyIndex % melody.length];
        this.melodyIndex++;

        if (note > 0) {
          const now = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(note, now);

          gain.gain.setValueAtTime(0.05 * this.masterVolume, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.25);
        }
      }, 240);
    }
    return this.musicEnabled;
  }
}

export const sound = new SoundSystem();
