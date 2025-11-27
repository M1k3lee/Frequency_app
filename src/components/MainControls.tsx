import React from 'react';
import { Play, Pause } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { getFrequencyById } from '../data/frequencies';
import './MainControls.css';

const MainControls: React.FC = () => {
  const { isPlaying, setPlaying, stopAll, addFrequency, currentFrequencies } = useAppStore();

  // Get currently playing frequency
  const getCurrentPlayingFrequency = () => {
    if (currentFrequencies.size === 0) return null;
    const activeFreq = Array.from(currentFrequencies.values())[0];
    if (activeFreq && activeFreq.enabled) {
      return getFrequencyById(activeFreq.frequencyId);
    }
    return null;
  };

  const currentPlayingFreq = getCurrentPlayingFrequency();
  const actuallyPlaying = currentFrequencies.size > 0 && isPlaying;

  const handlePlayPause = async () => {
    if (actuallyPlaying) {
      // Pause - stop all frequencies
      stopAll();
      setPlaying(false);
    } else {
      // Quick start with a default frequency
      const defaultFreq = getFrequencyById('alpha-10');
      if (defaultFreq) {
        await addFrequency(defaultFreq);
        setPlaying(true);
      }
    }
  };

  const quickPresets = [
    { id: 'theta-4.5', label: 'Deep Meditation' },
    { id: 'alpha-10', label: 'Relaxation' },
    { id: 'beta-15', label: 'Focus' },
    { id: 'delta-1.5', label: 'Sleep' }
  ];

  const handleQuickSelect = async (freqId: string) => {
    stopAll();
    const freq = getFrequencyById(freqId);
    if (freq) {
      await addFrequency(freq);
      setPlaying(true);
    }
  };

  return (
    <div className="main-controls">
      <div className="play-control-group">
        <button
          className={`play-button ${actuallyPlaying ? 'playing' : ''}`}
          onClick={handlePlayPause}
          aria-label={actuallyPlaying ? 'Pause' : 'Play'}
        >
          {actuallyPlaying ? <Pause size={48} /> : <Play size={48} />}
        </button>
        
        {currentPlayingFreq && (
          <div className="current-frequency-info-main">
            <div className="current-freq-name-main">
              <span className="freq-name-main">{currentPlayingFreq.name}</span>
              <span className="freq-value-main">{currentPlayingFreq.frequency} Hz</span>
            </div>
          </div>
        )}
      </div>

      <div className="quick-presets">
        <h3>Quick Start</h3>
        <div className="preset-buttons">
          {quickPresets.map((preset) => (
            <button
              key={preset.id}
              className="preset-btn"
              onClick={() => handleQuickSelect(preset.id)}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainControls;

