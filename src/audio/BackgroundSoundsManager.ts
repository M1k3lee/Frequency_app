import * as Tone from 'tone';
import { BackgroundSound } from '../types';
import { isMobileApp } from '../utils/isMobileApp';

class BackgroundSoundsManager {
  private activeSounds: Map<string, {
    player?: Tone.Player;
    noise?: Tone.Noise;
    filter?: Tone.Filter;
    lfo?: Tone.LFO;
    gain: Tone.Gain;
  }> = new Map();
  private isInitialized: boolean = false;
  private sharedReverb: Tone.Reverb | null = null;

  private async getSharedReverb(): Promise<Tone.Reverb> {
    if (this.sharedReverb) {
      return this.sharedReverb;
    }

    const reverb = new Tone.Reverb(2);
    reverb.wet.value = 0.3;
    await reverb.generate();
    reverb.connect(Tone.getDestination());
    this.sharedReverb = reverb;
    return reverb;
  }

  async ensureInitialized(): Promise<void> {
    if (this.isInitialized) return;
    
    const isMobile = isMobileApp();
    const currentState = Tone.context.state;
    
    // On Android, add a small delay to ensure WebView audio context is ready
    if (isMobile && currentState !== 'running') {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    if (currentState === 'suspended') {
      await Tone.context.resume();
      // On Android, wait a bit longer after resume to ensure it's stable
      if (isMobile) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } else if (currentState !== 'running') {
      await Tone.start();
      // On Android, wait after start to ensure stability
      if (isMobile) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    this.isInitialized = true;
  }

  async playSound(sound: BackgroundSound, volume: number = 0.3): Promise<string> {
    await this.ensureInitialized();
    
    const id = `${sound.id}-${Date.now()}`;
    
    try {
      // Create gain for volume control
      const gain = new Tone.Gain(0); // Start at 0 for fade-in
      const reverb = await this.getSharedReverb();
      
      let source: Tone.ToneAudioNode;
      
      // Check if sound has an MP3 file - play it if available
      if (sound.file) {
        // Use relative path for mobile apps (offline support), absolute path for web
        const filePath = isMobileApp() ? `./sounds/${sound.file}` : `/sounds/${sound.file}`;
        console.log('Loading background sound:', sound.name, 'from', filePath, '(mobile:', isMobileApp(), ')');
        
        // Create player and load the file
        const player = new Tone.Player();
        player.loop = true;
        player.autostart = false;
        
        // Load the audio file and wait for it to be ready
        try {
          await player.load(filePath);
          console.log('Background sound loaded successfully:', sound.name);
        } catch (error) {
          console.error('Error loading background sound file:', sound.name, filePath, error);
          throw new Error(`Failed to load audio file: ${sound.file}. Please check the file path and ensure the file exists.`);
        }
        
        // Verify the player is loaded before connecting
        if (!player.loaded) {
          throw new Error(`Audio file loaded but player not ready: ${sound.file}`);
        }
        
        player.connect(gain);
        source = player;
        this.activeSounds.set(id, {
          player,
          gain
        });
      } else {
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
            gain
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
            gain
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
            gain
          });
          break;
          
        case 'white-noise':
          // White noise
          const whiteNoise = new Tone.Noise('white');
          whiteNoise.connect(gain);
          source = whiteNoise;
          this.activeSounds.set(id, {
            noise: whiteNoise,
            gain
          });
          break;
          
        case 'pink-noise':
          // Pink noise (more natural)
          const pinkNoise = new Tone.Noise('pink');
          pinkNoise.connect(gain);
          source = pinkNoise;
          this.activeSounds.set(id, {
            noise: pinkNoise,
            gain
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
            gain
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
            gain
          });
          break;
          
        default:
          // Default: pink noise
          const defaultNoise = new Tone.Noise('pink');
          defaultNoise.connect(gain);
          source = defaultNoise;
          this.activeSounds.set(id, {
            noise: defaultNoise,
            gain
          });
        }
      }
      
      // Connect through reverb to master output
      gain.connect(reverb);
      
      // Start the source
      if (source instanceof Tone.Noise) {
        source.start();
      } else if (source instanceof Tone.Player) {
        // Player is already loaded, just start it
        source.start();
        console.log('Background sound player started:', sound.name);
      }
      
      // Fade in smoothly (longer on Android to prevent artifacts)
      const now = Tone.context.currentTime;
      const fadeInDuration = isMobileApp() ? 0.4 : 0.3; // 400ms on mobile, 300ms on web
      const startTime = isMobileApp() ? now + 0.01 : now; // Small delay on Android
      
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(volume, startTime + fadeInDuration);
      
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
        // Fade out smoothly (300ms for smooth stop)
        const now = Tone.context.currentTime;
        const currentGain = Math.max(0.0001, sound.gain.gain.value);
        sound.gain.gain.cancelScheduledValues(now);
        sound.gain.gain.setValueAtTime(currentGain, now);
        sound.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
        
        setTimeout(() => {
          if (sound.player) {
            sound.player.stop();
            sound.player.dispose();
          }
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
      const now = Tone.context.currentTime;
      const currentGain = Math.max(0.0001, sound.gain.gain.value);
      const targetGain = Math.max(0.0001, volume);
      sound.gain.gain.cancelScheduledValues(now);
      sound.gain.gain.setValueAtTime(currentGain, now);
      sound.gain.gain.exponentialRampToValueAtTime(targetGain, now + 0.1);
    }
  }

  getActiveCount(): number {
    return this.activeSounds.size;
  }
}

export const backgroundSoundsManager = new BackgroundSoundsManager();
