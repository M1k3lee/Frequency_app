export interface Frequency {
  id: string;
  name: string;
  frequency: number;
  category: 'theta' | 'alpha' | 'beta' | 'delta' | 'gamma' | 'experimental';
  tags: string[];
  description: string;
  detailedInfo?: string;
  gatewayReference?: string;
  effects?: string[];
  recommendedDuration?: number; // in minutes
  experimentalData?: {
    methodology?: string;
    testSubjects?: string;
    reactions?: string[];
    outcomes?: string[];
    notes?: string;
  };
}

export interface ActiveFrequency {
  id: string;
  frequencyId: string;
  volume: number;
  pan: number;
  enabled: boolean;
}

export interface AudioMix {
  id: string;
  name: string;
  description?: string;
  frequencies: Array<{
    frequencyId: string;
    volume: number;
    pan: number;
    enabled: boolean;
  }>;
  masterVolume: number;
  createdAt: number;
}

export interface Playlist {
  id: string;
  name: string;
  frequencyIds: string[];
  createdAt: number;
}

export type VisualPreset = 'starlit-void' | 'flowing-energy' | 'mandala' | 'gateway-portal' | 'breathing-orb' | 'none';

export interface FrequencySequence {
  id: string;
  name: string;
  steps: Array<{
    frequencyId: string;
    duration: number; // in minutes
    volume?: number;
    pan?: number;
  }>;
  fadeDuration?: number; // in seconds, for transitions between steps
  createdAt: number;
}

