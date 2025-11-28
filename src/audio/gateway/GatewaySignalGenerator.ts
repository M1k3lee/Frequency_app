import { GatewaySignalConfig } from './GatewaySignalConfig';
import { CarrierLayerNode } from './CarrierLayer';
import { IsochronicNode } from './IsochronicLayer';

export class GatewaySignalGenerator {
  private audioContext: AudioContext;
  private carrierLayers: CarrierLayerNode[] = [];
  private isochronicLayers: IsochronicNode[] = [];
  private masterGain: GainNode;
  private destination: AudioNode | null = null;
  private isInitialized: boolean = false;
  private isPlaying: boolean = false;
  private config: GatewaySignalConfig | null = null;

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
    this.masterGain = audioContext.createGain();
    this.masterGain.gain.value = 1.0;
  }

  async initialize(config: GatewaySignalConfig): Promise<void> {
    if (this.isInitialized) {
      this.dispose();
    }
    this.config = config;

    for (const layerConfig of config.carrierLayers) {
      const layer = new CarrierLayerNode(this.audioContext, layerConfig);
      layer.connect(this.masterGain);
      this.carrierLayers.push(layer);
    }

    for (const layerConfig of config.isochronicLayers) {
      const layer = new IsochronicNode(this.audioContext, layerConfig);
      layer.connect(this.masterGain);
      this.isochronicLayers.push(layer);
    }

    this.isInitialized = true;
  }

  connect(destination: AudioNode): void {
    this.destination = destination;
    this.masterGain.connect(destination);
  }

  start(): void {
    if (!this.isInitialized) {
      throw new Error('GatewaySignalGenerator must be initialized before starting');
    }
    if (this.isPlaying) return;

    this.carrierLayers.forEach(layer => layer.start());
    this.isochronicLayers.forEach(layer => layer.start());
    this.isPlaying = true;
  }

  stop(): void {
    if (!this.isPlaying) return;
    this.carrierLayers.forEach(layer => layer.stop());
    this.isochronicLayers.forEach(layer => layer.stop());
    this.isPlaying = false;
  }

  setVolume(volume: number): void {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    const now = this.audioContext.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(clampedVolume, now);
  }

  getVolume(): number {
    return this.masterGain.gain.value;
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  dispose(): void {
    this.stop();
    this.carrierLayers.forEach(layer => layer.dispose());
    this.carrierLayers = [];
    this.isochronicLayers.forEach(layer => layer.dispose());
    this.isochronicLayers = [];
    try {
      this.masterGain.disconnect();
    } catch (e) {}
    this.isInitialized = false;
    this.isPlaying = false;
    this.config = null;
  }
}
