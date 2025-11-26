import React from 'react';
import './AppHeader.css';

// Use Vite's BASE_URL for proper path resolution with GitHub Pages
const logoPath = `${import.meta.env.BASE_URL}zen_frequency_logo.png`;

const AppHeader: React.FC = () => {
  return (
    <header className="app-header">
      <img src={logoPath} alt="Frequency Zen" className="app-logo" />
    </header>
  );
};

export default AppHeader;

