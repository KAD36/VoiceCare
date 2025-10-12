import React, { useEffect } from 'react';
import './HelpPage.css';

function HelpPage({ patient }) {
  useEffect(() => {
    speak('Help and instructions. Tap any card to hear guidance.');
  }, []);

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const helpTopics = [
    {
      icon: '👤',
      title: 'Face Recognition Login',
      description: 'How to login using your face',
      instruction: 'To login: Position your face in the camera frame. Ensure good lighting and only one face is visible. The system will recognize you and log you in automatically. No passwords needed!'
    },
    {
      icon: '🔊',
      title: 'Voice Guidance',
      description: 'Using the voice assistant',
      instruction: 'Voice guidance: The app will read everything out loud. Each screen announces itself when you enter. Buttons speak when you press them. You can adjust voice speed in Settings.'
    },
    {
      icon: '📅',
      title: 'Viewing Appointments',
      description: 'Check your appointments',
      instruction: 'To view appointments: Tap the Appointments button on the home screen. You will see upcoming and past appointments. Tap any appointment to hear full details including date, time, doctor, and special instructions.'
    },
    {
      icon: '✓',
      title: 'Confirming Appointments',
      description: 'Confirm your attendance',
      instruction: 'To confirm attendance: Open your appointments. Tap the Confirm button on the appointment you want to confirm. The system will save your confirmation and send you a reminder 24 hours before.'
    },
    {
      icon: '🏥',
      title: 'Medical Services',
      description: 'Getting medical guidance',
      instruction: 'For medical services: Tap Services from home screen. Choose from surgery preparation, medication instructions, test preparation, or request help. Each service provides detailed spoken guidance.'
    },
    {
      icon: '⚙️',
      title: 'Adjusting Settings',
      description: 'Customize your experience',
      instruction: 'To adjust settings: Tap Settings from home. You can change voice speed, enable or disable voice, turn notifications on or off, and reset face recognition if needed.'
    },
    {
      icon: '🆘',
      title: 'Emergency Assistance',
      description: 'Request immediate help',
      instruction: 'For emergency help: Go to Services and tap Request Help. You can get assistance finding your department, request medical emergency support, or contact technical support. Staff will be notified immediately if you request emergency help.'
    },
    {
      icon: '📞',
      title: 'Contact Hospital',
      description: 'Reach hospital staff anytime',
      instruction: 'To contact the hospital: You can ask any staff member for help at any time. For technical support, call extension 1234. For medical emergencies, use the emergency help button in the Services menu.'
    }
  ];

  const handleTopicClick = (topic) => {
    window.speechSynthesis.cancel();
    setTimeout(() => {
      speak(topic.instruction);
    }, 100);
  };

  return (
    <div className="help-page">
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">❓ Help & Instructions</h1>
          <p className="page-subtitle">Tap any card to hear guidance</p>
        </div>

        <div className="help-content">
          <section className="help-section">
            <h2 className="section-heading">Getting Started</h2>
            <div className="help-grid">
              {helpTopics.slice(0, 4).map((topic, index) => (
                <div
                  key={index}
                  className="help-card"
                  onClick={() => handleTopicClick(topic)}
                >
                  <div className="help-icon">{topic.icon}</div>
                  <div className="help-text">
                    <h3>{topic.title}</h3>
                    <p>{topic.description}</p>
                  </div>
                  <div className="help-action">🔊</div>
                </div>
              ))}
            </div>
          </section>

          <section className="help-section">
            <h2 className="section-heading">Using Features</h2>
            <div className="help-grid">
              {helpTopics.slice(4, 6).map((topic, index) => (
                <div
                  key={index}
                  className="help-card"
                  onClick={() => handleTopicClick(topic)}
                >
                  <div className="help-icon">{topic.icon}</div>
                  <div className="help-text">
                    <h3>{topic.title}</h3>
                    <p>{topic.description}</p>
                  </div>
                  <div className="help-action">🔊</div>
                </div>
              ))}
            </div>
          </section>

          <section className="help-section">
            <h2 className="section-heading">Getting Help</h2>
            <div className="help-grid">
              {helpTopics.slice(6, 8).map((topic, index) => (
                <div
                  key={index}
                  className="help-card"
                  onClick={() => handleTopicClick(topic)}
                >
                  <div className="help-icon">{topic.icon}</div>
                  <div className="help-text">
                    <h3>{topic.title}</h3>
                    <p>{topic.description}</p>
                  </div>
                  <div className="help-action">🔊</div>
                </div>
              ))}
            </div>
          </section>

          <section className="contact-section">
            <div className="contact-card">
              <h3>📞 King Salman Specialist Hospital</h3>
              <div className="contact-info">
                <p><strong>Emergency:</strong> Extension 9-1-1</p>
                <p><strong>Tech Support:</strong> Extension 1234</p>
                <p><strong>Reception:</strong> Extension 100</p>
              </div>
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

export default HelpPage;
