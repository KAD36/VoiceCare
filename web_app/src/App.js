import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Components
import LoginPage from './pages/LoginPage';
import WelcomePage from './pages/WelcomePage';
import AppointmentsPage from './pages/AppointmentsPage';
import ServicesPage from './pages/ServicesPage';
import SettingsPage from './pages/SettingsPage';
import HelpPage from './pages/HelpPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [patientData, setPatientData] = useState(null);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const savedPatient = localStorage.getItem('voicecare_patient');
    if (savedPatient) {
      setPatientData(JSON.parse(savedPatient));
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (patient) => {
    setPatientData(patient);
    setIsAuthenticated(true);
    localStorage.setItem('voicecare_patient', JSON.stringify(patient));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPatientData(null);
    localStorage.removeItem('voicecare_patient');
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={
              isAuthenticated ? 
              <Navigate to="/welcome" /> : 
              <LoginPage onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/welcome" 
            element={
              isAuthenticated ? 
              <WelcomePage patient={patientData} onLogout={handleLogout} /> : 
              <Navigate to="/" />
            } 
          />
          <Route 
            path="/appointments" 
            element={
              isAuthenticated ? 
              <AppointmentsPage patient={patientData} /> : 
              <Navigate to="/" />
            } 
          />
          <Route 
            path="/services" 
            element={
              isAuthenticated ? 
              <ServicesPage patient={patientData} /> : 
              <Navigate to="/" />
            } 
          />
          <Route 
            path="/settings" 
            element={
              isAuthenticated ? 
              <SettingsPage patient={patientData} onLogout={handleLogout} /> : 
              <Navigate to="/" />
            } 
          />
          <Route 
            path="/help" 
            element={
              isAuthenticated ? 
              <HelpPage patient={patientData} /> : 
              <Navigate to="/" />
            } 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
