// Push Notifications Service for VoiceCare
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { APPOINTMENTS_API_URL } from './config';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class NotificationService {
  constructor() {
    this.expoPushToken = null;
    this.notificationListener = null;
    this.responseListener = null;
  }

  // Initialize notification service
  async initialize(patientId) {
    try {
      // Request permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return null;
      }

      // Get push token
      if (Device.isDevice) {
        const token = (await Notifications.getExpoPushTokenAsync()).data;
        this.expoPushToken = token;
        console.log('Expo Push Token:', token);

        // Register token with backend
        await this.registerPushToken(patientId, token);

        return token;
      } else {
        console.log('Must use physical device for Push Notifications');
      }

      // Configure Android notification channel
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      return this.expoPushToken;
    } catch (error) {
      console.error('Error initializing notifications:', error);
      return null;
    }
  }

  // Register push token with backend
  async registerPushToken(patientId, token) {
    try {
      const response = await fetch(`${APPOINTMENTS_API_URL}/notifications/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId,
          pushToken: token,
          platform: Platform.OS,
        }),
      });

      const data = await response.json();
      console.log('Push token registered:', data);
      return data;
    } catch (error) {
      console.error('Error registering push token:', error);
      return null;
    }
  }

  // Schedule local notification
  async scheduleAppointmentReminder(appointment) {
    try {
      // Calculate trigger time (24 hours before appointment)
      const appointmentDate = new Date(appointment.date + 'T' + appointment.time);
      const reminderTime = new Date(appointmentDate.getTime() - 24 * 60 * 60 * 1000);
      const now = new Date();

      // Only schedule if reminder time is in the future
      if (reminderTime > now) {
        const notificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title: '📅 Appointment Reminder',
            body: `You have an appointment tomorrow at ${appointment.time} in ${appointment.department}`,
            data: { appointmentId: appointment.id, type: 'appointment_reminder' },
            sound: true,
            priority: Notifications.AndroidNotificationPriority.HIGH,
          },
          trigger: {
            date: reminderTime,
          },
        });

        console.log('Scheduled notification:', notificationId);
        return notificationId;
      } else {
        console.log('Reminder time has passed, not scheduling');
        return null;
      }
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return null;
    }
  }

  // Schedule multiple appointment reminders
  async scheduleAppointmentReminders(appointments) {
    const notificationIds = [];
    
    for (const appointment of appointments) {
      const id = await this.scheduleAppointmentReminder(appointment);
      if (id) {
        notificationIds.push(id);
      }
    }

    console.log(`Scheduled ${notificationIds.length} notifications`);
    return notificationIds;
  }

  // Cancel all scheduled notifications
  async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('All notifications cancelled');
    } catch (error) {
      console.error('Error cancelling notifications:', error);
    }
  }

  // Cancel specific notification
  async cancelNotification(notificationId) {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      console.log('Notification cancelled:', notificationId);
    } catch (error) {
      console.error('Error cancelling notification:', error);
    }
  }

  // Send immediate notification
  async sendImmediateNotification(title, body, data = {}) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: true,
        },
        trigger: null, // null means immediate
      });
    } catch (error) {
      console.error('Error sending immediate notification:', error);
    }
  }

  // Get all scheduled notifications
  async getAllScheduledNotifications() {
    try {
      const notifications = await Notifications.getAllScheduledNotificationsAsync();
      console.log('Scheduled notifications:', notifications.length);
      return notifications;
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return [];
    }
  }

  // Setup notification listeners
  setupListeners(onNotificationReceived, onNotificationTapped) {
    // Listener for notifications received while app is foregrounded
    this.notificationListener = Notifications.addNotificationReceivedListener(
      notification => {
        console.log('Notification received:', notification);
        if (onNotificationReceived) {
          onNotificationReceived(notification);
        }
      }
    );

    // Listener for user tapping on notification
    this.responseListener = Notifications.addNotificationResponseReceivedListener(
      response => {
        console.log('Notification tapped:', response);
        if (onNotificationTapped) {
          onNotificationTapped(response);
        }
      }
    );
  }

  // Remove listeners
  removeListeners() {
    if (this.notificationListener) {
      Notifications.removeNotificationSubscription(this.notificationListener);
    }
    if (this.responseListener) {
      Notifications.removeNotificationSubscription(this.responseListener);
    }
  }

  // Get push token
  getPushToken() {
    return this.expoPushToken;
  }
}

export default new NotificationService();
