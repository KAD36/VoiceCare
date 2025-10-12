const express = require('express');
const router = express.Router();
const db = require('../services/database');
const { Expo } = require('expo-server-sdk');

// Create Expo SDK client
const expo = new Expo();

// Store of push tokens
const pushTokens = new Map();

// Register push token
router.post('/register', async (req, res) => {
  try {
    const { patientId, pushToken, platform } = req.body;

    if (!patientId || !pushToken) {
      return res.status(400).json({
        success: false,
        error: 'patientId and pushToken are required'
      });
    }

    // Validate Expo push token
    if (!Expo.isExpoPushToken(pushToken)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Expo push token'
      });
    }

    // Store token in memory (in production, store in database)
    pushTokens.set(patientId, { token: pushToken, platform, registeredAt: new Date() });

    // Also save to database for persistence
    await db.run(`
      INSERT OR REPLACE INTO push_tokens (patient_id, push_token, platform, registered_at)
      VALUES (?, ?, ?, datetime('now'))
    `, [patientId, pushToken, platform || 'unknown']);

    console.log(`✓ Push token registered for patient ${patientId}`);

    res.json({
      success: true,
      message: 'Push token registered successfully',
      patientId
    });
  } catch (error) {
    console.error('Error registering push token:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Send push notification to specific patient
router.post('/send', async (req, res) => {
  try {
    const { patientId, title, body, data } = req.body;

    if (!patientId || !title || !body) {
      return res.status(400).json({
        success: false,
        error: 'patientId, title, and body are required'
      });
    }

    // Get patient's push token
    const tokenData = pushTokens.get(patientId);
    
    if (!tokenData) {
      // Try to get from database
      const row = await db.get(
        'SELECT push_token FROM push_tokens WHERE patient_id = ? ORDER BY registered_at DESC LIMIT 1',
        [patientId]
      );

      if (!row) {
        return res.status(404).json({
          success: false,
          error: 'No push token found for this patient'
        });
      }

      pushTokens.set(patientId, { token: row.push_token });
    }

    const pushToken = tokenData.token;

    // Create message
    const message = {
      to: pushToken,
      sound: 'default',
      title,
      body,
      data: data || {},
      priority: 'high',
    };

    // Send push notification
    const chunks = expo.chunkPushNotifications([message]);
    const tickets = [];

    for (const chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error('Error sending chunk:', error);
      }
    }

    console.log(`✓ Push notification sent to patient ${patientId}`);

    // Save notification to database
    await db.run(`
      INSERT INTO notifications (id, patient_id, type, message, sent_at, status)
      VALUES (?, ?, 'push', ?, datetime('now'), 'sent')
    `, [`notif-${Date.now()}`, patientId, JSON.stringify({ title, body, data })]);

    res.json({
      success: true,
      message: 'Push notification sent',
      tickets
    });
  } catch (error) {
    console.error('Error sending push notification:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Send appointment reminder
router.post('/appointment-reminder', async (req, res) => {
  try {
    const { appointmentId } = req.body;

    if (!appointmentId) {
      return res.status(400).json({
        success: false,
        error: 'appointmentId is required'
      });
    }

    // Get appointment details
    const appointment = await db.get(`
      SELECT a.*, p.id as patient_id, p.name as patient_name
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      WHERE a.id = ?
    `, [appointmentId]);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: 'Appointment not found'
      });
    }

    // Get push token
    const tokenData = pushTokens.get(appointment.patient_id);
    
    if (!tokenData) {
      const row = await db.get(
        'SELECT push_token FROM push_tokens WHERE patient_id = ? ORDER BY registered_at DESC LIMIT 1',
        [appointment.patient_id]
      );

      if (!row) {
        return res.status(404).json({
          success: false,
          error: 'No push token found for this patient'
        });
      }

      pushTokens.set(appointment.patient_id, { token: row.push_token });
    }

    const pushToken = tokenData.token || pushTokens.get(appointment.patient_id).token;

    // Create reminder message
    const message = {
      to: pushToken,
      sound: 'default',
      title: '📅 Appointment Reminder',
      body: `You have an appointment tomorrow at ${appointment.time} in ${appointment.department}`,
      data: { 
        appointmentId: appointment.id,
        type: 'appointment_reminder'
      },
      priority: 'high',
    };

    // Send notification
    const chunks = expo.chunkPushNotifications([message]);
    
    for (const chunk of chunks) {
      await expo.sendPushNotificationsAsync(chunk);
    }

    console.log(`✓ Appointment reminder sent for ${appointmentId}`);

    res.json({
      success: true,
      message: 'Appointment reminder sent'
    });
  } catch (error) {
    console.error('Error sending appointment reminder:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get patient notifications
router.get('/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;

    const notifications = await db.all(`
      SELECT * FROM notifications
      WHERE patient_id = ?
      ORDER BY sent_at DESC
      LIMIT 50
    `, [patientId]);

    res.json({
      success: true,
      notifications
    });
  } catch (error) {
    console.error('Error getting notifications:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
