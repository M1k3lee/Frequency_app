import React, { useState } from 'react';
import { Play, Pause, Volume2, Settings, Zap, Wind, Moon, Brain, Eye, EyeOff } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { getFrequencyById, frequencies } from '../data/frequencies';
import './HeroSection.css';

const HeroSection: React.FC = () => {
  const {
    isPlaying,
    masterVolume,
    currentVisual,
    setPlaying,
    setMasterVolume,
    stopAll,
    addFrequency,
    setCurrentVisual,
    setShowAdvanced,
    setShowGateway,
    setShowBreathing
  } = useAppStore();

  const [selectedFreq, setSelectedFreq] = useState('');
  const [showVisuals, setShowVisuals] = useState(true);

  const modes = [
    { id: 'focus', label: 'Focus', icon: Brain, freqId: 'beta-15' },
    { id: 'relax', label: 'Relax', icon: Wind, freqId: 'alpha-10' },
    { id: 'sleep', label: 'Sleep', icon: Moon, freqId: 'delta-1.5' },
    { id: 'energy', label: 'Energy', icon: Zap, freqId: 'beta-20' }
  ];

  const visualizers = [
    { id: 'starlit-void', label: 'Starlit Void' },
    { id: 'flowing-energy', label: 'Flowing Energy' },
    { id: 'mandala', label: 'Mandala' },
    { id: 'gateway-portal', label: 'Gateway Portal' },
    { id: 'breathing-orb', label: 'Breathing Orb' }
  ];

  const handlePlayPause = async () => {
    if (isPlaying) {
      stopAll();
      setPlaying(false);
    } else {
      // Start with default alpha frequency
      const defaultFreq = getFrequencyById('alpha-10');
      if (defaultFreq) {
        await addFrequency(defaultFreq);
        setPlaying(true);
      }
    }
  };

  const handleModeSelect = async (freqId: string) => {
    stopAll();
    const freq = getFrequencyById(freqId);
    if (freq) {
      await addFrequency(freq);
      setPlaying(true);
    }
  };

  const handleFrequencySelect = async (freqId?: string) => {
    const idToUse = freqId || selectedFreq;
    if (!idToUse) return;
    stopAll();
    const freq = getFrequencyById(idToUse);
    if (freq) {
      await addFrequency(freq);
      setPlaying(true);
    }
  };

  const toggleVisuals = () => {
    setShowVisuals(!showVisuals);
    setCurrentVisual(!showVisuals ? 'starlit-void' : 'none');
  };

  return (
    <div className="hero-section">
      <div className="hero-card">
        {/* Playback and Volume Controls */}
        <div className="playback-controls">
          <button
            className={`play-button ${isPlaying ? 'playing' : ''}`}
            onClick={handlePlayPause}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          
          <div className="volume-control">
            <Volume2 size={18} />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={masterVolume}
              onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
              className="volume-slider"
            />
            <span className="volume-value">{Math.round(masterVolume * 100)}%</span>
          </div>
        </div>

        {/* Mode Selection */}
        <div className="mode-selection">
          {modes.map((mode) => {
            const Icon = mode.icon;
            return (
              <button
                key={mode.id}
                className="mode-btn"
                onClick={() => handleModeSelect(mode.freqId)}
              >
                <Icon size={24} />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>

        {/* Frequency Selection */}
        <div className="frequency-selector">
          <select
            value={selectedFreq}
            onChange={(e) => {
              setSelectedFreq(e.target.value);
              if (e.target.value) {
                handleFrequencySelect();
              }
            }}
            className="frequency-dropdown"
          >
            <option value="">Select a frequency...</option>
            {frequencies.map(freq => (
              <option key={freq.id} value={freq.id}>
                {freq.name} ({freq.frequency} Hz)
              </option>
            ))}
          </select>
        </div>

        {/* Advanced Options */}
        <div className="advanced-options">
          <button 
            className="option-btn"
            onClick={() => setShowAdvanced(true)}
          >
            <Settings size={18} />
            <span>Advanced</span>
          </button>
          <button 
            className="option-btn"
            onClick={() => setShowGateway(true)}
          >
            <Zap size={18} />
            <span>Gateway</span>
          </button>
          <button 
            className="option-btn"
            onClick={() => setShowBreathing(true)}
          >
            <Wind size={18} />
            <span>Breathing</span>
          </button>
        </div>

        {/* Visualizer Controls */}
        <div className="visualizer-controls">
          <button className="hide-visuals-btn" onClick={toggleVisuals}>
            {showVisuals ? <EyeOff size={18} /> : <Eye size={18} />}
            <span>{showVisuals ? 'Hide Visuals' : 'Show Visuals'}</span>
          </button>
          
          <div className="visualizer-buttons">
            {visualizers.map((viz) => (
              <button
                key={viz.id}
                className={`visualizer-btn ${currentVisual === viz.id ? 'active' : ''}`}
                onClick={() => setCurrentVisual(viz.id as any)}
              >
                {viz.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

