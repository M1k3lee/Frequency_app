import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Frequency, ActiveFrequency, AudioMix, Playlist, VisualPreset, FrequencySequence, BackgroundSound, ActiveBackgroundSound } from '../types';
import { audioEngine } from '../audio/AudioEngine';
import { backgroundSoundsManager } from '../audio/BackgroundSoundsManager';
import { getFrequencyById } from '../data/frequencies';

interface AppState {
  // Audio state
  currentFrequencies: Map<string, ActiveFrequency>;
  isPlaying: boolean;
  masterVolume: number;
  
  // Background sounds
  currentBackgroundSounds: Map<string, ActiveBackgroundSound>;
  backgroundSoundVolume: number;
  showBackgroundSounds: boolean;
  
  // UI state
  showAdvanced: boolean;
  showGateway: boolean;
  showBreathing: boolean;
  currentVisual: VisualPreset;
  
  // Timer
  playbackTimer: number | null; // in seconds
  playbackTimerRemaining: number | null;
  isTimerActive: boolean;
  
  // Saved data
  savedPlaylists: Playlist[];
  savedMixes: AudioMix[];
  savedSequences: FrequencySequence[];
  
  // Sequence playback
  currentSequence: FrequencySequence | null;
  currentSequenceStep: number;
  sequenceTimer: NodeJS.Timeout | null;
  
  // Actions
  addFrequency: (frequency: Frequency, volume?: number, pan?: number) => Promise<void>;
  removeFrequency: (id: string) => void;
  updateFrequency: (id: string, updates: Partial<ActiveFrequency>) => void;
  stopAll: () => void;
  setPlaying: (playing: boolean) => void;
  setMasterVolume: (volume: number) => void;
  addBackgroundSound: (sound: BackgroundSound, volume?: number) => Promise<void>;
  removeBackgroundSound: (id: string) => void;
  setBackgroundSoundVolume: (id: string, volume: number) => void;
  stopAllBackgroundSounds: () => void;
  setShowBackgroundSounds: (show: boolean) => void;
  setShowAdvanced: (show: boolean) => void;
  setShowGateway: (show: boolean) => void;
  setShowBreathing: (show: boolean) => void;
  setCurrentVisual: (visual: VisualPreset) => void;
  setPlaybackTimer: (seconds: number | null) => void;
  setPlaybackTimerRemaining: (seconds: number | null | ((prev: number | null) => number | null)) => void;
  setIsTimerActive: (active: boolean) => void;
  saveToPlaylist: (name: string, frequencyIds: string[]) => void;
  removePlaylist: (id: string) => void;
  saveMix: (mix: Omit<AudioMix, 'id' | 'createdAt'>) => void;
  loadMix: (id: string) => void;
  removeMix: (id: string) => void;
  saveSequence: (sequence: Omit<FrequencySequence, 'id' | 'createdAt'>) => void;
  playSequence: (sequence: FrequencySequence) => Promise<void>;
  removeSequence: (id: string) => void;
  stopSequence: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentFrequencies: new Map(),
      isPlaying: false,
      masterVolume: 0.7,
      currentBackgroundSounds: new Map(),
      backgroundSoundVolume: 0.3,
      showBackgroundSounds: false,
      showAdvanced: false,
      showGateway: false,
      showBreathing: false,
      currentVisual: 'starlit-void',
      playbackTimer: null,
      playbackTimerRemaining: null,
      isTimerActive: false,
      savedPlaylists: [],
      savedMixes: [],
      savedSequences: [],
      currentSequence: null,
      currentSequenceStep: 0,
      sequenceTimer: null,

      // Initialize audio engine
      addFrequency: async (frequency: Frequency, volume: number = 0.7, pan: number = 0) => {
        try {
          if (!audioEngine) {
            console.error('Audio engine not initialized');
            return;
          }

          // Prevent duplicate playback - check if this frequency is already playing
          const state = get();
          const alreadyPlaying = Array.from(state.currentFrequencies.values()).some(
            (f) => f.frequencyId === frequency.id && f.enabled
          );
          
          if (alreadyPlaying) {
            console.log('Frequency already playing, skipping duplicate:', frequency.name);
            return;
          }

          // Ensure audio engine is initialized and context is running
          if (!audioEngine.isReadyForPlayback()) {
            await audioEngine.initialize();
          }
          
          // Force audio context resume if needed (for Chrome autoplay policy)
          // This is especially important when playing from modals/overlays
          // Audio context is managed by AudioEngine, so we rely on ensureInitialized
          // which is called by addFrequency in the audioEngine
          
          const id = await audioEngine.playFrequency(frequency, volume, pan);
          
          // Set master volume after first frequency is added
          const currentMasterVolume = get().masterVolume;
          audioEngine.setMasterVolume(currentMasterVolume);
          
          console.log('Frequency playing:', frequency.name, 'at', volume, 'volume, master:', currentMasterVolume);
          
          const activeFreq: ActiveFrequency = {
            id,
            frequencyId: frequency.id,
            volume,
            pan,
            enabled: true
          };

          set((state) => {
            const newFrequencies = new Map(state.currentFrequencies);
            newFrequencies.set(id, activeFreq);
            return {
              currentFrequencies: newFrequencies,
              isPlaying: true
            };
          });
        } catch (error) {
          console.error('Error adding frequency:', error);
        }
      },

