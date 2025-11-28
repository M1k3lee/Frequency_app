/**
 * Gateway Signal Configurations
 * Based on research into Hemi-Sync technology and Gateway Experience frequencies
 */

export interface CarrierLayer {
  leftFreq: number;
  rightFreq: number;
  beatFreq: number;
  volume: number;
  phase: number;
}

export interface IsochronicLayer {
  frequency: number;
  pulseRate: number;
  dutyCycle: number;
  volume: number;
}

export interface GatewaySignalConfig {
  id: string;
  name: string;
  targetBeatFreq: number;
  carrierLayers: CarrierLayer[];
  isochronicLayers: IsochronicLayer[];
  description: string;
}

export const FOCUS_10_CONFIG: GatewaySignalConfig = {
  id: 'gateway-focus-10',
  name: 'Gateway Focus 10',
  targetBeatFreq: 5.0,
  description: 'Mind awake, body asleep',
  carrierLayers: [
    { leftFreq: 100.0, rightFreq: 105.0, beatFreq: 5.0, volume: 0.85, phase: 0 },
    { leftFreq: 200.0, rightFreq: 205.0, beatFreq: 5.0, volume: 0.70, phase: Math.PI / 4 },
    { leftFreq: 300.0, rightFreq: 305.0, beatFreq: 5.0, volume: 0.55, phase: Math.PI / 2 },
    { leftFreq: 150.0, rightFreq: 155.0, beatFreq: 5.0, volume: 0.60, phase: Math.PI / 6 },
    { leftFreq: 250.0, rightFreq: 255.0, beatFreq: 5.0, volume: 0.50, phase: Math.PI / 3 },
    { leftFreq: 400.0, rightFreq: 405.0, beatFreq: 5.0, volume: 0.40, phase: 3 * Math.PI / 4 },
  ],
  isochronicLayers: [
    { frequency: 5.0, pulseRate: 5.0, dutyCycle: 0.5, volume: 0.25 },
    { frequency: 10.0, pulseRate: 5.0, dutyCycle: 0.4, volume: 0.15 },
  ],
};

export const FOCUS_12_CONFIG: GatewaySignalConfig = {
  id: 'gateway-focus-12',
  name: 'Gateway Focus 12',
  targetBeatFreq: 4.0,
  description: 'Expanded awareness',
  carrierLayers: [
    { leftFreq: 100.0, rightFreq: 104.0, beatFreq: 4.0, volume: 0.90, phase: 0 },
    { leftFreq: 200.0, rightFreq: 204.0, beatFreq: 4.0, volume: 0.75, phase: Math.PI / 6 },
    { leftFreq: 150.0, rightFreq: 154.0, beatFreq: 4.0, volume: 0.65, phase: Math.PI / 3 },
    { leftFreq: 300.0, rightFreq: 304.0, beatFreq: 4.0, volume: 0.60, phase: Math.PI / 2 },
    { leftFreq: 250.0, rightFreq: 254.0, beatFreq: 4.0, volume: 0.55, phase: 2 * Math.PI / 3 },
    { leftFreq: 400.0, rightFreq: 404.0, beatFreq: 4.0, volume: 0.45, phase: 5 * Math.PI / 6 },
    { leftFreq: 500.0, rightFreq: 504.0, beatFreq: 4.0, volume: 0.35, phase: Math.PI },
  ],
  isochronicLayers: [
    { frequency: 4.0, pulseRate: 4.0, dutyCycle: 0.5, volume: 0.30 },
    { frequency: 8.0, pulseRate: 4.0, dutyCycle: 0.4, volume: 0.20 },
    { frequency: 12.0, pulseRate: 4.0, dutyCycle: 0.35, volume: 0.15 },
  ],
};

