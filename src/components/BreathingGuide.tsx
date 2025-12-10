import React, { useState, useEffect, useRef, useMemo } from 'react';
import { X, Play, Pause, RotateCcw, Clock, Heart, Brain } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import './BreathingGuide.css';

type BreathingMethod = 'box' | 'deep' | '4-7-8' | 'coherent' | 'wim-hof';
type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'pause';

interface BreathingTechnique {
  name: string;
  timings: { inhale: number; hold: number; exhale: number; pause: number };
  description: string;
  benefits: string[];
  recommendedDuration: number; // in minutes
  scientificNote: string;
  color: string;
}

const techniques: Record<BreathingMethod, BreathingTechnique> = {
  box: {
    name: 'Box Breathing',
    timings: { inhale: 4, hold: 4, exhale: 4, pause: 4 },
    description: 'Also known as square breathing, this technique is used by Navy SEALs and athletes to reduce stress and improve focus.',
    benefits: ['Reduces stress and anxiety', 'Improves focus and concentration', 'Enhances performance under pressure', 'Regulates heart rate'],
    recommendedDuration: 5,
    scientificNote: 'Research shows box breathing activates the parasympathetic nervous system, reducing cortisol levels by up to 23%.',
    color: '#64C8FF'
  },
  deep: {
    name: 'Deep Breathing',
    timings: { inhale: 6, hold: 0, exhale: 6, pause: 0 },
    description: 'Simple diaphragmatic breathing that activates the relaxation response and improves oxygen exchange.',
    benefits: ['Activates parasympathetic nervous system', 'Improves oxygen saturation', 'Reduces muscle tension', 'Enhances relaxation'],
    recommendedDuration: 10,
    scientificNote: 'Studies show deep breathing increases heart rate variability (HRV), a marker of stress resilience.',
    color: '#7B68EE'
  },
  '4-7-8': {
    name: '4-7-8 Method',
    timings: { inhale: 4, hold: 7, exhale: 8, pause: 0 },
    description: 'Developed by Dr. Andrew Weil, this technique is specifically designed to promote sleep and reduce anxiety.',
    benefits: ['Promotes sleep onset', 'Reduces anxiety and panic', 'Calms the nervous system', 'Improves sleep quality'],
    recommendedDuration: 5,
    scientificNote: 'The extended exhale (8 seconds) activates the vagus nerve, triggering the body\'s relaxation response.',
    color: '#FF6B9D'
  },
  coherent: {
    name: 'Coherent Breathing',
    timings: { inhale: 5.5, hold: 0, exhale: 5.5, pause: 0 },
    description: 'Also called resonant breathing, this technique optimizes heart rate variability (HRV) at 5-6 breaths per minute.',
    benefits: ['Optimizes heart rate variability', 'Reduces stress hormones', 'Improves cardiovascular health', 'Enhances emotional regulation'],
    recommendedDuration: 10,
    scientificNote: 'Research shows 5.5-second breathing cycles maximize HRV, improving autonomic nervous system balance.',
    color: '#4ECDC4'
  },
  'wim-hof': {
    name: 'Wim Hof Method',
    timings: { inhale: 1.5, hold: 0, exhale: 1.5, pause: 0 },
    description: 'Rapid breathing technique (30-40 breaths per minute) for energy and focus. Use with caution and proper guidance.',
    benefits: ['Increases energy and focus', 'Enhances immune function', 'Improves stress tolerance', 'Boosts mental clarity'],
    recommendedDuration: 5,
    scientificNote: 'Studies show Wim Hof breathing can influence the autonomic nervous system and immune response.',
    color: '#FFD93D'
  }
};

