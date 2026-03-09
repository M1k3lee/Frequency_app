import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useMobileOptimizations } from './hooks/useMobileOptimizations';
import { usePageTracking } from './hooks/usePageTracking';
import { useAppStore } from './store/useAppStore';
import AppHeader from './components/AppHeader';
import HeroSection from './components/HeroSection';
import FrequencyLibrary from './components/FrequencyLibrary';
import AdvancedPanel from './components/AdvancedPanel';
import GatewayMode from './components/GatewayMode';
import BreathingGuide from './components/BreathingGuide';
import VisualCanvas from './components/VisualCanvas';
import PlaybackBar from './components/PlaybackBar';
import AdMobNativeAd from './components/AdMobNativeAd';
import Footer from './components/Footer';
import Article from './components/Article';
import TechnologyComparison from './components/TechnologyComparison';
import PrivacyPolicy from './components/PrivacyPolicy';
import SessionCinematicOverlay from './components/SessionCinematicOverlay';
import {
  ANDROID_ADMOB_BANNER_AD_UNIT_ID,
  ANDROID_ADMOB_USE_TEST_ADS,
} from './config/admob';
import './App.css';

function AppContent() {
  useMobileOptimizations();
  usePageTracking();
  const { showAdvanced, showGateway, showBreathing, isFocusMode } = useAppStore();
  const location = useLocation();
  const isStandalonePage = location.pathname.startsWith('/articles') || 
                           location.pathname.startsWith('/technology') ||
                           location.pathname.startsWith('/privacy') ||
                           location.pathname.startsWith('/terms') ||
                           location.pathname.startsWith('/about');

  useEffect(() => {
    if (isFocusMode) {
      document.body.classList.add('focus-mode-active');
    } else {
      document.body.classList.remove('focus-mode-active');
    }

    return () => {
      document.body.classList.remove('focus-mode-active');
    };
  }, [isFocusMode]);

  return (
    <div className="app">
      {!isStandalonePage && <VisualCanvas />}
      {!isStandalonePage && <SessionCinematicOverlay />}
      
      <div className={`app-content ${isFocusMode ? 'focus-mode' : ''}`}>
        <AppHeader />
        <Routes>
          <Route path="/articles/:slug" element={<Article />} />
          <Route path="/technology" element={<><TechnologyComparison /><Footer /></>} />
          <Route path="/privacy" element={<><PrivacyPolicy /><Footer /></>} />
          <Route path="*" element={
            <>
              {showAdvanced ? (
                <AdvancedPanel />
              ) : showGateway ? (
                <GatewayMode />
              ) : showBreathing ? (
                <BreathingGuide />
              ) : (
                <>
                  <HeroSection />
                  <AdMobNativeAd
                    adUnitId={ANDROID_ADMOB_BANNER_AD_UNIT_ID}
                    useTestAds={ANDROID_ADMOB_USE_TEST_ADS}
                  />
                  <FrequencyLibrary />
                </>
              )}
              <Footer />
            </>
          } />
        </Routes>
        {!isStandalonePage && <PlaybackBar />}
      </div>
    </div>
  );
}

function App() {
  return <AppContent />;
}

export default App;
