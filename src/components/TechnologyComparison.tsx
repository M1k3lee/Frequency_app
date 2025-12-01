import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Grid3x3, Radio, Zap, FileCode, Cpu, Waves } from 'lucide-react';
import './TechnologyComparison.css';

const TechnologyComparison: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Advanced Audio Technology | Frequency Zen';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Discover the advanced multi-layer audio technology powering Frequency Zen. Learn how our Gateway frequency system uses 6-15 carrier layers, phase relationships, and isochronic tones for superior brainwave entrainment.');
    }
  }, []);

  return (
    <div className="technology-page">
      <div className="technology-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          Back
        </button>

        <header className="technology-header">
          <h1>Advanced Audio Technology</h1>
          <p className="technology-subtitle">
            Why Frequency Zen's multi-layer Gateway signals are far more advanced than standard binaural beats
          </p>
        </header>

        <div className="technology-intro">
          <p>
            Most binaural beats apps use simple two-oscillator systems. Frequency Zen uses a sophisticated 
            multi-layer audio synthesis engine that creates complex, harmonically rich entrainment signals 
            inspired by advanced brainwave entrainment research.
          </p>
        </div>

        {/* Feature Comparison Table */}
        <section className="comparison-section">
          <h2>Technology Comparison</h2>
          <div className="comparison-table">
            <div className="comparison-header">
              <div className="comparison-cell feature-header">Feature</div>
              <div className="comparison-cell standard-header">Standard Binaural Apps</div>
              <div className="comparison-cell advanced-header">Frequency Zen Gateway System</div>
            </div>
            
            <div className="comparison-row">
              <div className="comparison-cell feature-label">
                <Grid3x3 size={18} />
                Carrier Pairs
              </div>
              <div className="comparison-cell standard-value">1 pair</div>
              <div className="comparison-cell advanced-value">6-15 pairs simultaneously</div>
            </div>
            
            <div className="comparison-row">
              <div className="comparison-cell feature-label">
                <Radio size={18} />
                Phase Control
              </div>
              <div className="comparison-cell standard-value">None</div>
              <div className="comparison-cell advanced-value">Specific phase offsets per layer (0°-252°)</div>
            </div>
            
            <div className="comparison-row">
              <div className="comparison-cell feature-label">
                <Zap size={18} />
                Isochronic Tones
              </div>
              <div className="comparison-cell standard-value">Usually separate</div>
              <div className="comparison-cell advanced-value">Simultaneous with binaurals</div>
            </div>
            
            <div className="comparison-row">
              <div className="comparison-cell feature-label">
                <FileCode size={18} />
                Signal Complexity
              </div>
              <div className="comparison-cell standard-value">Fixed simple</div>
              <div className="comparison-cell advanced-value">Scales 8-21 techniques</div>
            </div>
            
            <div className="comparison-row">
              <div className="comparison-cell feature-label">
                <Waves size={18} />
                Harmonic Richness
              </div>
              <div className="comparison-cell standard-value">Basic</div>
              <div className="comparison-cell advanced-value">Multi-harmonic layers</div>
            </div>
            
            <div className="comparison-row">
              <div className="comparison-cell feature-label">
                <Cpu size={18} />
                Entrainment Depth
              </div>
              <div className="comparison-cell standard-value">Surface level</div>
              <div className="comparison-cell advanced-value">Layered multi-dimensional</div>
            </div>
          </div>
        </section>

        {/* Technical Details */}
        <section className="technical-details">
          <h2>What Makes Our System Unique</h2>
          
          <div className="feature-detail">
            <div className="feature-icon">
              <Grid3x3 size={32} />
            </div>
            <div className="feature-content">
              <h3>1. Multi-Layer Carrier Architecture</h3>
              <p>
                <strong>Standard apps:</strong> Use a single carrier pair (e.g., 200Hz left / 205Hz right = 5Hz beat)
              </p>
              <p>
                <strong>Frequency Zen:</strong> Multiple simultaneous carrier pairs (6-15 pairs) running at different 
                frequencies. For example, Focus 10 uses 6 pairs:
              </p>
              <ul className="tech-list">
                <li>100Hz / 105Hz (primary carrier)</li>
                <li>200Hz / 205Hz (second harmonic)</li>
                <li>300Hz / 305Hz (third harmonic)</li>
                <li>150Hz / 155Hz (harmonic interval)</li>
                <li>250Hz / 255Hz (fifth harmonic)</li>
                <li>400Hz / 405Hz (fourth harmonic)</li>
              </ul>
              <p>
                Each pair creates the same target beat frequency but at different carrier frequencies, creating 
                harmonic complexity and layered entrainment that standard apps cannot achieve.
              </p>
            </div>
          </div>

          <div className="feature-detail">
            <div className="feature-icon">
              <Radio size={32} />
            </div>
            <div className="feature-content">
              <h3>2. Phase Relationships Between Layers</h3>
              <p>
                <strong>Standard apps:</strong> No phase control or all layers start in phase
              </p>
              <p>
                <strong>Frequency Zen:</strong> Each carrier layer has a specific phase offset (0°, 45°, 90°, 30°, 60°, 135°, etc.) 
                creating constructive/destructive interference patterns. These phase relationships:
              </p>
              <ul className="tech-list">
                <li>Enhance entrainment through wave interference</li>
                <li>Create more complex brainwave patterns</li>
                <li>Provide multi-dimensional entrainment pathways</li>
                <li>Reduce habituation through phase variation</li>
              </ul>
            </div>
          </div>

          <div className="feature-detail">
            <div className="feature-icon">
              <Zap size={32} />
            </div>
            <div className="feature-content">
              <h3>3. Simultaneous Isochronic Tones</h3>
              <p>
                <strong>Standard apps:</strong> Offer binaural beats OR isochronic tones, not both together
              </p>
              <p>
                <strong>Frequency Zen:</strong> Isochronic tones (pulsing tones using LFO modulation) work simultaneously 
                with binaural beats. Example - Focus 10 includes:
              </p>
              <ul className="tech-list">
                <li>2 isochronic layers pulsing at 5Hz and 10Hz</li>
                <li>Configurable duty cycle, pulse rate, and volume</li>
                <li>Layered on top of 6 carrier frequency pairs</li>
                <li>Creates complementary entrainment pathways</li>
              </ul>
              <p>
                This dual entrainment approach (binaural + isochronic) provides stronger and more reliable brainwave 
                entrainment than either technique alone.
              </p>
            </div>
          </div>

          <div className="feature-detail">
            <div className="feature-icon">
              <FileCode size={32} />
            </div>
            <div className="feature-content">
              <h3>4. Dynamic Layer Orchestration</h3>
              <p>
                <strong>Standard apps:</strong> Fixed simple audio generation
              </p>
              <p>
                <strong>Frequency Zen:</strong> A sophisticated <code>GatewaySignalGenerator</code> class orchestrates 
                multiple independent audio nodes:
              </p>
              <ul className="tech-list">
                <li>Each <code>CarrierLayerNode</code> manages its own stereo pair with independent volume/phase</li>
                <li>Each <code>IsochronicNode</code> manages LFO-modulated pulsing tones</li>
                <li>All layers mix together in real-time through native Web Audio API</li>
                <li>Precise timing control using <code>audioContext.currentTime</code></li>
              </ul>
              <p>
                This isn't just "binaural beats" - it's a multi-voice synthesizer creating layered brainwave entrainment signals.
              </p>
            </div>
          </div>

          <div className="feature-detail">
            <div className="feature-icon">
              <Waves size={32} />
            </div>
            <div className="feature-content">
              <h3>5. Signal Complexity Scaling</h3>
              <p>
                <strong>Standard apps:</strong> Same simple approach for all frequencies
              </p>
              <p>
                <strong>Frequency Zen:</strong> Complexity scales with the target state:
              </p>
              <ul className="tech-list">
                <li><strong>Focus 10:</strong> 6 carriers + 2 isochronic = 8 total techniques</li>
                <li><strong>Focus 12:</strong> 7 carriers + 3 isochronic = 10 total techniques</li>
                <li><strong>Focus 15:</strong> 8 carriers + 3 isochronic = 11 total techniques</li>
                <li><strong>Focus 21:</strong> 12 carriers + 5 isochronic = 17 total techniques</li>
                <li><strong>Focus 27:</strong> 15 carriers + 6 isochronic = 21 total techniques</li>
              </ul>
              <p>
                More advanced states use more layers, creating increasingly complex and powerful entrainment signals.
              </p>
            </div>
          </div>

          <div className="feature-detail">
            <div className="feature-icon">
              <Cpu size={32} />
            </div>
            <div className="feature-content">
              <h3>6. Native Web Audio API Implementation</h3>
              <p>
                Built directly on Web Audio API nodes for maximum precision:
              </p>
              <ul className="tech-list">
                <li>Direct control over oscillators, gains, LFOs, and routing</li>
                <li>Proper stereo channel merging with <code>ChannelMergerNode</code></li>
                <li>Precise timing with <code>audioContext.currentTime</code></li>
                <li>50ms fade-in/fade-out to prevent clicks and artifacts</li>
                <li>Real-time audio processing without pre-rendered files</li>
              </ul>
              <p>
                This gives us fine-grained control that simple audio libraries cannot provide.
              </p>
            </div>
          </div>
        </section>

        {/* Why It Matters */}
        <section className="why-it-matters">
          <h2>Why This Matters</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <h3>Multiple Entrainment Pathways</h3>
              <p>
                Carrier layers + isochronic tones create complementary entrainment mechanisms, 
                increasing effectiveness through multiple simultaneous pathways.
              </p>
            </div>
            <div className="benefit-card">
              <h3>Harmonic Richness</h3>
              <p>
                Multiple carrier frequencies add depth and complexity versus a single pair, 
                creating more natural and engaging audio experiences.
              </p>
            </div>
            <div className="benefit-card">
              <h3>Phase Interactions</h3>
              <p>
                Controlled phase relationships enhance brainwave coherence through wave interference 
                patterns that simple binaurals cannot create.
              </p>
            </div>
            <div className="benefit-card">
              <h3>Real-Time Precision</h3>
              <p>
                Native Web Audio API implementation provides fine-grained control over every aspect 
                of the audio generation process.
              </p>
            </div>
            <div className="benefit-card">
              <h3>Scalable Complexity</h3>
              <p>
                More complex states use more layers, creating increasingly sophisticated entrainment 
                signals as needed.
              </p>
            </div>
            <div className="benefit-card">
              <h3>No Artifacts</h3>
              <p>
                Smooth fade-in/fade-out prevents clicks, pops, and static that can disrupt the 
                entrainment experience.
              </p>
            </div>
          </div>
        </section>

        {/* Technical Implementation Note */}
        <section className="technical-note">
          <div className="note-box">
            <h3>Technical Implementation</h3>
            <p>
              Frequency Zen's Gateway frequency system uses our custom-built multi-layer audio synthesis engine. 
              While inspired by research into advanced brainwave entrainment techniques, our implementation uses 
              publicly available principles and our own technical innovations. The exact proprietary specifications 
              of commercial Hemi-Sync systems are not publicly available.
            </p>
            <p>
              All Gateway signals are generated in real-time using native Web Audio API, creating clean, 
              artifact-free audio without pre-rendered files. The system is fully open-source and transparent 
              about its implementation.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TechnologyComparison;

