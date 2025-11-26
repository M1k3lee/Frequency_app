import React, { useState } from 'react';
import { Settings, Plus, X, Save, FolderOpen, Trash2, Clock } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { frequencies } from '../data/frequencies';
import SequenceBuilder from './SequenceBuilder';
import './AdvancedPanel.css';

const AdvancedPanel: React.FC = () => {
  const {
    currentFrequencies,
    addFrequency,
    removeFrequency,
    updateFrequency,
    stopAll,
    setPlaying,
    saveMix,
    savedMixes,
    loadMix,
    removeMix,
    masterVolume,
    setShowAdvanced,
    setPlaybackTimer,
    setPlaybackTimerRemaining,
    setIsTimerActive
  } = useAppStore();

  const [selectedFreq, setSelectedFreq] = useState('');
  const [playDuration, setPlayDuration] = useState<number | null>(null); // in minutes, null = no limit
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [mixName, setMixName] = useState('');

  const handleAddFrequency = async () => {
    const freq = frequencies.find(f => f.id === selectedFreq);
    if (freq) {
      await addFrequency(freq);
      setPlaying(true);
      
      // If duration is set, schedule auto-stop
      if (playDuration && playDuration > 0) {
        const durationSeconds = playDuration * 60;
        setPlaybackTimer(durationSeconds);
        setPlaybackTimerRemaining(durationSeconds);
        setIsTimerActive(true);
        
        setTimeout(() => {
          stopAll();
          setPlaybackTimer(null);
          setPlaybackTimerRemaining(null);
          setIsTimerActive(false);
        }, durationSeconds * 1000);
      }
      
      setTimeout(() => {
        const playbackBar = document.querySelector('.playback-bar');
        if (playbackBar) {
          playbackBar.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 100);
    }
  };

  const handleSaveMix = () => {
    if (!mixName.trim()) {
      alert('Please enter a name for your mix');
      return;
    }

    const mixFrequencies = Array.from(currentFrequencies.values()).map(f => ({
      frequencyId: f.frequencyId,
      volume: f.volume,
      pan: f.pan,
      enabled: f.enabled
    }));

    saveMix({
      name: mixName,
      frequencies: mixFrequencies,
      masterVolume
    });

    setShowSaveModal(false);
    setMixName('');
    alert('Mix saved!');
  };

  const handleClearAll = () => {
    if (confirm('Clear all frequencies?')) {
      stopAll();
    }
  };

  return (
    <div className="advanced-panel">
      <div className="advanced-header">
        <h2><Settings size={20} /> Advanced Mixing</h2>
        <button
          className="close-advanced-btn"
          onClick={() => setShowAdvanced(false)}
          aria-label="Close Advanced Panel"
          title="Return to main page"
        >
          <X size={24} />
        </button>
      </div>

      <div className="add-frequency-section">
        <h3>Add Frequency to Mix</h3>
        <div className="add-controls">
          <select
            value={selectedFreq}
            onChange={(e) => setSelectedFreq(e.target.value)}
            className="frequency-select"
          >
            <option value="">Select a frequency...</option>
            {frequencies.map(freq => (
              <option key={freq.id} value={freq.id}>
                {freq.name} ({freq.frequency} Hz)
              </option>
            ))}
          </select>
          <label className="duration-label">
            <Clock size={14} />
            Play for (min):
            <input
              type="number"
              min="0"
              max="120"
              placeholder="∞"
              value={playDuration || ''}
              onChange={(e) => setPlayDuration(e.target.value ? parseInt(e.target.value) || null : null)}
              className="duration-input"
            />
            <span className="duration-hint">(0 = no limit)</span>
          </label>
          <button
            className="add-btn"
            onClick={handleAddFrequency}
            disabled={!selectedFreq}
          >
            <Plus size={16} /> Add
          </button>
        </div>
      </div>

      <SequenceBuilder />

      <div className="active-mix-section">
        <h3>Active Mix ({currentFrequencies.size})</h3>
        {currentFrequencies.size === 0 ? (
          <p className="empty-state">No frequencies active. Add some to start mixing!</p>
        ) : (
          <div className="active-frequencies">
            {Array.from(currentFrequencies.values()).map((freq) => {
              const frequency = frequencies.find(f => f.id === freq.frequencyId);
              return (
                <div key={freq.id} className="active-frequency-item">
                  <div className="freq-info">
                    <span className="freq-name">{frequency?.name || freq.frequencyId}</span>
                    <span className="freq-hz">{frequency?.frequency} Hz</span>
                  </div>
                  <div className="freq-controls">
                    <label>
                      Vol:
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={freq.volume}
                        onChange={(e) => updateFrequency(freq.id, { volume: parseFloat(e.target.value) })}
                      />
                      {Math.round(freq.volume * 100)}%
                    </label>
                    <label>
                      Pan:
                      <input
                        type="range"
                        min="-1"
                        max="1"
                        step="0.01"
                        value={freq.pan}
                        onChange={(e) => updateFrequency(freq.id, { pan: parseFloat(e.target.value) })}
                      />
                      {freq.pan.toFixed(1)}
                    </label>
                    <button
                      className="remove-btn"
                      onClick={() => removeFrequency(freq.id)}
                      aria-label="Remove frequency"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mix-actions">
        <button className="action-btn" onClick={() => setShowSaveModal(true)}>
          <Save size={16} /> Save Mix
        </button>
        <button className="action-btn" onClick={() => setShowLoadModal(true)}>
          <FolderOpen size={16} /> Load Mix
        </button>
        <button className="action-btn danger" onClick={handleClearAll}>
          <Trash2 size={16} /> Clear All
        </button>
      </div>

      {showSaveModal && (
        <div className="modal-overlay" onClick={() => setShowSaveModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Save Mix</h3>
            <input
              type="text"
              placeholder="Mix name..."
              value={mixName}
              onChange={(e) => setMixName(e.target.value)}
              className="mix-name-input"
            />
            <div className="modal-actions">
              <button onClick={handleSaveMix}>Save</button>
              <button onClick={() => setShowSaveModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showLoadModal && (
        <div className="modal-overlay" onClick={() => setShowLoadModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Load Mix</h3>
            {savedMixes.length === 0 ? (
              <p>No saved mixes</p>
            ) : (
              <div className="saved-mixes-list">
                {savedMixes.map((mix) => (
                  <div key={mix.id} className="saved-mix-item">
                    <div>
                      <strong>{mix.name}</strong>
                      <p>{mix.frequencies.length} frequencies</p>
                    </div>
                    <div className="mix-item-actions">
                      <button onClick={() => { loadMix(mix.id); setShowLoadModal(false); }}>
                        Load
                      </button>
                      <button onClick={() => removeMix(mix.id)} className="delete-btn">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => setShowLoadModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedPanel;

