import { BackgroundSound } from '../types';

export const backgroundSounds: BackgroundSound[] = [
  // New MP3-based sounds
  {
    id: 'zen-garden',
    name: 'Zen Garden',
    category: 'spa',
    description: 'Peaceful zen garden ambiance',
    icon: '🧘',
    file: 'zen-garden.mp3'
  },
  {
    id: 'distant-thunder',
    name: 'Distant Thunderstorm',
    category: 'nature',
    description: 'Distant thunder and rain for deep relaxation',
    icon: '⛈️',
    file: 'distant-thunder.mp3'
  },
  {
    id: 'forest-rain',
    name: 'Forest Rain',
    category: 'nature',
    description: 'Gentle rain in a peaceful forest',
    icon: '🌧️',
    file: 'Forest_Rain.mp3'
  },
  {
    id: 'ocean-waves',
    name: 'Ocean Waves',
    category: 'nature',
    description: 'Calming ocean waves on the shore',
    icon: '🌊',
    file: 'ocean-waves.mp3'
  },
  {
    id: 'singing-bowls',
    name: 'Singing Bowls',
    category: 'spa',
    description: 'Meditative singing bowl tones',
    icon: '🔔',
    file: 'singing-bowls.mp3'
  },
  {
    id: 'spring-mountain',
    name: 'Spring Mountain',
    category: 'nature',
    description: 'Serene mountain spring ambiance',
    icon: '⛰️',
    file: 'spring_mountain.mp3'
  },
  {
    id: 'drift-lullaby',
    name: 'Drift Lullaby',
    category: 'spa',
    description: 'Gentle drifting lullaby for deep relaxation',
    icon: '🌙',
    file: 'drift-lul1.mp3'
  },
  // Legacy programmatic sounds (kept for backward compatibility)
  {
    id: 'rain',
    name: 'Gentle Rain',
    category: 'nature',
    description: 'Soothing rainfall for deep relaxation',
    icon: '🌧️'
  },
  {
    id: 'forest-birds',
    name: 'Forest Ambiance',
    category: 'nature',
    description: 'Peaceful forest with natural sounds',
    icon: '🌲'
  },
  {
    id: 'wind',
    name: 'Gentle Wind',
    category: 'nature',
    description: 'Soft wind through trees',
    icon: '🍃'
  },
  {
    id: 'white-noise',
    name: 'White Noise',
    category: 'noise',
    description: 'Neutral white noise for focus',
    icon: '⚪'
  },
  {
    id: 'pink-noise',
    name: 'Pink Noise',
    category: 'noise',
    description: 'Natural-sounding pink noise',
    icon: '🌸'
  },
  {
    id: 'brown-noise',
    name: 'Brown Noise',
    category: 'noise',
    description: 'Deep, rumbling brown noise',
    icon: '🟤'
  }
];

export const getBackgroundSoundById = (id: string): BackgroundSound | undefined => {
  return backgroundSounds.find(sound => sound.id === id);
};

export const getBackgroundSoundsByCategory = (category: BackgroundSound['category']): BackgroundSound[] => {
  return backgroundSounds.filter(sound => sound.category === category);
};