const BreathingGuide: React.FC = () => {
  const { setShowBreathing } = useAppStore();
  const [isActive, setIsActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<BreathPhase>('inhale');
  const [cycleCount, setCycleCount] = useState(0);
  const [method, setMethod] = useState<BreathingMethod>('box');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const phaseStartTimeRef = useRef<number>(0);

  const currentTechnique = techniques[method];
  
  // Calculate phases once based on current method - memoize to prevent unnecessary recalculations
  const phases: BreathPhase[] = useMemo(() => {
    const tech = techniques[method];
    return ['inhale', 'hold', 'exhale', 'pause'].filter(
      phase => tech.timings[phase as keyof typeof tech.timings] > 0
    ) as BreathPhase[];
  }, [method]);

  useEffect(() => {
    if (!isActive) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Reset when method changes
    setCycleCount(0);
    setBreathPhase('inhale');
    setTimeRemaining(0);

    let phaseIndex = 0;
    let isRunning = true;
    let timeoutId: NodeJS.Timeout | null = null;
    const startTime = Date.now();
    const sessionStart = sessionStartTime || startTime;
    if (!sessionStartTime) {
      setSessionStartTime(startTime);
    }

    const runCycle = () => {
      if (!isRunning || !isActive) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        return;
      }

      // Ensure we have valid phases
      if (phases.length === 0) {
        console.error('No valid phases for method:', method);
        setIsActive(false);
        return;
      }

      const phase = phases[phaseIndex];
      const tech = techniques[method];
      const duration = tech.timings[phase] * 1000;
      
      if (duration <= 0) {
        console.error('Invalid duration for phase:', phase, duration);
        setIsActive(false);
        return;
      }
      
      setBreathPhase(phase);
      setTimeRemaining(duration);
      phaseStartTimeRef.current = Date.now();

      // Update time remaining every 100ms for smooth progress ring
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      intervalRef.current = setInterval(() => {
        if (!isRunning) return;
        const elapsed = Date.now() - phaseStartTimeRef.current;
        const remaining = Math.max(0, duration - elapsed);
        setTimeRemaining(remaining);
        setTotalTime(Math.floor((Date.now() - sessionStart) / 1000));
      }, 50); // Update every 50ms for very smooth countdown

      timeoutId = setTimeout(() => {
        if (!isRunning || !isActive) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return;
        }

        // Move to next phase
        phaseIndex = (phaseIndex + 1) % phases.length;
        if (phaseIndex === 0) {
          setCycleCount(prev => prev + 1);
        }
        
        // Continue to next phase
        runCycle();
      }, duration);
    };

    runCycle();

    return () => {
      isRunning = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    };
  }, [isActive, method, phases]);

  const handleToggle = () => {
    if (isActive) {
      setIsActive(false);
      setBreathPhase('inhale');
      setTimeRemaining(0);
    } else {
      setIsActive(true);
      setCycleCount(0);
      setTotalTime(0);
      setSessionStartTime(null);
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setBreathPhase('inhale');
    setCycleCount(0);
    setTimeRemaining(0);
    setTotalTime(0);
    setSessionStartTime(null);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const getProgress = (): number => {
    if (!isActive || timeRemaining === 0) return 0;
    const phase = breathPhase;
    const totalDuration = currentTechnique.timings[phase] * 1000;
    return ((totalDuration - timeRemaining) / totalDuration) * 100;
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="breathing-overlay" onClick={() => setShowBreathing(false)}>
      <div className="breathing-panel" onClick={(e) => e.stopPropagation()}>
        <div className="breathing-header">
          <h2>Breathing Guide</h2>
          <button 
            className="close-btn" 
            onClick={() => setShowBreathing(false)}
            aria-label="Close Breathing Guide"
            title="Close"
          >
            <X size={18} />
            <span className="close-btn-text">Close</span>
          </button>
        </div>

        <div className="breathing-content">
          <div className="breathing-methods">
            <h3>Select Breathing Method</h3>
            <div className="method-buttons">
              {(Object.keys(techniques) as BreathingMethod[]).map((key) => {
                const tech = techniques[key];
                return (
                  <button
                    key={key}
                    className={`method-btn ${method === key ? 'active' : ''}`}
                    onClick={() => {
                      setMethod(key);
                      handleReset();
                    }}
                    style={method === key ? { borderColor: tech.color } : {}}
                  >
                    <div>
                      <strong>{tech.name}</strong>
                      <span className="method-ratio">
                        {tech.timings.inhale}-{tech.timings.hold || 0}-{tech.timings.exhale}-{tech.timings.pause || 0}
                      </span>
                    </div>
                    <div className="method-benefit-preview">
                      {tech.benefits[0]}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="breathing-visualizer">
            <div 
              className={`breathing-circle ${breathPhase} ${isActive ? 'active' : ''}`}
              style={{
                '--breath-color': currentTechnique.color,
                '--breath-duration': `${currentTechnique.timings[breathPhase]}s`
              } as React.CSSProperties}
            >
              <div className="breathing-progress-ring">
                <svg className="progress-svg" viewBox="0 0 100 100">
                  <circle
                    className="progress-circle-bg"
                    cx="50"
                    cy="50"
                    r="45"
                  />
                  <circle
                    className="progress-circle"
                    cx="50"
                    cy="50"
                    r="45"
                    style={{
                      strokeDasharray: `${2 * Math.PI * 45}`,
                      strokeDashoffset: `${2 * Math.PI * 45 * (1 - getProgress() / 100)}`
                    }}
                  />
                </svg>
              </div>
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
                    <span className="breath-countdown">
                      {Math.ceil(timeRemaining / 1000)}
                    </span>
                    <span className="breath-phase-label">
                      {breathPhase === 'inhale' && 'seconds to inhale'}
                      {breathPhase === 'hold' && 'seconds to hold'}
                      {breathPhase === 'exhale' && 'seconds to exhale'}
                      {breathPhase === 'pause' && 'seconds to pause'}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Phase Indicators */}
            {isActive && (
              <div className="phase-indicators">
                {phases.map((phase) => (
                  <div
                    key={phase}
                    className={`phase-indicator ${breathPhase === phase ? 'active' : ''}`}
                    style={{
                      backgroundColor: breathPhase === phase ? currentTechnique.color : 'rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <span className="phase-label">
                      {phase === 'inhale' && 'I'}
                      {phase === 'hold' && 'H'}
                      {phase === 'exhale' && 'E'}
                      {phase === 'pause' && 'P'}
                    </span>
                    <span className="phase-time">{currentTechnique.timings[phase]}s</span>
                  </div>
                ))}
              </div>
            )}

            <div className="breathing-controls">
              <button
                className="breathing-toggle-btn"
                onClick={handleToggle}
              >
                {isActive ? <Pause size={24} /> : <Play size={24} />}
                <span>{isActive ? 'Pause' : 'Start'}</span>
              </button>
              {isActive && (
                <button
                  className="breathing-reset-btn"
                  onClick={handleReset}
                  title="Reset"
                >
                  <RotateCcw size={18} />
                </button>
              )}
            </div>

            {/* Stats */}
            {isActive && (
              <div className="breathing-stats">
                <div className="stat-item">
                  <Heart size={16} />
                  <span>Cycle: {cycleCount + 1}</span>
                </div>
                <div className="stat-item">
                  <Clock size={16} />
                  <span>{formatTime(totalTime)}</span>
                </div>
              </div>
            )}
          </div>

          <div className="breathing-info">
            <div className="info-header">
              <h4>
                <Brain size={18} />
                {currentTechnique.name}
              </h4>
              <span className="recommended-duration">
                Recommended: {currentTechnique.recommendedDuration} min
              </span>
            </div>
            <p className="technique-description">{currentTechnique.description}</p>
            
            <div className="benefits-list">
              <strong>Benefits:</strong>
              <ul>
                {currentTechnique.benefits.map((benefit, i) => (
                  <li key={i}>{benefit}</li>
                ))}
              </ul>
            </div>

            <div className="scientific-note">
              <strong>Research:</strong> {currentTechnique.scientificNote}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreathingGuide;
