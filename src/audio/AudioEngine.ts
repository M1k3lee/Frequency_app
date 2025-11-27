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
    // According to Chrome autoplay policy, we should create AudioContext only after user gesture
    // But we can create the Volume node now - it will connect when context is running
    // Start with 0dB (full volume) - will be adjusted by setMasterVolume
    this.masterVolume = new Tone.Volume(0).toDestination();
    console.log('AudioEngine: Master volume node created');
    console.log('Master volume connected to destination:', this.masterVolume.volume.value, 'dB');
    console.log('Tone.js context state:', Tone.context.state);
    
    // Verify connection
    try {
      const destination = Tone.getDestination();
      console.log('Tone.js destination available:', destination ? 'Yes' : 'No');
      if (destination) {
        console.log('Destination number of inputs:', destination.numberOfInputs);
        console.log('Destination context state:', destination.context.state);
      }
    } catch (e) {
      console.error('Error accessing destination:', e);
    }
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
    // According to Chrome autoplay policy (https://developer.chrome.com/blog/autoplay/#web_audio):
    // - AudioContext created before user gesture will be in "suspended" state
    // - Must call resume() after user gesture
    // - Or create AudioContext only when user interacts
    
    const currentState = Tone.context.state;
    console.log('Audio context current state:', currentState);
    
    if (currentState === 'suspended') {
      console.log('Audio context is suspended, resuming...');
      try {
        await Tone.context.resume();
        console.log('Audio context resumed, new state:', Tone.context.state);
      } catch (error) {
        console.error('Failed to resume audio context:', error);
        throw error;
      }
    } else if (currentState !== 'running') {
      // If not running and not suspended, try to start
      console.log('Audio context not running, attempting to start...');
      try {
        await Tone.start();
        console.log('Audio context started, state:', Tone.context.state);
      } catch (error) {
        console.error('Failed to start audio context:', error);
        throw error;
      }
    } else {
      console.log('Audio context already running');
    }
    
    // Verify context is actually running
    if (Tone.context.state !== 'running') {
      const errorMsg = `Audio context could not be started. Current state: ${Tone.context.state}. User interaction required.`;
      console.error('ERROR:', errorMsg);
      throw new Error(errorMsg);
    }
    
    if (!this.context) {
      this.context = Tone.context;
      console.log('Audio context stored, state:', this.context.state);
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
    // Ensure audio context is running - critical for Chrome autoplay policy
    await this.ensureInitialized();
    
    // Double-check context state and resume if needed
    // This is especially important when playing from modals/overlays
    if (Tone.context.state === 'suspended') {
      console.log('Audio context suspended, attempting resume...');
      try {
        await Tone.context.resume();
        console.log('Audio context resumed successfully');
      } catch (error) {
        console.error('Failed to resume audio context:', error);
        throw new Error('Audio context could not be resumed. User interaction required.');
      }
    }

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
        
        // Create carrier oscillator at base frequency
        // Set phase to 0 to ensure smooth start and prevent clicks
        const carrier = new Tone.Oscillator({
          frequency: carrierFreq,
          type: 'sine',
          phase: 0
        });
        
        // Create LFO for frequency modulation
        // Tone.js LFO: frequency, min, max
        const lfo = new Tone.LFO(modulationFreq, -modulationDepth, modulationDepth);
        // Connect LFO to modulate the carrier's frequency parameter
        lfo.connect(carrier.frequency);
        lfo.start();
        
        // Create gain for volume control - start at 0 for smooth fade-in
        const gain = new Tone.Gain(0);
        carrier.connect(gain);
        
        // Create panner for stereo positioning
        const panNode = new Tone.Panner(pan);
        gain.connect(panNode);
        panNode.connect(this.masterVolume);
        
        // Verify context is running before starting
        if (Tone.context.state !== 'running') {
          console.error('Cannot start carrier: Audio context not running!');
          throw new Error('Audio context must be running to play audio');
        }
        
        // Start carrier with zero volume, then fade in smoothly to prevent clicks
        carrier.start();
        // Very short fade-in (5ms) to eliminate clicks from phase discontinuities
        gain.gain.rampTo(adjustedVolume, 0.005);
        
        // Verify it actually started
        setTimeout(() => {
          if (carrier.state !== 'started') {
            console.error('Carrier oscillator failed to start! State:', carrier.state);
          }
        }, 100);
        
        // Verify connection chain
        console.log('Playing carrier frequency:', carrierFreq, 'Hz modulated by', modulationFreq, 'Hz (±', modulationDepth, 'Hz) at volume', adjustedVolume);
        console.log('Carrier state:', carrier.state, 'LFO state:', lfo.state, 'Gain value:', gain.gain.value);
        console.log('Master volume dB:', this.masterVolume.volume.value);
        console.log('Carrier frequency value:', carrier.frequency.value);
        console.log('Connection chain: carrier -> gain -> pan -> masterVolume -> destination');
        
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
        // Use a carrier frequency in the audible range and create binaural beat
        const beatFreq = frequency.frequency; // The desired beat frequency (Hz)
        const carrierFreq = 200; // Base frequency in audible range
        
        // Create binaural beat: left and right differ by beatFreq
        // This creates the perception of the beat frequency in the brain
        const leftFreq = carrierFreq - beatFreq / 2;
        const rightFreq = carrierFreq + beatFreq / 2;
        
        // Ensure both are in audible range (20-20000 Hz)
        const safeLeftFreq = Math.max(20, Math.min(20000, leftFreq));
        const safeRightFreq = Math.max(20, Math.min(20000, rightFreq));
        
        // Create oscillators with phase set to 0 to ensure smooth start and prevent clicks
        const leftOsc = new Tone.Oscillator({
          frequency: safeLeftFreq,
          type: 'sine',
          phase: 0
        });
        const rightOsc = new Tone.Oscillator({
          frequency: safeRightFreq,
          type: 'sine',
          phase: 0
        });
        
        // Create separate gains for left and right - start at 0 for smooth fade-in
        const leftGain = new Tone.Gain(0);
        const rightGain = new Tone.Gain(0);
        
        // Create panners for stereo positioning
        const leftPan = new Tone.Panner(Math.max(-1, -1 + pan));
        const rightPan = new Tone.Panner(Math.min(1, 1 + pan));
        
        // Connect: osc -> gain -> panner -> masterVolume -> destination
        leftOsc.connect(leftGain);
        rightOsc.connect(rightGain);
        leftGain.connect(leftPan);
        rightGain.connect(rightPan);
        leftPan.connect(this.masterVolume);
        rightPan.connect(this.masterVolume);
        
        // Verify context is running before starting
        if (Tone.context.state !== 'running') {
          console.error('Cannot start oscillators: Audio context not running!');
          throw new Error('Audio context must be running to play audio');
        }
        
        // Start oscillators with zero volume, then fade in smoothly to prevent clicks
        leftOsc.start();
        rightOsc.start();
        // Very short fade-in (5ms) to eliminate clicks from phase discontinuities
        leftGain.gain.rampTo(adjustedVolume, 0.005);
        rightGain.gain.rampTo(adjustedVolume, 0.005);
        
        // Verify they actually started
        setTimeout(() => {
          if (leftOsc.state !== 'started' || rightOsc.state !== 'started') {
            console.error('Oscillators failed to start! Left:', leftOsc.state, 'Right:', rightOsc.state);
          }
        }, 100);
        
        // Verify everything is connected and working
        console.log('Playing binaural beat:', safeLeftFreq.toFixed(1), 'Hz /', safeRightFreq.toFixed(1), 'Hz (beat:', beatFreq.toFixed(1), 'Hz) at volume', adjustedVolume.toFixed(2));
        console.log('Left osc state:', leftOsc.state, 'Right osc state:', rightOsc.state);
        console.log('Left gain:', leftGain.gain.value, 'Right gain:', rightGain.gain.value);
        console.log('Master volume dB:', this.masterVolume.volume.value);
        console.log('Left frequency:', leftOsc.frequency.value, 'Right frequency:', rightOsc.frequency.value);
        console.log('Connection chain: osc -> gain -> pan -> masterVolume -> destination');
        
        // Verify master volume is connected to destination
        console.log('Master volume connected to destination:', this.masterVolume.volume.value, 'dB');
        
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
        // Fade out smoothly to prevent clicks when stopping
        const fadeOutTime = 0.01; // 10ms fade-out
        if (osc.carrier) {
          // Carrier modulation - single gain
          osc.gain.gain.rampTo(0, fadeOutTime);
        } else {
          // Binaural beats - fade both gains
          osc.gain.gain.rampTo(0, fadeOutTime);
          if (osc.rightGain) {
            osc.rightGain.gain.rampTo(0, fadeOutTime);
          }
        }
        
        // Stop oscillators after fade-out completes
        setTimeout(() => {
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
            console.error('Error disposing oscillators:', error);
          }
        }, fadeOutTime * 1000 + 10); // Add small buffer for fade completion
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

