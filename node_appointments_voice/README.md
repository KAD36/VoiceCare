# VoiceCare Appointments API

## Overview
Node.js REST API backend for managing patient appointments in the VoiceCare application.

## Features
- Appointment CRUD operations
- Patient management
- Automated appointment reminders
- Notification scheduling
- SQLite database for data persistence
- RESTful API design
- Security with Helmet.js
- CORS enabled for mobile app

## Installation

### Prerequisites
- Node.js 14+ and npm

### Setup
```bash
cd node_appointments_voice
npm install
```

### Running the Server
```bash
# Production mode
npm start

# Development mode with auto-reload
npm run dev

# Run tests
npm test
```

The server will start on `http://localhost:3000`

## API Endpoints

### Health Check
- `GET /health` - Check API status

### Appointments
- `GET /api/appointments/:patientId` - Get all appointments for a patient
  - Query params: `type=upcoming|past`
- `GET /api/appointments/:patientId/:appointmentId` - Get single appointment
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/:appointmentId/confirm` - Confirm attendance
- `PUT /api/appointments/:appointmentId/reschedule` - Reschedule appointment
- `DELETE /api/appointments/:appointmentId` - Cancel appointment

## Database Schema

### appointments
- id (TEXT, PRIMARY KEY)
- patient_id (TEXT)
- date (TEXT)
- time (TEXT)
- department (TEXT)
- doctor (TEXT)
- type (TEXT)
- instructions (TEXT)
- status (TEXT)
- created_at (TIMESTAMP)

### patients
- id (TEXT, PRIMARY KEY)
- name (TEXT)
- phone (TEXT)
- medical_record_number (TEXT, UNIQUE)
- face_data_id (TEXT)

### notifications
- id (TEXT, PRIMARY KEY)
- patient_id (TEXT)
- appointment_id (TEXT)
- type (TEXT)
- message (TEXT)
- sent_at (TIMESTAMP)

## Security
- Helmet.js for HTTP security headers
- CORS configured for mobile app origin
- Input validation on all endpoints
- SQL injection protection with parameterized queries

## Environment Variables
```
PORT=3000
NODE_ENV=development
```

## License
Proprietary - King Salman Specialist Hospital
