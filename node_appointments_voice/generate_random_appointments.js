const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dbPath = path.join(__dirname, 'data', 'appointments.db');
const db = new sqlite3.Database(dbPath);

// Random data generators
const departments = [
  'Cardiology', 'Orthopedics', 'Dermatology', 'Ophthalmology',
  'Internal Medicine', 'Pediatrics', 'Neurology', 'ENT',
  'Physical Therapy', 'Radiology', 'Emergency Medicine', 'Surgery'
];

const doctors = [
  'Dr. Ahmed Hassan', 'Dr. Fatima Al-Saud', 'Dr. Khalid Al-Rashid',
  'Dr. Sara Al-Mutairi', 'Dr. Nora Al-Qahtani', 'Dr. Mohammed Al-Ghamdi',
  'Dr. Layla Al-Harbi', 'Dr. Omar Al-Otaibi', 'Dr. Aisha Al-Shehri',
  'Dr. Abdullah Al-Zahrani', 'Dr. Maha Al-Mansour', 'Dr. Yasir Al-Bakr'
];

const appointmentTypes = [
  'Routine Checkup', 'Follow-up Consultation', 'First Visit',
  'Emergency Consultation', 'Specialist Review', 'Lab Test',
  'X-Ray Imaging', 'Therapy Session', 'Vaccination', 'Surgical Consultation'
];

const instructions = [
  'Please fast for 8 hours before the appointment',
  'Bring previous lab results',
  'Wear comfortable clothing',
  'No special preparation needed',
  'Avoid wearing contact lenses on the day of appointment',
  'Bring all current medications',
  'Please arrive 15 minutes early',
  'Fasting required - no food or water after midnight',
  'Bring medical history records',
  'Please complete registration forms online before arrival'
];

function getRandomDate(startDays, endDays) {
  const start = new Date();
  start.setDate(start.getDate() + startDays);
  const end = new Date();
  end.setDate(end.getDate() + endDays);
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
}

function getRandomTime() {
  const hours = Math.floor(Math.random() * 9) + 8; // 8 AM to 4 PM
  const minutes = ['00', '15', '30', '45'][Math.floor(Math.random() * 4)];
  const ampm = hours < 12 ? 'AM' : 'PM';
  const displayHour = hours > 12 ? hours - 12 : hours;
  return `${displayHour}:${minutes} ${ampm}`;
}

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Generate random appointments
function generateRandomAppointments(patientId, patientName, count) {
  const appointments = [];
  
  for (let i = 0; i < count; i++) {
    appointments.push({
      id: uuidv4(),
      patient_id: patientId,
      patient_name: patientName,
      date: getRandomDate(1, 90), // Random date within next 90 days
      time: getRandomTime(),
      department: getRandomElement(departments),
      doctor: getRandomElement(doctors),
      type: getRandomElement(appointmentTypes),
      instructions: getRandomElement(instructions),
      status: 'scheduled'
    });
  }
  
  // Sort by date
  appointments.sort((a, b) => new Date(a.date) - new Date(b.date));
  
  return appointments;
}

// Main execution
console.log('=' .repeat(70));
console.log('GENERATING 10 RANDOM APPOINTMENTS FOR EACH PATIENT');
console.log('=' .repeat(70));

db.serialize(() => {
  // Create table first
  db.run(`
    CREATE TABLE IF NOT EXISTS appointments (
      id TEXT PRIMARY KEY,
      patient_id TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      department TEXT NOT NULL,
      doctor TEXT NOT NULL,
      type TEXT NOT NULL,
      instructions TEXT,
      status TEXT DEFAULT 'scheduled',
      confirmed_at TEXT,
      cancelled_at TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating table:', err);
      return;
    }
  });
  
  // Clear existing appointments
  db.run('DELETE FROM appointments', (err) => {
    if (err) {
      console.error('Error clearing appointments:', err);
      return;
    }
    console.log('\n✓ Cleared existing appointments\n');
  });
  
  // Generate appointments for each patient
  const patients = [
    { id: 'P001', name: 'Ibrahim' },
    { id: 'P002', name: 'Yousef' },
    { id: 'P003', name: 'Motaz' }
  ];
  
  const stmt = db.prepare(`
    INSERT INTO appointments (
      id, patient_id, date, time, department, doctor, type, 
      instructions, status, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  let totalCount = 0;
  
  patients.forEach(patient => {
    console.log(`Generating appointments for ${patient.name} (${patient.id}):`);
    console.log('-' .repeat(70));
    
    const appointments = generateRandomAppointments(patient.id, patient.name, 10);
    
    appointments.forEach((apt, index) => {
      const now = new Date().toISOString();
      
      stmt.run(
        apt.id,
        apt.patient_id,
        apt.date,
        apt.time,
        apt.department,
        apt.doctor,
        apt.type,
        apt.instructions,
        apt.status,
        now,
        now,
        (err) => {
          if (err) {
            console.error('Error inserting appointment:', err);
          } else {
            totalCount++;
            console.log(`  ${index + 1}. ${apt.date} at ${apt.time} - ${apt.department} - ${apt.doctor}`);
          }
        }
      );
    });
    
    console.log('');
  });
  
  stmt.finalize(() => {
    console.log('=' .repeat(70));
    console.log(`✓ Successfully created ${totalCount} random appointments`);
    console.log('=' .repeat(70));
    
    // Show summary
    db.all('SELECT patient_id, COUNT(*) as count FROM appointments GROUP BY patient_id', (err, rows) => {
      if (err) {
        console.error('Error getting summary:', err);
      } else {
        console.log('\nSUMMARY:');
        rows.forEach(row => {
          const patient = patients.find(p => p.patient_id === row.patient_id);
          console.log(`  ${patient.name} (${row.patient_id}): ${row.count} appointments`);
        });
      }
      
      console.log('\n✓ All appointments generated successfully!\n');
      db.close();
    });
  });
});
