import * as Tone from 'tone';
import { Frequency } from '../types';
import { GatewaySignalGenerator } from './gateway/GatewaySignalGenerator';
import { getGatewayConfig } from './gateway/GatewaySignalConfig';
import { isMobileApp } from '../utils/isMobileApp';

class AudioEngine {
  private context: Tone.BaseContext | null = null;
  private masterVolume: Tone.Volume;
  private masterCompressor: Tone.Compressor;
  private masterLimiter: Tone.Limiter;
  private activeOscillators: Map<string, {
    left: Tone.Oscillator;
    right: Tone.Oscillator;
    carrier?: Tone.Oscillator;
    lfo?: Tone.LFO;
    gain: Tone.Gain;
    rightGain?: Tone.Gain;
    pan: Tone.Panner;
    rightPan?: Tone.Panner;
    mode: 'fm-carrier' | 'binaural' | 'tone';
  }> = new Map();
  private gatewayGenerator: GatewaySignalGenerator | null = null;
  private isInitialized: boolean = false;
  private isReady: boolean = false;
  private contextMonitorInterval: number | null = null;
  private readonly MAX_BRAINWAVE_BEAT_HZ = 40;
  private readonly BINAURAL_STEREO_SPREAD = 0.85;

  constructor() {
    // Prefer playback stability over low latency to reduce underruns/crackle.
    try {
      Tone.setContext(new Tone.Context({
        latencyHint: 'playback'
      }));
    } catch (error) {
      console.warn('AudioEngine: Unable to override Tone context settings:', error);
    }

    // According to Chrome autoplay policy, we should create AudioContext only after user gesture
    // But we can create the master chain now - it will connect when context is running.
    this.masterVolume = new Tone.Volume(0);
    this.masterCompressor = new Tone.Compressor({
      threshold: -18,
      ratio: 3,
      attack: 0.01,
      release: 0.2
    });
    this.masterLimiter = new Tone.Limiter(-1);
    this.masterVolume.chain(this.masterCompressor, this.masterLimiter, Tone.getDestination());
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
    const isMobile = isMobileApp();
    console.log('Audio context current state:', currentState, 'Mobile:', isMobile);
    
    // On Android, add a small delay to ensure WebView audio context is ready
    if (isMobile && currentState !== 'running') {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    if (currentState === 'suspended') {
      console.log('Audio context is suspended, resuming...');
      try {
        await Tone.context.resume();
        // On Android, wait a bit longer after resume to ensure it's stable
        if (isMobile) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
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
        // On Android, wait after start to ensure stability
        if (isMobile) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
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
      
      // Optimize audio context settings to prevent buffer underruns and crackling
      if (this.context.rawContext instanceof AudioContext) {
        const audioContext = this.context.rawContext as AudioContext;
        
        // Log current settings
        console.log('Audio context sample rate:', audioContext.sampleRate);
        console.log('Audio context state:', audioContext.state);
        
        // Android-specific optimizations for better audio stability
        if (isMobileApp()) {
          console.log('Android detected - applying mobile audio optimizations');
          // On Android WebView, audio context can be more sensitive
          // Add extra stability checks and delays
          if (audioContext.state === 'running') {
            // Even if running, add a small stabilization delay on Android
            await new Promise(resolve => setTimeout(resolve, 50));
            // Double-check it's still running after delay
            if (audioContext.state !== 'running') {
              console.warn('Android: Audio context stopped during stabilization, resuming...');
              try {
                await audioContext.resume();
                await new Promise(resolve => setTimeout(resolve, 50));
              } catch (err) {
                console.error('Android: Failed to resume after stabilization:', err);
              }
            }
          }
        }
        
        // Monitor audio context state changes to catch unexpected suspensions
        // This helps identify if the context is being suspended/resumed unexpectedly
        audioContext.addEventListener('statechange', () => {
          console.log('Audio context state changed to:', audioContext.state);
          if (audioContext.state === 'suspended') {
            console.warn('Audio context unexpectedly suspended - this may cause crackling');
            // Try to automatically resume if we have active oscillators
            if (this.activeOscillators.size > 0 || this.gatewayGenerator) {
              console.log('Attempting to auto-resume audio context...');
              audioContext.resume().catch(err => {
                console.error('Failed to auto-resume audio context:', err);
              });
            }
          }
        });
        
        // Set up periodic monitoring to catch state changes that might not fire events
        // On Android, check more frequently (every 1 second) to catch issues faster
        // On web, every 2 seconds is sufficient
        const monitorInterval = isMobileApp() ? 1000 : 2000;
        this.contextMonitorInterval = window.setInterval(() => {
          if ((this.activeOscillators.size > 0 || this.gatewayGenerator) && 
              audioContext.state !== 'running') {
            console.warn('Audio context not running during playback - attempting resume');
            // On Android, add a small delay before resume for stability
            const resumeDelay = isMobileApp() ? 50 : 0;
            setTimeout(() => {
              audioContext.resume().catch(err => {
                console.error('Failed to resume audio context during monitoring:', err);
              });
            }, resumeDelay);
          }
        }, monitorInterval);
        
        // Note: Buffer size cannot be changed after AudioContext creation
        // But we can optimize by ensuring we're not overloading the context
        // The default buffer size is typically 512 or 1024 samples
        // Larger buffers = less crackling but more latency
      }
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

  private isBrainwaveBeatFrequency(targetHz: number): boolean {
    return targetHz > 0 && targetHz <= this.MAX_BRAINWAVE_BEAT_HZ;
  }

  private getBinauralCarrierFrequency(
    beatFreq: number,
    headphoneQuality: 'standard' | 'high-quality'
  ): number {
    // Keep beta/gamma carriers in the most audible range for phone/laptop speakers.
    const preferredBase = headphoneQuality === 'high-quality' ? 260 : 432;
    const minSafeCarrier = beatFreq / 2 + 60;
    return Math.min(1600, Math.max(preferredBase, minSafeCarrier));
  }

  private getStereoPans(pan: number): { left: number; right: number } {
    const clampedPan = Math.max(-1, Math.min(1, pan));
    return {
      left: Math.max(-1, Math.min(1, clampedPan - this.BINAURAL_STEREO_SPREAD)),
      right: Math.max(-1, Math.min(1, clampedPan + this.BINAURAL_STEREO_SPREAD))
    };
  }

  async playFrequency(frequency: Frequency, volume: number = 0.7, pan: number = 0, headphoneQuality: 'standard' | 'high-quality' = 'standard'): Promise<string> {
    // Check if this is a Gateway signal
    const gatewayConfig = getGatewayConfig(frequency.id);
    const isGateway = frequency.isGatewaySignal || gatewayConfig !== null;

    if (isGateway && gatewayConfig) {
      // Use Gateway signal generator (Web Audio API)
      return await this.playGatewaySignal(gatewayConfig, volume);
    }

    // Use Tone.js for regular frequencies (existing implementation)
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
      const targetFrequencyHz = Math.max(0.0001, frequency.frequency);
      // Keep per-voice gain conservative to avoid clipping when layers combine.
      const adjustedVolume = Math.max(0.0001, Math.min(1.0, volume));

      // For very low frequencies (<10Hz), use frequency modulation for a stable audible carrier.
      if (targetFrequencyHz < 10) {
        let carrierFreq: number;
        let modulationDepth: number;

        if (headphoneQuality === 'high-quality') {
          // High quality: Use lower carrier (200Hz) for deeper bass response with premium headphones
          carrierFreq = 200;
          modulationDepth = targetFrequencyHz < 2 ? 60 : 50; // Modulate by +/-50-60Hz
        } else {
          // Standard: Use higher carrier for better phone speaker compatibility
          // Very low frequencies (<2Hz) use 400Hz, others use 300Hz
          carrierFreq = targetFrequencyHz < 2 ? 400 : 300;
          modulationDepth = targetFrequencyHz < 2 ? 80 : 60; // Modulate by +/-60-80Hz
        }

        const modulationFreq = targetFrequencyHz;

        // Create carrier oscillator at base frequency
        // Set phase to 0 to ensure smooth start and prevent clicks
        const carrier = new Tone.Oscillator({
          frequency: carrierFreq,
          type: 'sine',
          phase: 0
        });

        // Create gain for volume control - start at 0 for smooth fade-in
        const gain = new Tone.Gain(0);
        carrier.connect(gain);

        // Create panner for stereo positioning
        const panNode = new Tone.Panner(Math.max(-1, Math.min(1, pan)));
        gain.connect(panNode);
        panNode.connect(this.masterVolume);

        // Verify context is running before starting
        if (Tone.context.state !== 'running') {
          console.error('Cannot start carrier: Audio context not running!');
          throw new Error('Audio context must be running to play audio');
        }

        // Use proper Web Audio API scheduling for smooth fade-in
        const now = Tone.context.currentTime;
        // On Android, use slightly longer fade-in to prevent audio artifacts
        const fadeInDuration = isMobileApp() ? 0.4 : 0.3; // 400ms on mobile, 300ms on web

        // Ensure gain is explicitly 0 before starting to prevent pops
        gain.gain.cancelScheduledValues(now);
        gain.gain.setValueAtTime(0, now);

        // On Android, add a tiny delay before starting to ensure context is stable
        const startTime = isMobileApp() ? now + 0.01 : now;

        // Create LFO for frequency modulation
        // Tone.js LFO: frequency, min, max
        // Use a smoother LFO to prevent discontinuities that cause crackling
        const lfo = new Tone.LFO(modulationFreq, -modulationDepth, modulationDepth);
        lfo.type = 'sine';
        lfo.connect(carrier.frequency);

        // Start LFO slightly before carrier to ensure smooth modulation from the start
        // On Android, use a slightly longer pre-start delay for better stability
        const lfoPreStartDelay = isMobileApp() ? 0.01 : 0.005;
        const lfoStartTime = Math.max(0, startTime - lfoPreStartDelay);
        lfo.start(lfoStartTime);

        // On Android, add a small additional delay before starting carrier for extra stability
        const carrierStartTime = isMobileApp() ? startTime + 0.005 : startTime;
        carrier.start(carrierStartTime);

        // Smooth exponential fade-in (sounds more natural than linear)
        gain.gain.exponentialRampToValueAtTime(adjustedVolume, startTime + fadeInDuration);

        setTimeout(() => {
          if (carrier.state !== 'started') {
            console.error('Carrier oscillator failed to start! State:', carrier.state);
          }
        }, 100);

        console.log('Playing carrier frequency:', carrierFreq, 'Hz modulated by', modulationFreq, 'Hz (+/-', modulationDepth, 'Hz) at volume', adjustedVolume);
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
          pan: panNode,
          mode: 'fm-carrier'
        });
      } else if (this.isBrainwaveBeatFrequency(targetFrequencyHz)) {
        // Brainwave range (10-40Hz): generate true binaural beat.
        const beatFreq = targetFrequencyHz;
        const carrierFreq = this.getBinauralCarrierFrequency(beatFreq, headphoneQuality);

        // Create binaural beat: left and right differ by beatFreq
        const leftFreq = carrierFreq - beatFreq / 2;
        const rightFreq = carrierFreq + beatFreq / 2;

        // Ensure both are in audible range (20-20000 Hz)
        const safeLeftFreq = Math.max(20, Math.min(20000, leftFreq));
        const safeRightFreq = Math.max(20, Math.min(20000, rightFreq));

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

        // Keep binaural channels separated without hard-L/R lock for better speaker compatibility.
        const stereoPans = this.getStereoPans(pan);
        const leftPan = new Tone.Panner(stereoPans.left);
        const rightPan = new Tone.Panner(stereoPans.right);

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

        const now = Tone.context.currentTime;
        const fadeInDuration = isMobileApp() ? 0.4 : 0.3; // 400ms on mobile, 300ms on web

        leftGain.gain.cancelScheduledValues(now);
        rightGain.gain.cancelScheduledValues(now);
        leftGain.gain.setValueAtTime(0, now);
        rightGain.gain.setValueAtTime(0, now);

        const startTime = isMobileApp() ? now + 0.01 : now;
        leftOsc.start(startTime);
        rightOsc.start(startTime);

        leftGain.gain.exponentialRampToValueAtTime(adjustedVolume, startTime + fadeInDuration);
        rightGain.gain.exponentialRampToValueAtTime(adjustedVolume, startTime + fadeInDuration);

        setTimeout(() => {
          if (leftOsc.state !== 'started' || rightOsc.state !== 'started') {
            console.error('Oscillators failed to start! Left:', leftOsc.state, 'Right:', rightOsc.state);
          }
        }, 100);

        console.log('Playing binaural beat:', safeLeftFreq.toFixed(1), 'Hz /', safeRightFreq.toFixed(1), 'Hz (beat:', beatFreq.toFixed(1), 'Hz) at volume', adjustedVolume.toFixed(2));
        console.log('Left osc state:', leftOsc.state, 'Right osc state:', rightOsc.state);
        console.log('Left gain:', leftGain.gain.value, 'Right gain:', rightGain.gain.value);
        console.log('Master volume dB:', this.masterVolume.volume.value);
        console.log('Left frequency:', leftOsc.frequency.value, 'Right frequency:', rightOsc.frequency.value);
        console.log('Connection chain: osc -> gain -> pan -> masterVolume -> destination');

        this.activeOscillators.set(id, {
          left: leftOsc,
          right: rightOsc,
          gain: leftGain,
          rightGain,
          pan: leftPan,
          rightPan,
          mode: 'binaural'
        });
      } else {
        // Tonal range (>40Hz): play exact frequency to preserve frequency accuracy.
        const toneOsc = new Tone.Oscillator({
          frequency: targetFrequencyHz,
          type: 'sine',
          phase: 0
        });

        const gain = new Tone.Gain(0);
        toneOsc.connect(gain);

        const panNode = new Tone.Panner(Math.max(-1, Math.min(1, pan)));
        gain.connect(panNode);
        panNode.connect(this.masterVolume);

        if (Tone.context.state !== 'running') {
          console.error('Cannot start tone oscillator: Audio context not running!');
          throw new Error('Audio context must be running to play audio');
        }

        const now = Tone.context.currentTime;
        const fadeInDuration = isMobileApp() ? 0.4 : 0.3;
        gain.gain.cancelScheduledValues(now);
        gain.gain.setValueAtTime(0, now);

        const startTime = isMobileApp() ? now + 0.01 : now;
        toneOsc.start(startTime);
        gain.gain.exponentialRampToValueAtTime(adjustedVolume, startTime + fadeInDuration);

        setTimeout(() => {
          if (toneOsc.state !== 'started') {
            console.error('Tone oscillator failed to start! State:', toneOsc.state);
          }
        }, 100);

        console.log('Playing exact tone:', targetFrequencyHz.toFixed(2), 'Hz at volume', adjustedVolume.toFixed(2));
        console.log('Tone osc state:', toneOsc.state, 'Gain:', gain.gain.value);
        console.log('Master volume dB:', this.masterVolume.volume.value);
        console.log('Connection chain: tone -> gain -> pan -> masterVolume -> destination');

        this.activeOscillators.set(id, {
          left: toneOsc as any,
          right: toneOsc as any,
          carrier: toneOsc,
          gain,
          pan: panNode,
          mode: 'tone'
        });
      }

      return id;
    } catch (error) {
      console.error('Error playing frequency:', error);
      throw error;
    }
  }

  stopFrequency(id: string): void {
    // Check if this is a Gateway signal
    // Gateway signals have IDs like "gateway-{configId}-{timestamp}" or just start with "gateway-"
    if (id.startsWith('gateway-') || this.gatewayGenerator) {
      if (this.gatewayGenerator) {
        this.gatewayGenerator.stop();
        // Wait for fade-out to complete before disposing and disconnecting output nodes.
        setTimeout(() => {
          if (this.gatewayGenerator) {
            this.cleanupGatewayOutputNodes();
            this.gatewayGenerator.dispose();
            this.gatewayGenerator = null;
          }
        }, 650);
      }
      return;
    }

    const osc = this.activeOscillators.get(id);
    if (osc) {
      try {
        // Fade out smoothly to prevent clicks when stopping
        // On Android, use slightly longer fade-out to prevent audio artifacts
        const fadeOutDuration = isMobileApp() ? 0.4 : 0.3; // 400ms on mobile, 300ms on web
        
        // Cancel any existing scheduled values
        const now = Tone.context.currentTime;
        const stopTime = now + fadeOutDuration + 0.01; // Small buffer after fade
        
        if (osc.carrier) {
          // Carrier modulation - single gain
          const currentGain = Math.max(0.0001, osc.gain.gain.value); // Avoid zero for exponential
          osc.gain.gain.cancelScheduledValues(now);
          osc.gain.gain.setValueAtTime(currentGain, now);
          osc.gain.gain.exponentialRampToValueAtTime(0.0001, now + fadeOutDuration);
          // Stop after fade completes
          osc.carrier.stop(stopTime);
          if (osc.lfo) {
            osc.lfo.stop(stopTime);
          }
        } else {
          // Binaural beats - fade both gains
          const currentLeftGain = Math.max(0.0001, osc.gain.gain.value);
          const currentRightGain = osc.rightGain ? Math.max(0.0001, osc.rightGain.gain.value) : 0.0001;
          
          osc.gain.gain.cancelScheduledValues(now);
          osc.gain.gain.setValueAtTime(currentLeftGain, now);
          osc.gain.gain.exponentialRampToValueAtTime(0.0001, now + fadeOutDuration);
          
          if (osc.rightGain) {
            osc.rightGain.gain.cancelScheduledValues(now);
            osc.rightGain.gain.setValueAtTime(currentRightGain, now);
            osc.rightGain.gain.exponentialRampToValueAtTime(0.0001, now + fadeOutDuration);
          }
          
          // Stop oscillators after fade completes
          osc.left.stop(stopTime);
          if (osc.right) {
            osc.right.stop(stopTime);
          }
        }
        
        // Schedule cleanup after fade-out completes (oscillators already stopped with stopTime)
        setTimeout(() => {
          try {
            // Dispose of all nodes after fade-out completes
            const nodes = [osc.left, osc.right, osc.carrier, osc.lfo, osc.gain, osc.rightGain, osc.pan, osc.rightPan];
            const disposed = new Set();
            for (const node of nodes) {
              if (!node || disposed.has(node)) continue;
              disposed.add(node);
              (node as any).dispose?.();
            }
          } catch (error) {
            console.error('Error disposing oscillators:', error);
          }
        }, fadeOutDuration * 1000 + 50); // Wait for fade completion + buffer
      } catch (error) {
        console.error('Error stopping frequency:', error);
      }
      this.activeOscillators.delete(id);
    }
  }

  private async playGatewaySignal(config: ReturnType<typeof getGatewayConfig>, volume: number): Promise<string> {
    if (!config) {
      throw new Error('Gateway config not found');
    }

    // Ensure Tone.js context is initialized
    await this.ensureInitialized();

    // Stop any existing Gateway signal
    if (this.gatewayGenerator) {
      this.cleanupGatewayOutputNodes();
      this.gatewayGenerator.dispose();
      this.gatewayGenerator = null;
    }

    // Use Tone.js's underlying Web Audio API context
    // Tone.js uses Web Audio API, so we can access the raw context
    const toneContext = Tone.context;
    const webAudioContext = toneContext.rawContext as AudioContext;

    // Resume if suspended
    if (webAudioContext.state === 'suspended') {
      await webAudioContext.resume();
    }

    // Create Gateway signal generator using Tone.js's AudioContext
    this.gatewayGenerator = new GatewaySignalGenerator(webAudioContext);
    await this.gatewayGenerator.initialize(config);

    // Normalize complex layer stacks to preserve headroom and avoid intermittent clipping.
    const normalization = this.calculateGatewayNormalization(config);
    const clampedBaseVolume = Math.max(0.0001, Math.min(1, volume));
    const normalizedBaseVolume = clampedBaseVolume * normalization;

    // Create output chain for Gateway signals:
    // gatewayGain -> compressor -> limiter -> destination
    const gatewayGain = webAudioContext.createGain();
    const gatewayCompressor = webAudioContext.createDynamicsCompressor();
    const gatewayLimiter = webAudioContext.createDynamicsCompressor();

    gatewayCompressor.threshold.value = -18;
    gatewayCompressor.knee.value = 24;
    gatewayCompressor.ratio.value = 3;
    gatewayCompressor.attack.value = 0.003;
    gatewayCompressor.release.value = 0.2;

    gatewayLimiter.threshold.value = -1;
    gatewayLimiter.knee.value = 0;
    gatewayLimiter.ratio.value = 20;
    gatewayLimiter.attack.value = 0.001;
    gatewayLimiter.release.value = 0.05;

    const masterVol = this.masterVolume.volume.value;
    const masterVolLinear = Tone.dbToGain(masterVol);
    gatewayGain.gain.value = normalizedBaseVolume * masterVolLinear;
    
    // Connect: Gateway Generator -> Gateway Gain -> Compressor -> Limiter -> Destination
    this.gatewayGenerator.connect(gatewayGain);
    gatewayGain.connect(gatewayCompressor);
    gatewayCompressor.connect(gatewayLimiter);
    gatewayLimiter.connect(webAudioContext.destination);
    
    // Store gateway gain for volume updates
    (this.gatewayGenerator as any).gatewayGain = gatewayGain;
    (this.gatewayGenerator as any).baseVolume = normalizedBaseVolume;
    (this.gatewayGenerator as any).gatewayCompressor = gatewayCompressor;
    (this.gatewayGenerator as any).gatewayLimiter = gatewayLimiter;
    (this.gatewayGenerator as any).gatewayNormalization = normalization;

    // Start playing
    this.gatewayGenerator.start();

    console.log('Gateway signal started:', config.name, {
      carrierLayers: config.carrierLayers.length,
      isochronicLayers: config.isochronicLayers.length,
    });

    // Return a unique ID for Gateway signals
    return `gateway-${config.id}-${Date.now()}`;
  }

  async stopAll(): Promise<void> {
    // Stop Gateway generator first (if it exists)
    if (this.gatewayGenerator) {
      try {
        this.gatewayGenerator.stop();
        // Wait for fade-out to complete before disposing (300ms master fade + 300ms layer fade + 50ms buffer)
        await new Promise(resolve => setTimeout(resolve, 650));
        if (this.gatewayGenerator) {
          this.cleanupGatewayOutputNodes();
          this.gatewayGenerator.dispose();
          this.gatewayGenerator = null;
        }
      } catch (error) {
        console.error('Error stopping Gateway generator:', error);
        // Force cleanup even if there's an error
        if (this.gatewayGenerator) {
          try {
            this.cleanupGatewayOutputNodes();
            this.gatewayGenerator.dispose();
          } catch (e) {
            console.error('Error disposing Gateway generator:', e);
          }
          this.gatewayGenerator = null;
        }
      }
    }

    // Stop all Tone.js oscillators
    const oscillatorIds = Array.from(this.activeOscillators.keys());
    oscillatorIds.forEach((id) => {
      try {
        this.stopFrequency(id);
      } catch (error) {
        console.error(`Error stopping frequency ${id}:`, error);
      }
    });
    
    // Clear the map after stopping
    this.activeOscillators.clear();
    
    // Stop context monitoring if no audio is playing
    if (this.contextMonitorInterval !== null) {
      clearInterval(this.contextMonitorInterval);
      this.contextMonitorInterval = null;
    }
    
    // Wait for all fade-outs to complete (300ms fade + 50ms buffer)
    await new Promise(resolve => setTimeout(resolve, 350));
    
    console.log('All frequencies stopped successfully');
  }

  setVolume(id: string, volume: number): void {
    const osc = this.activeOscillators.get(id);
    if (osc) {
      const target = Math.max(0.0001, Math.min(1, volume));
      const now = Tone.context.currentTime;
      if (osc.carrier) {
        // Carrier modulation - smooth ramp to avoid zipper noise.
        osc.gain.gain.cancelScheduledValues(now);
        osc.gain.gain.setValueAtTime(Math.max(0.0001, osc.gain.gain.value), now);
        osc.gain.gain.exponentialRampToValueAtTime(target, now + 0.03);
      } else {
        // Binaural beats - update both left and right gains with a short ramp.
        osc.gain.gain.cancelScheduledValues(now);
        osc.gain.gain.setValueAtTime(Math.max(0.0001, osc.gain.gain.value), now);
        osc.gain.gain.exponentialRampToValueAtTime(target, now + 0.03);
        if (osc.rightGain) {
          osc.rightGain.gain.cancelScheduledValues(now);
          osc.rightGain.gain.setValueAtTime(Math.max(0.0001, osc.rightGain.gain.value), now);
          osc.rightGain.gain.exponentialRampToValueAtTime(target, now + 0.03);
        }
      }
    }
  }

  setPan(id: string, pan: number): void {
    const osc = this.activeOscillators.get(id);
    if (osc) {
      const clampedPan = Math.max(-1, Math.min(1, pan));
      if (osc.mode === 'binaural' && osc.rightPan) {
        const stereoPans = this.getStereoPans(clampedPan);
        osc.pan.pan.value = stereoPans.left;
        osc.rightPan.pan.value = stereoPans.right;
      } else {
        osc.pan.pan.value = clampedPan;
      }
    }
  }

  setMasterVolume(volume: number): void {
    // Convert 0-1 range to dB with full dynamic range.
    const clampedVolume = Math.max(0, Math.min(1, volume));
    const dbValue = clampedVolume > 0 ? Tone.gainToDb(clampedVolume) : -60;
    this.masterVolume.volume.value = dbValue;
    console.log('Master volume set to:', volume, '(', dbValue.toFixed(1), 'dB)');
    console.log('Master volume node connected:', this.masterVolume.volume.value, 'dB');

    // Also update Gateway generator volume if active
    if (this.gatewayGenerator) {
      const gatewayGain = (this.gatewayGenerator as any).gatewayGain;
      const baseVolume = (this.gatewayGenerator as any).baseVolume || 0.7;
      if (gatewayGain) {
        gatewayGain.gain.value = baseVolume * clampedVolume;
      }
    }
  }

  private calculateGatewayNormalization(config: NonNullable<ReturnType<typeof getGatewayConfig>>): number {
    const carrierPower = config.carrierLayers.reduce((sum, layer) => {
      // Each carrier layer has L/R oscillators.
      return sum + (layer.volume * layer.volume * 2);
    }, 0);
    const isochronicPower = config.isochronicLayers.reduce((sum, layer) => {
      return sum + (layer.volume * layer.volume);
    }, 0);
    const estimatedRms = Math.sqrt(carrierPower + isochronicPower);
    if (estimatedRms <= 0) {
      return 1;
    }
    // Target ~-6 dB headroom before output processing.
    return Math.min(1, 0.5 / estimatedRms);
  }

  private cleanupGatewayOutputNodes(): void {
    if (!this.gatewayGenerator) return;

    const gatewayGain = (this.gatewayGenerator as any).gatewayGain as GainNode | undefined;
    const gatewayCompressor = (this.gatewayGenerator as any).gatewayCompressor as DynamicsCompressorNode | undefined;
    const gatewayLimiter = (this.gatewayGenerator as any).gatewayLimiter as DynamicsCompressorNode | undefined;

    try {
      gatewayGain?.disconnect();
      gatewayCompressor?.disconnect();
      gatewayLimiter?.disconnect();
    } catch (error) {
      console.error('Error disconnecting Gateway output nodes:', error);
    }
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

  // Gateway layer volume control methods
  getGatewayConfig(): any {
    if (!this.gatewayGenerator) return null;
    return this.gatewayGenerator.getConfig();
  }

  getGatewayCarrierLayerCount(): number {
    if (!this.gatewayGenerator) return 0;
    return this.gatewayGenerator.getCarrierLayerCount();
  }

  getGatewayIsochronicLayerCount(): number {
    if (!this.gatewayGenerator) return 0;
    return this.gatewayGenerator.getIsochronicLayerCount();
  }

  getGatewayCarrierLayerVolume(index: number): number {
    if (!this.gatewayGenerator) return 0;
    return this.gatewayGenerator.getCarrierLayerVolume(index);
  }

  setGatewayCarrierLayerVolume(index: number, volume: number): void {
    if (!this.gatewayGenerator) return;
    this.gatewayGenerator.setCarrierLayerVolume(index, volume);
  }

  getGatewayIsochronicLayerVolume(index: number): number {
    if (!this.gatewayGenerator) return 0;
    return this.gatewayGenerator.getIsochronicLayerVolume(index);
  }

  setGatewayIsochronicLayerVolume(index: number, volume: number): void {
    if (!this.gatewayGenerator) return;
    this.gatewayGenerator.setIsochronicLayerVolume(index, volume);
  }

  resetGatewayLayerVolumes(): void {
    if (!this.gatewayGenerator) return;
    this.gatewayGenerator.resetToDefaults();
  }

  getGatewayAnalyser(): AnalyserNode | null {
    if (!this.gatewayGenerator) return null;
    return this.gatewayGenerator.getAnalyser();
  }
}

export const audioEngine = new AudioEngine();


