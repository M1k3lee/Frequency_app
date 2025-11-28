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
    this.leftGain.gain.value = config.volume;
    this.rightGain.gain.value = config.volume;

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
      this.leftOsc.start(now);
      this.rightOsc.start(now);
      this.isPlaying = true;
    }
  }

  stop(): void {
    if (this.isPlaying) {
      const now = this.audioContext.currentTime;
      this.leftOsc.stop(now + 0.1);
      this.rightOsc.stop(now + 0.1);
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
