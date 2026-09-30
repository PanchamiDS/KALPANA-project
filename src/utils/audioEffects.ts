// Web Audio API and Speech Synthesis for aerospace sound effects & narration

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private rumbleNode: AudioBufferSourceNode | null = null;
  private rumbleGain: GainNode | null = null;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopRumble();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  }

  public playTelemetryBeep(freq = 1200, duration = 0.08) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // AudioContext policy catch
    }
  }

  public playRcsBurst() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const bufferSize = this.ctx.sampleRate * 0.15;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 2400;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start();
    } catch {}
  }

  public playEngineRumble(intensity = 0.1) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      if (this.rumbleNode) return;
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5;
      }

      this.rumbleNode = this.ctx.createBufferSource();
      this.rumbleNode.buffer = buffer;
      this.rumbleNode.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 160;

      this.rumbleGain = this.ctx.createGain();
      this.rumbleGain.gain.setValueAtTime(intensity * 0.15, this.ctx.currentTime);

      this.rumbleNode.connect(filter);
      filter.connect(this.rumbleGain);
      this.rumbleGain.connect(this.ctx.destination);
      this.rumbleNode.start();
    } catch {}
  }

  public stopRumble() {
    if (this.rumbleNode) {
      try {
        this.rumbleNode.stop();
        this.rumbleNode.disconnect();
      } catch {}
      this.rumbleNode = null;
    }
  }

  public speak(text: string, onEnd?: () => void) {
    if (this.isMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const spokenText = normalizeForSpeech(text);
      const utterance = new SpeechSynthesisUtterance(spokenText);
      utterance.rate = 1.02;
      utterance.pitch = 1.0;

      // Select natural English voice if present
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(v => (v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel')))) || voices.find(v => v.lang.startsWith('en'));
      if (preferred) {
        utterance.voice = preferred;
      }

      if (onEnd) {
        utterance.onend = onEnd;
        utterance.onerror = onEnd;
      }
      window.speechSynthesis.speak(utterance);
    } catch {
      if (onEnd) onEnd();
    }
  }
}

/**
 * Phonetically normalizes text for Web SpeechSynthesis engines
 * Ensures "ASTRYX-K4" is pronounced fluidly as "Astrix Kay-Four" rather than letter-by-letter "A-S-T-R-Y-X",
 * and "VYOM-1" as "Vyom one".
 */
export function normalizeForSpeech(text: string): string {
  if (!text) return '';
  return text
    // Replace all variations of ASTRYX-K4 and Astryx so it is pronounced as word "Astrix"
    .replace(/ASTRYX[- ]?K4/gi, 'Astrix K 4')
    .replace(/ASTRYX/gi, 'Astrix')
    .replace(/Astryx/g, 'Astrix')
    // Pronounce VYOM-1 as "Vyom one"
    .replace(/VYOM[- ]?1/gi, 'Vyom one')
    .replace(/VYOM/gi, 'Vyom')
    // SSO -> Sun-synchronous orbit
    .replace(/\bSSO\b/g, 'Sun-synchronous orbit')
    // N2O / N₂O -> nitrous oxide
    .replace(/\bN[2₂]O\b/gi, 'nitrous oxide')
    // HTPB -> H-T-P-B
    .replace(/\bHTPB\b/gi, 'H-T-P-B');
}

export const soundEngine = new SoundEngine();

