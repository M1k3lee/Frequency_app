# Gateway Frequency Audio System - Complete Technical Documentation

## Executive Summary

The Gateway Frequency Audio System is a sophisticated multi-layer audio entrainment system that generates complex binaural beats and isochronic tones to recreate Gateway Project-inspired signals. Unlike simple binaural beat generators, this system uses multiple carrier frequency pairs (binaural beats) combined with isochronic tone layers, all with carefully calculated phase relationships to create enhanced brainwave entrainment effects.

**Key Technical Facts:**
- Uses **Web Audio API** (not Tone.js) for gateway signals
- Generates **6-15 carrier frequency pairs** per gateway card
- Includes **1-6 isochronic tone layers** per gateway card
- Total of **7-21 simultaneous audio entrainment techniques** per signal
- All layers are combined through a master gain node for precise volume control
- Smooth 50ms fade-in/fade-out to prevent audio clicks

---

## System Architecture

### Component Overview

The gateway audio system consists of four main components:

1. **GatewaySignalGenerator** (`src/audio/gateway/GatewaySignalGenerator.ts`)
   - Main orchestrator class
   - Manages all carrier and isochronic layers
   - Handles initialization, start/stop, and volume control
   - Connects all layers to a master gain node

2. **CarrierLayerNode** (`src/audio/gateway/CarrierLayer.ts`)
   - Creates binaural beats using left/right oscillator pairs
   - Each layer generates a single binaural beat frequency
   - Supports phase offset configuration
   - Uses ChannelMergerNode to create stereo output

3. **IsochronicNode** (`src/audio/gateway/IsochronicLayer.ts`)
   - Creates pulsing tones using an oscillator modulated by an LFO
   - Square wave LFO creates the pulsing effect
   - Configurable duty cycle controls pulse width
   - Frequency modulation creates the isochronic pattern

