import React, { useState, useEffect, useRef } from 'react';
import './AppointmentsPage.css';

function AppointmentsPage({ patient }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const hasSpoken = useRef(false);

  useEffect(() => {
    loadDemoAppointments();
  }, []);

  const loadDemoAppointments = () => {
    // Demo appointments data
    const demoAppointments = [
      {
        id: 'apt-001',
        type: 'Follow-up Consultation',
        date: '2025-10-15',
        time: '10:00 AM',
        department: 'Cardiology',
        doctor: 'Dr. Ahmed Al-Saud',
        location: 'Building A, Floor 3, Room 301',
        status: 'scheduled',
        instructions: 'Please bring previous test results. Fasting is not required.'
      },
      {
        id: 'apt-002',
        type: 'Blood Test',
        date: '2025-10-20',
        time: '08:00 AM',
        department: 'Laboratory',
        doctor: 'Lab Technician',
        location: 'Building B, Ground Floor',
        status: 'scheduled',
        instructions: 'Fasting for 8-12 hours required. Drink water only.'
      },
      {
        id: 'apt-003',
        type: 'Physical Therapy',
        date: '2025-10-08',
        time: '02:00 PM',
        department: 'Physical Therapy',
        doctor: 'Dr. Sara Mohammed',
        location: 'Building C, Floor 2',
        status: 'completed'
      }
    ];

    setAppointments(demoAppointments);
    setLoading(false);

    // Speak only once
    if (!hasSpoken.current) {
      setTimeout(() => {
        speak(`You have ${demoAppointments.filter(a => isUpcoming(a)).length} upcoming appointments`);
        hasSpoken.current = true;
      }, 300);
    }
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      utterance.volume = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const speakAppointment = (apt, e) => {
    e.stopPropagation();
    const text = `${apt.type} on ${formatDate(apt.date)} at ${apt.time} in ${apt.department} department with ${apt.doctor}. Location: ${apt.location}. ${apt.instructions ? 'Instructions: ' + apt.instructions : ''}`;
    speak(text);
  };

  const confirmAppointment = (apt, e) => {
    e.stopPropagation();
    window.speechSynthesis.cancel();
    
    const confirmed = window.confirm(
      `Confirm Appointment\n\n` +
      `${apt.type}\n` +
      `${formatDate(apt.date)} at ${apt.time}\n` +
      `${apt.department} - ${apt.doctor}\n\n` +
      `Do you confirm your attendance?`
    );
    
    if (confirmed) {
      speak('Attendance confirmed. You will receive a reminder.');
      setTimeout(() => {
        alert('✓ CONFIRMED\n\nYour attendance has been confirmed.\nYou will receive a reminder 24 hours before your appointment.');
      }, 100);
    }
  };

  const cancelAppointment = (apt, e) => {
    e.stopPropagation();
    window.speechSynthesis.cancel();
    
    const cancelled = window.confirm(
      `Cancel Appointment\n\n` +
      `${apt.type}\n` +
      `${formatDate(apt.date)} at ${apt.time}\n\n` +
      `Are you sure you want to cancel?\n` +
      `This action cannot be undone.`
    );
    
    if (cancelled) {
      speak('Appointment cancelled. Please contact reception to reschedule.');
      setTimeout(() => {
        alert('CANCELLED\n\nYour appointment has been cancelled.\n\nTo reschedule, please contact:\nReception: Extension 100\nPhone: +966 11 234 5678');
      }, 100);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDepartmentColor = (dept) => {
    const colors = {
      'Cardiology': ['#2563eb', '#3b82f6'],
      'Orthopedics': ['#10b981', '#059669'],
      'Dermatology': ['#8b5cf6', '#7c3aed'],
      'Ophthalmology': ['#f59e0b', '#d97706'],
      'Internal Medicine': ['#06b6d4', '#0891b2'],
      'Pediatrics': ['#ec4899', '#db2777'],
      'Neurology': ['#6366f1', '#4f46e5'],
      'ENT': ['#14b8a6', '#0d9488'],
      'Physical Therapy': ['#84cc16', '#65a30d'],
      'Radiology': ['#f97316', '#ea580c'],
      'Emergency Medicine': ['#ef4444', '#dc2626'],
      'Surgery': ['#8b5cf6', '#7c3aed'],
      'default': ['#64748b', '#475569']
    };
    return colors[dept] || colors.default;
  };

  const isUpcoming = (apt) => {
    const now = new Date();
    const aptDate = new Date(apt.date);
    return aptDate >= now;
  };

  const filteredAppointments = appointments.filter(apt => 
    activeTab === 'upcoming' ? isUpcoming(apt) : !isUpcoming(apt)
  );

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="appointments-page">
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">📅 My Appointments</h1>
          <p className="page-subtitle">View and manage your appointments</p>
        </div>

        <div className="tabs">
          <button
            className={`tab ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('upcoming');
              speak('Showing upcoming appointments');
            }}
          >
            Upcoming ({appointments.filter(isUpcoming).length})
          </button>
          <button
            className={`tab ${activeTab === 'past' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('past');
              speak('Showing past appointments');
            }}
          >
            Past ({appointments.filter(apt => !isUpcoming(apt)).length})
          </button>
        </div>

        <div className="appointments-list">
          {filteredAppointments.length === 0 ? (
            <div className="empty-state">
              <p className="empty-icon">📭</p>
              <h3>No {activeTab} appointments</h3>
              <p>You don't have any {activeTab} appointments at the moment</p>
            </div>
          ) : (
            filteredAppointments.map((apt, index) => {
              const [color1, color2] = getDepartmentColor(apt.department);
              return (
                <div
                  key={apt.id}
                  className="appointment-card"
                  style={{
                    background: `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`
                  }}
                >
                  <div className="apt-header">
                    <div className="apt-date">
                      <div className="date-day">{new Date(apt.date).getDate()}</div>
                      <div className="date-month">
                        {new Date(apt.date).toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                    </div>
                    <div className="apt-time">
                      <span className="time-icon">🕒</span>
                      <span>{apt.time}</span>
                    </div>
                  </div>

                  <div className="apt-body">
                    <h3 className="apt-type">{apt.type}</h3>
                    <div className="apt-details">
                      <p><strong>Department:</strong> {apt.department}</p>
                      <p><strong>Doctor:</strong> {apt.doctor}</p>
                      {apt.location && <p><strong>Location:</strong> {apt.location}</p>}
                      {apt.instructions && (
                        <div className="apt-instructions">
                          <strong>Instructions:</strong>
                          <p>{apt.instructions}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="apt-actions">
                    <button
                      className="btn-listen"
                      onClick={(e) => speakAppointment(apt, e)}
                    >
                      🔊 Listen
                    </button>
                    {isUpcoming(apt) && (
                      <>
                        <button
                          className="btn-confirm"
                          onClick={(e) => confirmAppointment(apt, e)}
                        >
                          ✓ Confirm
                        </button>
                        <button
                          className="btn-cancel"
                          onClick={(e) => cancelAppointment(apt, e)}
                        >
                          ✗ Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
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

export default AppointmentsPage;
