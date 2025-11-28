export class IsochronicNode {
  private audioContext: AudioContext;
  private osc: OscillatorNode;
  private gain: GainNode;
  private lfo: OscillatorNode;
  private lfoGain: GainNode;
  private config: {
    frequency: number;
    pulseRate: number;
    dutyCycle: number;
    volume: number;
  };
  private isPlaying: boolean = false;

  constructor(
    audioContext: AudioContext,
    config: {
      frequency: number;
      pulseRate: number;
      dutyCycle: number;
      volume: number;
    }
  ) {
    this.audioContext = audioContext;
    this.config = config;

    this.osc = audioContext.createOscillator();
    this.osc.frequency.value = config.frequency;
    this.osc.type = 'sine';

    this.lfo = audioContext.createOscillator();
    this.lfo.frequency.value = config.pulseRate;
    this.lfo.type = 'square';

    this.gain = audioContext.createGain();
    this.lfoGain = audioContext.createGain();

    const minGain = 0;
    const maxGain = config.volume;
    const adjustedCenter = minGain + (maxGain - minGain) * config.dutyCycle;
    const adjustedDepth = Math.min(adjustedCenter - minGain, maxGain - adjustedCenter);
    
    this.lfoGain.gain.value = adjustedDepth;
    this.gain.gain.value = adjustedCenter;

    this.lfo.connect(this.lfoGain);
    this.lfoGain.connect(this.gain.gain);
    this.osc.connect(this.gain);
  }

  connect(destination: AudioNode): void {
    this.gain.connect(destination);
  }

  start(): void {
    if (!this.isPlaying) {
      const now = this.audioContext.currentTime;
      this.osc.start(now);
      this.lfo.start(now);
      this.isPlaying = true;
    }
  }

  stop(): void {
    if (this.isPlaying) {
      const now = this.audioContext.currentTime;
      this.osc.stop(now + 0.1);
      this.lfo.stop(now + 0.1);
      this.isPlaying = false;
    }
  }

  setVolume(volume: number): void {
    const now = this.audioContext.currentTime;
    this.gain.gain.cancelScheduledValues(now);
    const minGain = 0;
    const maxGain = volume;
    const adjustedCenter = minGain + (maxGain - minGain) * this.config.dutyCycle;
    const adjustedDepth = Math.min(adjustedCenter - minGain, maxGain - adjustedCenter);
    this.lfoGain.gain.value = adjustedDepth;
    this.gain.gain.setValueAtTime(adjustedCenter, now);
    this.config.volume = volume;
  }

  dispose(): void {
    this.stop();
    try {
      this.osc.disconnect();
      this.lfo.disconnect();
      this.gain.disconnect();
      this.lfoGain.disconnect();
    } catch (e) {}
  }
}
