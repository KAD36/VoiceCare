import React, { useState, useEffect, useRef } from 'react';
import './LoginPage.css';

function LoginPage({ onLogin }) {
  const [loading, setLoading] = useState(false);
  const hasSpoken = useRef(false);

  useEffect(() => {
    // Speak only once when component mounts
    if (!hasSpoken.current) {
      const timer = setTimeout(() => {
        speak('Welcome to VoiceCare. Tap the button to login.');
        hasSpoken.current = true;
      }, 500);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleLogin = () => {
    setLoading(true);
    
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    speak('Logging in...');

    const demoPatients = [
      { id: 'patient-001', name: 'Yousef Ahmed', age: 65, medical_number: 'MRN-12345', phone: '+966 50 123 4567' },
      { id: 'patient-002', name: 'Fatima Mohammed', age: 58, medical_number: 'MRN-67890', phone: '+966 55 987 6543' },
      { id: 'patient-003', name: 'Abdullah Salem', age: 72, medical_number: 'MRN-11223', phone: '+966 50 555 1234' },
      { id: 'patient-004', name: 'Sara Ali', age: 45, medical_number: 'MRN-44556', phone: '+966 54 321 9876' }
    ];

    // Rotate through patients (get from localStorage or start at 0)
    const currentIndex = parseInt(localStorage.getItem('current_patient_index') || '0');
    const nextIndex = (currentIndex + 1) % demoPatients.length;
    localStorage.setItem('current_patient_index', nextIndex.toString());

    setTimeout(() => {
      onLogin(demoPatients[currentIndex]);
      setLoading(false);
    }, 1500);
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Cancel any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1 className="login-title">🏥 VoiceCare</h1>
          <p className="login-subtitle">King Salman Specialist Hospital</p>
          <p className="login-description">Accessible Healthcare for Everyone</p>
        </div>

        <div className="login-card">
          <div className="face-icon">👤</div>
          <h2>Patient Login</h2>
          <p className="info-text">Tap the large button below to begin</p>

          <button
            className="button button-large"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="loading-spinner"></div>
                <span>Logging in...</span>
              </>
            ) : (
              'TAP TO LOGIN'
            )}
          </button>

          <p className="help-text">
            🔊 Voice guidance is enabled
          </p>
        </div>

        <div className="login-footer">
          <p>Version 1.0.0 | Web Interface</p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
