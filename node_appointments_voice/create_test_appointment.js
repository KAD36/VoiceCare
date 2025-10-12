const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DB_PATH = path.join(__dirname, 'data/voicecare.db');
const db = new sqlite3.Database(DB_PATH);

// Create patient first  
db.run(`
  INSERT OR IGNORE INTO patients (id, name, phone)
  VALUES ('P001', 'Ahmed Mohammed', '+966501234567')
`, (err) => {
  if (err) {
    console.error('Error creating patient:', err);
    return;
  }
  console.log('✓ Patient created/exists: Ahmed Mohammed');
  
  // Create appointment
  const appointmentId = uuidv4();
  db.run(`
    INSERT INTO appointments (id, patient_id, date, time, department, doctor, type, instructions, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'scheduled', datetime('now'))
  `, [
    appointmentId,
    'P001',
    '2025-10-25',
    '10:00 AM',
    'Cardiology',
    'Dr. Ahmed Hassan',
    'Follow-up Consultation',
    'Please fast for 8 hours before the appointment'
  ], (err) => {
    if (err) {
      console.error('Error creating appointment:', err);
    } else {
      console.log('✓ Appointment created successfully');
      console.log(`  ID: ${appointmentId}`);
      console.log('  Date: 2025-10-25 at 10:00 AM');
      console.log('  Department: Cardiology');
    }
    db.close();
  });
});
