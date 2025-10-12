# VoiceCare Mobile Application

## Overview
VoiceCare is a React Native mobile application designed for illiterate and disabled patients at King Salman Specialist Hospital. It provides voice-based interaction and face recognition authentication.

## Features
- **Face Recognition Login**: Biometric authentication using device camera
- **Voice Appointments**: Listen to upcoming appointments with full details
- **Medical Guidance**: Voice instructions for test preparation and medication
- **Interactive Services**: Voice commands for attendance confirmation, help requests, and appointment management
- **Accessibility**: Designed for illiterate, elderly, and visually impaired users

## Installation

### Prerequisites
- Node.js 14+ and npm
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (Mac) or Android Studio (for Android development)

### Setup
```bash
cd mobile_app
npm install
```

### Running the App
```bash
# Start Expo development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run in web browser
npm run web
```

## Project Structure
```
mobile_app/
├── App.js              # Main application entry point
├── screens/            # Screen components
├── components/         # Reusable components
├── services/           # API services
├── utils/              # Utility functions
├── localization/       # Internationalization
└── assets/             # Images and static files
```

## Technologies
- **React Native**: Cross-platform mobile framework
- **Expo**: Development and build tooling
- **React Navigation**: Navigation management
- **Expo Speech**: Text-to-speech functionality
- **Expo Camera**: Face recognition integration
- **Axios**: HTTP client for API calls

## Configuration
API endpoints can be configured in `services/config.js`:
- Face Recognition API: Django backend
- Appointments API: Node.js backend

## Security
- Encrypted biometric data transmission
- Secure token-based authentication
- HTTPS only for API communication
- No local storage of sensitive patient data

## Accessibility Features
- Large, high-contrast UI elements
- Voice feedback for all interactions
- Simple navigation with voice commands
- No text input required for core functions

## License
Proprietary - King Salman Specialist Hospital
