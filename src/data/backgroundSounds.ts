import { BackgroundSound } from '../types';

export const backgroundSounds: BackgroundSound[] = [
  {
    id: 'rain',
    name: 'Gentle Rain',
    category: 'nature',
    description: 'Soothing rainfall for deep relaxation',
    icon: '🌧️'
  },
  {
    id: 'ocean-waves',
    name: 'Ocean Waves',
    category: 'nature',
    description: 'Calming ocean waves on the shore',
    icon: '🌊'
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

