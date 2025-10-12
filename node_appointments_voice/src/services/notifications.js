const schedule = require('node-schedule');
const db = require('./database');

class NotificationService {
  constructor() {
    this.scheduledJobs = new Map();
  }

  // Start the notification scheduler
  startScheduler() {
    console.log('✓ Notification scheduler started');
    
    // Check for upcoming appointments every hour
    schedule.scheduleJob('0 * * * *', () => {
      this.checkUpcomingAppointments();
    });
    
    // Run initial check after 30 seconds to allow database initialization
    setTimeout(() => {
      this.checkUpcomingAppointments();
    }, 30000);
  }

  // Check for appointments in the next 24 hours
  async checkUpcomingAppointments() {
    try {
      const now = new Date();
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      
      const query = `
        SELECT a.*, p.name as patient_name, p.phone
        FROM appointments a
        JOIN patients p ON a.patient_id = p.id
        WHERE a.date = ? AND a.status = 'scheduled'
      `;
      
      const tomorrowDate = tomorrow.toISOString().split('T')[0];
      const appointments = await db.all(query, [tomorrowDate]);
      
      if (appointments && appointments.length > 0) {
        console.log(`Found ${appointments.length} appointments for tomorrow`);
        
        for (const appointment of appointments) {
          await this.sendAppointmentReminder(appointment);
        }
      }
    } catch (error) {
      console.error('Error checking appointments:', error);
    }
  }

  // Send appointment reminder
  async sendAppointmentReminder(appointment) {
    try {
      const message = `Reminder: You have an appointment tomorrow at ${appointment.time} 
        in ${appointment.department} with ${appointment.doctor}. 
        ${appointment.instructions ? 'Instructions: ' + appointment.instructions : ''}`;
      
      // In a real app, this would send a push notification
      // For now, we'll just log it and save to database
      console.log(`Sending reminder to ${appointment.patient_name}: ${message}`);
      
      await db.run(`
        INSERT INTO notifications (id, patient_id, appointment_id, type, message, sent_at, status)
        VALUES (?, ?, ?, 'reminder', ?, datetime('now'), 'sent')
      `, [
        `notif-${Date.now()}`,
        appointment.patient_id,
        appointment.id,
        message
      ]);
      
      return { success: true };
    } catch (error) {
      console.error('Error sending reminder:', error);
      return { success: false, error: error.message };
    }
  }

  // Send emergency alert
  async sendEmergencyAlert(patientId, location) {
    try {
      const message = `Emergency alert from patient at ${location}. Immediate assistance required.`;
      
      console.log(`EMERGENCY ALERT: ${message}`);
      
      await db.run(`
        INSERT INTO notifications (id, patient_id, type, message, sent_at, status)
        VALUES (?, ?, 'emergency', ?, datetime('now'), 'sent')
      `, [`notif-${Date.now()}`, patientId, message]);
      
      // In real app, trigger hospital emergency response system
      
      return { success: true, message: 'Emergency alert sent to medical staff' };
    } catch (error) {
      console.error('Error sending emergency alert:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new NotificationService();
