import React from 'react';
import { Link } from 'react-router-dom';
import { Download } from 'lucide-react';
import { isMobileApp } from '../utils/isMobileApp';
import './Footer.css';

const Footer: React.FC = () => {
  const isMobile = isMobileApp();
  const currentYear = new Date().getFullYear();

  if (isMobile) {
    return (
      <footer className="app-footer mobile-footer">
        <div className="footer-content">
          <div className="footer-mobile">
            <div className="footer-brand-mobile">
              <h3>Frequency Zen</h3>
            </div>
            <div className="footer-links-mobile">
              <div className="footer-category-mobile">
                <h4>Learn</h4>
                <ul>
                  <li><Link to="/articles/what-are-binaural-beats">What Are Binaural Beats?</Link></li>
                  <li><Link to="/articles/brainwave-frequencies-explained">Brainwave Frequencies</Link></li>
                  <li><Link to="/articles/best-frequencies-for-sleep">Best Sleep Frequencies</Link></li>
                  <li><Link to="/articles/best-frequencies-for-focus">Best Focus Frequencies</Link></li>
                  <li><Link to="/articles/best-frequencies-for-meditation">Best Meditation Frequencies</Link></li>
                </ul>
              </div>
              <div className="footer-category-mobile">
                <h4>App Guides</h4>
                <ul>
                  <li><Link to="/articles/best-sleep-app-android">Best Sleep App</Link></li>
                  <li><Link to="/articles/best-study-sounds-app">Study Sounds App</Link></li>
                  <li><Link to="/articles/free-meditation-apps">Free Meditation Apps</Link></li>
                  <li><Link to="/articles/gateway-project-frequencies">Gateway Project</Link></li>
                </ul>
              </div>
              <div className="footer-category-mobile">
                <h4>Resources</h4>
                <ul>
                  <li><Link to="/technology">Advanced Technology</Link></li>
                  <li><Link to="/privacy">Privacy Policy</Link></li>
                </ul>
              </div>
            </div>
            <div className="footer-bottom-mobile">
              <p className="footer-copyright-mobile">
                © {currentYear} Frequency Zen. All rights reserved.
              </p>
              <p className="footer-disclaimer-mobile">
                Frequency Zen is not a medical device. Individual experiences may vary. Consult a healthcare professional for medical advice.
              </p>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-main">
          <div className="footer-brand">
            <h3>Frequency Zen</h3>
            <p>
              Free binaural beats and meditation sounds for sleep, focus, and relaxation. 
              Experience the power of brainwave entrainment.
            </p>
            <div className="footer-download">
              <a 
                href="/downloads/frequency-zen.apk" 
                className="download-button"
                download
              >
                <Download className="download-icon" />
                Available on Google Play Soon
              </a>
              <p className="download-note">
                Android app coming soon to the Google Play Store
              </p>
            </div>
          </div>
          <div className="footer-links">
            <div className="footer-category">
              <h4>Learn About Frequencies</h4>
              <ul>
                <li><Link to="/articles/what-are-binaural-beats">What Are Binaural Beats?</Link></li>
                <li><Link to="/articles/brainwave-frequencies-explained">Brainwave Frequencies Explained</Link></li>
                <li><Link to="/articles/best-frequencies-for-sleep">Best Frequencies for Sleep</Link></li>
                <li><Link to="/articles/best-frequencies-for-focus">Best Frequencies for Focus</Link></li>
                <li><Link to="/articles/best-frequencies-for-meditation">Best Frequencies for Meditation</Link></li>
              </ul>
            </div>
            <div className="footer-category">
              <h4>App Guides</h4>
              <ul>
                <li><Link to="/articles/best-sleep-app-android">Best Sleep App for Android</Link></li>
                <li><Link to="/articles/best-study-sounds-app">Best Study Sounds App</Link></li>
                <li><Link to="/articles/free-meditation-apps">Free Meditation Apps</Link></li>
                <li><Link to="/articles/gateway-project-frequencies">Gateway Project Frequencies</Link></li>
              </ul>
            </div>
            <div className="footer-category">
              <h4>Frequency Therapy</h4>
              <ul>
                <li><Link to="/articles/theta-waves-for-sleep">Theta Waves for Sleep</Link></li>
                <li><Link to="/articles/alpha-waves-for-focus">Alpha Waves for Focus</Link></li>
                <li><Link to="/articles/binaural-beats-for-anxiety">Binaural Beats for Anxiety</Link></li>
                <li><Link to="/articles/frequency-therapy-guide">Frequency Therapy Guide</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-meta">
            <p>© {currentYear} Frequency Zen. All rights reserved.</p>
            <div className="footer-links-inline">
              <Link to="/technology">Advanced Technology</Link>
              <span>•</span>
              <Link to="/privacy">Privacy Policy</Link>
              <span>•</span>
              <Link to="/terms">Terms of Service</Link>
              <span>•</span>
              <Link to="/about">About</Link>
            </div>
            <p className="footer-disclaimer">
              Frequency Zen is not a medical device. Individual experiences may vary. 
              Consult a healthcare professional for medical advice.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