      removeFrequency: (id: string) => {
        audioEngine?.stopFrequency(id);
        set((state) => {
          const newFrequencies = new Map(state.currentFrequencies);
          newFrequencies.delete(id);
          return {
            currentFrequencies: newFrequencies,
            isPlaying: newFrequencies.size > 0 ? state.isPlaying : false
          };
        });
      },

      updateFrequency: (id: string, updates: Partial<ActiveFrequency>) => {
        set((state) => {
          const freq = state.currentFrequencies.get(id);
          if (!freq) return state;

          const updated = { ...freq, ...updates };
          const newFrequencies = new Map(state.currentFrequencies);
          newFrequencies.set(id, updated);

          if (updates.volume !== undefined) {
            audioEngine?.setVolume(id, updates.volume);
          }
          if (updates.pan !== undefined) {
            audioEngine?.setPan(id, updates.pan);
          }
          if (updates.enabled !== undefined) {
            if (!updates.enabled) {
              audioEngine?.stopFrequency(id);
            } else {
              const frequency = getFrequencyById(freq.frequencyId);
              if (frequency) {
                get().addFrequency(frequency, updated.volume, updated.pan);
              }
            }
          }

          return { currentFrequencies: newFrequencies };
        });
      },

      stopAll: () => {
        audioEngine?.stopAll();
        set({
          currentFrequencies: new Map(),
          isPlaying: false,
          isTimerActive: false,
          playbackTimerRemaining: null
        });
        console.log('All frequencies stopped');
      },

      addBackgroundSound: async (sound: BackgroundSound, volume: number = 0.3) => {
        try {
          const state = get();
          // Check if already playing
          const alreadyPlaying = Array.from(state.currentBackgroundSounds.values()).some(
            (s) => s.soundId === sound.id && s.enabled
          );
          
          if (alreadyPlaying) {
            console.log('Background sound already playing:', sound.name);
            return;
          }

          const id = await backgroundSoundsManager.playSound(sound, volume);
          
          const activeSound: ActiveBackgroundSound = {
            id,
            soundId: sound.id,
            volume,
            enabled: true
          };

          set((state) => {
            const newSounds = new Map(state.currentBackgroundSounds);
            newSounds.set(id, activeSound);
            return { currentBackgroundSounds: newSounds };
          });
        } catch (error) {
          console.error('Error adding background sound:', error);
        }
      },

      removeBackgroundSound: (id: string) => {
        backgroundSoundsManager?.stopSound(id);
        set((state) => {
          const newSounds = new Map(state.currentBackgroundSounds);
          newSounds.delete(id);
          return { currentBackgroundSounds: newSounds };
        });
      },

      setBackgroundSoundVolume: (id: string, volume: number) => {
        backgroundSoundsManager?.setVolume(id, volume);
        set((state) => {
          const sound = state.currentBackgroundSounds.get(id);
          if (sound) {
            const updated = { ...sound, volume };
            const newSounds = new Map(state.currentBackgroundSounds);
            newSounds.set(id, updated);
            return { currentBackgroundSounds: newSounds };
          }
          return state;
        });
      },

      stopAllBackgroundSounds: () => {
        backgroundSoundsManager?.stopAll();
        set({ currentBackgroundSounds: new Map() });
      },

      setShowBackgroundSounds: (show: boolean) => {
        set({ showBackgroundSounds: show });
      },

      setPlaying: (playing: boolean) => {
        set({ isPlaying: playing });
      },

      setMasterVolume: (volume: number) => {
        audioEngine?.setMasterVolume(volume);
        set({ masterVolume: volume });
      },

      setShowAdvanced: (show: boolean) => {
        set({ showAdvanced: show, showGateway: false, showBreathing: false });
      },

      setShowGateway: (show: boolean) => {
        set({ showGateway: show, showAdvanced: false, showBreathing: false });
      },

      setShowBreathing: (show: boolean) => {
        set({ showBreathing: show, showAdvanced: false, showGateway: false });
      },

      setCurrentVisual: (visual: VisualPreset) => {
        set({ currentVisual: visual });
      },

      setPlaybackTimer: (seconds: number | null) => {
        set({ playbackTimer: seconds, playbackTimerRemaining: seconds });
      },

      setPlaybackTimerRemaining: (seconds: number | null | ((prev: number | null) => number | null)) => {
        if (typeof seconds === 'function') {
          set((state) => ({ playbackTimerRemaining: seconds(state.playbackTimerRemaining) }));
        } else {
          set({ playbackTimerRemaining: seconds });
        }
      },

      setIsTimerActive: (active: boolean) => {
        set({ isTimerActive: active });
      },

