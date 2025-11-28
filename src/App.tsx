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
import './App.css';

function AppContent() {
  useMobileOptimizations();
  usePageTracking();
  const { showAdvanced, showGateway, showBreathing } = useAppStore();
  const location = useLocation();
  const isArticlePage = location.pathname.startsWith('/articles');

  return (
    <div className="app">
      {!isArticlePage && <VisualCanvas />}
      
      <div className="app-content">
        <AppHeader />
        <Routes>
          <Route path="/articles/:slug" element={<Article />} />
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
                  <AdMobNativeAd adUnitId="ca-app-pub-1993326848971014/2440032906" />
                  <FrequencyLibrary />
                </>
              )}
              <Footer />
            </>
          } />
        </Routes>
        {!isArticlePage && <PlaybackBar />}
      </div>
    </div>
  );
}

function App() {
  return <AppContent />;
}

export default App;
