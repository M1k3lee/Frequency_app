import React, { useState, useEffect } from 'react';
import { X, Play, Pause } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import './BreathingGuide.css';

const BreathingGuide: React.FC = () => {
  const { setShowBreathing } = useAppStore();
  const [isActive, setIsActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [cycleCount, setCycleCount] = useState(0);
  const [method, setMethod] = useState<'box' | 'deep' | '4-7-8'>('box');

  const timings = {
    box: { inhale: 4, hold: 4, exhale: 4, pause: 4 },
    deep: { inhale: 6, hold: 0, exhale: 6, pause: 0 },
    '4-7-8': { inhale: 4, hold: 7, exhale: 8, pause: 0 }
  };

  useEffect(() => {
    if (!isActive) return;

    const currentTiming = timings[method];
    let phaseIndex = 0;
    const phases: Array<'inhale' | 'hold' | 'exhale' | 'pause'> = ['inhale', 'hold', 'exhale', 'pause'];
    
    const cycle = () => {
      const phase = phases[phaseIndex];
      setBreathPhase(phase);
      
      const duration = currentTiming[phase] * 1000;
      
      setTimeout(() => {
        phaseIndex = (phaseIndex + 1) % phases.length;
        if (phaseIndex === 0) {
          setCycleCount(prev => prev + 1);
        }
        if (isActive) {
          cycle();
        }
      }, duration);
    };

    cycle();

    return () => {
      setIsActive(false);
    };
  }, [isActive, method]);

  const handleToggle = () => {
    if (isActive) {
      setIsActive(false);
      setBreathPhase('inhale');
    } else {
      setIsActive(true);
      setCycleCount(0);
    }
  };

  return (
    <div className="breathing-overlay" onClick={() => setShowBreathing(false)}>
      <div className="breathing-panel" onClick={(e) => e.stopPropagation()}>
        <div className="breathing-header">
          <h2>Breathing Guide</h2>
          <button className="close-btn" onClick={() => setShowBreathing(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="breathing-content">
          <div className="breathing-methods">
            <h3>Select Breathing Method</h3>
            <div className="method-buttons">
              <button
                className={`method-btn ${method === 'box' ? 'active' : ''}`}
                onClick={() => setMethod('box')}
              >
                Box Breathing
                <span>4-4-4-4</span>
              </button>
              <button
                className={`method-btn ${method === 'deep' ? 'active' : ''}`}
                onClick={() => setMethod('deep')}
              >
                Deep Breathing
                <span>6-0-6-0</span>
              </button>
              <button
                className={`method-btn ${method === '4-7-8' ? 'active' : ''}`}
                onClick={() => setMethod('4-7-8')}
              >
                4-7-8 Method
                <span>4-7-8-0</span>
              </button>
            </div>
          </div>

          <div className="breathing-visualizer">
            <div className={`breathing-circle ${breathPhase} ${isActive ? 'active' : ''}`}>
              <div className="breathing-text">
                {!isActive ? (
                  <>
                    <span className="breath-label">Ready</span>
                    <span className="breath-instruction">Click to start</span>
                  </>
                ) : (
                  <>
                    <span className="breath-label">
                      {breathPhase === 'inhale' && 'Inhale'}
                      {breathPhase === 'hold' && 'Hold'}
                      {breathPhase === 'exhale' && 'Exhale'}
                      {breathPhase === 'pause' && 'Pause'}
                    </span>
                    <span className="breath-count">{timings[method][breathPhase]}s</span>
                  </>
                )}
              </div>
            </div>
            <div className="breathing-controls">
              <button
                className="breathing-toggle-btn"
                onClick={handleToggle}
              >
                {isActive ? <Pause size={24} /> : <Play size={24} />}
                <span>{isActive ? 'Pause' : 'Start'}</span>
              </button>
              {isActive && (
                <div className="cycle-counter">
                  Cycle: {cycleCount + 1}
                </div>
              )}
            </div>
          </div>

          <div className="breathing-info">
            <h4>About {method === 'box' ? 'Box Breathing' : method === 'deep' ? 'Deep Breathing' : '4-7-8 Method'}</h4>
            {method === 'box' && (
              <p>Box breathing (4-4-4-4) is a simple technique used to reduce stress and improve focus. Inhale for 4 seconds, hold for 4, exhale for 4, and pause for 4. Repeat.</p>
            )}
            {method === 'deep' && (
              <p>Deep breathing involves slow, controlled inhales and exhales. This method helps activate the parasympathetic nervous system, promoting relaxation.</p>
            )}
            {method === '4-7-8' && (
              <p>The 4-7-8 breathing technique is designed to promote relaxation and sleep. Inhale for 4 seconds, hold for 7, and exhale for 8 seconds.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreathingGuide;

