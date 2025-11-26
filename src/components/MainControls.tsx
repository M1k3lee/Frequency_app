import React from 'react';
import { Play, Pause } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { getFrequencyById } from '../data/frequencies';
import './MainControls.css';

const MainControls: React.FC = () => {
  const { isPlaying, setPlaying, stopAll, addFrequency } = useAppStore();

  const handlePlayPause = async () => {
    if (isPlaying) {
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
      <button
        className={`play-button ${isPlaying ? 'playing' : ''}`}
        onClick={handlePlayPause}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? <Pause size={48} /> : <Play size={48} />}
      </button>

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

