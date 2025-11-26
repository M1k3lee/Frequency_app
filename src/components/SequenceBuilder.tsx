import React, { useState } from 'react';
import { Clock, Plus, X, Play, Save, Trash2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { frequencies, getFrequencyById } from '../data/frequencies';
import { FrequencySequence } from '../types';
import './SequenceBuilder.css';

const SequenceBuilder: React.FC = () => {
  const {
    savedSequences,
    saveSequence,
    playSequence,
    removeSequence,
    stopSequence,
    currentSequence,
    currentSequenceStep
  } = useAppStore();

  const [sequenceName, setSequenceName] = useState('');
  const [steps, setSteps] = useState<Array<{ frequencyId: string; duration: number; volume?: number }>>([]);
  const [fadeDuration, setFadeDuration] = useState(5); // seconds
  const [showBuilder, setShowBuilder] = useState(false);

  const handleAddStep = () => {
    setSteps([...steps, { frequencyId: '', duration: 5, volume: 0.7 }]);
  };

  const handleRemoveStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleUpdateStep = (index: number, updates: Partial<typeof steps[0]>) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], ...updates };
    setSteps(newSteps);
  };

  const handleSaveSequence = () => {
    if (!sequenceName.trim()) {
      alert('Please enter a sequence name');
      return;
    }
    if (steps.length === 0) {
      alert('Please add at least one step to the sequence');
      return;
    }
    if (steps.some(s => !s.frequencyId)) {
      alert('Please select a frequency for all steps');
      return;
    }

    saveSequence({
      name: sequenceName,
      steps: steps.map(s => ({
        frequencyId: s.frequencyId,
        duration: s.duration,
        volume: s.volume || 0.7,
        pan: 0
      })),
      fadeDuration
    });

    setSequenceName('');
    setSteps([]);
    setShowBuilder(false);
    alert('Sequence saved!');
  };

  const handlePlaySequence = async (sequence: FrequencySequence) => {
    await playSequence(sequence);
  };

  return (
    <div className="sequence-builder-section">
      <div className="sequence-header">
        <h3><Clock size={18} /> Frequency Sequences</h3>
        <button
          className="toggle-builder-btn"
          onClick={() => setShowBuilder(!showBuilder)}
        >
          {showBuilder ? 'Hide Builder' : 'Create Sequence'}
        </button>
      </div>

      {showBuilder && (
        <div className="sequence-builder">
          <div className="builder-controls">
            <input
              type="text"
              placeholder="Sequence name..."
              value={sequenceName}
              onChange={(e) => setSequenceName(e.target.value)}
              className="sequence-name-input"
            />
            <label className="fade-duration-label">
              Fade Duration (seconds):
              <input
                type="number"
                min="0"
                max="30"
                value={fadeDuration}
                onChange={(e) => setFadeDuration(parseInt(e.target.value) || 5)}
                className="fade-duration-input"
              />
            </label>
          </div>

          <div className="sequence-steps">
            <h4>Sequence Steps</h4>
            {steps.length === 0 ? (
              <p className="empty-steps">Click "Add Step" to create your sequence</p>
            ) : (
              steps.map((step, index) => {
                const freq = getFrequencyById(step.frequencyId);
                return (
                  <div key={index} className="sequence-step">
                    <div className="step-number">Step {index + 1}</div>
                    <select
                      value={step.frequencyId}
                      onChange={(e) => handleUpdateStep(index, { frequencyId: e.target.value })}
                      className="step-frequency-select"
                    >
                      <option value="">Select frequency...</option>
                      {frequencies.map(f => (
                        <option key={f.id} value={f.id}>
                          {f.name} ({f.frequency} Hz)
                        </option>
                      ))}
                    </select>
                    <label className="step-duration-label">
                      Duration (min):
                      <input
                        type="number"
                        min="1"
                        max="120"
                        value={step.duration}
                        onChange={(e) => handleUpdateStep(index, { duration: parseInt(e.target.value) || 5 })}
                        className="step-duration-input"
                      />
                    </label>
                    <label className="step-volume-label">
                      Volume:
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={step.volume || 0.7}
                        onChange={(e) => handleUpdateStep(index, { volume: parseFloat(e.target.value) })}
                        className="step-volume-input"
                      />
                      {Math.round((step.volume || 0.7) * 100)}%
                    </label>
                    <button
                      className="remove-step-btn"
                      onClick={() => handleRemoveStep(index)}
                      aria-label="Remove step"
                    >
                      <X size={16} />
                    </button>
                  </div>
                );
              })
            )}
            <button className="add-step-btn" onClick={handleAddStep}>
              <Plus size={16} /> Add Step
            </button>
          </div>

          <div className="builder-actions">
            <button className="save-sequence-btn" onClick={handleSaveSequence}>
              <Save size={16} /> Save Sequence
            </button>
            <button className="cancel-builder-btn" onClick={() => {
              setShowBuilder(false);
              setSequenceName('');
              setSteps([]);
            }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {savedSequences.length > 0 && (
        <div className="saved-sequences">
          <h4>Saved Sequences</h4>
          <div className="sequences-list">
            {savedSequences.map((sequence) => (
              <div key={sequence.id} className="sequence-item">
                <div className="sequence-info">
                  <strong>{sequence.name}</strong>
                  <span>{sequence.steps.length} steps</span>
                  {currentSequence?.id === sequence.id && (
                    <span className="playing-badge">
                      Playing: Step {currentSequenceStep + 1}/{sequence.steps.length}
                    </span>
                  )}
                </div>
                <div className="sequence-item-actions">
                  <button
                    className="play-sequence-btn"
                    onClick={() => handlePlaySequence(sequence)}
                    disabled={currentSequence?.id === sequence.id}
                  >
                    <Play size={14} /> Play
                  </button>
                  {currentSequence?.id === sequence.id && (
                    <button
                      className="stop-sequence-btn"
                      onClick={stopSequence}
                    >
                      Stop
                    </button>
                  )}
                  <button
                    className="delete-sequence-btn"
                    onClick={() => removeSequence(sequence.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SequenceBuilder;