      saveToPlaylist: (name: string, frequencyIds: string[]) => {
        const playlist: Playlist = {
          id: `playlist-${Date.now()}`,
          name,
          frequencyIds,
          createdAt: Date.now()
        };
        set((state) => ({
          savedPlaylists: [...state.savedPlaylists, playlist]
        }));
      },

      removePlaylist: (id: string) => {
        set((state) => ({
          savedPlaylists: state.savedPlaylists.filter(p => p.id !== id)
        }));
      },

      saveMix: (mix: Omit<AudioMix, 'id' | 'createdAt'>) => {
        const audioMix: AudioMix = {
          ...mix,
          id: `mix-${Date.now()}`,
          createdAt: Date.now()
        };
        set((state) => ({
          savedMixes: [...state.savedMixes, audioMix]
        }));
      },

      loadMix: (id: string) => {
        const state = get();
        const mix = state.savedMixes.find(m => m.id === id);
        if (!mix) return;

        state.stopAll();
        
        mix.frequencies.forEach(async (freq) => {
          if (freq.enabled) {
            const frequency = getFrequencyById(freq.frequencyId);
            if (frequency) {
              await state.addFrequency(frequency, freq.volume, freq.pan);
            }
          }
        });

        state.setMasterVolume(mix.masterVolume);
      },

      removeMix: (id: string) => {
        set((state) => ({
          savedMixes: state.savedMixes.filter(m => m.id !== id)
        }));
      },

      saveSequence: (sequence: Omit<FrequencySequence, 'id' | 'createdAt'>) => {
        const freqSequence: FrequencySequence = {
          ...sequence,
          id: `seq-${Date.now()}`,
          createdAt: Date.now()
        };
        set((state) => ({
          savedSequences: [...state.savedSequences, freqSequence]
        }));
      },

      loadSequence: (id: string) => {
        const state = get();
        const sequence = state.savedSequences.find(s => s.id === id);
        if (sequence) {
          set({ currentSequence: sequence, currentSequenceStep: 0 });
        }
      },

      removeSequence: (id: string) => {
        set((state) => ({
          savedSequences: state.savedSequences.filter(s => s.id !== id)
        }));
      },

      playSequence: async (sequence: FrequencySequence) => {
        const state = get();
        state.stopAll();
        state.stopSequence();
        
        set({ 
          currentSequence: sequence, 
          currentSequenceStep: 0,
          isPlaying: true 
        });

        // Start playing the sequence
        const playStep = async (stepIndex: number) => {
          if (stepIndex >= sequence.steps.length) {
            // Sequence complete
            state.stopAll();
            set({ currentSequence: null, currentSequenceStep: 0, isPlaying: false });
            return;
          }

          const step = sequence.steps[stepIndex];
          const frequency = getFrequencyById(step.frequencyId);
          
          if (!frequency) {
            // Skip invalid frequency, move to next
            playStep(stepIndex + 1);
            return;
          }

          // Stop all and play this frequency
          state.stopAll();
          await state.addFrequency(frequency, step.volume || 0.7, step.pan || 0);
          
          set({ currentSequenceStep: stepIndex });

          // Schedule next step
          const durationMs = step.duration * 60 * 1000; // Convert minutes to ms
          const fadeDuration = (sequence.fadeDuration || 5) * 1000; // Default 5 second fade
          
          const timer = setTimeout(() => {
            // Fade out current frequency
            if (stepIndex < sequence.steps.length - 1) {
              // Fade out before next step
              const fadeSteps = 20;
              const fadeInterval = fadeDuration / fadeSteps;
              let fadeStep = 0;
              
              const fadeTimer = setInterval(() => {
                const currentFreqs = get().currentFrequencies;
                currentFreqs.forEach((freq) => {
                  const newVolume = freq.volume * (1 - fadeStep / fadeSteps);
                  state.updateFrequency(freq.id, { volume: newVolume });
                });
                
                fadeStep++;
                if (fadeStep >= fadeSteps) {
                  clearInterval(fadeTimer);
                  state.stopAll();
                  // Start next step
                  playStep(stepIndex + 1);
                }
              }, fadeInterval);
            } else {
              // Last step, just stop
              state.stopAll();
              set({ currentSequence: null, currentSequenceStep: 0, isPlaying: false });
            }
          }, durationMs);

          set({ sequenceTimer: timer as any });
        };

        // Start first step
        await playStep(0);
      },

      stopSequence: () => {
        const state = get();
        if (state.sequenceTimer) {
          clearTimeout(state.sequenceTimer);
        }
        set({ 
          currentSequence: null, 
          currentSequenceStep: 0, 
          sequenceTimer: null 
        });
      }
    }),
    {
      name: 'frequency-zen-storage',
      partialize: (state) => ({
        masterVolume: state.masterVolume,
        showAdvanced: state.showAdvanced,
        currentVisual: state.currentVisual,
        savedPlaylists: state.savedPlaylists,
        savedMixes: state.savedMixes,
        savedSequences: state.savedSequences
      })
    }
  )
);

