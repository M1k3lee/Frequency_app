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
    // Start at 0 for smooth fade-in
    this.gain.gain.value = 0;

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
      const fadeInDuration = 0.3; // 300ms smooth fade-in to eliminate all clicks
      
      // Cancel any existing scheduled values
      this.gain.gain.cancelScheduledValues(now);
      
      // Calculate target gain
      const minGain = 0.0001; // Use small value for exponential ramp
      const maxGain = Math.max(0.0001, this.config.volume);
      const adjustedCenter = minGain + (maxGain - minGain) * this.config.dutyCycle;
      
      // Set gain to minimum before starting
      this.gain.gain.setValueAtTime(0.0001, now);
      
      // Start oscillators at exact same time
      this.osc.start(now);
      this.lfo.start(now);
      
      // Smooth exponential fade-in
      this.gain.gain.exponentialRampToValueAtTime(adjustedCenter, now + fadeInDuration);
      
      this.isPlaying = true;
    }
  }

  stop(): void {
    if (this.isPlaying) {
      const now = this.audioContext.currentTime;
      const fadeOutDuration = 0.3; // 300ms smooth fade-out to match fade-in
      const stopTime = now + fadeOutDuration + 0.01; // Small buffer after fade
      
      // Cancel any existing scheduled values
      this.gain.gain.cancelScheduledValues(now);
      
      // Get current gain value (avoid zero for exponential ramp)
      const currentGain = Math.max(0.0001, this.gain.gain.value);
      
      // Set current value and fade out
      this.gain.gain.setValueAtTime(currentGain, now);
      
      // Smooth exponential fade-out
      this.gain.gain.exponentialRampToValueAtTime(0.0001, now + fadeOutDuration);
      
      // Stop oscillators after fade-out completes
      this.osc.stop(stopTime);
      this.lfo.stop(stopTime);
      
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
