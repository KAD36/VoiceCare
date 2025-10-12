const express = require('express');
const router = express.Router();
const db = require('../services/database');
const { v4: uuidv4 } = require('uuid');

// Random data for generating appointments
const departments = ['Cardiology', 'Orthopedics', 'Dermatology', 'Ophthalmology', 'Internal Medicine', 'Pediatrics', 'Neurology', 'ENT', 'Physical Therapy', 'Radiology', 'Emergency Medicine', 'Surgery'];
const doctors = ['Dr. Ahmed Hassan', 'Dr. Fatima Al-Saud', 'Dr. Khalid Al-Rashid', 'Dr. Sara Al-Mutairi', 'Dr. Nora Al-Qahtani', 'Dr. Mohammed Al-Ghamdi', 'Dr. Layla Al-Harbi', 'Dr. Omar Al-Otaibi', 'Dr. Aisha Al-Shehri', 'Dr. Abdullah Al-Zahrani', 'Dr. Maha Al-Mansour', 'Dr. Yasir Al-Bakr'];
const appointmentTypes = ['Routine Checkup', 'Follow-up Consultation', 'First Visit', 'Emergency Consultation', 'Specialist Review', 'Lab Test', 'X-Ray Imaging', 'Therapy Session', 'Vaccination', 'Surgical Consultation'];
const instructions = ['Please fast for 8 hours before the appointment', 'Bring previous lab results', 'Wear comfortable clothing', 'No special preparation needed', 'Avoid wearing contact lenses on the day of appointment', 'Bring all current medications', 'Please arrive 15 minutes early', 'Fasting required - no food or water after midnight', 'Bring medical history records', 'Please complete registration forms online before arrival'];

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

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

function generateRandomAppointments(patientId, count = 10) {
  const appointments = [];
  
  for (let i = 0; i < count; i++) {
    appointments.push({
      id: uuidv4(),
      patient_id: patientId,
      date: getRandomDate(1, 90),
      time: getRandomTime(),
      department: getRandomElement(departments),
      doctor: getRandomElement(doctors),
      type: getRandomElement(appointmentTypes),
      instructions: getRandomElement(instructions),
      status: 'scheduled',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }
  
  // Sort by date
  appointments.sort((a, b) => new Date(a.date) - new Date(b.date));
  
  return appointments;
}

// Get all appointments for a patient
router.get('/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    const { type } = req.query; // 'upcoming' or 'past'
    
    // Generate 2-5 random appointments dynamically
    const appointmentCount = Math.floor(Math.random() * 4) + 2; // Random between 2 and 5
    const appointments = generateRandomAppointments(patientId, appointmentCount);
    
    // Filter by type if requested
    const currentDate = new Date().toISOString().split('T')[0];
    let filteredAppointments = appointments;
    
    if (type === 'upcoming') {
      filteredAppointments = appointments.filter(apt => apt.date >= currentDate);
    } else if (type === 'past') {
      filteredAppointments = appointments.filter(apt => apt.date < currentDate);
    }
    
    res.json({
      success: true,
      appointments: filteredAppointments,
      count: filteredAppointments.length
    });
  } catch (error) {
    console.error('Error generating appointments:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to generate appointments' 
    });
  }
});

// Get single appointment details
router.get('/:patientId/:appointmentId', async (req, res) => {
  try {
    const { patientId, appointmentId } = req.params;
    
    const appointment = await db.get(
      'SELECT * FROM appointments WHERE id = ? AND patient_id = ?',
      [appointmentId, patientId]
    );
    
    if (!appointment) {
      return res.status(404).json({ 
        success: false, 
        error: 'Appointment not found' 
      });
    }
    
    res.json({ success: true, appointment });
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch appointment' 
    });
  }
});

// Create new appointment
router.post('/', async (req, res) => {
  try {
    const { patient_id, date, time, department, doctor, type, instructions } = req.body;
    
    if (!patient_id || !date || !time || !department) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields' 
      });
    }
    
    const id = uuidv4();
    const query = `
      INSERT INTO appointments (id, patient_id, date, time, department, doctor, type, instructions, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'scheduled', datetime('now'))
    `;
    
    await db.run(query, [id, patient_id, date, time, department, doctor, type, instructions]);
    
    res.status(201).json({ 
      success: true, 
      appointmentId: id,
      message: 'Appointment created successfully' 
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create appointment' 
    });
  }
});

// Confirm appointment attendance
router.put('/:appointmentId/confirm', async (req, res) => {
  try {
    const { appointmentId } = req.params;
    
    await db.run(
      'UPDATE appointments SET status = ?, confirmed_at = datetime("now") WHERE id = ?',
      ['confirmed', appointmentId]
    );
    
    res.json({ 
      success: true, 
      message: 'Appointment confirmed successfully' 
    });
  } catch (error) {
    console.error('Error confirming appointment:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to confirm appointment' 
    });
  }
});

// Cancel appointment
router.delete('/:appointmentId', async (req, res) => {
  try {
    const { appointmentId } = req.params;
    
    await db.run(
      'UPDATE appointments SET status = ?, cancelled_at = datetime("now") WHERE id = ?',
      ['cancelled', appointmentId]
    );
    
    res.json({ 
      success: true, 
      message: 'Appointment cancelled successfully' 
    });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to cancel appointment' 
    });
  }
});

// Reschedule appointment
router.put('/:appointmentId/reschedule', async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { date, time } = req.body;
    
    if (!date || !time) {
      return res.status(400).json({ 
        success: false, 
        error: 'Date and time are required' 
      });
    }
    
    await db.run(
      'UPDATE appointments SET date = ?, time = ?, status = ?, updated_at = datetime("now") WHERE id = ?',
      [date, time, 'rescheduled', appointmentId]
    );
    
    res.json({ 
      success: true, 
      message: 'Appointment rescheduled successfully' 
    });
  } catch (error) {
    console.error('Error rescheduling appointment:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to reschedule appointment' 
    });
  }
});

module.exports = router;
