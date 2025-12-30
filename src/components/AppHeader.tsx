import React from 'react';
import HeadphoneQualitySelector from './HeadphoneQualitySelector';
import './AppHeader.css';

// Use Vite's BASE_URL for proper path resolution with GitHub Pages
const logoPath = `${import.meta.env.BASE_URL}zen_frequency_logo.png`;

const AppHeader: React.FC = () => {
  return (
    <header className="app-header">
      <div className="header-left">
        <a 
          href="https://play.google.com/store/apps/details?id=com.frequencyzen.app" 
          className="play-store-button-header"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img 
            src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" 
            alt="Get it on Google Play" 
            className="play-store-badge-header"
          />
        </a>
      </div>
      <img src={logoPath} alt="Frequency Zen" className="app-logo" />
      <HeadphoneQualitySelector variant="header" />
    </header>
  );
};

export default AppHeader;

