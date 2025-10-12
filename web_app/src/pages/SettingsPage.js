import React, { useState, useEffect, useRef } from 'react';
import './SettingsPage.css';

function SettingsPage({ patient, onLogout }) {
  const [speechRate, setSpeechRate] = useState(0.85);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const hasSpoken = useRef(false);

  useEffect(() => {
    // Load settings from localStorage
    const savedRate = localStorage.getItem('voicecare_speech_rate');
    const savedVoice = localStorage.getItem('voicecare_voice_enabled');
    const savedNotif = localStorage.getItem('voicecare_notifications');
    
    if (savedRate) setSpeechRate(parseFloat(savedRate));
    if (savedVoice !== null) setVoiceEnabled(savedVoice === 'true');
    if (savedNotif !== null) setNotificationsEnabled(savedNotif === 'true');

    // Speak only once
    if (!hasSpoken.current) {
      setTimeout(() => {
        speak('Settings. Customize your experience.', savedRate ? parseFloat(savedRate) : 0.85);
        hasSpoken.current = true;
      }, 300);
    }
  }, []);

  const speak = (text, rate = speechRate) => {
    if ('speechSynthesis' in window && voiceEnabled) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.volume = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSpeechRateChange = (e) => {
    const newRate = parseFloat(e.target.value);
    setSpeechRate(newRate);
    localStorage.setItem('voicecare_speech_rate', newRate.toString());
  };

  const handleVoiceToggle = (enabled) => {
    window.speechSynthesis.cancel();
    setVoiceEnabled(enabled);
    localStorage.setItem('voicecare_voice_enabled', enabled.toString());
    if (enabled) {
      setTimeout(() => speak('Voice enabled'), 100);
    }
  };

  const handleNotificationsToggle = (enabled) => {
    window.speechSynthesis.cancel();
    setNotificationsEnabled(enabled);
    localStorage.setItem('voicecare_notifications', enabled.toString());
    setTimeout(() => {
      speak(enabled ? 'Notifications enabled' : 'Notifications disabled');
    }, 100);
  };

  const testVoice = () => {
    window.speechSynthesis.cancel();
    setTimeout(() => {
      speak('This is a test. The quick brown fox jumps over the lazy dog.');
    }, 100);
  };

  const resetFaceRecognition = () => {
    window.speechSynthesis.cancel();
    
    const confirmed = window.confirm(
      'Reset Face Recognition?\n\n' +
      'This will log you out.\n\n' +
      'Do you want to continue?'
    );
    
    if (confirmed) {
      speak('Logging out');
      setTimeout(() => {
        onLogout();
      }, 1000);
    }
  };

  return (
    <div className="settings-page">
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">⚙️ Settings</h1>
          <p className="page-subtitle">Customize your experience</p>
        </div>

        <div className="settings-content">
          {/* Voice Settings */}
          <section className="settings-section">
            <h2 className="section-title">🔊 Voice</h2>
            
            <div className="setting-card">
              <div className="setting-row">
                <label className="setting-label">Enable Voice</label>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={voiceEnabled}
                    onChange={(e) => handleVoiceToggle(e.target.checked)}
                  />
                  <span className="slider round"></span>
                </label>
              </div>

              <div className="setting-row slider-row">
                <label className="setting-label">Speech Speed</label>
                <div className="slider-container">
                  <span className="slider-label">Slow</span>
                  <input
                    type="range"
                    min="0.5"
                    max="1.5"
                    step="0.05"
                    value={speechRate}
                    onChange={handleSpeechRateChange}
                    className="range-slider"
                  />
                  <span className="slider-label">Fast</span>
                </div>
                <div className="slider-value">{speechRate.toFixed(2)}x</div>
              </div>

              <button 
                className="button test-button"
                onClick={testVoice}
                disabled={!voiceEnabled}
              >
                🔊 Test Voice
              </button>
            </div>
          </section>

          {/* Notifications Settings */}
          <section className="settings-section">
            <h2 className="section-title">🔔 Notifications</h2>
            
            <div className="setting-card">
              <div className="setting-row">
                <label className="setting-label">Push Notifications</label>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={notificationsEnabled}
                    onChange={(e) => handleNotificationsToggle(e.target.checked)}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
              <p className="setting-description">
                Receive reminders 24 hours before your appointments
              </p>
            </div>
          </section>

          {/* Security Settings */}
          <section className="settings-section">
            <h2 className="section-title">🔐 Security</h2>
            
            <div className="setting-card danger-card">
              <button 
                className="button button-danger danger-button"
                onClick={resetFaceRecognition}
              >
                <span className="danger-icon">🔄</span>
                <div className="danger-text">
                  <strong>Reset Face Recognition</strong>
                  <p>Clear face data and re-register</p>
                </div>
              </button>
            </div>
          </section>

          {/* App Info */}
          <section className="settings-section">
            <div className="app-info">
              <p className="info-text"><strong>VoiceCare</strong> v1.0.0</p>
              <p className="info-subtext">King Salman Specialist Hospital</p>
              <p className="info-subtext">Web Interface</p>
            </div>
          </section>
        </div>

        <button 
          className="button button-secondary back-button"
          onClick={() => {
            speak('Going back');
            window.history.back();
          }}
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}

export default SettingsPage;
