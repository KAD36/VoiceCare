import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomePage.css';

function WelcomePage({ patient, onLogout }) {
  const navigate = useNavigate();
  const hasSpoken = useRef(false);

  useEffect(() => {
    // Speak only once when component mounts
    if (!hasSpoken.current) {
      const timer = setTimeout(() => {
        speak(`Welcome ${patient?.name || ''}. How can I help you today?`);
        hasSpoken.current = true;
      }, 300);

      return () => clearTimeout(timer);
    }
  }, []);

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Cancel any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      utterance.volume = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleNavigation = (screen, message) => {
    window.speechSynthesis.cancel();
    speak(message);
    setTimeout(() => navigate(`/${screen}`), 800);
  };

  return (
    <div className="welcome-page">
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Welcome, {patient?.name || 'Patient'}</h1>
          <p className="page-subtitle">How can I help you today?</p>
        </div>

        <div className="welcome-grid">
          <button
            className="welcome-card appointments"
            onClick={() => handleNavigation('appointments', 'Opening your appointments')}
          >
            <span className="card-icon">📅</span>
            <h2>My Appointments</h2>
            <p>View and manage your appointments</p>
          </button>

          <button
            className="welcome-card services"
            onClick={() => handleNavigation('services', 'Opening services and guidance')}
          >
            <span className="card-icon">🏥</span>
            <h2>Services</h2>
            <p>Medical guidance and instructions</p>
          </button>

          <button
            className="welcome-card settings"
            onClick={() => handleNavigation('settings', 'Opening settings')}
          >
            <span className="card-icon">⚙️</span>
            <h2>Settings</h2>
            <p>Adjust voice and preferences</p>
          </button>

          <button
            className="welcome-card help"
            onClick={() => handleNavigation('help', 'Opening help and instructions')}
          >
            <span className="card-icon">❓</span>
            <h2>Help</h2>
            <p>Learn how to use this app</p>
          </button>
        </div>

        <button 
          className="button button-danger logout-button"
          onClick={() => {
            speak('Logging out');
            setTimeout(onLogout, 1000);
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default WelcomePage;
