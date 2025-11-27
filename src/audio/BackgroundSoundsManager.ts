import * as Tone from 'tone';
import { BackgroundSound } from '../types';

class BackgroundSoundsManager {
  private activeSounds: Map<string, {
    player?: Tone.Player;
    noise?: Tone.Noise;
    filter?: Tone.Filter;
    lfo?: Tone.LFO;
    gain: Tone.Gain;
    reverb?: Tone.Reverb;
  }> = new Map();
  private isInitialized: boolean = false;

  async ensureInitialized(): Promise<void> {
    if (this.isInitialized) return;
    
    const currentState = Tone.context.state;
    if (currentState === 'suspended') {
      await Tone.context.resume();
    } else if (currentState !== 'running') {
      await Tone.start();
    }
    
    this.isInitialized = true;
  }

  async playSound(sound: BackgroundSound, volume: number = 0.3): Promise<string> {
    await this.ensureInitialized();
    
    const id = `${sound.id}-${Date.now()}`;
    
    try {
      // Create gain for volume control
      const gain = new Tone.Gain(0); // Start at 0 for fade-in
      
      // Create reverb for spa-like ambience
      const reverb = new Tone.Reverb(2); // 2 seconds of reverb
      reverb.wet.value = 0.3; // Set wet/dry mix
      await reverb.generate(); // Generate the reverb impulse response
      
      let source: Tone.ToneAudioNode;
      
      // Generate sounds programmatically based on category
      switch (sound.id) {
        case 'rain':
          // Rain using filtered noise
          const rainNoise = new Tone.Noise('pink');
          const rainFilter = new Tone.Filter({
            frequency: 1000,
            type: 'lowpass',
            Q: 1
          });
          rainNoise.connect(rainFilter);
          rainFilter.connect(gain);
          source = rainNoise;
          this.activeSounds.set(id, {
            noise: rainNoise,
            filter: rainFilter,
            gain,
            reverb
          });
          break;
          
        case 'ocean-waves':
          // Ocean waves using filtered noise with LFO
          const oceanNoise = new Tone.Noise('brown');
          const oceanFilter = new Tone.Filter({
            frequency: 800,
            type: 'lowpass',
            Q: 2
          });
          const oceanLFO = new Tone.LFO(0.1, 400, 1200).start();
          oceanLFO.connect(oceanFilter.frequency);
          oceanNoise.connect(oceanFilter);
          oceanFilter.connect(gain);
          source = oceanNoise;
          this.activeSounds.set(id, {
            noise: oceanNoise,
            filter: oceanFilter,
            lfo: oceanLFO,
            gain,
            reverb
          });
          break;
          
        case 'forest-birds':
          // Forest ambiance using multiple filtered noise sources
          const forestNoise = new Tone.Noise('pink');
          const forestFilter = new Tone.Filter({
            frequency: 2000,
            type: 'bandpass',
            Q: 3
          });
          forestNoise.connect(forestFilter);
          forestFilter.connect(gain);
          source = forestNoise;
          this.activeSounds.set(id, {
            noise: forestNoise,
            filter: forestFilter,
            gain,
            reverb
          });
          break;
          
        case 'white-noise':
          // White noise
          const whiteNoise = new Tone.Noise('white');
          whiteNoise.connect(gain);
          source = whiteNoise;
          this.activeSounds.set(id, {
            noise: whiteNoise,
            gain,
            reverb
          });
          break;
          
        case 'pink-noise':
          // Pink noise (more natural)
          const pinkNoise = new Tone.Noise('pink');
          pinkNoise.connect(gain);
          source = pinkNoise;
          this.activeSounds.set(id, {
            noise: pinkNoise,
            gain,
            reverb
          });
          break;
          
        case 'brown-noise':
          // Brown noise (deep, rumbling)
          const brownNoise = new Tone.Noise('brown');
          const brownFilter = new Tone.Filter({
            frequency: 500,
            type: 'lowpass',
            Q: 1
          });
          brownNoise.connect(brownFilter);
          brownFilter.connect(gain);
          source = brownNoise;
          this.activeSounds.set(id, {
            noise: brownNoise,
            filter: brownFilter,
            gain,
            reverb
          });
          break;
          
        case 'fireplace':
          // Fireplace crackling using filtered noise
          const fireNoise = new Tone.Noise('pink');
          const fireFilter = new Tone.Filter({
            frequency: 2000,
            type: 'bandpass',
            Q: 4
          });
          const fireLFO = new Tone.LFO(2, 1500, 2500).start();
          fireLFO.connect(fireFilter.frequency);
          fireNoise.connect(fireFilter);
          fireFilter.connect(gain);
          source = fireNoise;
          this.activeSounds.set(id, {
            noise: fireNoise,
            filter: fireFilter,
            lfo: fireLFO,
            gain,
            reverb
          });
          break;
          
        case 'wind':
          // Wind using filtered noise
          const windNoise = new Tone.Noise('pink');
          const windFilter = new Tone.Filter({
            frequency: 300,
            type: 'lowpass',
            Q: 0.5
          });
          const windLFO = new Tone.LFO(0.05, 200, 400).start();
          windLFO.connect(windFilter.frequency);
          windNoise.connect(windFilter);
          windFilter.connect(gain);
          source = windNoise;
          this.activeSounds.set(id, {
            noise: windNoise,
            filter: windFilter,
            lfo: windLFO,
            gain,
            reverb
          });
          break;
          
        default:
          // Default: pink noise
          const defaultNoise = new Tone.Noise('pink');
          defaultNoise.connect(gain);
          source = defaultNoise;
          this.activeSounds.set(id, {
            noise: defaultNoise,
            gain,
            reverb
          });
      }
      
      // Connect through reverb to master output
      gain.connect(reverb);
      reverb.connect(Tone.getDestination());
      
      // Start the source
      if (source instanceof Tone.Noise) {
        source.start();
      }
      
      // Fade in smoothly
      gain.gain.rampTo(volume, 0.5);
      
      console.log('Background sound playing:', sound.name, 'at volume', volume);
      
      return id;
    } catch (error) {
      console.error('Error playing background sound:', error);
      throw error;
    }
  }

  stopSound(id: string): void {
    const sound = this.activeSounds.get(id);
    if (sound) {
      try {
        // Fade out smoothly
        sound.gain.gain.rampTo(0, 0.3);
        
        setTimeout(() => {
          if (sound.lfo) {
            sound.lfo.stop();
            sound.lfo.dispose();
          }
          if (sound.noise) {
            sound.noise.stop();
            sound.noise.dispose();
          }
          if (sound.filter) {
            sound.filter.dispose();
          }
          if (sound.reverb) {
            sound.reverb.dispose();
          }
          sound.gain.dispose();
        }, 350);
      } catch (error) {
        console.error('Error stopping background sound:', error);
      }
      this.activeSounds.delete(id);
    }
  }

  stopAll(): void {
    this.activeSounds.forEach((_, id) => {
      this.stopSound(id);
    });
  }

  setVolume(id: string, volume: number): void {
    const sound = this.activeSounds.get(id);
    if (sound) {
      sound.gain.gain.rampTo(volume, 0.1);
    }
  }

  getActiveCount(): number {
    return this.activeSounds.size;
  }
}

export const backgroundSoundsManager = new BackgroundSoundsManager();

