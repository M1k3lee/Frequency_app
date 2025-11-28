import React, { useState } from 'react';
import { X, Play, Pause, Info, Volume2, Square } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { getFrequenciesByTag } from '../data/frequencies';
import { Frequency } from '../types';
import { audioEngine } from '../audio/AudioEngine';
import './GatewayMode.css';

const GatewayMode: React.FC = () => {
  const { 
    setShowGateway, 
    addFrequency, 
    stopAll, 
    setPlaying,
    currentFrequencies,
    isPlaying,
    masterVolume,
    setMasterVolume
  } = useAppStore();
  const gatewayFrequencies = getFrequenciesByTag('gateway');
  const [selectedFreq, setSelectedFreq] = useState<Frequency | null>(null);

  // Check if a frequency is currently playing
  const isFrequencyPlaying = (frequencyId: string): boolean => {
    return Array.from(currentFrequencies.values()).some(
      (f) => f.frequencyId === frequencyId && f.enabled
    );
  };

  // Get currently playing Gateway frequency
  const getCurrentPlayingFrequency = (): Frequency | null => {
    if (currentFrequencies.size === 0) return null;
    const activeFreq = Array.from(currentFrequencies.values())[0];
    if (activeFreq && activeFreq.enabled) {
      const freq = gatewayFrequencies.find(f => f.id === activeFreq.frequencyId);
      return freq || null;
    }
    return null;
  };

  const currentPlayingFreq = getCurrentPlayingFrequency();

  const handlePlayFrequency = async (freqId: string, e?: React.MouseEvent) => {
    // Prevent event propagation to avoid closing the modal
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    // If already playing, pause it by stopping all
    if (isFrequencyPlaying(freqId)) {
      stopAll();
      // stopAll() already sets isPlaying to false, no need to call setPlaying again
      return;
    }

    // Stop all and play this one
    stopAll();
    
    // Small delay to ensure cleanup
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const freq = gatewayFrequencies.find(f => f.id === freqId);
    if (freq) {
      try {
        console.log('Gateway: Attempting to play frequency:', freq.name, freq.frequency, 'Hz');
        
        // Ensure audio engine is ready - this will handle context resume
        if (!audioEngine.isReadyForPlayback()) {
          await audioEngine.initialize();
        }
        
        // The addFrequency function will handle audio context resume via ensureInitialized
        // Just call addFrequency - it will handle everything
        await addFrequency(freq);
        setPlaying(true);
        console.log('Gateway: Frequency added successfully');
      } catch (error) {
        console.error('Gateway: Error playing frequency:', error);
        alert('Failed to play frequency. Please try again. Error: ' + (error instanceof Error ? error.message : String(error)));
      }
    }
  };

  return (
    <div className="gateway-mode-overlay" onClick={() => setShowGateway(false)}>
      <div className="gateway-mode-panel" onClick={(e) => e.stopPropagation()}>
        <div className="gateway-header">
          <h2>Gateway Project Frequencies</h2>
          <button className="close-btn" onClick={() => setShowGateway(false)}>
            <X size={24} />
          </button>
        </div>

        {/* Gateway Control Bar - Moved to top */}
        {currentPlayingFreq && (
          <div className="gateway-control-bar">
            <div className="gateway-control-info">
              <div className="gateway-now-playing">
                <span className="now-playing-label">Now Playing:</span>
                <strong>{currentPlayingFreq.name}</strong>
                <span className="now-playing-freq">{currentPlayingFreq.frequency} Hz</span>
              </div>
            </div>
            <div className="gateway-control-actions">
              <div className="gateway-volume-control">
                <Volume2 size={16} />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={masterVolume}
                  onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
                  className="gateway-volume-slider"
                />
                <span className="gateway-volume-value">{Math.round(masterVolume * 100)}%</span>
              </div>
              <button
                className="gateway-pause-btn"
                onClick={async (e) => {
                  e.stopPropagation();
                  // Check if there are actually active frequencies playing
                  const hasActiveFrequencies = currentFrequencies.size > 0 && 
                    Array.from(currentFrequencies.values()).some(f => f.enabled);
                  
                  if (hasActiveFrequencies && isPlaying) {
                    // Pause - stop all frequencies
                    stopAll();
                    // stopAll() already sets isPlaying to false, no need to call setPlaying again
                  } else {
                    // Resume - restart the current frequency
                    if (currentPlayingFreq) {
                      // Stop all first to ensure clean state
                      stopAll();
                      // Small delay to ensure cleanup
                      await new Promise(resolve => setTimeout(resolve, 100));
                      // Restart the frequency
                      try {
                        if (!audioEngine.isReadyForPlayback()) {
                          await audioEngine.initialize();
                        }
                        await addFrequency(currentPlayingFreq);
                        setPlaying(true);
                      } catch (error) {
                        console.error('Gateway: Error resuming frequency:', error);
                      }
                    }
                  }
                }}
                aria-label={(currentFrequencies.size > 0 && isPlaying) ? 'Pause' : 'Play'}
              >
                {(currentFrequencies.size > 0 && isPlaying) ? <Pause size={18} /> : <Play size={18} />}
              </button>
              <button
                className="gateway-stop-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  stopAll();
                  // stopAll() already sets isPlaying to false, no need to call setPlaying again
                }}
                aria-label="Stop"
              >
                <Square size={18} />
              </button>
            </div>
          </div>
        )}
        
        <div className="gateway-intro">
          <p>Explore the declassified frequencies from the Monroe Institute's Gateway Project. These experimental frequencies were used in consciousness exploration research.</p>
        </div>

        <div className="gateway-frequencies">
          {gatewayFrequencies.map((freq) => (
            <div key={freq.id} className="gateway-frequency-card">
              <div className="gateway-freq-header">
                <div>
                  <h3>{freq.name}</h3>
                  <span className="gateway-badge">Gateway Project</span>
                </div>
                <div className="gateway-card-actions">
                  {freq.experimentalData && (
                    <button
                      className="info-gateway-btn"
                      onClick={() => setSelectedFreq(freq)}
                      aria-label={`View experimental data for ${freq.name}`}
                      title="View Experimental Data"
                    >
                      <Info size={18} />
                    </button>
                  )}
                  <button
                    className={`play-gateway-btn ${isFrequencyPlaying(freq.id) ? 'playing' : ''}`}
                    onClick={(e) => handlePlayFrequency(freq.id, e)}
                    aria-label={isFrequencyPlaying(freq.id) ? `Pause ${freq.name}` : `Play ${freq.name}`}
                  >
                    {isFrequencyPlaying(freq.id) ? <Pause size={18} /> : <Play size={18} />}
                  </button>
                </div>
              </div>
              <div className="gateway-freq-info">
                <span className="freq-value">{freq.frequency} Hz</span>
                <p>{freq.description}</p>
                {freq.gatewayReference && (
                  <span className="gateway-ref">{freq.gatewayReference}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Experimental Data Modal */}
        {selectedFreq && selectedFreq.experimentalData && (
          <div className="experimental-modal-overlay" onClick={() => setSelectedFreq(null)}>
            <div className="experimental-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="experimental-modal-header">
                <h3>{selectedFreq.name} - Experimental Data</h3>
                <button
                  className="close-experimental-btn"
                  onClick={() => setSelectedFreq(null)}
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="experimental-data-content">
                {selectedFreq.experimentalData.methodology && (
                  <div className="data-section">
                    <h4>Methodology</h4>
                    <p>{selectedFreq.experimentalData.methodology}</p>
                  </div>
                )}
                
                {selectedFreq.experimentalData.testSubjects && (
                  <div className="data-section">
                    <h4>Test Subjects</h4>
                    <p>{selectedFreq.experimentalData.testSubjects}</p>
                  </div>
                )}
                
                {selectedFreq.experimentalData.reactions && selectedFreq.experimentalData.reactions.length > 0 && (
                  <div className="data-section">
                    <h4>Subject Reactions</h4>
                    <ul>
                      {selectedFreq.experimentalData.reactions.map((reaction, i) => (
                        <li key={i}>{reaction}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {selectedFreq.experimentalData.outcomes && selectedFreq.experimentalData.outcomes.length > 0 && (
                  <div className="data-section">
                    <h4>Experimental Outcomes</h4>
                    <ul>
                      {selectedFreq.experimentalData.outcomes.map((outcome, i) => (
                        <li key={i}>{outcome}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {selectedFreq.experimentalData.notes && (
                  <div className="data-section notes">
                    <h4>Research Notes</h4>
                    <p>{selectedFreq.experimentalData.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GatewayMode;