export const FOCUS_15_CONFIG: GatewaySignalConfig = {
  id: 'gateway-focus-15',
  name: 'Gateway Focus 15',
  targetBeatFreq: 5.0,
  description: 'No time',
  carrierLayers: [
    { leftFreq: 100.0, rightFreq: 105.0, beatFreq: 5.0, volume: 0.88, phase: 0 },
    { leftFreq: 150.0, rightFreq: 155.0, beatFreq: 5.0, volume: 0.72, phase: Math.PI / 5 },
    { leftFreq: 200.0, rightFreq: 205.0, beatFreq: 5.0, volume: 0.68, phase: 2 * Math.PI / 5 },
    { leftFreq: 300.0, rightFreq: 305.0, beatFreq: 5.0, volume: 0.58, phase: 3 * Math.PI / 5 },
    { leftFreq: 250.0, rightFreq: 255.0, beatFreq: 5.0, volume: 0.62, phase: 4 * Math.PI / 5 },
    { leftFreq: 350.0, rightFreq: 355.0, beatFreq: 5.0, volume: 0.52, phase: Math.PI },
    { leftFreq: 450.0, rightFreq: 455.0, beatFreq: 5.0, volume: 0.42, phase: 6 * Math.PI / 5 },
    { leftFreq: 500.0, rightFreq: 505.0, beatFreq: 5.0, volume: 0.38, phase: 7 * Math.PI / 5 },
  ],
  isochronicLayers: [
    { frequency: 5.0, pulseRate: 5.0, dutyCycle: 0.5, volume: 0.28 },
    { frequency: 10.0, pulseRate: 5.0, dutyCycle: 0.45, volume: 0.18 },
    { frequency: 15.0, pulseRate: 5.0, dutyCycle: 0.40, volume: 0.12 },
  ],
};

export const FOCUS_21_CONFIG: GatewaySignalConfig = {
  id: 'gateway-focus-21',
  name: 'Gateway Focus 21',
  targetBeatFreq: 4.5,
  description: 'Edge of perception',
  carrierLayers: [
    { leftFreq: 100.0, rightFreq: 104.5, beatFreq: 4.5, volume: 0.92, phase: 0 },
    { leftFreq: 150.0, rightFreq: 154.5, beatFreq: 4.5, volume: 0.78, phase: Math.PI / 8 },
    { leftFreq: 200.0, rightFreq: 204.5, beatFreq: 4.5, volume: 0.74, phase: Math.PI / 4 },
    { leftFreq: 250.0, rightFreq: 254.5, beatFreq: 4.5, volume: 0.70, phase: 3 * Math.PI / 8 },
    { leftFreq: 300.0, rightFreq: 304.5, beatFreq: 4.5, volume: 0.66, phase: Math.PI / 2 },
    { leftFreq: 350.0, rightFreq: 354.5, beatFreq: 4.5, volume: 0.62, phase: 5 * Math.PI / 8 },
    { leftFreq: 400.0, rightFreq: 404.5, beatFreq: 4.5, volume: 0.58, phase: 3 * Math.PI / 4 },
    { leftFreq: 450.0, rightFreq: 454.5, beatFreq: 4.5, volume: 0.54, phase: 7 * Math.PI / 8 },
    { leftFreq: 500.0, rightFreq: 504.5, beatFreq: 4.5, volume: 0.50, phase: Math.PI },
    { leftFreq: 550.0, rightFreq: 554.5, beatFreq: 4.5, volume: 0.46, phase: 9 * Math.PI / 8 },
    { leftFreq: 600.0, rightFreq: 604.5, beatFreq: 4.5, volume: 0.42, phase: 5 * Math.PI / 4 },
    { leftFreq: 650.0, rightFreq: 654.5, beatFreq: 4.5, volume: 0.38, phase: 11 * Math.PI / 8 },
  ],
  isochronicLayers: [
    { frequency: 4.5, pulseRate: 4.5, dutyCycle: 0.5, volume: 0.32 },
    { frequency: 9.0, pulseRate: 4.5, dutyCycle: 0.45, volume: 0.22 },
    { frequency: 13.5, pulseRate: 4.5, dutyCycle: 0.40, volume: 0.16 },
    { frequency: 18.0, pulseRate: 4.5, dutyCycle: 0.35, volume: 0.12 },
    { frequency: 22.5, pulseRate: 4.5, dutyCycle: 0.30, volume: 0.10 },
  ],
};

