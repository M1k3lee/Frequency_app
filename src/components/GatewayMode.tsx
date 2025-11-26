import React from 'react';
import { X, Play } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { getFrequenciesByTag, getFrequencyById } from '../data/frequencies';
import './GatewayMode.css';

const GatewayMode: React.FC = () => {
  const { setShowGateway, addFrequency, stopAll, setPlaying } = useAppStore();
  const gatewayFrequencies = getFrequenciesByTag('gateway');

  const handlePlayFrequency = async (freqId: string) => {
    stopAll();
    const freq = gatewayFrequencies.find(f => f.id === freqId);
    if (freq) {
      await addFrequency(freq);
      setPlaying(true);
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
                <button
                  className="play-gateway-btn"
                  onClick={() => handlePlayFrequency(freq.id)}
                  aria-label={`Play ${freq.name}`}
                >
                  <Play size={18} />
                </button>
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
      </div>
    </div>
  );
};

export default GatewayMode;

