import React from 'react';
import { useNavigate } from 'react-router-dom';
import { isMobileApp } from '../utils/isMobileApp';
import './Footer.css';

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const isMobile = isMobileApp();
  
  const handleLinkClick = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    navigate(path);
  };

  const articleCategories = [
    {
      title: 'Learn About Frequencies',
      links: [
        { path: '/articles/what-are-binaural-beats', title: 'What Are Binaural Beats?', description: 'Complete guide to binaural beats and brainwave entrainment' },
        { path: '/articles/brainwave-frequencies-explained', title: 'Brainwave Frequencies Explained', description: 'Understanding alpha, beta, theta, delta, and gamma waves' },
        { path: '/articles/best-frequencies-for-sleep', title: 'Best Frequencies for Sleep', description: 'Discover the best Hz frequencies for deep, restful sleep' },
        { path: '/articles/best-frequencies-for-focus', title: 'Best Frequencies for Focus', description: 'Optimal brainwave frequencies for concentration and study' },
        { path: '/articles/best-frequencies-for-meditation', title: 'Best Frequencies for Meditation', description: 'Guide to meditation frequencies and their benefits' }
      ]
    },
    {
      title: 'App Guides',
      links: [
        { path: '/articles/best-sleep-app-android', title: 'Best Sleep App for Android', description: 'Top-rated sleep frequency apps for Android devices' },
        { path: '/articles/best-study-sounds-app', title: 'Best Study Sounds App', description: 'Find the perfect app for focus and concentration while studying' },
        { path: '/articles/free-meditation-apps', title: 'Free Meditation Apps', description: 'Best free meditation and binaural beats apps available' },
        { path: '/articles/gateway-project-frequencies', title: 'Gateway Project Frequencies', description: 'Explore declassified Gateway Project consciousness frequencies' }
      ]
    },
    {
      title: 'Frequency Therapy',
      links: [
        { path: '/articles/theta-waves-for-sleep', title: 'Theta Waves for Sleep', description: 'How theta frequencies promote deep, restorative sleep' },
        { path: '/articles/alpha-waves-for-focus', title: 'Alpha Waves for Focus', description: 'Using alpha brainwaves to enhance concentration and learning' },
        { path: '/articles/binaural-beats-for-anxiety', title: 'Binaural Beats for Anxiety', description: 'How binaural beats can help reduce anxiety and stress' },
        { path: '/articles/frequency-therapy-guide', title: 'Frequency Therapy Guide', description: 'Complete guide to using frequencies for wellness and healing' }
      ]
    }
  ];

  return (
    <footer className={`app-footer ${isMobile ? 'mobile-footer' : ''}`}>
      <div className="footer-content">
        {!isMobile && (
          <div className="footer-main">
            <div className="footer-brand">
              <h3>Frequency Zen</h3>
              <p>Free binaural beats and meditation sounds for sleep, focus, and relaxation. Experience the power of brainwave entrainment.</p>
            </div>

            <div className="footer-links">
              {articleCategories.map((category, index) => (
                <div key={index} className="footer-category">
                  <h4>{category.title}</h4>
                  <ul>
                    {category.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <a 
                          href={link.path} 
                          onClick={(e) => handleLinkClick(link.path, e)}
                          title={link.description}
                        >
                          {link.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {isMobile && (
          <div className="footer-mobile">
            <div className="footer-brand-mobile">
              <h3>Frequency Zen</h3>
            </div>
            <div className="footer-links-mobile">
              {articleCategories.map((category, index) => (
                <div key={index} className="footer-category-mobile">
                  <h4>{category.title}</h4>
                  <ul>
                    {category.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <a 
                          href={link.path} 
                          onClick={(e) => handleLinkClick(link.path, e)}
                          title={link.description}
                        >
                          {link.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="footer-bottom">
          <div className="footer-meta">
            <p>&copy; {currentYear} Frequency Zen. All rights reserved.</p>
            <div className="footer-links-inline">
              <a href="/privacy" onClick={(e) => handleLinkClick('/privacy', e)}>Privacy Policy</a>
              <span>•</span>
              <a href="/terms" onClick={(e) => handleLinkClick('/terms', e)}>Terms of Service</a>
              <span>•</span>
              <a href="/about" onClick={(e) => handleLinkClick('/about', e)}>About</a>
            </div>
          </div>
          <p className="footer-disclaimer">
            Frequency Zen is not a medical device. Individual experiences may vary. Consult a healthcare professional for medical advice.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

