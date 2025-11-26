import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Frequency, ActiveFrequency, AudioMix, Playlist, VisualPreset } from '../types';
import { audioEngine } from '../audio/AudioEngine';
import { getFrequencyById } from '../data/frequencies';

interface AppState {
  // Audio state
  currentFrequencies: Map<string, ActiveFrequency>;
  isPlaying: boolean;
  masterVolume: number;
  
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
  
  // Actions
  addFrequency: (frequency: Frequency, volume?: number, pan?: number) => Promise<void>;
  removeFrequency: (id: string) => void;
  updateFrequency: (id: string, updates: Partial<ActiveFrequency>) => void;
  stopAll: () => void;
  setPlaying: (playing: boolean) => void;
  setMasterVolume: (volume: number) => void;
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
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentFrequencies: new Map(),
      isPlaying: false,
      masterVolume: 0.7,
      showAdvanced: false,
      showGateway: false,
      showBreathing: false,
      currentVisual: 'starlit-void',
      playbackTimer: null,
      playbackTimerRemaining: null,
      isTimerActive: false,
      savedPlaylists: [],
      savedMixes: [],

      // Initialize audio engine
      addFrequency: async (frequency: Frequency, volume: number = 0.7, pan: number = 0) => {
        try {
          if (!audioEngine) {
            console.error('Audio engine not initialized');
            return;
          }

          // Ensure audio engine is initialized
          if (!audioEngine.isReadyForPlayback()) {
            await audioEngine.initialize();
          }
          
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
      }
    }),
    {
      name: 'frequency-zen-storage',
      partialize: (state) => ({
        masterVolume: state.masterVolume,
        showAdvanced: state.showAdvanced,
        currentVisual: state.currentVisual,
        savedPlaylists: state.savedPlaylists,
        savedMixes: state.savedMixes
      })
    }
  )
);

