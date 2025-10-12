import React, { useState, useEffect, useRef } from 'react';
import './ServicesPage.css';

function ServicesPage({ patient }) {
  const [selectedService, setSelectedService] = useState(null);
  const hasSpoken = useRef(false);

  useEffect(() => {
    if (!hasSpoken.current && !selectedService) {
      setTimeout(() => {
        speak('Services and guidance. Tap any service for help.');
        hasSpoken.current = true;
      }, 300);
    }
  }, [selectedService]);

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      utterance.volume = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const services = [
    {
      id: 'guidance',
      title: 'Medical Guidance',
      description: 'Surgery prep, fasting, post-procedure care',
      icon: '🏥',
      color: ['#2563eb', '#3b82f6'],
      items: [
        {
          icon: '🏥',
          title: 'Surgery Preparation',
          text: 'Fast for 8 hours. Bring insurance and ID. Arrange transport.',
          speech: 'Before surgery: Fast for 8 hours. Bring insurance card and ID. Arrange for someone to drive you home.'
        },
        {
          icon: '🍽️',
          title: 'Fasting Instructions',
          text: 'No food 8 hours before. Water allowed until 2 hours before.',
          speech: 'Fasting instructions: No food for 8 hours before procedure. You may drink clear water until 2 hours before.'
        },
        {
          icon: '🏠',
          title: 'Post-Procedure Care',
          text: 'Rest for 24 hours. Take prescribed medication. Monitor for complications.',
          speech: 'After your procedure: Rest for 24 hours. Take all prescribed medications. Watch for any unusual symptoms and call if concerned.'
        },
        {
          icon: '🩹',
          title: 'Wound Care',
          text: 'Keep clean and dry. Change dressing daily. Watch for infection signs.',
          speech: 'Wound care: Keep area clean and dry. Change dressing once daily. Look for redness, swelling, or discharge and contact us if you see these signs.'
        }
      ]
    },
    {
      id: 'medication',
      title: 'Medication Instructions',
      description: 'How to take prescribed medications safely',
      icon: '💊',
      color: ['#10b981', '#059669'],
      items: [
        {
          icon: '💊',
          title: 'Antibiotics',
          text: 'Complete full course. Take at same time daily. Take with food if upset.',
          speech: 'Antibiotics: Complete the full course even if you feel better. Take at the same time each day. Take with food if it upsets your stomach.'
        },
        {
          icon: '💉',
          title: 'Pain Medication',
          text: 'Take as prescribed. Do not exceed maximum dose. Do not drive if drowsy.',
          speech: 'Pain medication: Take only as prescribed by your doctor. Never exceed the maximum daily dose. Avoid driving if medication makes you drowsy.'
        },
        {
          icon: '🫀',
          title: 'Blood Pressure Medication',
          text: 'Take same time daily. Do not stop suddenly. Monitor pressure regularly.',
          speech: 'Blood pressure medication: Take at the same time every day. Never stop taking suddenly. Monitor your blood pressure regularly and keep a log.'
        },
        {
          icon: '🩸',
          title: 'Diabetes Medication',
          text: 'Follow meal schedule. Check blood sugar regularly. Store properly.',
          speech: 'Diabetes medication: Follow your meal schedule carefully. Check blood sugar levels as directed. Store medication properly, some need refrigeration.'
        }
      ]
    },
    {
      id: 'tests',
      title: 'Test Preparation',
      description: 'Guidelines for blood tests, X-rays, MRI',
      icon: '🔬',
      color: ['#8b5cf6', '#7c3aed'],
      items: [
        {
          icon: '🩸',
          title: 'Blood Tests',
          text: 'Fast 8-12 hours. Drink water. Wear short sleeves. Results in 24-48 hours.',
          speech: 'Blood test preparation: Fast for 8 to 12 hours. Drink plenty of water. Wear short sleeves. Results available in 24 to 48 hours.'
        },
        {
          icon: '🔬',
          title: 'X-Ray',
          text: 'Remove jewelry and metal. Wear comfortable clothes. Inform if pregnant.',
          speech: 'X-ray preparation: Remove jewelry and metal objects. Wear comfortable clothing. Inform staff if you are pregnant. Test takes 10 to 15 minutes.'
        },
        {
          icon: '📡',
          title: 'Ultrasound',
          text: 'For abdominal: fast 6 hours. Drink water 1 hour before. Wear loose clothing.',
          speech: 'Ultrasound preparation: For abdominal ultrasound, fast for 6 hours. Drink water 1 hour before. Do not urinate before pelvic ultrasound.'
        },
        {
          icon: '🧲',
          title: 'MRI Scan',
          text: 'Remove all metal objects. Inform about implants. Stay very still. 30-60 minutes.',
          speech: 'M R I scan preparation: Remove all metal including jewelry. Inform staff if you have implants or pacemaker. Test takes 30 to 60 minutes. Stay very still.'
        }
      ]
    },
    {
      id: 'help',
      title: 'Request Help',
      description: 'Emergency assistance and support',
      icon: '🆘',
      color: ['#ef4444', '#dc2626'],
      onClick: () => {
        speak('Help requested. Hospital staff will be notified. What do you need?');
        const helpType = prompt('What type of help do you need?\n1. Find my department\n2. Medical emergency\n3. Technical support\n\nEnter 1, 2, or 3:');
        
        if (helpType === '1') {
          speak('Finding your department. Please wait for staff assistance.');
          alert('✓ Help Request Sent\n\nA staff member will help you find your department shortly.');
        } else if (helpType === '2') {
          speak('Medical emergency! Calling medical staff now!');
          alert('🚨 EMERGENCY ALERT\n\nMedical staff have been notified and are on their way!');
        } else if (helpType === '3') {
          speak('Technical support requested. An IT staff member will assist you.');
          alert('✓ Technical Support\n\nAn IT staff member will help you shortly. You can also call extension 1234.');
        }
      }
    }
  ];

  const handleServiceClick = (service) => {
    window.speechSynthesis.cancel();
    if (service.onClick) {
      service.onClick();
    } else {
      setSelectedService(service);
      setTimeout(() => {
        speak(`${service.title}. Tap any item to hear instructions.`);
      }, 200);
    }
  };

  const handleItemClick = (item) => {
    window.speechSynthesis.cancel();
    setTimeout(() => {
      speak(item.speech);
    }, 100);
  };

  const handleBack = () => {
    window.speechSynthesis.cancel();
    setSelectedService(null);
    hasSpoken.current = false;
  };

  if (selectedService) {
    const [color1, color2] = selectedService.color;
    return (
      <div className="services-page">
        <div className="page-container">
          <div className="page-header">
            <h1 className="page-title">{selectedService.title}</h1>
            <p className="page-subtitle">Tap any item to hear instructions</p>
          </div>

          <div className="service-items">
            {selectedService.items.map((item, index) => (
              <div
                key={index}
                className="service-item"
                onClick={() => handleItemClick(item)}
                style={{
                  background: `linear-gradient(135deg, ${color1}20 0%, ${color2}20 100%)`,
                  borderColor: color1
                }}
              >
                <div className="item-icon">{item.icon}</div>
                <div className="item-content">
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
                <div className="item-action">🔊</div>
              </div>
            ))}
          </div>

          <button 
            className="button button-secondary back-button"
            onClick={handleBack}
          >
            ← Back to Services
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="services-page">
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">🏥 Services & Guidance</h1>
          <p className="page-subtitle">Tap any service for help</p>
        </div>

        <div className="services-grid">
          {services.map((service) => {
            const [color1, color2] = service.color;
            return (
              <button
                key={service.id}
                className="service-card"
                onClick={() => handleServiceClick(service)}
                style={{
                  background: `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`
                }}
              >
                <span className="service-icon">{service.icon}</span>
                <h2>{service.title}</h2>
                <p>{service.description}</p>
                <span className="service-arrow">→</span>
              </button>
            );
          })}
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

export default ServicesPage;
