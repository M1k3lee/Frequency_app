import { useMobileOptimizations } from './hooks/useMobileOptimizations';
import { useAppStore } from './store/useAppStore';
import AppHeader from './components/AppHeader';
import HeroSection from './components/HeroSection';
import FrequencyLibrary from './components/FrequencyLibrary';
import AdvancedPanel from './components/AdvancedPanel';
import GatewayMode from './components/GatewayMode';
import BreathingGuide from './components/BreathingGuide';
import VisualCanvas from './components/VisualCanvas';
import PlaybackBar from './components/PlaybackBar';
import './App.css';

function App() {
  useMobileOptimizations();
  const { showAdvanced, showGateway, showBreathing } = useAppStore();

  return (
    <div className="app">
      <VisualCanvas />
      
      <div className="app-content">
        <AppHeader />
        {showAdvanced ? (
          <AdvancedPanel />
        ) : showGateway ? (
          <GatewayMode />
        ) : showBreathing ? (
          <BreathingGuide />
        ) : (
          <>
            <HeroSection />
            <FrequencyLibrary />
          </>
        )}
        <PlaybackBar />
      </div>
    </div>
  );
}

export default App;