export const FOCUS_27_CONFIG: GatewaySignalConfig = {
  id: 'gateway-focus-27',
  name: 'Gateway Focus 27',
  targetBeatFreq: 3.5,
  description: 'Recycling station',
  carrierLayers: [
    { leftFreq: 100.0, rightFreq: 103.5, beatFreq: 3.5, volume: 0.95, phase: 0 },
    { leftFreq: 150.0, rightFreq: 153.5, beatFreq: 3.5, volume: 0.82, phase: Math.PI / 10 },
    { leftFreq: 200.0, rightFreq: 203.5, beatFreq: 3.5, volume: 0.78, phase: Math.PI / 5 },
    { leftFreq: 250.0, rightFreq: 253.5, beatFreq: 3.5, volume: 0.74, phase: 3 * Math.PI / 10 },
    { leftFreq: 300.0, rightFreq: 303.5, beatFreq: 3.5, volume: 0.70, phase: 2 * Math.PI / 5 },
    { leftFreq: 350.0, rightFreq: 353.5, beatFreq: 3.5, volume: 0.66, phase: Math.PI / 2 },
    { leftFreq: 400.0, rightFreq: 403.5, beatFreq: 3.5, volume: 0.62, phase: 3 * Math.PI / 5 },
    { leftFreq: 450.0, rightFreq: 453.5, beatFreq: 3.5, volume: 0.58, phase: 7 * Math.PI / 10 },
    { leftFreq: 500.0, rightFreq: 503.5, beatFreq: 3.5, volume: 0.54, phase: 4 * Math.PI / 5 },
    { leftFreq: 550.0, rightFreq: 553.5, beatFreq: 3.5, volume: 0.50, phase: 9 * Math.PI / 10 },
    { leftFreq: 600.0, rightFreq: 603.5, beatFreq: 3.5, volume: 0.46, phase: Math.PI },
    { leftFreq: 650.0, rightFreq: 653.5, beatFreq: 3.5, volume: 0.42, phase: 11 * Math.PI / 10 },
    { leftFreq: 700.0, rightFreq: 703.5, beatFreq: 3.5, volume: 0.38, phase: 6 * Math.PI / 5 },
    { leftFreq: 750.0, rightFreq: 753.5, beatFreq: 3.5, volume: 0.34, phase: 13 * Math.PI / 10 },
    { leftFreq: 800.0, rightFreq: 803.5, beatFreq: 3.5, volume: 0.30, phase: 7 * Math.PI / 5 },
  ],
  isochronicLayers: [
    { frequency: 3.5, pulseRate: 3.5, dutyCycle: 0.5, volume: 0.35 },
    { frequency: 7.0, pulseRate: 3.5, dutyCycle: 0.45, volume: 0.25 },
    { frequency: 10.5, pulseRate: 3.5, dutyCycle: 0.40, volume: 0.18 },
    { frequency: 14.0, pulseRate: 3.5, dutyCycle: 0.35, volume: 0.14 },
    { frequency: 17.5, pulseRate: 3.5, dutyCycle: 0.30, volume: 0.12 },
    { frequency: 21.0, pulseRate: 3.5, dutyCycle: 0.25, volume: 0.10 },
  ],
};

export const SCHUMANN_RESONANCE_CONFIG: GatewaySignalConfig = {
  id: 'gateway-schumann',
  name: 'Schumann Resonance',
  targetBeatFreq: 7.83,
  description: 'Earth\'s natural frequency',
  carrierLayers: [
    { leftFreq: 100.0, rightFreq: 107.83, beatFreq: 7.83, volume: 0.80, phase: 0 },
    { leftFreq: 200.0, rightFreq: 207.83, beatFreq: 7.83, volume: 0.65, phase: Math.PI / 4 },
    { leftFreq: 300.0, rightFreq: 307.83, beatFreq: 7.83, volume: 0.50, phase: Math.PI / 2 },
    { leftFreq: 150.0, rightFreq: 157.83, beatFreq: 7.83, volume: 0.60, phase: Math.PI / 6 },
  ],
  isochronicLayers: [
    { frequency: 7.83, pulseRate: 7.83, dutyCycle: 0.5, volume: 0.30 },
  ],
};

export function getGatewayConfig(id: string): GatewaySignalConfig | null {
  const configs: Record<string, GatewaySignalConfig> = {
    'gateway-focus-10': FOCUS_10_CONFIG,
    'gateway-focus-12': FOCUS_12_CONFIG,
    'gateway-focus-15': FOCUS_15_CONFIG,
    'gateway-focus-21': FOCUS_21_CONFIG,
    'gateway-focus-27': FOCUS_27_CONFIG,
    'gateway-schumann': SCHUMANN_RESONANCE_CONFIG,
    'gateway-6.3': FOCUS_10_CONFIG,
    'gateway-40.5': FOCUS_12_CONFIG,
    'gateway-15.5': FOCUS_15_CONFIG,
    'gateway-21': FOCUS_21_CONFIG,
    'gateway-27': FOCUS_27_CONFIG,
    'gateway-7.83': SCHUMANN_RESONANCE_CONFIG,
  };
  return configs[id] || null;
}
