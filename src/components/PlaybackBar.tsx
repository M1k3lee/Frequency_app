import React, { useEffect, useState } from 'react';
import { Play, Pause, Volume2, Timer, Save, Square, Clock } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import './PlaybackBar.css';

const PlaybackBar: React.FC = () => {
  const {
    currentFrequencies,
    isPlaying,
    masterVolume,
    playbackTimerRemaining,
    isTimerActive,
    setPlaying,
    setMasterVolume,
    stopAll,
    setPlaybackTimerRemaining,
    setIsTimerActive,
    setPlaybackTimer,
    saveToPlaylist
  } = useAppStore();

  const [showTimerModal, setShowTimerModal] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(30);

  useEffect(() => {
    if (isTimerActive && playbackTimerRemaining !== null && playbackTimerRemaining > 0) {
      const interval = setInterval(() => {
        setPlaybackTimerRemaining((prev) => {
          if (prev === null || prev <= 0) {
            setIsTimerActive(false);
            stopAll();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    } else if (isTimerActive && playbackTimerRemaining === 0) {
      stopAll();
      setIsTimerActive(false);
    }
  }, [isTimerActive, playbackTimerRemaining, setPlaybackTimerRemaining, setIsTimerActive, stopAll]);

  if (currentFrequencies.size === 0) {
    return null;
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSaveToPlaylist = () => {
    const frequencyIds = Array.from(currentFrequencies.values()).map(f => f.frequencyId);
    const name = prompt('Enter playlist name:');
    if (name) {
      saveToPlaylist(name, frequencyIds);
      alert('Saved to playlist!');
    }
  };

  const handleSetTimer = () => {
    const seconds = timerMinutes * 60;
    setPlaybackTimer(seconds);
    setPlaybackTimerRemaining(seconds);
    setIsTimerActive(true);
    setShowTimerModal(false);
  };

  const handleCancelTimer = () => {
    setPlaybackTimer(null);
    setPlaybackTimerRemaining(null);
    setIsTimerActive(false);
  };

  return (
    <div className="playback-bar">
      <div className="playback-bar-content">
        <button
          className="playback-btn"
          onClick={() => setPlaying(!isPlaying)}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>

        <div className="playback-info">
          <span className="active-count">
            {currentFrequencies.size} frequency{currentFrequencies.size !== 1 ? 's' : ''} active
          </span>
          {isTimerActive && playbackTimerRemaining !== null && (
            <span className="timer-display">
              <Timer size={14} /> {formatTime(playbackTimerRemaining)}
            </span>
          )}
        </div>

        <div className="playback-controls">
          <div className="volume-control">
            <Volume2 size={16} />
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

          <button
            className="playback-btn secondary"
            onClick={() => setShowTimerModal(true)}
            aria-label="Set timer"
            title="Set timer"
          >
            <Clock size={16} />
          </button>

          <button
            className="playback-btn secondary"
            onClick={handleSaveToPlaylist}
            aria-label="Save to playlist"
            title="Save to playlist"
          >
            <Save size={16} />
          </button>

          <button
            className="playback-btn secondary"
            onClick={stopAll}
            aria-label="Stop all"
            title="Stop all"
          >
            <Square size={16} />
          </button>
        </div>

        {showTimerModal && (
          <div className="timer-modal">
            <div className="timer-modal-content">
              <h3>Set Timer</h3>
              <div className="timer-input-group">
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={timerMinutes}
                  onChange={(e) => setTimerMinutes(parseInt(e.target.value) || 30)}
                  className="timer-input"
                />
                <span>minutes</span>
              </div>
              <div className="timer-modal-actions">
                <button onClick={handleSetTimer} className="timer-btn primary">
                  Set Timer
                </button>
                {isTimerActive && (
                  <button onClick={handleCancelTimer} className="timer-btn secondary">
                    Cancel Timer
                  </button>
                )}
                <button onClick={() => setShowTimerModal(false)} className="timer-btn">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaybackBar;

