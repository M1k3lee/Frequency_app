import React from 'react';
import './AppHeader.css';

const logoPath = '/zen_frequency_logo.png';

const AppHeader: React.FC = () => {
  return (
    <header className="app-header">
      <img src={logoPath} alt="Frequency Zen" className="app-logo" />
    </header>
  );
};

export default AppHeader;

