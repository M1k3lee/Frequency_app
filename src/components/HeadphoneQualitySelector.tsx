import React, { useState } from 'react';
import { Headphones, Info, X } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import './HeadphoneQualitySelector.css';

const HeadphoneQualitySelector: React.FC<{ variant?: 'header' | 'playback' }> = ({ variant = 'header' }) => {
  const { headphoneQuality, setHeadphoneQuality } = useAppStore();
  const [showInfo, setShowInfo] = useState(false);

  const handleToggle = () => {
    setHeadphoneQuality(headphoneQuality === 'standard' ? 'high-quality' : 'standard');
  };

  const isHighQuality = headphoneQuality === 'high-quality';

  return (
    <>
      <div className={`headphone-selector ${variant}`}>
        <button
          className={`headphone-btn ${isHighQuality ? 'hq' : ''}`}
          onClick={handleToggle}
          title={isHighQuality ? 'High Quality - Click to switch to Standard' : 'Standard - Click to switch to High Quality'}
          aria-label={`Headphone quality: ${headphoneQuality}`}
        >
          <Headphones size={variant === 'header' ? 18 : 16} />
          <span>{isHighQuality ? 'HQ' : 'Standard'}</span>
        </button>
        <button
          className="headphone-info-btn"
          onClick={() => setShowInfo(true)}
          title="Learn about headphone quality settings"
          aria-label="Info about headphone quality"
        >
          <Info size={variant === 'header' ? 16 : 14} />
        </button>
      </div>

      {showInfo && (
        <>
          <div className="headphone-info-overlay" onClick={() => setShowInfo(false)} />
          <div className="headphone-info-modal">
            <button className="headphone-info-close" onClick={() => setShowInfo(false)} aria-label="Close">
              <X size={20} />
            </button>
            <h3>Headphone Quality Settings</h3>
            <div className="headphone-info-content">
              <p>
                Some frequencies, especially very low ones (below 10 Hz), may not be audible on mobile speakers or basic headphones.
              </p>
              <div className="headphone-info-section">
                <h4>Standard Mode</h4>
                <p>
                  Optimized for phone speakers and basic headphones. Uses higher carrier frequencies (300-400 Hz) 
                  to make low frequencies more audible on devices with limited bass response.
                </p>
              </div>
              <div className="headphone-info-section">
                <h4>High Quality Mode</h4>
                <p>
                  For premium headphones with good bass response. Uses lower carrier frequencies (200 Hz) 
                  for deeper, richer bass tones. Recommended for high-quality over-ear headphones.
                </p>
              </div>
              <div className="headphone-info-tip">
                <strong>Tip:</strong> If you can't hear a frequency, try switching to Standard mode or use headphones.
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default HeadphoneQualitySelector;

