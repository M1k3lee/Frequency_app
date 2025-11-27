import React from 'react';
import { Music, ChevronDown, ChevronUp, Volume2, X } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { backgroundSounds } from '../data/backgroundSounds';
import { getBackgroundSoundById } from '../data/backgroundSounds';
import './BackgroundSounds.css';

const BackgroundSounds: React.FC = () => {
  const {
    showBackgroundSounds,
    setShowBackgroundSounds,
    currentBackgroundSounds,
    addBackgroundSound,
    removeBackgroundSound,
    setBackgroundSoundVolume,
    stopAllBackgroundSounds
  } = useAppStore();

  const isSoundPlaying = (soundId: string): boolean => {
    return Array.from(currentBackgroundSounds.values()).some(
      (s) => s.soundId === soundId && s.enabled
    );
  };

  const getActiveSoundId = (soundId: string): string | null => {
    const active = Array.from(currentBackgroundSounds.values()).find(
      (s) => s.soundId === soundId && s.enabled
    );
    return active ? active.id : null;
  };

  const handleToggleSound = async (soundId: string) => {
    if (isSoundPlaying(soundId)) {
      const activeId = getActiveSoundId(soundId);
      if (activeId) {
        removeBackgroundSound(activeId);
      }
    } else {
      const sound = getBackgroundSoundById(soundId);
      if (sound) {
        await addBackgroundSound(sound, 0.3);
      }
    }
  };

  const getSoundVolume = (soundId: string): number => {
    const active = Array.from(currentBackgroundSounds.values()).find(
      (s) => s.soundId === soundId && s.enabled
    );
    return active ? active.volume : 0.3;
  };

  const handleVolumeChange = (soundId: string, volume: number) => {
    const activeId = getActiveSoundId(soundId);
    if (activeId) {
      setBackgroundSoundVolume(activeId, volume);
    }
  };

  // Group sounds by category
  const soundsByCategory = backgroundSounds.reduce((acc, sound) => {
    if (!acc[sound.category]) {
      acc[sound.category] = [];
    }
    acc[sound.category].push(sound);
    return acc;
  }, {} as Record<string, typeof backgroundSounds>);

  const categoryLabels: Record<string, string> = {
    nature: 'Nature',
    spa: 'Spa & Relaxation',
    noise: 'Noise Colors',
    ambient: 'Ambient'
  };

  return (
    <div className="background-sounds-section">
      <button
        className="background-sounds-toggle"
        onClick={() => setShowBackgroundSounds(!showBackgroundSounds)}
        aria-label={showBackgroundSounds ? 'Hide background sounds' : 'Show background sounds'}
      >
        <Music size={20} />
        <span>Background Sounds</span>
        {showBackgroundSounds ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {showBackgroundSounds && (
        <div className="background-sounds-content">
          <div className="background-sounds-header">
            <h3>Ambient Background Sounds</h3>
            <p className="background-sounds-description">
              Add relaxing ambient sounds to complement your frequency tones
            </p>
            {currentBackgroundSounds.size > 0 && (
              <button
                className="stop-all-sounds-btn"
                onClick={stopAllBackgroundSounds}
                aria-label="Stop all background sounds"
              >
                <X size={16} />
                Stop All
              </button>
            )}
          </div>

          <div className="background-sounds-grid">
            {Object.entries(soundsByCategory).map(([category, sounds]) => (
              <div key={category} className="sound-category">
                <h4 className="category-title">{categoryLabels[category] || category}</h4>
                <div className="sounds-list">
                  {sounds.map((sound) => {
                    const playing = isSoundPlaying(sound.id);
                    const volume = getSoundVolume(sound.id);
                    
                    return (
                      <div
                        key={sound.id}
                        className={`sound-item ${playing ? 'playing' : ''}`}
                      >
                        <div className="sound-item-header">
                          <button
                            className="sound-play-btn"
                            onClick={() => handleToggleSound(sound.id)}
                            aria-label={playing ? `Stop ${sound.name}` : `Play ${sound.name}`}
                          >
                            <span className="sound-icon">{sound.icon || '🎵'}</span>
                            <div className="sound-info">
                              <span className="sound-name">{sound.name}</span>
                              <span className="sound-description">{sound.description}</span>
                            </div>
                          </button>
                        </div>
                        
                        {playing && (
                          <div className="sound-controls">
                            <Volume2 size={14} />
                            <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.01"
                              value={volume}
                              onChange={(e) => handleVolumeChange(sound.id, parseFloat(e.target.value))}
                              className="sound-volume-slider"
                              aria-label={`${sound.name} volume`}
                            />
                            <span className="sound-volume-value">
                              {Math.round(volume * 100)}%
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BackgroundSounds;