4. **AudioEngine Integration** (`src/audio/AudioEngine.ts`)
   - Detects gateway signals via `isGatewaySignal` flag or `getGatewayConfig()` lookup
   - Routes gateway signals to GatewaySignalGenerator
   - Manages Web Audio API context (uses Tone.js's underlying context)
   - Handles volume control and master gain

### Technology Stack

- **Web Audio API**: Direct use for gateway signals (more control)
- **Tone.js**: Used for regular frequencies and context management
- **TypeScript**: Full type safety throughout
- **React**: UI components for user interaction

### Audio Graph Structure

```
User Click → GatewayMode Component
    ↓
addFrequency() → useAppStore
    ↓
AudioEngine.playFrequency()
    ↓
Detect Gateway Signal → getGatewayConfig()
    ↓
Create GatewaySignalGenerator
    ↓
Initialize with Config
    ├─→ Create 6-15 CarrierLayerNode instances
    └─→ Create 1-6 IsochronicNode instances
    ↓
Connect all layers → Master Gain Node
    ↓
Master Gain → Gateway Gain → Web Audio Destination
```

---

## Section 1: Complete Frequency Specifications

### Gateway Card: Focus 10 (Gateway ID: gateway-6.3)

**Display Name:** Gateway Focus 10  
**Frequency:** 6.3 Hz  
**Description:** "Mind awake, body asleep"  
**Target Beat Frequency:** 5.0 Hz (theta)

#### Carrier Layers (6 total)

| Layer | Left Frequency (Hz) | Right Frequency (Hz) | Beat Frequency (Hz) | Volume | Phase Offset |
|-------|---------------------|----------------------|---------------------|--------|--------------|
| 1 | 100.0 | 105.0 | 5.0 | 0.85 | 0° (0) |
| 2 | 200.0 | 205.0 | 5.0 | 0.70 | 45° (π/4) |
| 3 | 300.0 | 305.0 | 5.0 | 0.55 | 90° (π/2) |
| 4 | 150.0 | 155.0 | 5.0 | 0.60 | 30° (π/6) |
| 5 | 250.0 | 255.0 | 5.0 | 0.50 | 60° (π/3) |
| 6 | 400.0 | 405.0 | 5.0 | 0.40 | 135° (3π/4) |

**Total Carrier Frequencies Generated:** 12 (6 left + 6 right)

#### Isochronic Layers (2 total)

| Layer | Frequency (Hz) | Pulse Rate (Hz) | Duty Cycle | Volume |
|-------|----------------|-----------------|------------|--------|
| 1 | 5.0 | 5.0 | 0.5 (50%) | 0.25 |
| 2 | 10.0 | 5.0 | 0.4 (40%) | 0.15 |

**Total Entrainment Techniques:** 8 (6 carrier + 2 isochronic)

---

### Gateway Card: Focus 12 (Gateway ID: gateway-40.5)

**Display Name:** Gateway Focus 12  
**Frequency:** 40.5 Hz  
**Description:** "Expanded awareness"  
**Target Beat Frequency:** 4.0 Hz (theta)

#### Carrier Layers (7 total)

| Layer | Left Frequency (Hz) | Right Frequency (Hz) | Beat Frequency (Hz) | Volume | Phase Offset |
|-------|---------------------|----------------------|---------------------|--------|--------------|
| 1 | 100.0 | 104.0 | 4.0 | 0.90 | 0° (0) |
| 2 | 200.0 | 204.0 | 4.0 | 0.75 | 30° (π/6) |
| 3 | 150.0 | 154.0 | 4.0 | 0.65 | 60° (π/3) |
| 4 | 300.0 | 304.0 | 4.0 | 0.60 | 90° (π/2) |
| 5 | 250.0 | 254.0 | 4.0 | 0.55 | 120° (2π/3) |
| 6 | 400.0 | 404.0 | 4.0 | 0.45 | 150° (5π/6) |
| 7 | 500.0 | 504.0 | 4.0 | 0.35 | 180° (π) |

**Total Carrier Frequencies Generated:** 14 (7 left + 7 right)

#### Isochronic Layers (3 total)

| Layer | Frequency (Hz) | Pulse Rate (Hz) | Duty Cycle | Volume |
|-------|----------------|-----------------|------------|--------|
| 1 | 4.0 | 4.0 | 0.5 (50%) | 0.30 |
| 2 | 8.0 | 4.0 | 0.4 (40%) | 0.20 |
| 3 | 12.0 | 4.0 | 0.35 (35%) | 0.15 |

**Total Entrainment Techniques:** 10 (7 carrier + 3 isochronic)

---

### Gateway Card: Focus 15 (Gateway ID: gateway-15.5)

**Display Name:** Gateway Focus 15  
**Frequency:** 15.5 Hz  
**Description:** "No time"  
**Target Beat Frequency:** 5.0 Hz (deep theta)

#### Carrier Layers (8 total)

| Layer | Left Frequency (Hz) | Right Frequency (Hz) | Beat Frequency (Hz) | Volume | Phase Offset |
|-------|---------------------|----------------------|---------------------|--------|--------------|
| 1 | 100.0 | 105.0 | 5.0 | 0.88 | 0° (0) |
| 2 | 150.0 | 155.0 | 5.0 | 0.72 | 36° (π/5) |
| 3 | 200.0 | 205.0 | 5.0 | 0.68 | 72° (2π/5) |
| 4 | 300.0 | 305.0 | 5.0 | 0.58 | 108° (3π/5) |
| 5 | 250.0 | 255.0 | 5.0 | 0.62 | 144° (4π/5) |
| 6 | 350.0 | 355.0 | 5.0 | 0.52 | 180° (π) |
| 7 | 450.0 | 455.0 | 5.0 | 0.42 | 216° (6π/5) |
| 8 | 500.0 | 505.0 | 5.0 | 0.38 | 252° (7π/5) |

**Total Carrier Frequencies Generated:** 16 (8 left + 8 right)

#### Isochronic Layers (3 total)

| Layer | Frequency (Hz) | Pulse Rate (Hz) | Duty Cycle | Volume |
|-------|----------------|-----------------|------------|--------|
| 1 | 5.0 | 5.0 | 0.5 (50%) | 0.28 |
| 2 | 10.0 | 5.0 | 0.45 (45%) | 0.18 |
| 3 | 15.0 | 5.0 | 0.40 (40%) | 0.12 |

**Total Entrainment Techniques:** 11 (8 carrier + 3 isochronic)

---

### Gateway Card: Focus 21 (Gateway ID: gateway-21)

**Display Name:** Gateway Focus 21  
**Frequency:** 21 Hz  
**Description:** "Edge of perception"  
**Target Beat Frequency:** 4.5 Hz (theta-gamma bridge)

#### Carrier Layers (12 total)

| Layer | Left Frequency (Hz) | Right Frequency (Hz) | Beat Frequency (Hz) | Volume | Phase Offset |
|-------|---------------------|----------------------|---------------------|--------|--------------|
| 1 | 100.0 | 104.5 | 4.5 | 0.92 | 0° (0) |
| 2 | 150.0 | 154.5 | 4.5 | 0.78 | 22.5° (π/8) |
| 3 | 200.0 | 204.5 | 4.5 | 0.74 | 45° (π/4) |
| 4 | 250.0 | 254.5 | 4.5 | 0.70 | 67.5° (3π/8) |
| 5 | 300.0 | 304.5 | 4.5 | 0.66 | 90° (π/2) |
| 6 | 350.0 | 354.5 | 4.5 | 0.62 | 112.5° (5π/8) |
| 7 | 400.0 | 404.5 | 4.5 | 0.58 | 135° (3π/4) |
| 8 | 450.0 | 454.5 | 4.5 | 0.54 | 157.5° (7π/8) |
| 9 | 500.0 | 504.5 | 4.5 | 0.50 | 180° (π) |
| 10 | 550.0 | 554.5 | 4.5 | 0.46 | 202.5° (9π/8) |
| 11 | 600.0 | 604.5 | 4.5 | 0.42 | 225° (5π/4) |
| 12 | 650.0 | 654.5 | 4.5 | 0.38 | 247.5° (11π/8) |

**Total Carrier Frequencies Generated:** 24 (12 left + 12 right)

#### Isochronic Layers (5 total)

| Layer | Frequency (Hz) | Pulse Rate (Hz) | Duty Cycle | Volume |
|-------|----------------|-----------------|------------|--------|
| 1 | 4.5 | 4.5 | 0.5 (50%) | 0.32 |
| 2 | 9.0 | 4.5 | 0.45 (45%) | 0.22 |
| 3 | 13.5 | 4.5 | 0.40 (40%) | 0.16 |
| 4 | 18.0 | 4.5 | 0.35 (35%) | 0.12 |
| 5 | 22.5 | 4.5 | 0.30 (30%) | 0.10 |

**Total Entrainment Techniques:** 17 (12 carrier + 5 isochronic)

---

### Gateway Card: Focus 27 (Gateway ID: gateway-27)

**Display Name:** Gateway Focus 27  
**Frequency:** 27 Hz  
**Description:** "Recycling station"  
**Target Beat Frequency:** 3.5 Hz (deep theta-delta)

#### Carrier Layers (15 total)

| Layer | Left Frequency (Hz) | Right Frequency (Hz) | Beat Frequency (Hz) | Volume | Phase Offset |
|-------|---------------------|----------------------|---------------------|--------|--------------|
| 1 | 100.0 | 103.5 | 3.5 | 0.95 | 0° (0) |
| 2 | 150.0 | 153.5 | 3.5 | 0.82 | 18° (π/10) |
| 3 | 200.0 | 203.5 | 3.5 | 0.78 | 36° (π/5) |
| 4 | 250.0 | 253.5 | 3.5 | 0.74 | 54° (3π/10) |
| 5 | 300.0 | 303.5 | 3.5 | 0.70 | 72° (2π/5) |
| 6 | 350.0 | 353.5 | 3.5 | 0.66 | 90° (π/2) |
| 7 | 400.0 | 403.5 | 3.5 | 0.62 | 108° (3π/5) |
| 8 | 450.0 | 453.5 | 3.5 | 0.58 | 126° (7π/10) |
| 9 | 500.0 | 503.5 | 3.5 | 0.54 | 144° (4π/5) |
| 10 | 550.0 | 553.5 | 3.5 | 0.50 | 162° (9π/10) |
| 11 | 600.0 | 603.5 | 3.5 | 0.46 | 180° (π) |
| 12 | 650.0 | 653.5 | 3.5 | 0.42 | 198° (11π/10) |
| 13 | 700.0 | 703.5 | 3.5 | 0.38 | 216° (6π/5) |
| 14 | 750.0 | 753.5 | 3.5 | 0.34 | 234° (13π/10) |
| 15 | 800.0 | 803.5 | 3.5 | 0.30 | 252° (7π/5) |

**Total Carrier Frequencies Generated:** 30 (15 left + 15 right)

#### Isochronic Layers (6 total)

| Layer | Frequency (Hz) | Pulse Rate (Hz) | Duty Cycle | Volume |
|-------|----------------|-----------------|------------|--------|
| 1 | 3.5 | 3.5 | 0.5 (50%) | 0.35 |
| 2 | 7.0 | 3.5 | 0.45 (45%) | 0.25 |
| 3 | 10.5 | 3.5 | 0.40 (40%) | 0.18 |
| 4 | 14.0 | 3.5 | 0.35 (35%) | 0.14 |
| 5 | 17.5 | 3.5 | 0.30 (30%) | 0.12 |
| 6 | 21.0 | 3.5 | 0.25 (25%) | 0.10 |

**Total Entrainment Techniques:** 21 (15 carrier + 6 isochronic)

---

### Gateway Card: Schumann Resonance (Gateway ID: gateway-7.83)

**Display Name:** Schumann Resonance 7.83Hz  
**Frequency:** 7.83 Hz  
**Description:** "Earth's natural frequency"  
**Target Beat Frequency:** 7.83 Hz (Schumann Resonance)

#### Carrier Layers (4 total)

| Layer | Left Frequency (Hz) | Right Frequency (Hz) | Beat Frequency (Hz) | Volume | Phase Offset |
|-------|---------------------|----------------------|---------------------|--------|--------------|
| 1 | 100.0 | 107.83 | 7.83 | 0.80 | 0° (0) |
| 2 | 200.0 | 207.83 | 7.83 | 0.65 | 45° (π/4) |
| 3 | 300.0 | 307.83 | 7.83 | 0.50 | 90° (π/2) |
| 4 | 150.0 | 157.83 | 7.83 | 0.60 | 30° (π/6) |

**Total Carrier Frequencies Generated:** 8 (4 left + 4 right)

#### Isochronic Layers (1 total)

| Layer | Frequency (Hz) | Pulse Rate (Hz) | Duty Cycle | Volume |
|-------|----------------|-----------------|------------|--------|
| 1 | 7.83 | 7.83 | 0.5 (50%) | 0.30 |

**Total Entrainment Techniques:** 5 (4 carrier + 1 isochronic)

---

## Section 2: Technical Implementation Details

### How Carrier Layers Create Binaural Beats

**Binaural Beats Principle:**
When two slightly different frequencies are played separately to each ear, the brain perceives a third "beat" frequency equal to the difference between the two frequencies. This is a perceptual phenomenon, not an actual audio frequency.

**Implementation:**

1. **Oscillator Creation:**
   - Each carrier layer creates two sine wave oscillators
   - Left oscillator: `leftFreq` Hz
   - Right oscillator: `rightFreq` Hz
   - Beat frequency = `rightFreq - leftFreq`

2. **Stereo Routing:**
   - Left oscillator → Left Gain → Channel 0 of ChannelMergerNode
   - Right oscillator → Right Gain → Channel 1 of ChannelMergerNode
   - ChannelMergerNode creates stereo output (2-channel audio)

3. **Phase Offset:**
   - Phase offsets are configured but not currently applied in CarrierLayerNode
   - Phase relationships create complex interference patterns when multiple layers combine
   - This enhances the entrainment effect beyond simple binaural beats

4. **Volume Control:**
   - Each layer has independent volume control (0.0 to 1.0)
   - Layers are mixed additively (all frequencies sum together)
   - Higher-frequency layers typically have lower volume to prevent masking

**Code Reference:** `src/audio/gateway/CarrierLayer.ts`

```typescript
// Simplified structure
leftOsc.frequency.value = config.leftFreq;  // e.g., 100.0 Hz
rightOsc.frequency.value = config.rightFreq; // e.g., 105.0 Hz
// Brain perceives: 105.0 - 100.0 = 5.0 Hz beat
```

### How Isochronic Layers Create Pulsing Tones

**Isochronic Tones Principle:**
Isochronic tones are regular beats of a single tone that turn on and off rapidly. Unlike binaural beats (which require stereo headphones), isochronic tones work in mono and create a strong rhythmic entrainment effect.

**Implementation:**

1. **Base Oscillator:**
   - Creates a sine wave at the target frequency (e.g., 5.0 Hz)
   - This is the tone that will pulse

2. **LFO (Low Frequency Oscillator):**
   - Creates a square wave at the pulse rate (e.g., 5.0 Hz)
   - Square wave alternates between -1 and +1
   - Controls the amplitude of the base oscillator

3. **Gain Modulation:**
   - LFO → LFO Gain → Base Oscillator Gain Node's `gain` parameter
   - Square wave LFO creates sharp on/off pulses
   - Duty cycle adjusts the pulse width (how long "on" vs "off")

4. **Duty Cycle Calculation:**
   ```typescript
   minGain = 0
   maxGain = volume (e.g., 0.25)
   centerGain = minGain + (maxGain - minGain) * dutyCycle
   // e.g., 0 + (0.25 - 0) * 0.5 = 0.125 (center point)
   ```

5. **Volume Control:**
   - Each isochronic layer has independent volume
   - Lower than carrier layers to provide rhythmic reinforcement without masking

**Code Reference:** `src/audio/gateway/IsochronicLayer.ts`

```typescript
// Simplified structure
osc.frequency.value = config.frequency;     // e.g., 5.0 Hz tone
lfo.frequency.value = config.pulseRate;     // e.g., 5.0 Hz pulses
lfo.type = 'square';                        // Sharp on/off
lfo.connect(lfoGain);
lfoGain.connect(gain.gain);                 // Modulates gain
osc.connect(gain);
```

### Phase Offset Calculations

Phase offsets are specified in radians in the configuration files:

| Degrees | Radians | Example Calculation |
|---------|---------|---------------------|
| 0° | 0 | `0` |
| 30° | π/6 | `Math.PI / 6` |
| 45° | π/4 | `Math.PI / 4` |
| 60° | π/3 | `Math.PI / 3` |
| 90° | π/2 | `Math.PI / 2` |
| 180° | π | `Math.PI` |

**Purpose:**
- Phase offsets create temporal relationships between carrier layers
- Different phase relationships create constructive/destructive interference patterns
- Enhances the entrainment effect by creating complex wave interactions

**Note:** While phase offsets are defined in configurations, they are not currently applied to oscillators in the CarrierLayerNode implementation. The phase relationships exist conceptually in the signal design.

### Gain/Volume Management

**Layer Volume Hierarchy:**

1. **Individual Layer Volume** (0.0 - 1.0)
   - Each carrier/isochronic layer has its own volume
   - Stored in configuration
   - Applied to layer's gain node

2. **Master Gain Node**
   - All layers connect to GatewaySignalGenerator's master gain
   - Master gain default: 1.0 (full volume)
   - Controlled via `setVolume()` method

3. **Gateway Gain Node**
   - Created in AudioEngine for integration with Tone.js
   - Applies user volume setting (0.0 - 1.0)
   - Accounts for Tone.js master volume (dB conversion)

4. **Final Volume Calculation:**
   ```
   Final Volume = Layer Volume × Master Gain × Gateway Gain × User Volume × Master Volume (dB)
   ```

**Volume Balance:**
- Primary carrier layers: 0.80 - 0.95
- Secondary carrier layers: 0.60 - 0.80
- Tertiary carrier layers: 0.40 - 0.60
- Isochronic layers: 0.10 - 0.35 (typically lower)

### Fade-In/Fade-Out Procedures

**Fade-In (50ms):**
1. Start oscillators at volume 0
2. Immediately ramp gain to target volume over 50ms using `linearRampToValueAtTime()`
3. Prevents audio clicks from sudden phase jumps

**Fade-Out (50ms):**
1. Ramp gain from current volume to 0 over 50ms
2. Stop oscillators 60ms after fade starts (50ms fade + 10ms buffer)
3. Prevents audio clicks and ensures clean shutdown

**Code Implementation:**
```typescript
// Fade-in
gain.gain.setValueAtTime(0, now);
gain.gain.linearRampToValueAtTime(targetVolume, now + 0.05); // 50ms

// Fade-out
gain.gain.setValueAtTime(currentVolume, now);
gain.gain.linearRampToValueAtTime(0, now + 0.05); // 50ms
osc.stop(now + 0.06); // 60ms total
```

### Audio Context Management

**Web Audio API Context:**
- Uses Tone.js's underlying Web Audio API context
- Accessed via: `Tone.context.rawContext as AudioContext`
- Ensures compatibility with Tone.js master volume control

**Context State Management:**
1. Check if context is suspended
2. Resume if suspended (required after user interaction)
3. Verify context is running before starting audio
4. Handle autoplay policy restrictions

**Code Flow:**
```typescript
const toneContext = Tone.context;
const webAudioContext = toneContext.rawContext as AudioContext;

if (webAudioContext.state === 'suspended') {
  await webAudioContext.resume();
}
```

---

## Section 3: Code Flow - Complete Execution Path

### Step-by-Step Execution Flow

#### 1. User Interaction (UI Layer)

**File:** `src/components/GatewayMode.tsx`

**Action:** User clicks play button on a gateway frequency card

```typescript
// Line 195: Button click handler
onClick={(e) => handlePlayFrequency(freq.id, e)}
```

**Function:** `handlePlayFrequency(freqId: string, e?: React.MouseEvent)`
- Checks if frequency is already playing
- If playing, stops it
- If not playing, stops all other frequencies
- Calls `addFrequency(freq)` from store

**Code Reference:** Lines 43-83

---

#### 2. State Management (Store Layer)

**File:** `src/store/useAppStore.ts`

**Function:** `addFrequency(frequency: Frequency, volume: number = 0.7, pan: number = 0)`

**Actions:**
1. Check for duplicate playback (lines 104-111)
2. Ensure audio engine is initialized (lines 113-122)
3. Call `audioEngine.playFrequency(frequency, volume, pan)` (line 126)
4. Create ActiveFrequency entry in store (lines 127-138)
5. Update isPlaying state

**Code Reference:** Lines 95-150

---

#### 3. Audio Engine Detection

**File:** `src/audio/AudioEngine.ts`

**Function:** `playFrequency(frequency: Frequency, volume: number = 0.7, pan: number = 0)`

**Gateway Detection Logic (lines 114-121):**
```typescript
const gatewayConfig = getGatewayConfig(frequency.id);
const isGateway = frequency.isGatewaySignal || gatewayConfig !== null;

if (isGateway && gatewayConfig) {
  // Use Gateway signal generator (Web Audio API)
  return await this.playGatewaySignal(gatewayConfig, volume);
}
```

**Detection Methods:**
1. Check `frequency.isGatewaySignal` boolean flag
2. Lookup via `getGatewayConfig(frequency.id)` function

**Code Reference:** Lines 113-121

---

#### 4. Gateway Signal Generation

**File:** `src/audio/AudioEngine.ts`

**Function:** `playGatewaySignal(config: GatewaySignalConfig, volume: number)`

**Steps:**
1. Ensure audio context is initialized (line 375)
2. Stop any existing gateway signal (lines 378-381)
3. Get Web Audio API context from Tone.js (lines 385-386)
4. Resume context if suspended (lines 389-391)
5. Create new GatewaySignalGenerator (line 394)
6. Initialize with configuration (line 395)
7. Create gateway gain node for volume control (lines 399-402)
8. Connect: Generator → Gateway Gain → Destination (lines 405-406)
9. Start playback (line 413)
10. Return unique ID (line 421)

**Code Reference:** Lines 369-422

---

#### 5. Gateway Signal Generator Initialization

**File:** `src/audio/gateway/GatewaySignalGenerator.ts`

**Function:** `initialize(config: GatewaySignalConfig)`

**Steps:**
1. Dispose any existing layers (line 21)
2. Create CarrierLayerNode for each carrier layer config (lines 24-28)
   - Loop through `config.carrierLayers[]`
   - Create CarrierLayerNode instance
   - Connect to master gain
3. Create IsochronicNode for each isochronic layer config (lines 30-34)
   - Loop through `config.isochronicLayers[]`
   - Create IsochronicNode instance
   - Connect to master gain
4. Mark as initialized (line 36)

**Code Reference:** Lines 19-37

---

#### 6. Carrier Layer Creation

**File:** `src/audio/gateway/CarrierLayer.ts`

**Constructor:** `CarrierLayerNode(audioContext, config)`

**Steps:**
1. Create left oscillator at `config.leftFreq` (line 30)
2. Create right oscillator at `config.rightFreq` (line 31)
3. Set oscillator type to 'sine' (lines 32-33)
4. Set frequencies (lines 34-35)
5. Create left and right gain nodes (lines 37-38)
6. Initialize gains to 0 for smooth start (lines 40-41)
7. Create ChannelMergerNode for stereo output (line 43)
8. Connect: Osc → Gain → Merger (lines 44-47)

**Code Reference:** Lines 17-48

---

#### 7. Isochronic Layer Creation

**File:** `src/audio/gateway/IsochronicLayer.ts`

**Constructor:** `IsochronicNode(audioContext, config)`

**Steps:**
1. Create base oscillator at `config.frequency` (line 27)
2. Set oscillator type to 'sine' (line 29)
3. Create LFO (Low Frequency Oscillator) at `config.pulseRate` (line 31)
4. Set LFO type to 'square' for sharp pulses (line 33)
5. Create gain nodes (lines 35-36)
6. Calculate duty cycle adjustments (lines 38-43)
7. Connect: LFO → LFO Gain → Base Osc Gain (lines 47-48)
8. Connect: Base Osc → Gain (line 49)

**Code Reference:** Lines 15-50

---

#### 8. Start Playback

**File:** `src/audio/gateway/GatewaySignalGenerator.ts`

**Function:** `start()`

**Steps:**
1. Verify initialization (lines 44-46)
2. Check if already playing (line 47)
3. Start all carrier layers (line 49)
4. Start all isochronic layers (line 50)
5. Mark as playing (line 51)

**Code Reference:** Lines 43-52

---

#### 9. Individual Layer Start (Carrier)

**File:** `src/audio/gateway/CarrierLayer.ts`

**Function:** `start()`

**Steps:**
1. Check if already playing (line 55)
2. Get current audio time (line 56)
3. Start oscillators (lines 58-59)
4. Cancel any scheduled gain values (lines 61-62)
5. Set gain to 0 immediately (lines 63-64)
6. Ramp gain to target volume over 50ms (lines 65-66)
7. Mark as playing (line 67)

**Code Reference:** Lines 54-69

---

#### 10. Individual Layer Start (Isochronic)

**File:** `src/audio/gateway/IsochronicLayer.ts`

**Function:** `start()`

**Steps:**
1. Check if already playing (line 57)
2. Get current audio time (line 58)
3. Start oscillators (base + LFO) (lines 60-61)
4. Cancel scheduled gain values (line 63)
5. Calculate center gain based on duty cycle (lines 64-66)
6. Set gain to 0 immediately (line 67)
7. Ramp gain to center value over 50ms (line 68)
8. Mark as playing (line 69)

**Code Reference:** Lines 56-71

---

#### 11. Stop Playback

**Stop Flow (Reverse of Start):**
1. User clicks stop/pause button
2. `stopAll()` called in AudioEngine
3. `gatewayGenerator.stop()` called
4. Each layer's `stop()` method called
5. Gain ramped to 0 over 50ms
6. Oscillators stopped after 60ms
7. Layers disposed and cleaned up

**Code Reference:** 
- AudioEngine.stopAll(): Lines 424-441
- GatewaySignalGenerator.stop(): Lines 54-59
- CarrierLayer.stop(): Lines 71-86
- IsochronicLayer.stop(): Lines 73-85

---

## Section 4: Exact Frequency Generation Tables

### Summary: Total Frequencies Per Gateway Card

| Gateway Card | Carrier Layers | Carrier Frequencies (Left) | Carrier Frequencies (Right) | Isochronic Layers | Total Audio Oscillators | Total Entrainment Techniques |
|--------------|----------------|----------------------------|-----------------------------|-------------------|-------------------------|------------------------------|
| Focus 10 | 6 | 6 | 6 | 2 | 14 | 8 |
| Focus 12 | 7 | 7 | 7 | 3 | 17 | 10 |
| Focus 15 | 8 | 8 | 8 | 3 | 19 | 11 |
| Focus 21 | 12 | 12 | 12 | 5 | 29 | 17 |
| Focus 27 | 15 | 15 | 15 | 6 | 36 | 21 |
| Schumann | 4 | 4 | 4 | 1 | 9 | 5 |

**Note:** Each isochronic layer uses 2 oscillators (base + LFO), so total oscillators = (carrier layers × 2) + (isochronic layers × 2)

---

### Complete Frequency Lists by Gateway Card

#### Focus 10 - All Frequencies Generated

**Carrier Frequencies (Binaural Beat Layers):**
- Left Ear: 100.0, 200.0, 300.0, 150.0, 250.0, 400.0 Hz
- Right Ear: 105.0, 205.0, 305.0, 155.0, 255.0, 405.0 Hz
- Perceived Beat: 5.0 Hz (from all 6 pairs)

**Isochronic Frequencies (Pulsing Tone Layers):**
- Base Tone: 5.0 Hz (pulsing at 5.0 Hz)
- Base Tone: 10.0 Hz (pulsing at 5.0 Hz)

**Total Simultaneous Frequencies:** 12 carrier + 2 isochronic = 14 unique frequencies

---

#### Focus 12 - All Frequencies Generated

**Carrier Frequencies (Binaural Beat Layers):**
- Left Ear: 100.0, 200.0, 150.0, 300.0, 250.0, 400.0, 500.0 Hz
- Right Ear: 104.0, 204.0, 154.0, 304.0, 254.0, 404.0, 504.0 Hz
- Perceived Beat: 4.0 Hz (from all 7 pairs)

**Isochronic Frequencies (Pulsing Tone Layers):**
- Base Tone: 4.0 Hz (pulsing at 4.0 Hz)
- Base Tone: 8.0 Hz (pulsing at 4.0 Hz)
- Base Tone: 12.0 Hz (pulsing at 4.0 Hz)

**Total Simultaneous Frequencies:** 14 carrier + 3 isochronic = 17 unique frequencies

---

#### Focus 15 - All Frequencies Generated

**Carrier Frequencies (Binaural Beat Layers):**
- Left Ear: 100.0, 150.0, 200.0, 300.0, 250.0, 350.0, 450.0, 500.0 Hz
- Right Ear: 105.0, 155.0, 205.0, 305.0, 255.0, 355.0, 455.0, 505.0 Hz
- Perceived Beat: 5.0 Hz (from all 8 pairs)

**Isochronic Frequencies (Pulsing Tone Layers):**
- Base Tone: 5.0 Hz (pulsing at 5.0 Hz)
- Base Tone: 10.0 Hz (pulsing at 5.0 Hz)
- Base Tone: 15.0 Hz (pulsing at 5.0 Hz)

**Total Simultaneous Frequencies:** 16 carrier + 3 isochronic = 19 unique frequencies

---

#### Focus 21 - All Frequencies Generated

**Carrier Frequencies (Binaural Beat Layers):**
- Left Ear: 100.0, 150.0, 200.0, 250.0, 300.0, 350.0, 400.0, 450.0, 500.0, 550.0, 600.0, 650.0 Hz
- Right Ear: 104.5, 154.5, 204.5, 254.5, 304.5, 354.5, 404.5, 454.5, 504.5, 554.5, 604.5, 654.5 Hz
- Perceived Beat: 4.5 Hz (from all 12 pairs)

**Isochronic Frequencies (Pulsing Tone Layers):**
- Base Tone: 4.5 Hz (pulsing at 4.5 Hz)
- Base Tone: 9.0 Hz (pulsing at 4.5 Hz)
- Base Tone: 13.5 Hz (pulsing at 4.5 Hz)
- Base Tone: 18.0 Hz (pulsing at 4.5 Hz)
- Base Tone: 22.5 Hz (pulsing at 4.5 Hz)

**Total Simultaneous Frequencies:** 24 carrier + 5 isochronic = 29 unique frequencies

---

#### Focus 27 - All Frequencies Generated

**Carrier Frequencies (Binaural Beat Layers):**
- Left Ear: 100.0, 150.0, 200.0, 250.0, 300.0, 350.0, 400.0, 450.0, 500.0, 550.0, 600.0, 650.0, 700.0, 750.0, 800.0 Hz
- Right Ear: 103.5, 153.5, 203.5, 253.5, 303.5, 353.5, 403.5, 453.5, 503.5, 553.5, 603.5, 653.5, 703.5, 753.5, 803.5 Hz
- Perceived Beat: 3.5 Hz (from all 15 pairs)

**Isochronic Frequencies (Pulsing Tone Layers):**
- Base Tone: 3.5 Hz (pulsing at 3.5 Hz)
- Base Tone: 7.0 Hz (pulsing at 3.5 Hz)
- Base Tone: 10.5 Hz (pulsing at 3.5 Hz)
- Base Tone: 14.0 Hz (pulsing at 3.5 Hz)
- Base Tone: 17.5 Hz (pulsing at 3.5 Hz)
- Base Tone: 21.0 Hz (pulsing at 3.5 Hz)

**Total Simultaneous Frequencies:** 30 carrier + 6 isochronic = 36 unique frequencies

---

#### Schumann Resonance - All Frequencies Generated

**Carrier Frequencies (Binaural Beat Layers):**
- Left Ear: 100.0, 200.0, 300.0, 150.0 Hz
- Right Ear: 107.83, 207.83, 307.83, 157.83 Hz
- Perceived Beat: 7.83 Hz (from all 4 pairs)

**Isochronic Frequencies (Pulsing Tone Layers):**
- Base Tone: 7.83 Hz (pulsing at 7.83 Hz)

**Total Simultaneous Frequencies:** 8 carrier + 1 isochronic = 9 unique frequencies

---

## Section 5: Source Code Reference

### Core Implementation Files

#### 1. Gateway Signal Generator
- **File:** `src/audio/gateway/GatewaySignalGenerator.ts`
- **Purpose:** Main orchestrator for gateway signals
- **Key Methods:**
  - `initialize(config)` - Sets up all layers
  - `start()` - Starts all layers
  - `stop()` - Stops all layers
  - `setVolume(volume)` - Controls master volume
  - `dispose()` - Cleans up resources

#### 2. Carrier Layer Implementation
- **File:** `src/audio/gateway/CarrierLayer.ts`
- **Purpose:** Creates binaural beat layers
- **Key Components:**
  - Left/Right oscillators
  - Left/Right gain nodes
  - ChannelMergerNode for stereo output
  - Smooth fade-in/fade-out

#### 3. Isochronic Layer Implementation
- **File:** `src/audio/gateway/IsochronicLayer.ts`
- **Purpose:** Creates pulsing isochronic tone layers
- **Key Components:**
  - Base oscillator
  - LFO (Low Frequency Oscillator)
  - Gain modulation
  - Duty cycle control

#### 4. Signal Configuration
- **File:** `src/audio/gateway/GatewaySignalConfig.ts`
- **Purpose:** Defines all gateway signal configurations
- **Contains:**
  - FOCUS_10_CONFIG
  - FOCUS_12_CONFIG
  - FOCUS_15_CONFIG
  - FOCUS_21_CONFIG
  - FOCUS_27_CONFIG
  - SCHUMANN_RESONANCE_CONFIG
  - `getGatewayConfig(id)` lookup function

#### 5. Audio Engine Integration
- **File:** `src/audio/AudioEngine.ts`
- **Purpose:** Integrates gateway signals with audio system
- **Key Methods:**
  - `playFrequency()` - Detects and routes gateway signals
  - `playGatewaySignal()` - Creates and starts gateway generator
  - `stopFrequency()` - Stops gateway signals
  - `setMasterVolume()` - Controls overall volume

#### 6. Frequency Definitions
- **File:** `src/data/frequencies.ts`
- **Purpose:** Defines gateway frequency metadata
- **Location:** Lines 524-886
- **Contains:**
  - Gateway frequency objects with `isGatewaySignal: true`
  - Experimental data and methodology
  - User-facing descriptions

#### 7. UI Component
- **File:** `src/components/GatewayMode.tsx`
- **Purpose:** User interface for gateway frequencies
- **Key Features:**
  - Gateway frequency card display
  - Play/pause controls
  - Experimental data modal
  - Volume control

#### 8. State Management
- **File:** `src/store/useAppStore.ts`
- **Purpose:** Manages application state
- **Key Functions:**
  - `addFrequency()` - Adds frequency to playback
  - `stopAll()` - Stops all playback
  - State tracking for active frequencies

---

## Section 6: Technical Specifications Summary

### Audio Specifications

**Sample Rate:** Determined by Web Audio API (typically 44.1 kHz or 48 kHz)  
**Bit Depth:** 32-bit floating point (Web Audio API standard)  
**Channel Configuration:** Stereo (2-channel) for carrier layers, Mono for isochronic layers  
**Oscillator Type:** Sine wave for all carriers and base tones, Square wave for LFOs  

### Performance Characteristics

**CPU Usage:**
- Each oscillator is computationally lightweight
- Focus 27 (36 oscillators) is the most intensive
- Modern browsers handle 36 oscillators easily

**Memory Usage:**
- Minimal - oscillators are generated in real-time
- No audio files stored
- Only configuration data in memory

**Latency:**
- Fade-in: 50ms (smooth start)
- Fade-out: 50ms (smooth stop)
- No perceptible audio delay

### Browser Compatibility

**Web Audio API Support:**
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (iOS 6+)
- Mobile browsers: Full support

**Tone.js Integration:**
- Uses Tone.js for context management only
- Gateway signals use native Web Audio API
- Ensures maximum compatibility

---

## Conclusion

The Gateway Frequency Audio System is a sophisticated multi-layer audio entrainment engine that generates complex signals using:

- **6-15 binaural beat carrier layers** per gateway card
- **1-6 isochronic tone layers** per gateway card
- **Total of 7-21 simultaneous entrainment techniques**
- **12-36 unique audio frequencies** playing simultaneously
- **Carefully calculated phase relationships** for enhanced effects
- **Smooth fade-in/fade-out** for professional audio quality

This documentation provides complete technical specifications for understanding, maintaining, and extending the gateway audio system.

---

**Last Updated:** Based on current codebase as of documentation creation  
**Document Version:** 1.0  
**Codebase Files Referenced:** 8 core files across gateway audio system




