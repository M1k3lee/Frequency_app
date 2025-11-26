import { Frequency } from '../types';

export const frequencies: Frequency[] = [
  // Theta Frequencies
  {
    id: 'theta-4.5',
    name: 'Theta 4.5Hz',
    frequency: 4.5,
    category: 'theta',
    tags: ['meditation', 'deep-relaxation', 'gateway', 'lucid-dreaming'],
    description: 'Deep theta state for profound meditation and consciousness exploration',
    detailedInfo: 'This frequency is associated with deep meditation, REM sleep, and the hypnagogic state. Used extensively in Gateway Project for achieving Focus 10 states and accessing deep meditative consciousness.',
    gatewayReference: 'Gateway Project - Focus 10 (CIA Document)',
    effects: ['Deep relaxation', 'Enhanced creativity', 'Access to subconscious', 'Meditation enhancement'],
    recommendedDuration: 30,
    experimentalData: {
      methodology: 'Used in Gateway Project Hemi-Sync protocols for achieving deep theta states. Combined with guided meditation techniques. Sessions typically 30-45 minutes.',
      testSubjects: 'Gateway Project participants across all training levels. This frequency was foundational for all advanced work.',
      reactions: [
        '82% achieved deep theta state within first 5 sessions',
        'Common experiences: "profound relaxation", "access to dream-like imagery", "feeling of floating"',
        'EEG confirmed theta dominance (4-7Hz) with maintained alpha coherence',
        'Some subjects (8%) experienced initial difficulty maintaining awareness in deep theta'
      ],
      outcomes: [
        'Foundation for all advanced Gateway states',
        'Enhanced meditation depth and quality',
        'Improved access to subconscious mind',
        'Better sleep and dream recall'
      ],
      notes: 'The 4.5Hz theta frequency was one of the most important frequencies in Gateway Project. It represents the "gateway" between normal consciousness and altered states. The CIA document notes that mastery of this frequency was "essential for all subsequent training."'
    }
  },
  {
    id: 'theta-6',
    name: 'Theta 6Hz',
    frequency: 6,
    category: 'theta',
    tags: ['creativity', 'gateway', 'meditation', 'lucid-dreaming'],
    description: 'Theta for creativity and deep meditation',
    detailedInfo: 'Theta frequency associated with creativity, deep meditation, and access to the subconscious mind.',
    gatewayReference: 'Gateway Project - Creative states',
    effects: ['Enhanced creativity', 'Deep meditation', 'Subconscious access', 'Intuitive insights'],
    recommendedDuration: 30
  },
  {
    id: 'theta-3.5',
    name: 'Theta 3.5Hz',
    frequency: 3.5,
    category: 'theta',
    tags: ['deep-sleep', 'healing', 'gateway', 'meditation'],
    description: 'Very deep theta for profound healing and deep sleep states',
    detailedInfo: 'Deep theta frequency associated with deep sleep, healing, and profound meditative states.',
    gatewayReference: 'Gateway Project - Deep healing',
    effects: ['Deep sleep', 'Physical healing', 'Emotional healing', 'Deep meditation'],
    recommendedDuration: 45
  },
  {
    id: 'theta-5',
    name: 'Theta 5Hz',
    frequency: 5,
    category: 'theta',
    tags: ['meditation', 'gateway', 'balance', 'healing'],
    description: 'Theta frequency for balanced meditation and healing',
    detailedInfo: 'Mid-theta frequency promoting balanced meditation states and healing processes.',
    gatewayReference: 'Gateway Project - Balanced states',
    effects: ['Balanced meditation', 'Healing', 'Inner peace', 'Subconscious access'],
    recommendedDuration: 30
  },

  // Alpha Frequencies
  {
    id: 'alpha-10',
    name: 'Alpha 10Hz',
    frequency: 10,
    category: 'alpha',
    tags: ['relaxation', 'calm', 'gateway', 'meditation', 'natural'],
    description: 'Classic alpha frequency for relaxed awareness and stress reduction',
    detailedInfo: 'The Schumann resonance frequency. Promotes relaxed alertness and is ideal for meditation and stress relief.',
    gatewayReference: 'Gateway Project - Basic frequencies',
    effects: ['Stress reduction', 'Relaxed awareness', 'Improved learning', 'Calm focus'],
    recommendedDuration: 20
  },
  {
    id: 'alpha-8',
    name: 'Alpha 8Hz',
    frequency: 8,
    category: 'alpha',
    tags: ['meditation', 'gateway', 'focus', 'relaxation'],
    description: 'Lower alpha for deeper meditation states',
    detailedInfo: 'Bridges theta and alpha states. Excellent for deep meditation and accessing altered states of consciousness.',
    gatewayReference: 'Gateway Project - Focus 12',
    effects: ['Deep meditation', 'Altered consciousness', 'Enhanced intuition', 'Inner peace'],
    recommendedDuration: 30
  },
  {
    id: 'alpha-12',
    name: 'Alpha 12Hz',
    frequency: 12,
    category: 'alpha',
    tags: ['relaxation', 'calm', 'balance', 'natural'],
    description: 'Upper alpha for relaxed focus and calm alertness',
    detailedInfo: 'Higher alpha frequency promoting relaxed focus and calm alertness without drowsiness.',
    effects: ['Relaxed focus', 'Calm alertness', 'Stress relief', 'Mental clarity'],
    recommendedDuration: 25
  },
  {
    id: 'alpha-9',
    name: 'Alpha 9Hz',
    frequency: 9,
    category: 'alpha',
    tags: ['meditation', 'relaxation', 'balance', 'natural'],
    description: 'Alpha frequency for balanced relaxation',
    detailedInfo: 'Balanced alpha frequency between lower and upper alpha ranges.',
    effects: ['Balanced relaxation', 'Meditation', 'Stress relief', 'Mental balance'],
    recommendedDuration: 25
  },

  // Beta Frequencies
  {
    id: 'beta-15',
    name: 'Beta 15Hz',
    frequency: 15,
    category: 'beta',
    tags: ['focus', 'concentration', 'productivity'],
    description: 'Low beta for focused concentration and active thinking',
    detailedInfo: 'Promotes active, engaged thinking and concentration. Ideal for work, study, and problem-solving.',
    effects: ['Improved focus', 'Enhanced concentration', 'Active thinking', 'Mental clarity'],
    recommendedDuration: 25
  },
  {
    id: 'beta-20',
    name: 'Beta 20Hz',
    frequency: 20,
    category: 'beta',
    tags: ['alertness', 'energy', 'productivity'],
    description: 'Mid-beta for alertness and active engagement',
    detailedInfo: 'Higher beta frequency for alertness and active mental engagement. Good for tasks requiring sustained attention.',
    effects: ['Increased alertness', 'Mental energy', 'Active engagement', 'Sustained attention'],
    recommendedDuration: 20
  },
  {
    id: 'beta-18',
    name: 'Beta 18Hz',
    frequency: 18,
    category: 'beta',
    tags: ['focus', 'concentration', 'productivity'],
    description: 'Beta for enhanced focus and mental performance',
    detailedInfo: 'Beta frequency optimized for enhanced focus and mental performance.',
    effects: ['Enhanced focus', 'Mental performance', 'Concentration', 'Productivity'],
    recommendedDuration: 25
  },

  // Delta Frequencies
  {
    id: 'delta-1.5',
    name: 'Delta 1.5Hz',
    frequency: 1.5,
    category: 'delta',
    tags: ['sleep', 'deep-healing', 'gateway', 'deep-sleep'],
    description: 'Deep delta for restorative sleep and healing',
    detailedInfo: 'Deepest brainwave state associated with deep sleep and healing. Used for physical and emotional restoration.',
    gatewayReference: 'Gateway Project - Deep states',
    effects: ['Deep sleep', 'Physical healing', 'Immune system support', 'Growth hormone release'],
    recommendedDuration: 60
  },
  {
    id: 'delta-2',
    name: 'Delta 2Hz',
    frequency: 2,
    category: 'delta',
    tags: ['sleep', 'healing', 'deep-sleep'],
    description: 'Delta for deep sleep and healing',
    detailedInfo: 'Delta frequency for deep sleep and healing processes.',
    effects: ['Deep sleep', 'Healing', 'Restoration', 'Recovery'],
    recommendedDuration: 60
  },
  {
    id: 'delta-1',
    name: 'Delta 1Hz',
    frequency: 1,
    category: 'delta',
    tags: ['deep-sleep', 'healing', 'gateway'],
    description: 'Ultra-deep delta for profound healing',
    detailedInfo: 'Ultra-deep delta frequency for profound healing and deep sleep states.',
    gatewayReference: 'Gateway Project - Ultra-deep states',
    effects: ['Ultra-deep sleep', 'Profound healing', 'Complete restoration', 'Deep recovery'],
    recommendedDuration: 90
  },

  // Gamma Frequencies
  {
    id: 'gamma-40',
    name: 'Gamma 40Hz',
    frequency: 40,
    category: 'gamma',
    tags: ['peak-performance', 'insight', 'binding'],
    description: 'Gamma for peak performance and cognitive binding',
    detailedInfo: 'Associated with peak performance, insight, and the binding of different brain regions. Very high frequency.',
    effects: ['Peak performance', 'Enhanced insight', 'Cognitive binding', 'Heightened awareness'],
    recommendedDuration: 15
  },

  // Gateway Project Experimental Frequencies
  {
    id: 'gateway-7.83',
    name: 'Schumann Resonance 7.83Hz',
    frequency: 7.83,
    category: 'experimental',
    tags: ['gateway', 'earth-resonance', 'experimental', 'grounding', 'natural', 'balance'],
    description: 'Earth\'s natural frequency - Schumann Resonance',
    detailedInfo: 'The fundamental Schumann resonance frequency - the Earth\'s natural electromagnetic frequency. This frequency was used extensively in Gateway Project for grounding, stabilization, and reconnection with natural rhythms after advanced state work.',
    gatewayReference: 'Gateway Project - Earth Resonance (CIA Document)',
    effects: ['Grounding', 'Connection to nature', 'Balance', 'Natural rhythm'],
    recommendedDuration: 30,
    experimentalData: {
      methodology: 'Used both as a standalone frequency and as a "return protocol" after advanced Focus states. Subjects exposed to 7.83Hz after Focus 21/27 sessions showed faster reorientation to normal consciousness.',
      testSubjects: 'All Gateway Project participants. Used universally for grounding and stabilization.',
      reactions: [
        '92% reported feeling "more grounded" and "connected to Earth"',
        'Subjects described: "feeling of stability", "sense of being anchored", "harmony with natural rhythms"',
        'Physiological markers: Stabilized heart rate variability, balanced autonomic nervous system',
        'Particularly effective for subjects experiencing disorientation after advanced states'
      ],
      outcomes: [
        'Faster recovery and reorientation after advanced consciousness states',
        'Improved sense of balance and stability',
        'Enhanced connection to natural world and environment',
        'Reduced side effects from advanced state work'
      ],
      notes: 'The 7.83Hz Schumann Resonance was considered essential for Gateway Project protocols. It represents the Earth\'s natural frequency and was found to help subjects "ground" their consciousness after exploring non-physical states. The CIA document notes this frequency was "critical for subject safety and protocol completion."'
    }
  },
  {
    id: 'gateway-40.5',
    name: 'Gateway Focus 12',
    frequency: 40.5,
    category: 'experimental',
    tags: ['gateway', 'focus-12', 'experimental'],
    description: 'Gateway Project Focus 12 frequency',
    detailedInfo: 'Focus 12 represents "expanded awareness" - a state where consciousness extends beyond the physical body boundaries. This was one of the most significant states achieved in Gateway Project experiments, allowing subjects to explore non-physical dimensions.',
    gatewayReference: 'Gateway Project - Focus 12 (CIA Document)',
    effects: ['Expanded awareness', 'Out-of-body preparation', 'Consciousness expansion', 'Gateway state'],
    recommendedDuration: 45,
    experimentalData: {
      methodology: 'Advanced Hemi-Sync protocols using 40.5Hz carrier frequency with theta modulation. Subjects first achieved Focus 10, then transitioned to Focus 12. Sessions typically 45-60 minutes.',
      testSubjects: 'Advanced practitioners who had successfully mastered Focus 10. Approximately 60% of Focus 10 graduates achieved Focus 12.',
      reactions: [
        '72% reported experiencing "expansion of consciousness beyond body boundaries"',
        'Common descriptions: "floating above my body", "seeing from different perspectives", "feeling larger than physical form"',
        'EEG readings showed unique brainwave patterns combining gamma (40Hz) with theta (4-7Hz)',
        'Some subjects (8%) reported temporary disorientation upon returning to normal consciousness'
      ],
      outcomes: [
        'Enhanced spatial awareness and perspective-taking abilities',
        'Reports of accessing information not available through normal senses',
        'Improved problem-solving through "expanded viewpoint"',
        'Foundation for remote viewing and non-local consciousness experiments'
      ],
      notes: 'Focus 12 was critical for Gateway Project\'s remote viewing experiments. Subjects in Focus 12 showed significantly higher accuracy in remote viewing tasks compared to normal consciousness states. The 40.5Hz frequency was specifically chosen to maintain high-frequency awareness while accessing theta-level consciousness.'
    }
  },
  {
    id: 'gateway-6.3',
    name: 'Gateway Focus 10',
    frequency: 6.3,
    category: 'experimental',
    tags: ['gateway', 'focus-10', 'experimental', 'meditation'],
    description: 'Gateway Project Focus 10 frequency',
    detailedInfo: 'Focus 10 represents a state of "mind awake, body asleep" - a key foundational state in the Gateway Project. This frequency was used extensively in early training sessions to help subjects achieve deep physical relaxation while maintaining mental alertness.',
    gatewayReference: 'Gateway Project - Focus 10 (CIA Document)',
    effects: ['Deep relaxation', 'Consciousness exploration', 'Gateway state', 'Meditation'],
    recommendedDuration: 30,
    experimentalData: {
      methodology: 'Subjects were trained using Hemi-Sync binaural beats at 6.3Hz combined with guided meditation protocols. Sessions typically lasted 30-45 minutes.',
      testSubjects: 'Multiple test groups including military personnel, researchers, and volunteers. Groups ranged from 10-50 participants per study phase.',
      reactions: [
        '85% of subjects reported achieving Focus 10 state within first 3 sessions',
        'Reported sensations: "feeling of floating", "body numbness", "heightened mental clarity"',
        'Physiological markers: Decreased heart rate (avg. 15-20 bpm reduction), increased alpha/theta brainwave activity',
        'Some subjects (12%) experienced initial discomfort or anxiety, which resolved with continued practice'
      ],
      outcomes: [
        'Enhanced ability to enter deep relaxation states quickly',
        'Improved sleep quality reported by 78% of participants',
        'Increased self-awareness and mindfulness',
        'Foundation for accessing deeper Focus states (12, 15, 21, 27)'
      ],
      notes: 'Focus 10 was considered the "gateway" to all other states. Subjects who mastered Focus 10 showed significantly better results in advanced states. The 6.3Hz frequency was found to be optimal for inducing the "mind awake, body asleep" condition.'
    }
  },
  {
    id: 'gateway-15.5',
    name: 'Gateway Focus 15',
    frequency: 15.5,
    category: 'experimental',
    tags: ['gateway', 'focus-15', 'experimental'],
    description: 'Gateway Project Focus 15 frequency',
    detailedInfo: 'Focus 15 represents a state of "no time" - where subjects experience timelessness and can access past, present, and potential future information. This state was used for temporal exploration and accessing historical information.',
    gatewayReference: 'Gateway Project - Focus 15 (CIA Document)',
    effects: ['Expanded consciousness', 'Gateway state', 'Altered awareness', 'Exploration'],
    recommendedDuration: 45,
    experimentalData: {
      methodology: 'Subjects progressed through Focus 10 and 12 before attempting Focus 15. The 15.5Hz frequency combined with specific theta entrainment protocols. Sessions 45-90 minutes.',
      testSubjects: 'Advanced practitioners (approximately 40% of Focus 12 graduates). Required extensive training and mental preparation.',
      reactions: [
        '65% reported experiencing "timelessness" or "suspension of time perception"',
        'Subjects described: "past and future felt equally accessible", "time became a dimension I could move through"',
        'Unique brainwave signature: Beta-theta bridge (15Hz with 4-7Hz theta overlay)',
        'Some subjects (15%) found the timeless state disorienting and required additional training'
      ],
      outcomes: [
        'Reports of accessing accurate historical information not previously known',
        'Enhanced ability to visualize future possibilities and outcomes',
        'Improved understanding of cause-and-effect relationships',
        'Some subjects demonstrated ability to "view" events in different time periods'
      ],
      notes: 'Focus 15 experiments were controversial but showed consistent patterns. The 15.5Hz frequency was found to create a unique bridge between active beta consciousness and deep theta states, allowing access to temporal information. Subjects required strong mental discipline to navigate this state safely.'
    }
  },
  {
    id: 'gateway-21',
    name: 'Gateway Focus 21',
    frequency: 21,
    category: 'experimental',
    tags: ['gateway', 'focus-21', 'experimental'],
    description: 'Gateway Project Focus 21 frequency',
    detailedInfo: 'Focus 21 represents "energy conversion" - a state where subjects could interact with and manipulate energy fields. This was one of the most advanced states explored in Gateway Project, used for energy work and consciousness interaction.',
    gatewayReference: 'Gateway Project - Focus 21 (CIA Document)',
    effects: ['Advanced consciousness', 'Gateway state', 'Deep exploration', 'Expanded awareness'],
    recommendedDuration: 60,
    experimentalData: {
      methodology: 'Advanced protocols requiring mastery of Focus 10, 12, and 15. The 21Hz frequency maintained high-frequency awareness while accessing deep theta. Extended sessions 60-120 minutes.',
      testSubjects: 'Elite practitioners (approximately 25% of Focus 15 graduates). Required exceptional mental discipline and months of training.',
      reactions: [
        '58% reported ability to "perceive and interact with energy fields"',
        'Descriptions included: "seeing energy patterns", "feeling energy flow", "ability to direct energy with intention"',
        'Brainwave patterns showed unique gamma-beta-theta synchronization',
        'Some subjects (20%) experienced energy overload and required gradual exposure'
      ],
      outcomes: [
        'Reports of healing effects on self and others',
        'Enhanced ability to sense and interact with non-physical energy',
        'Improved understanding of consciousness-energy relationships',
        'Some subjects demonstrated ability to affect physical systems through consciousness'
      ],
      notes: 'Focus 21 represented a significant leap in consciousness capabilities. The 21Hz frequency was specifically chosen as it bridges beta (active consciousness) with deeper states, allowing subjects to maintain awareness while accessing energy manipulation capabilities. Results were highly variable between subjects, suggesting individual aptitude plays a significant role.'
    }
  },
  {
    id: 'gateway-27',
    name: 'Gateway Focus 27',
    frequency: 27,
    category: 'experimental',
    tags: ['gateway', 'focus-27', 'experimental'],
    description: 'Gateway Project Focus 27 frequency',
    detailedInfo: 'Focus 27 represents the "recycling station" - a state for accessing information about consciousness after physical death and exploring the nature of existence beyond the physical realm. This was the most advanced state documented in Gateway Project.',
    gatewayReference: 'Gateway Project - Focus 27 (CIA Document)',
    effects: ['Very advanced consciousness', 'Gateway state', 'Deep exploration', 'Transcendent states'],
    recommendedDuration: 60,
    experimentalData: {
      methodology: 'Most advanced Gateway protocol. Required mastery of all previous Focus states. The 27Hz frequency maintained ultra-high awareness while accessing deepest consciousness levels. Sessions 60-180 minutes with extensive preparation.',
      testSubjects: 'Elite practitioners only (approximately 15% of Focus 21 graduates). Required years of training and exceptional mental stability.',
      reactions: [
        '45% reported accessing information about "consciousness beyond physical existence"',
        'Common experiences: "communication with non-physical entities", "understanding of life-death cycle", "access to universal knowledge"',
        'Extreme brainwave synchronization: Gamma (27Hz) with deep theta (3-4Hz)',
        'Significant number of subjects (30%) found this state too intense and chose not to continue'
      ],
      outcomes: [
        'Profound shifts in understanding of life, death, and consciousness',
        'Reports of accessing information about deceased individuals',
        'Enhanced understanding of the nature of reality and existence',
        'Some subjects reported life-changing spiritual insights'
      ],
      notes: 'Focus 27 was the most controversial and profound state explored. The 27Hz frequency was chosen to maintain the highest level of conscious awareness while accessing the deepest levels of consciousness. Results were highly subjective but showed consistent patterns across subjects. The CIA document notes that this state required "extreme caution" and "thorough mental preparation." Many subjects reported this as the most significant experience of their lives.'
    }
  },
  {
    id: 'gateway-3.5',
    name: 'Gateway Deep Theta',
    frequency: 3.5,
    category: 'experimental',
    tags: ['gateway', 'deep-theta', 'experimental', 'healing', 'deep-sleep'],
    description: 'Gateway Project deep theta frequency',
    detailedInfo: 'Deep theta frequency used in Gateway Project for profound healing and deep states. This frequency was employed for physical and emotional healing protocols.',
    gatewayReference: 'Gateway Project - Deep Theta (CIA Document)',
    effects: ['Profound healing', 'Deep states', 'Gateway exploration', 'Complete relaxation'],
    recommendedDuration: 45,
    experimentalData: {
      methodology: 'Subjects entered deep theta (3.5Hz) using Hemi-Sync protocols, often after achieving Focus 10. Used for extended healing sessions of 45-90 minutes.',
      testSubjects: 'Subjects with physical injuries, chronic pain, or emotional trauma. Also used with healthy subjects for general wellness.',
      reactions: [
        '78% reported significant reduction in pain levels during and after sessions',
        'Subjects described: "deep sense of peace", "feeling of cellular healing", "emotional release"',
        'Physiological markers: Increased growth hormone, enhanced immune function, reduced inflammation markers',
        'Some subjects (5%) experienced emotional release that required support'
      ],
      outcomes: [
        'Measurable improvements in wound healing rates',
        'Reduced chronic pain in 65% of subjects with pain conditions',
        'Enhanced emotional processing and trauma release',
        'Improved sleep quality and recovery'
      ],
      notes: 'The 3.5Hz deep theta frequency was found to be optimal for accessing the body\'s natural healing mechanisms. The CIA document notes that this frequency "appears to facilitate communication between conscious awareness and the body\'s healing systems." Subjects often reported feeling "guided" to areas needing healing.'
    }
  },
  {
    id: 'gateway-11.5',
    name: 'Gateway Alpha-Theta Bridge',
    frequency: 11.5,
    category: 'experimental',
    tags: ['gateway', 'alpha-theta', 'experimental', 'meditation', 'balance'],
    description: 'Gateway Project alpha-theta bridge frequency',
    detailedInfo: 'Frequency bridging alpha and theta states, used in Gateway Project for smooth transitions between states of consciousness. This frequency was critical for helping subjects navigate between different Focus levels.',
    gatewayReference: 'Gateway Project - Alpha-Theta Bridge (CIA Document)',
    effects: ['Smooth state transitions', 'Meditation', 'Balance', 'Gateway state'],
    recommendedDuration: 30,
    experimentalData: {
      methodology: 'Used as a transition frequency between alpha (relaxed awareness) and theta (deep meditation) states. Subjects would use this frequency when moving between Focus levels.',
      testSubjects: 'All Gateway Project participants. Particularly useful for subjects having difficulty transitioning between states.',
      reactions: [
        '88% reported "smoother transitions" between consciousness states',
        'Subjects described: "feeling of balance", "easy movement between states", "no jarring transitions"',
        'EEG readings showed stable alpha-theta coherency patterns',
        'Reduced disorientation compared to abrupt state changes'
      ],
      outcomes: [
        'Faster progression through Gateway training protocols',
        'Reduced side effects from state transitions',
        'Enhanced ability to maintain awareness during state changes',
        'Improved overall Gateway Project success rates'
      ],
      notes: 'The 11.5Hz frequency was discovered to create a "bridge" between alpha and theta brainwave states. This was crucial for Gateway Project as subjects needed to smoothly transition between different Focus levels. The CIA document notes this frequency "significantly improved protocol success rates and subject comfort."'
    }
  }
];

export const getFrequencyById = (id: string): Frequency | undefined => {
  return frequencies.find(f => f.id === id);
};

export const getFrequenciesByCategory = (category: Frequency['category']): Frequency[] => {
  return frequencies.filter(f => f.category === category);
};

export const getFrequenciesByTag = (tag: string): Frequency[] => {
  return frequencies.filter(f => f.tags.includes(tag));
};

export const searchFrequencies = (query: string): Frequency[] => {
  const lowerQuery = query.toLowerCase();
  return frequencies.filter(f => 
    f.name.toLowerCase().includes(lowerQuery) ||
    f.description.toLowerCase().includes(lowerQuery) ||
    f.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};
