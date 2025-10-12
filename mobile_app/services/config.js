// API Configuration for VoiceCare Application

// Base URLs for different environments
const ENVIRONMENTS = {
  development: {
    FACE_RECOGNITION_URL: 'http://192.168.60.97:8000/api',
    APPOINTMENTS_API_URL: 'http://192.168.60.97:3000/api',
  },
  production: {
    FACE_RECOGNITION_URL: 'https://voicecare-face.hospital.sa/api',
    APPOINTMENTS_API_URL: 'https://voicecare-appointments.hospital.sa/api',
  },
};

// Set current environment (change to 'production' when deploying)
const CURRENT_ENV = 'development';

// Export configuration
export const API_BASE_URL = ENVIRONMENTS[CURRENT_ENV].APPOINTMENTS_API_URL;
export const FACE_RECOGNITION_URL = ENVIRONMENTS[CURRENT_ENV].FACE_RECOGNITION_URL;
export const APPOINTMENTS_API_URL = ENVIRONMENTS[CURRENT_ENV].APPOINTMENTS_API_URL;

// API timeout settings (milliseconds)
export const API_TIMEOUT = 10000;

// App configuration
export const APP_CONFIG = {
  appName: 'VoiceCare',
  hospital: 'King Salman Specialist Hospital',
  version: '1.0.0',
  defaultLanguage: 'en-US',
  supportedLanguages: ['en-US', 'ar-SA'],
};

// Voice settings defaults
export const VOICE_DEFAULTS = {
  pitch: 1.0,
  rate: 0.85,
  volume: 1.0,
  language: 'en-US',
};

// Notification settings
export const NOTIFICATION_DEFAULTS = {
  enabled: true,
  reminderHours: 24,
  soundEnabled: true,
};
