import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Waves, Sparkles } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import './SessionCinematicOverlay.css';

const CINEMATIC_DURATION_MS = 3600;

const SessionCinematicOverlay: React.FC = () => {
  const { sessionCinematic, clearSessionCinematic } = useAppStore();

  useEffect(() => {
    if (!sessionCinematic?.active) return;

    const timer = setTimeout(() => {
      clearSessionCinematic();
    }, CINEMATIC_DURATION_MS);

    return () => clearTimeout(timer);
  }, [sessionCinematic, clearSessionCinematic]);

  return (
    <AnimatePresence>
      {sessionCinematic?.active && (
        <motion.div
          className="session-cinematic-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <motion.div
            className="session-cinematic-panel"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          >
            <div className="cinematic-header">
              <Waves size={18} />
              <span>Resonance Session</span>
            </div>

            <h2>{sessionCinematic.frequencyName}</h2>
            <div className="cinematic-frequency">{sessionCinematic.frequencyHz} Hz</div>

            {sessionCinematic.source && (
              <div className="cinematic-source">
                <Sparkles size={14} />
                <span>{sessionCinematic.source}</span>
              </div>
            )}

            <div className="cinematic-progress-track">
              <motion.div
                className="cinematic-progress-bar"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: CINEMATIC_DURATION_MS / 1000, ease: 'linear' }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SessionCinematicOverlay;
