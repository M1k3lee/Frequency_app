import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, RotateCcw, Volume2, Info } from 'lucide-react';
import { audioEngine } from '../audio/AudioEngine';
import { getGatewayConfig } from '../audio/gateway/GatewaySignalConfig';
import { getFrequencyById } from '../data/frequencies';
import './AdvancedFrequencyControls.css';

interface AdvancedFrequencyControlsProps {
  frequencyId: string;
}

const AdvancedFrequencyControls: React.FC<AdvancedFrequencyControlsProps> = ({ frequencyId }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [config, setConfig] = useState<any>(null);
  const [carrierVolumes, setCarrierVolumes] = useState<number[]>([]);
  const [isochronicVolumes, setIsochronicVolumes] = useState<number[]>([]);

  useEffect(() => {
    // Check if this is a Gateway frequency
    const frequency = getFrequencyById(frequencyId);
    if (!frequency?.isGatewaySignal) {
      return;
    }

    // Get Gateway config from frequency ID mapping
    const gatewayConfig = getGatewayConfig(frequencyId);
    if (!gatewayConfig) {
      // Fallback: try to get from audio engine
      const storedConfig = audioEngine.getGatewayConfig();
      if (storedConfig) {
        setConfig(storedConfig);
      }
      return;
    }

    setConfig(gatewayConfig);

    // Get current layer volumes from audio engine
    const carrierCount = audioEngine.getGatewayCarrierLayerCount();
    const isochronicCount = audioEngine.getGatewayIsochronicLayerCount();

    if (carrierCount > 0) {
      const currentCarrierVolumes = Array.from({ length: carrierCount }, (_, i) =>
        audioEngine.getGatewayCarrierLayerVolume(i)
      );
      setCarrierVolumes(currentCarrierVolumes);
    }

    if (isochronicCount > 0) {
      const currentIsochronicVolumes = Array.from({ length: isochronicCount }, (_, i) =>
        audioEngine.getGatewayIsochronicLayerVolume(i)
      );
      setIsochronicVolumes(currentIsochronicVolumes);
    }
  }, [frequencyId]);

  const handleCarrierVolumeChange = (index: number, volume: number) => {
    audioEngine.setGatewayCarrierLayerVolume(index, volume);
    const newVolumes = [...carrierVolumes];
    newVolumes[index] = volume;
    setCarrierVolumes(newVolumes);
  };

  const handleIsochronicVolumeChange = (index: number, volume: number) => {
    audioEngine.setGatewayIsochronicLayerVolume(index, volume);
    const newVolumes = [...isochronicVolumes];
    newVolumes[index] = volume;
    setIsochronicVolumes(newVolumes);
  };

  const handleReset = () => {
    audioEngine.resetGatewayLayerVolumes();
    
    // Reset to default volumes from config
    if (config) {
      const defaultCarrierVolumes = config.carrierLayers.map((layer: any) => layer.volume);
      const defaultIsochronicVolumes = config.isochronicLayers.map((layer: any) => layer.volume);
      
      setCarrierVolumes(defaultCarrierVolumes);
      setIsochronicVolumes(defaultIsochronicVolumes);
    }
  };

  // Check if this is a Gateway frequency
  const frequency = getFrequencyById(frequencyId);
  const isGateway = frequency?.isGatewaySignal;

  // Don't render if not a Gateway frequency
  if (!isGateway) {
    return null;
  }

  return (
    <div className="advanced-frequency-controls">
      <button
        className="advanced-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label={isExpanded ? 'Collapse advanced controls' : 'Expand advanced controls'}
      >
        <span className="advanced-toggle-text">Advanced</span>
        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {isExpanded && !config && (
        <div className="advanced-controls-content">
          <p style={{ color: 'rgba(255, 255, 255, 0.5)', textAlign: 'center', padding: '20px' }}>
            Loading layer controls...
          </p>
        </div>
      )}

      {isExpanded && config && (
        <div className="advanced-controls-content">
          <div className="tech-info-section">
            <div className="tech-info-header">
              <Info size={16} />
              <h5>Advanced Audio Technology</h5>
            </div>
            <div className="tech-info-content">
              <p>
                This frequency uses our <strong>multi-layer audio synthesis engine</strong> with {config.carrierLayers.length} carrier layers 
                {config.isochronicLayers.length > 0 && ` and ${config.isochronicLayers.length} isochronic layers`}. 
                Each layer operates independently with precise phase relationships, creating complex harmonic entrainment patterns 
                that standard binaural beat apps cannot achieve.
              </p>
              <ul className="tech-features-list">
                <li><strong>Lossless DSP Processing:</strong> Real-time Web Audio API synthesis with zero compression artifacts</li>
                <li><strong>Multi-Layer Architecture:</strong> Simultaneous carrier pairs at different frequencies for enhanced entrainment</li>
                <li><strong>Phase Relationships:</strong> Each layer uses specific phase offsets (0°-252°) for wave interference patterns</li>
                <li><strong>Real-Time Mixing:</strong> Individual layer volume control with instant response and smooth transitions</li>
                <li><strong>Professional Quality:</strong> Sample-accurate timing and 32-bit floating-point precision</li>
              </ul>
            </div>
          </div>

          <div className="advanced-controls-header">
            <h4>Layer Volume Controls</h4>
            <button
              className="reset-button"
              onClick={handleReset}
              title="Reset all volumes to default"
              aria-label="Reset volumes to default"
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
          </div>

          {config.carrierLayers.length > 0 && (
            <div className="layer-group">
              <h5 className="layer-group-title">
                Carrier Layers (Binaural Beats)
                <span className="layer-count">{config.carrierLayers.length}</span>
              </h5>
              {config.carrierLayers.map((layer: any, index: number) => (
                <div key={index} className="layer-control">
                  <div className="layer-info">
                    <span className="layer-label">
                      Layer {index + 1}
                    </span>
                    <span className="layer-freq">
                      {layer.leftFreq.toFixed(1)} / {layer.rightFreq.toFixed(1)} Hz
                      <span className="beat-freq"> ({layer.beatFreq.toFixed(1)} Hz beat)</span>
                    </span>
                  </div>
                  <div className="layer-volume-control">
                    <Volume2 size={14} />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={carrierVolumes[index] || layer.volume}
                      onChange={(e) => handleCarrierVolumeChange(index, parseFloat(e.target.value))}
                      className="layer-volume-slider"
                    />
                    <span className="layer-volume-value">
                      {Math.round((carrierVolumes[index] || layer.volume) * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {config.isochronicLayers.length > 0 && (
            <div className="layer-group">
              <h5 className="layer-group-title">
                Isochronic Layers
                <span className="layer-count">{config.isochronicLayers.length}</span>
              </h5>
              {config.isochronicLayers.map((layer: any, index: number) => (
                <div key={index} className="layer-control">
                  <div className="layer-info">
                    <span className="layer-label">
                      Layer {index + 1}
                    </span>
                    <span className="layer-freq">
                      {layer.frequency.toFixed(1)} Hz @ {layer.pulseRate.toFixed(1)} Hz
                    </span>
                  </div>
                  <div className="layer-volume-control">
                    <Volume2 size={14} />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={isochronicVolumes[index] || layer.volume}
                      onChange={(e) => handleIsochronicVolumeChange(index, parseFloat(e.target.value))}
                      className="layer-volume-slider"
                    />
                    <span className="layer-volume-value">
                      {Math.round((isochronicVolumes[index] || layer.volume) * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedFrequencyControls;
