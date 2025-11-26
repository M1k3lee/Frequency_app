import * as Tone from 'tone';
import { Frequency } from '../types';

class AudioEngine {
  private context: Tone.BaseContext | null = null;
  private masterVolume: Tone.Volume;
  private activeOscillators: Map<string, {
    left: Tone.Oscillator;
    right: Tone.Oscillator;
    carrier?: Tone.Oscillator;
    lfo?: Tone.LFO;
    gain: Tone.Gain;
    rightGain?: Tone.Gain;
    pan: Tone.Panner;
  }> = new Map();
  private isInitialized: boolean = false;
  private isReady: boolean = false;

  constructor() {
    // Start with 0dB (full volume) - will be adjusted by setMasterVolume
    this.masterVolume = new Tone.Volume(0).toDestination();
    console.log('AudioEngine: Master volume node created');
    console.log('Master volume connected to destination:', this.masterVolume.volume.value, 'dB');
    console.log('Tone.js context state:', Tone.context.state);
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      // Mark as ready but don't start context yet
      this.isReady = true;
      this.isInitialized = true;
      console.log('Audio engine initialized (ready for user gesture)');
    } catch (error) {
      console.error('Failed to initialize audio engine:', error);
      throw error;
    }
  }

  async ensureInitialized(): Promise<void> {
    if (Tone.context.state !== 'running') {
      await Tone.start();
      console.log('Audio context started, state:', Tone.context.state);
    } else {
      console.log('Audio context already running');
    }
    
    if (!this.context) {
      this.context = Tone.context;
      console.log('Audio context stored');
    }

    // Request wake lock for mobile
    if ('wakeLock' in navigator) {
      try {
        await (navigator as any).wakeLock.request('screen');
        console.log('Wake lock acquired');
      } catch (err) {
        console.log('Wake lock not available:', err);
      }
    }
  }

  async playFrequency(frequency: Frequency, volume: number = 0.7, pan: number = 0): Promise<string> {
    await this.ensureInitialized();

    const id = `${frequency.id}-${Date.now()}`;
    
    try {
      // Increase volume significantly for audibility
      const adjustedVolume = Math.min(1.0, volume * 2.0); // Boost by 100%, cap at 1.0
      
      // For very low frequencies (< 10Hz), use carrier frequency modulation
      // For 10-20Hz, use binaural beats as they're close to audible range
      if (frequency.frequency < 10) {
        const carrierFreq = 200; // Carrier frequency in Hz
        const modulationFreq = frequency.frequency;
        const modulationDepth = 50; // Modulate by ±50Hz for audible effect
        
        // Create carrier oscillator
        const carrier = new Tone.Oscillator(carrierFreq, 'sine');
        
        // Create LFO for frequency modulation with proper depth
        // LFO output range: -1 to 1, scale to -modulationDepth to +modulationDepth
        const lfo = new Tone.LFO(modulationFreq, -modulationDepth, modulationDepth);
        lfo.connect(carrier.frequency);
        lfo.start();
        
        // Create gain for volume control - use full volume for carrier
        const gain = new Tone.Gain(adjustedVolume);
        carrier.connect(gain);
        
        // Create panner for stereo positioning
        const panNode = new Tone.Panner(pan);
        gain.connect(panNode);
        panNode.connect(this.masterVolume);
        
        // Start carrier after a small delay to ensure everything is connected
        carrier.start();
        
        console.log('Playing carrier frequency:', carrierFreq, 'Hz modulated by', modulationFreq, 'Hz (±', modulationDepth, 'Hz) at volume', adjustedVolume);
        console.log('Carrier state:', carrier.state, 'LFO state:', lfo.state, 'Gain value:', gain.gain.value);
        console.log('Master volume dB:', this.masterVolume.volume.value);
        
        this.activeOscillators.set(id, {
          left: carrier as any,
          right: carrier as any,
          carrier,
          lfo,
          gain,
          pan: panNode
        });
      } else {
        // Standard binaural beat generation
        // Use a carrier frequency in the audible range (200Hz) and modulate it
        // to create the binaural beat effect
        const beatFreq = frequency.frequency; // The desired beat frequency
        const carrierFreq = 200; // Base frequency in audible range
        
        // Create binaural beat: left and right differ by beatFreq
        // This creates the perception of the beat frequency
        const leftFreq = carrierFreq - beatFreq / 2;
        const rightFreq = carrierFreq + beatFreq / 2;
        
        // Ensure both are in audible range (20-20000 Hz)
        const safeLeftFreq = Math.max(20, Math.min(20000, leftFreq));
        const safeRightFreq = Math.max(20, Math.min(20000, rightFreq));
        
        const leftOsc = new Tone.Oscillator(safeLeftFreq, 'sine');
        const rightOsc = new Tone.Oscillator(safeRightFreq, 'sine');
        
        // Create separate gains for left and right with increased volume
        const leftGain = new Tone.Gain(adjustedVolume);
        const rightGain = new Tone.Gain(adjustedVolume);
        
        // Create panners
        const leftPan = new Tone.Panner(Math.max(-1, -1 + pan));
        const rightPan = new Tone.Panner(Math.min(1, 1 + pan));
        
        // Connect: osc -> gain -> panner -> master
        leftOsc.connect(leftGain);
        rightOsc.connect(rightGain);
        leftGain.connect(leftPan);
        rightGain.connect(rightPan);
        leftPan.connect(this.masterVolume);
        rightPan.connect(this.masterVolume);
        
        // Start oscillators
        leftOsc.start();
        rightOsc.start();
        
        console.log('Playing binaural beat:', safeLeftFreq.toFixed(1), 'Hz /', safeRightFreq.toFixed(1), 'Hz (beat:', beatFreq.toFixed(1), 'Hz) at volume', adjustedVolume.toFixed(2));
        console.log('Left osc state:', leftOsc.state, 'Right osc state:', rightOsc.state);
        console.log('Left gain:', leftGain.gain.value, 'Right gain:', rightGain.gain.value);
        console.log('Master volume dB:', this.masterVolume.volume.value);
        
        // Store both gains for volume control
        this.activeOscillators.set(id, {
          left: leftOsc,
          right: rightOsc,
          gain: leftGain,
          pan: leftPan,
          rightGain: rightGain
        } as any);
      }
      
      return id;
    } catch (error) {
      console.error('Error playing frequency:', error);
      throw error;
    }
  }

  stopFrequency(id: string): void {
    const osc = this.activeOscillators.get(id);
    if (osc) {
      try {
        osc.left.stop();
        osc.right.stop();
        if (osc.carrier) {
          osc.carrier.stop();
        }
        if (osc.lfo) {
          osc.lfo.stop();
        }
        osc.left.dispose();
        osc.right.dispose();
        if (osc.carrier) {
          osc.carrier.dispose();
        }
        if (osc.lfo) {
          osc.lfo.dispose();
        }
        osc.gain.dispose();
        if (osc.rightGain) {
          osc.rightGain.dispose();
        }
        osc.pan.dispose();
      } catch (error) {
        console.error('Error stopping frequency:', error);
      }
      this.activeOscillators.delete(id);
    }
  }

  stopAll(): void {
    this.activeOscillators.forEach((_, id) => {
      this.stopFrequency(id);
    });
  }

  setVolume(id: string, volume: number): void {
    const osc = this.activeOscillators.get(id);
    if (osc) {
      if (osc.carrier) {
        // Carrier modulation - single gain
        osc.gain.gain.value = volume;
      } else {
        // Binaural beats - update both left and right gains
        osc.gain.gain.value = volume; // Left gain
        if (osc.rightGain) {
          osc.rightGain.gain.value = volume; // Right gain
        }
      }
    }
  }

  setPan(id: string, pan: number): void {
    const osc = this.activeOscillators.get(id);
    if (osc) {
      osc.pan.pan.value = pan;
    }
  }

  setMasterVolume(volume: number): void {
    // Convert 0-1 range to dB
    // Volume of 1.0 = 0dB (full volume), 0.5 = -6dB, 0.1 = -20dB
    // Use a minimum of -12dB (about 25% volume) to ensure audibility
    const minDb = -12;
    const dbValue = volume > 0 ? Math.max(minDb, Tone.gainToDb(volume)) : -60;
    this.masterVolume.volume.value = dbValue;
    console.log('Master volume set to:', volume, '(', dbValue.toFixed(1), 'dB)');
    console.log('Master volume node connected:', this.masterVolume.volume.value, 'dB');
  }

  getAnalyser(): AnalyserNode | null {
    if (!this.context) return null;
    
    try {
      const analyser = Tone.context.createAnalyser();
      analyser.fftSize = 2048;
      return analyser;
    } catch (error) {
      console.error('Error creating analyser:', error);
      return null;
    }
  }

  getActiveCount(): number {
    return this.activeOscillators.size;
  }

  isReadyForPlayback(): boolean {
    return this.isReady;
  }
}

export const audioEngine = new AudioEngine();

