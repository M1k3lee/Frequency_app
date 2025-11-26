# Frequency Zen 🧘

A highly interactive web and mobile application serving as a zen platform for playing and mixing binaural beats and experimental frequencies. The app provides deep integration of declassified frequencies from the Gateway Project (Monroe Institute), empowering users with advanced mixing and timing controls, immersive 3D animated visuals that react to audio, and extractable metadata and educational context for every frequency.

![Frequency Zen](https://img.shields.io/badge/Platform-Web%20%7C%20Android%20%7C%20iOS-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Version](https://img.shields.io/badge/Version-1.0.0-orange)

## ✨ Features

### 🎵 Audio Engine
- **Binaural Beat Generation**: Create and mix binaural beats with precise frequency control
- **Gateway Project Integration**: Access declassified frequencies from the Monroe Institute's Gateway Project
- **Advanced Mixing**: Mix multiple frequencies simultaneously with individual volume and pan controls
- **Carrier Frequency Modulation**: Sub-audible frequencies (<20Hz) are made audible through intelligent carrier frequency modulation
- **Real-time Audio Analysis**: Visual feedback through audio-reactive 3D visuals

### 🎨 Visual Experience
- **3D Animated Visuals**: Immersive Three.js/WebGL powered visuals that react to audio in real-time
- **Multiple Visual Presets**: Choose from various visual themes (Starlight, Waves, Particles, etc.)
- **Zen-Inspired Design**: Beautiful, minimalist UI designed for relaxation and focus

### 📱 Cross-Platform
- **Web Application**: Full-featured web app accessible from any modern browser
- **Android App**: Native Android application with background audio support
- **iOS App**: Native iOS application (coming soon)
- **Offline Functionality**: All audio generation works completely offline - no internet required

### 🎛️ Advanced Controls
- **Playback Timer**: Set custom playback duration with auto-stop
- **Save & Load Mixes**: Save your custom frequency combinations for later
- **Playlist Management**: Organize your favorite frequencies into playlists
- **Volume & Pan Controls**: Fine-tune each frequency's volume and stereo positioning
- **Gateway Mode**: Explore experimental frequencies from declassified research

### 📚 Educational Content
- **Frequency Metadata**: Detailed information about each frequency including:
  - Category and tags
  - Recommended duration
  - Effects and benefits
  - Gateway Project references
  - Scientific context

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- For Android development: Android Studio with Android SDK
- For iOS development: Xcode (macOS only)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/M1k3lee/Frequency_app.git
   cd Frequency_app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 📱 Mobile App Development

### Android Setup

1. **Sync Capacitor**
   ```bash
   npm run cap:sync
   ```

2. **Open in Android Studio**
   ```bash
   npm run cap:open:android
   ```

3. **Build APK**
   ```bash
   npm run cap:build:android
   ```

### iOS Setup (macOS only)

1. **Sync Capacitor**
   ```bash
   npm run cap:sync
   ```

2. **Open in Xcode**
   ```bash
   npm run cap:open:ios
   ```

## 🏗️ Project Structure

```
Frequency_app/
├── src/
│   ├── audio/           # Audio engine (Tone.js integration)
│   ├── components/     # React components
│   ├── data/           # Frequency database
│   ├── store/          # Zustand state management
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   └── hooks/          # Custom React hooks
├── android/            # Android native project
├── ios/               # iOS native project
├── public/            # Static assets
└── dist/              # Production build output
```

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Audio Engine**: Tone.js
- **3D Graphics**: Three.js with React Three Fiber
- **State Management**: Zustand
- **Mobile Framework**: Capacitor 5
- **Styling**: CSS3 with modern animations

## 🎯 Use Cases

- **Meditation & Mindfulness**: Use binaural beats for deep meditation
- **Focus & Concentration**: Enhance productivity with beta frequencies
- **Sleep & Relaxation**: Promote restful sleep with delta/theta frequencies
- **Research & Experimentation**: Explore Gateway Project frequencies
- **Audio Therapy**: Custom frequency combinations for personal wellness

## 📖 Gateway Project Integration

This application integrates frequencies from the declassified Gateway Project research conducted by the Monroe Institute. These frequencies were used in consciousness exploration experiments and are provided for educational and research purposes.

**Note**: The frequencies in this app are based on declassified research documents. Individual experiences may vary, and this app is not a medical device.

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run cap:sync` - Sync web assets to native projects
- `npm run cap:open:android` - Open Android project
- `npm run cap:open:ios` - Open iOS project
- `npm run cap:build:android` - Build Android APK

### Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Monroe Institute**: For the Gateway Project research
- **Tone.js**: For the powerful audio synthesis library
- **Three.js**: For the 3D graphics capabilities
- **Capacitor**: For cross-platform mobile development

## 📞 Support

For issues, questions, or contributions, please open an issue on the [GitHub repository](https://github.com/M1k3lee/Frequency_app/issues).

## ⚠️ Disclaimer

This application is for educational and research purposes only. It is not intended to diagnose, treat, cure, or prevent any disease. Individual experiences with binaural beats and frequency therapy may vary. Please consult with a healthcare professional before using frequency therapy, especially if you have epilepsy, seizures, or other neurological conditions.

---

**Made with ❤️ for the exploration of consciousness and sound**
