import { GatewaySignalConfig } from './GatewaySignalConfig';
import { CarrierLayerNode } from './CarrierLayer';
import { IsochronicNode } from './IsochronicLayer';

export class GatewaySignalGenerator {
  private audioContext: AudioContext;
  private carrierLayers: CarrierLayerNode[] = [];
  private isochronicLayers: IsochronicNode[] = [];
  private masterGain: GainNode;
  private isInitialized: boolean = false;
  private isPlaying: boolean = false;
  private analyser: AnalyserNode | null = null;
  private originalConfig: GatewaySignalConfig | null = null;

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
    this.masterGain = audioContext.createGain();
    this.masterGain.gain.value = 1.0;
  }

  async initialize(config: GatewaySignalConfig): Promise<void> {
    if (this.isInitialized) {
      this.dispose();
    }

    // Store original config for reset functionality
    this.originalConfig = JSON.parse(JSON.stringify(config));

    // Create analyser for visualization
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 2048;
    this.analyser.smoothingTimeConstant = 0.8;

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

    // Analyser is a pass-through node, so we'll connect it in the connect() method
    this.isInitialized = true;
  }

  connect(destination: AudioNode): void {
    // Connect through analyser for visualization (analyser is a pass-through)
    if (this.analyser) {
      this.masterGain.connect(this.analyser);
      this.analyser.connect(destination);
    } else {
      this.masterGain.connect(destination);
    }
  }

  getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  getCarrierLayerAnalyser(_index: number): AnalyserNode | null {
    // For individual layer analysis, we'd need to add analysers to each layer
    // For now, return the master analyser
    return this.analyser;
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
    
    // Fade out master gain smoothly to prevent clicks
    const now = this.audioContext.currentTime;
    const currentVolume = this.masterGain.gain.value;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(currentVolume, now);
    this.masterGain.gain.linearRampToValueAtTime(0, now + 0.05); // 50ms fade-out
    
    // Stop all layers (they have their own fade-outs)
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

  getConfig(): GatewaySignalConfig | null {
    return this.originalConfig;
  }

  getCarrierLayerCount(): number {
    return this.carrierLayers.length;
  }

  getIsochronicLayerCount(): number {
    return this.isochronicLayers.length;
  }

  getCarrierLayerVolume(index: number): number {
    if (index < 0 || index >= this.carrierLayers.length) return 0;
    return (this.carrierLayers[index] as any).config.volume;
  }

  setCarrierLayerVolume(index: number, volume: number): void {
    if (index < 0 || index >= this.carrierLayers.length) return;
    this.carrierLayers[index].setVolume(volume);
  }

  getIsochronicLayerVolume(index: number): number {
    if (index < 0 || index >= this.isochronicLayers.length) return 0;
    return (this.isochronicLayers[index] as any).config.volume;
  }

  setIsochronicLayerVolume(index: number, volume: number): void {
    if (index < 0 || index >= this.isochronicLayers.length) return;
    this.isochronicLayers[index].setVolume(volume);
  }

  resetToDefaults(): void {
    if (!this.originalConfig) return;

    // Reset carrier layers
    this.originalConfig.carrierLayers.forEach((layerConfig, index) => {
      if (index < this.carrierLayers.length) {
        this.carrierLayers[index].setVolume(layerConfig.volume);
      }
    });

    // Reset isochronic layers
    this.originalConfig.isochronicLayers.forEach((layerConfig, index) => {
      if (index < this.isochronicLayers.length) {
        this.isochronicLayers[index].setVolume(layerConfig.volume);
      }
    });
  }

  dispose(): void {
    this.stop();
    this.carrierLayers.forEach(layer => layer.dispose());
    this.carrierLayers = [];
    this.isochronicLayers.forEach(layer => layer.dispose());
    this.isochronicLayers = [];
    try {
      this.masterGain.disconnect();
      if (this.analyser) {
        this.analyser.disconnect();
      }
    } catch (e) {}
    this.analyser = null;
    this.isInitialized = false;
    this.isPlaying = false;
  }
}
