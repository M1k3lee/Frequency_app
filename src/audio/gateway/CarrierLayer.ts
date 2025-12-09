export class CarrierLayerNode {
  private audioContext: AudioContext;
  private leftOsc: OscillatorNode;
  private rightOsc: OscillatorNode;
  private leftGain: GainNode;
  private rightGain: GainNode;
  private merger: ChannelMergerNode;
  private config: {
    leftFreq: number;
    rightFreq: number;
    beatFreq: number;
    volume: number;
    phase: number;
  };
  private isPlaying: boolean = false;

  constructor(
    audioContext: AudioContext,
    config: {
      leftFreq: number;
      rightFreq: number;
      beatFreq: number;
      volume: number;
      phase: number;
    }
  ) {
    this.audioContext = audioContext;
    this.config = config;

    this.leftOsc = audioContext.createOscillator();
    this.rightOsc = audioContext.createOscillator();
    this.leftOsc.type = 'sine';
    this.rightOsc.type = 'sine';
    this.leftOsc.frequency.value = config.leftFreq;
    this.rightOsc.frequency.value = config.rightFreq;

    this.leftGain = audioContext.createGain();
    this.rightGain = audioContext.createGain();
    // Start at 0 for smooth fade-in
    this.leftGain.gain.value = 0;
    this.rightGain.gain.value = 0;

    this.merger = audioContext.createChannelMerger(2);
    this.leftOsc.connect(this.leftGain);
    this.rightOsc.connect(this.rightGain);
    this.leftGain.connect(this.merger, 0, 0);
    this.rightGain.connect(this.merger, 0, 1);
  }

  connect(destination: AudioNode): void {
    this.merger.connect(destination);
  }

  start(): void {
    if (!this.isPlaying) {
      const now = this.audioContext.currentTime;
      const fadeInDuration = 0.3; // 300ms smooth fade-in to eliminate all clicks
      
      // Cancel any existing scheduled values
      this.leftGain.gain.cancelScheduledValues(now);
      this.rightGain.gain.cancelScheduledValues(now);
      
      // Set gain to 0 before starting
      this.leftGain.gain.setValueAtTime(0.0001, now); // Use small value for exponential ramp
      this.rightGain.gain.setValueAtTime(0.0001, now);
      
      // Start oscillators at exact same time
      this.leftOsc.start(now);
      this.rightOsc.start(now);
      
      // Smooth exponential fade-in (sounds more natural than linear)
      const targetVolume = Math.max(0.0001, this.config.volume);
      this.leftGain.gain.exponentialRampToValueAtTime(targetVolume, now + fadeInDuration);
      this.rightGain.gain.exponentialRampToValueAtTime(targetVolume, now + fadeInDuration);
      
      this.isPlaying = true;
    }
  }

  stop(): void {
    if (this.isPlaying) {
      const now = this.audioContext.currentTime;
      const fadeOutDuration = 0.3; // 300ms smooth fade-out to match fade-in
      const stopTime = now + fadeOutDuration + 0.01; // Small buffer after fade
      
      // Cancel any existing scheduled values
      this.leftGain.gain.cancelScheduledValues(now);
      this.rightGain.gain.cancelScheduledValues(now);
      
      // Get current gain values (avoid zero for exponential ramp)
      const currentLeftGain = Math.max(0.0001, this.leftGain.gain.value);
      const currentRightGain = Math.max(0.0001, this.rightGain.gain.value);
      
      // Set current values and fade out
      this.leftGain.gain.setValueAtTime(currentLeftGain, now);
      this.rightGain.gain.setValueAtTime(currentRightGain, now);
      
      // Smooth exponential fade-out
      this.leftGain.gain.exponentialRampToValueAtTime(0.0001, now + fadeOutDuration);
      this.rightGain.gain.exponentialRampToValueAtTime(0.0001, now + fadeOutDuration);
      
      // Stop oscillators after fade-out completes
      this.leftOsc.stop(stopTime);
      this.rightOsc.stop(stopTime);
      
      this.isPlaying = false;
    }
  }

  setVolume(volume: number): void {
    const now = this.audioContext.currentTime;
    this.leftGain.gain.cancelScheduledValues(now);
    this.rightGain.gain.cancelScheduledValues(now);
    this.leftGain.gain.setValueAtTime(volume, now);
    this.rightGain.gain.setValueAtTime(volume, now);
    this.config.volume = volume;
  }

  dispose(): void {
    this.stop();
    try {
      this.leftOsc.disconnect();
      this.rightOsc.disconnect();
      this.leftGain.disconnect();
      this.rightGain.disconnect();
      this.merger.disconnect();
    } catch (e) {}
  }
}
