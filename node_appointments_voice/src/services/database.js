const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, '../../data/voicecare.db');

// Create database connection
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('✓ Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database schema
function initializeDatabase() {
  db.serialize(() => {
    // Create appointments table
    db.run(`
      CREATE TABLE IF NOT EXISTS appointments (
        id TEXT PRIMARY KEY,
        patient_id TEXT NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        department TEXT NOT NULL,
        doctor TEXT,
        type TEXT,
        instructions TEXT,
        status TEXT DEFAULT 'scheduled',
        confirmed_at TEXT,
        cancelled_at TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create patients table
    db.run(`
      CREATE TABLE IF NOT EXISTS patients (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT,
        email TEXT,
        date_of_birth TEXT,
        medical_record_number TEXT UNIQUE,
        face_data_id TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create notifications table
    db.run(`
      CREATE TABLE IF NOT EXISTS notifications (
        id TEXT PRIMARY KEY,
        patient_id TEXT NOT NULL,
        appointment_id TEXT,
        type TEXT NOT NULL,
        message TEXT NOT NULL,
        sent_at TEXT,
        status TEXT DEFAULT 'pending',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('✓ Database schema initialized');
  });
}

// Promisify database methods
const dbAsync = {
  all: (query, params) => {
    return new Promise((resolve, reject) => {
      db.all(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },
  
  get: (query, params) => {
    return new Promise((resolve, reject) => {
      db.get(query, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },
  
  run: (query, params) => {
    return new Promise((resolve, reject) => {
      db.run(query, params, function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, changes: this.changes });
      });
    });
  }
};

module.exports = dbAsync;
