const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dbPath = path.join(__dirname, 'data', 'appointments.db');
const db = new sqlite3.Database(dbPath);

// Appointments data for all patients
const appointments = [
  // Ibrahim's appointments
  {
    patient_id: 'P001',
    patient_name: 'Ibrahim',
    date: '2025-10-25',
    time: '09:00 AM',
    department: 'Cardiology',
    doctor: 'Dr. Ahmed Hassan',
    type: 'Routine Checkup',
    instructions: 'Please fast for 8 hours before the appointment'
  },
  {
    patient_id: 'P001',
    patient_name: 'Ibrahim',
    date: '2025-11-05',
    time: '02:30 PM',
    department: 'Internal Medicine',
    doctor: 'Dr. Fatima Al-Saud',
    type: 'Follow-up Consultation',
    instructions: 'Bring previous lab results'
  },
  
  // Yousef's appointments
  {
    patient_id: 'P002',
    patient_name: 'Yousef',
    date: '2025-10-28',
    time: '10:30 AM',
    department: 'Orthopedics',
    doctor: 'Dr. Khalid Al-Rashid',
    type: 'Consultation',
    instructions: 'Bring X-ray images if available'
  },
  {
    patient_id: 'P002',
    patient_name: 'Yousef',
    date: '2025-11-10',
    time: '11:00 AM',
    department: 'Physical Therapy',
    doctor: 'Dr. Sara Al-Mutairi',
    type: 'Therapy Session',
    instructions: 'Wear comfortable clothing'
  },
  
  // Motaz's appointments
  {
    patient_id: 'P003',
    patient_name: 'Motaz',
    date: '2025-10-30',
    time: '03:00 PM',
    department: 'Dermatology',
    doctor: 'Dr. Nora Al-Qahtani',
    type: 'Skin Checkup',
    instructions: 'No special preparation needed'
  },
  {
    patient_id: 'P003',
    patient_name: 'Motaz',
    date: '2025-11-15',
    time: '01:00 PM',
    department: 'Ophthalmology',
    doctor: 'Dr. Mohammed Al-Ghamdi',
    type: 'Eye Examination',
    instructions: 'Avoid wearing contact lenses on the day of appointment'
  }
];

// No need to update patients table - Django handles that

// Create appointments
const createAppointments = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create table if not exists
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
          return reject(err);
        }
        console.log('✓ Table ready');
      });
      
      // Clear existing appointments
      db.run('DELETE FROM appointments', (err) => {
        if (err) {
          console.error('Error clearing appointments:', err);
        }
        console.log('✓ Cleared existing appointments');
      });
      
      // Insert new appointments
      const stmt = db.prepare(`
        INSERT INTO appointments (
          id, patient_id, date, time, department, doctor, type, 
          instructions, status, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      let count = 0;
      appointments.forEach(apt => {
        const id = uuidv4();
        const now = new Date().toISOString();
        
        stmt.run(
          id,
          apt.patient_id,
          apt.date,
          apt.time,
          apt.department,
          apt.doctor,
          apt.type,
          apt.instructions,
          'scheduled',
          now,
          now,
          (err) => {
            if (err) {
              console.error('Error inserting appointment:', err);
            } else {
              count++;
              console.log(`  ✓ ${apt.patient_name}: ${apt.date} at ${apt.time} - ${apt.department}`);
            }
          }
        );
      });
      
      stmt.finalize(() => {
        console.log(`\n✓ Created ${count} appointments total`);
        resolve();
      });
    });
  });
};

// Main execution
console.log('=' .repeat(60));
console.log('CREATING APPOINTMENTS FOR ALL PATIENTS');
console.log('=' .repeat(60));

createAppointments()
  .then(() => {
    console.log('\n' + '=' .repeat(60));
    console.log('SUMMARY');
    console.log('=' .repeat(60));
    
    db.all('SELECT patient_id, COUNT(*) as count FROM appointments GROUP BY patient_id', (err, rows) => {
      if (err) {
        console.error('Error getting summary:', err);
      } else {
        rows.forEach(row => {
          const patient = appointments.find(a => a.patient_id === row.patient_id);
          console.log(`${patient.patient_name} (${row.patient_id}): ${row.count} appointments`);
        });
      }
      
      console.log('=' .repeat(60));
      console.log('✓ All data created successfully!');
      console.log('=' .repeat(60));
      
      db.close();
    });
  })
  .catch(err => {
    console.error('Error:', err);
    db.close();
  });
