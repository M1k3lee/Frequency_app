import React, { useState } from 'react';
import { Play, Pause, Info, Search } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { frequencies, searchFrequencies } from '../data/frequencies';
import { Frequency } from '../types';
import './FrequencyLibrary.css';

const FrequencyLibrary: React.FC = () => {
  const { addFrequency, stopAll, setPlaying, currentFrequencies, removeFrequency } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [selectedFreq, setSelectedFreq] = useState<Frequency | null>(null);

  const allTags = ['all', 'relaxation', 'meditation', 'lucid-dreaming', 'deep-sleep', 'healing', 'grounding', 'natural', 'balance', 'gateway'];

  const filteredFrequencies = React.useMemo(() => {
    let filtered = frequencies;

    // Filter by tag
    if (selectedTag !== 'all') {
      filtered = filtered.filter(f => f.tags.includes(selectedTag));
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = searchFrequencies(searchQuery);
      if (selectedTag !== 'all') {
        filtered = filtered.filter(f => f.tags.includes(selectedTag));
      }
    }

    return filtered;
  }, [selectedTag, searchQuery]);

  // Check if a frequency is currently playing
  const isFrequencyPlaying = (frequencyId: string): boolean => {
    return Array.from(currentFrequencies.values()).some(
      (f) => f.frequencyId === frequencyId && f.enabled
    );
  };

  // Get the active frequency ID for a given frequency
  const getActiveFrequencyId = (frequencyId: string): string | null => {
    const active = Array.from(currentFrequencies.values()).find(
      (f) => f.frequencyId === frequencyId && f.enabled
    );
    return active ? active.id : null;
  };

  const handlePlayFrequency = async (frequency: Frequency) => {
    // If already playing, pause it
    if (isFrequencyPlaying(frequency.id)) {
      const activeId = getActiveFrequencyId(frequency.id);
      if (activeId) {
        removeFrequency(activeId);
      }
      return;
    }
    
    // Otherwise, stop all and play this one
    stopAll();
    await addFrequency(frequency);
    setPlaying(true);
  };

  return (
    <div className="frequency-library">
      <h2 className="library-title">Frequency Library</h2>
      
      {/* Search Bar */}
      <div className="search-container">
        <Search size={20} className="search-icon" />
        <input
          type="text"
          placeholder="Search frequencies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Filter Tags */}
      <div className="filter-tags">
        {allTags.map(tag => (
          <button
            key={tag}
            className={`filter-tag ${selectedTag === tag ? 'active' : ''}`}
            onClick={() => setSelectedTag(tag)}
          >
            {tag.charAt(0).toUpperCase() + tag.slice(1)}
          </button>
        ))}
      </div>

      {/* Frequency Grid */}
      <div className="frequency-grid">
        {filteredFrequencies.map((frequency) => (
          <div key={frequency.id} className="frequency-card">
            <div className="frequency-header">
              <div className="frequency-title-group">
                <h3>{frequency.name}</h3>
                {frequency.gatewayReference && (
                  <span className="gateway-badge">Gateway Project</span>
                )}
              </div>
              <button
                className={`play-icon-btn ${isFrequencyPlaying(frequency.id) ? 'playing' : ''}`}
                onClick={() => handlePlayFrequency(frequency)}
                aria-label={isFrequencyPlaying(frequency.id) ? `Pause ${frequency.name}` : `Play ${frequency.name}`}
              >
                {isFrequencyPlaying(frequency.id) ? <Pause size={16} /> : <Play size={16} />}
              </button>
            </div>
            <div className="frequency-info">
              <span className="frequency-value">{frequency.frequency} Hz</span>
              <span className="frequency-category">{frequency.category}</span>
            </div>
            <p className="frequency-description">{frequency.description}</p>
            <button
              className="info-btn"
              onClick={() => setSelectedFreq(frequency)}
            >
              <Info size={12} /> Info
            </button>
          </div>
        ))}
      </div>

      {filteredFrequencies.length === 0 && (
        <div className="no-results">
          <p>No frequencies found matching your search.</p>
        </div>
      )}

      {/* Info Modal */}
      {selectedFreq && (
        <div className="modal-overlay" onClick={() => setSelectedFreq(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedFreq.name}</h2>
            <div className="modal-info">
              <p><strong>Frequency:</strong> {selectedFreq.frequency} Hz</p>
              <p><strong>Category:</strong> {selectedFreq.category}</p>
              {selectedFreq.gatewayReference && (
                <p><strong>Gateway Reference:</strong> {selectedFreq.gatewayReference}</p>
              )}
              {selectedFreq.detailedInfo && (
                <p className="detailed-info">{selectedFreq.detailedInfo}</p>
              )}
              {selectedFreq.effects && selectedFreq.effects.length > 0 && (
                <div>
                  <strong>Effects:</strong>
                  <ul>
                    {selectedFreq.effects.map((effect: string, i: number) => (
                      <li key={i}>{effect}</li>
                    ))}
                  </ul>
                </div>
              )}
              {selectedFreq.recommendedDuration && (
                <p><strong>Recommended Duration:</strong> {selectedFreq.recommendedDuration} minutes</p>
              )}
              
              {selectedFreq.experimentalData && (
                <div className="experimental-data">
                  <h4>Gateway Project Experimental Data</h4>
                  
                  {selectedFreq.experimentalData.methodology && (
                    <div className="data-section">
                      <strong>Methodology:</strong>
                      <p>{selectedFreq.experimentalData.methodology}</p>
                    </div>
                  )}
                  
                  {selectedFreq.experimentalData.testSubjects && (
                    <div className="data-section">
                      <strong>Test Subjects:</strong>
                      <p>{selectedFreq.experimentalData.testSubjects}</p>
                    </div>
                  )}
                  
                  {selectedFreq.experimentalData.reactions && selectedFreq.experimentalData.reactions.length > 0 && (
                    <div className="data-section">
                      <strong>Subject Reactions:</strong>
                      <ul>
                        {selectedFreq.experimentalData.reactions.map((reaction: string, i: number) => (
                          <li key={i}>{reaction}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {selectedFreq.experimentalData.outcomes && selectedFreq.experimentalData.outcomes.length > 0 && (
                    <div className="data-section">
                      <strong>Experimental Outcomes:</strong>
                      <ul>
                        {selectedFreq.experimentalData.outcomes.map((outcome: string, i: number) => (
                          <li key={i}>{outcome}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {selectedFreq.experimentalData.notes && (
                    <div className="data-section notes">
                      <strong>Research Notes:</strong>
                      <p>{selectedFreq.experimentalData.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            <button className="close-btn" onClick={() => setSelectedFreq(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FrequencyLibrary;
