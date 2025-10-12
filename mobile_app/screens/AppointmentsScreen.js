import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
import axios from 'axios';
import { APPOINTMENTS_API_URL } from '../services/config';

export default function AppointmentsScreen({ route }) {
  const { patientId, patientName } = route.params || {};
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchAppointments();
    speak('Loading your appointments.');
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [activeTab]);

  const fetchAppointments = async () => {
    if (!patientId) {
      setLoading(false);
      setAppointments([]);
      speak('No patient information found.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${APPOINTMENTS_API_URL}/appointments/${patientId}`, {
        params: { type: activeTab },
        timeout: 5000
      });

      if (response.data.success) {
        setAppointments(response.data.appointments || []);
        announceAppointments(response.data.appointments || []);
      } else {
        setAppointments([]);
        speak('Unable to load appointments.');
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setAppointments([]);
      speak('Connection error. Please check your network.');
    } finally {
      setLoading(false);
    }
  };

  const announceAppointments = (apps) => {
    if (apps.length === 0) {
      speak(`You have no ${activeTab} appointments.`);
    } else {
      speak(`You have ${apps.length} ${activeTab} appointment${apps.length > 1 ? 's' : ''}.`);
    }
  };

  const speak = (text) => {
    Speech.speak(text, {
      language: 'en-US',
      pitch: 1.0,
      rate: 0.85
    });
  };

  const speakAppointmentDetails = (appointment) => {
    const message = `Appointment on ${formatDate(appointment.date)}, at ${appointment.time}, 
    Department: ${appointment.department}, with ${appointment.doctor}, Type: ${appointment.type}. 
    ${appointment.instructions ? `Instructions: ${appointment.instructions}` : ''}`;
    speak(message);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const confirmAppointment = (appointment) => {
    speak('Confirm your attendance?');
    Alert.alert(
      'Confirm Attendance',
      `Confirm appointment:\n${appointment.type}\n${formatDate(appointment.date)} at ${appointment.time}\n\nDo you confirm your attendance?`,
      [
        { 
          text: 'No', 
          onPress: () => speak('Cancelled'), 
          style: 'cancel' 
        },
        {
          text: 'Yes, Confirm',
          onPress: () => {
            speak('Attendance confirmed successfully. You will receive a reminder 24 hours before your appointment.');
            Alert.alert(
              'Confirmed ✓',
              'Your attendance has been confirmed. You will receive a reminder before the appointment.',
              [{ text: 'OK', onPress: () => speak('Thank you') }]
            );
          }
        }
      ]
    );
  };

  const cancelAppointment = (appointment) => {
    speak('Are you sure you want to cancel?');
    Alert.alert(
      'Cancel Appointment',
      `Are you sure you want to cancel:\n${appointment.type}\n${formatDate(appointment.date)} at ${appointment.time}\n\nThis action cannot be undone.`,
      [
        { 
          text: 'No, Keep It', 
          onPress: () => speak('Appointment kept'), 
          style: 'cancel' 
        },
        {
          text: 'Yes, Cancel',
          onPress: () => {
            speak('Appointment cancelled successfully. Please contact hospital reception to reschedule.');
            Alert.alert(
              'Cancelled',
              'Your appointment has been cancelled. Contact reception at extension 100 to reschedule.',
              [{ text: 'OK', onPress: () => speak('Appointment cancelled') }]
            );
          },
          style: 'destructive'
        }
      ]
    );
  };

  const AppointmentCard = ({ appointment, index }) => {
    const slideAnim = useRef(new Animated.Value(50)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
      Animated.spring(slideAnim, {
        toValue: 0,
        delay: index * 100,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }, []);

    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.97,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }).start();
    };

    const getDepartmentColor = (dept) => {
      const colors = {
        'Cardiology': ['#2563eb', '#3b82f6'],
        'Orthopedics': ['#10b981', '#059669'],
        'Dermatology': ['#8b5cf6', '#7c3aed'],
        'Ophthalmology': ['#f59e0b', '#d97706'],
        'Internal Medicine': ['#06b6d4', '#0891b2'],
        'Pediatrics': ['#ec4899', '#db2777'],
        'Neurology': ['#6366f1', '#4f46e5'],
        'ENT': ['#14b8a6', '#0d9488'],
        'Physical Therapy': ['#84cc16', '#65a30d'],
        'Radiology': ['#f97316', '#ea580c'],
        'Emergency Medicine': ['#ef4444', '#dc2626'],
        'Surgery': ['#8b5cf6', '#7c3aed'],
        default: ['#64748b', '#475569']
      };
      return colors[dept] || colors.default;
    };

    return (
      <Animated.View 
        style={[
          styles.cardWrapper,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }]
          }
        ]}
      >
        <TouchableOpacity
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={() => speakAppointmentDetails(appointment)}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={getDepartmentColor(appointment.department)}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.appointmentCard}
          >
            <View style={styles.cardHeader}>
              <View style={styles.dateContainer}>
                <Text style={styles.dateDay}>{new Date(appointment.date).getDate()}</Text>
                <Text style={styles.dateMonth}>
                  {new Date(appointment.date).toLocaleDateString('en-US', { month: 'short' })}
                </Text>
              </View>
              <View style={styles.timeContainer}>
                <Text style={styles.timeIcon}>🕒</Text>
                <Text style={styles.timeText}>{appointment.time}</Text>
              </View>
            </View>

            <View style={styles.cardBody}>
              <Text style={styles.departmentText}>{appointment.department}</Text>
              <Text style={styles.doctorText}>{appointment.doctor}</Text>
              <Text style={styles.typeText}>{appointment.type}</Text>

              {appointment.instructions && (
                <View style={styles.instructionsBox}>
                  <Text style={styles.instructionsIcon}>⚠️</Text>
                  <Text style={styles.instructionsText}>{appointment.instructions}</Text>
                </View>
              )}
            </View>

            {activeTab === 'upcoming' && (
              <View style={styles.cardActions}>
                <TouchableOpacity 
                  style={[styles.actionBtn, styles.confirmBtn]}
                  onPress={() => confirmAppointment(appointment)}
                >
                  <Text style={styles.actionBtnText}>✓ Confirm</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.actionBtn, styles.cancelBtn]}
                  onPress={() => cancelAppointment(appointment)}
                >
                  <Text style={styles.actionBtnText}>✗ Cancel</Text>
                </TouchableOpacity>
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <LinearGradient
      colors={['#0f172a', '#1e293b', '#334155']}
      style={styles.container}
    >
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => {
            setActiveTab('upcoming');
            speak('Showing upcoming appointments');
          }}
        >
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>
            Upcoming
          </Text>
          {activeTab === 'upcoming' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'past' && styles.activeTab]}
          onPress={() => {
            setActiveTab('past');
            speak('Showing past appointments');
          }}
        >
          <Text style={[styles.tabText, activeTab === 'past' && styles.activeTabText]}>
            Past
          </Text>
          {activeTab === 'past' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00ff88" />
          <Text style={styles.loadingText}>Loading appointments...</Text>
        </View>
      ) : appointments.length === 0 ? (
        <Animated.View style={[styles.emptyContainer, { opacity: fadeAnim }]}>
          <Text style={styles.emptyIcon}>📅</Text>
          <Text style={styles.emptyText}>No {activeTab} appointments</Text>
          <Text style={styles.emptySubtext}>You're all caught up!</Text>
        </Animated.View>
      ) : (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {appointments.map((appointment, index) => (
            <AppointmentCard key={appointment.id} appointment={appointment} index={index} />
          ))}
          <View style={styles.bottomPadding} />
        </ScrollView>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 25,
    padding: 5,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 20,
    position: 'relative',
  },
  activeTab: {
    backgroundColor: 'rgba(0,255,136,0.2)',
  },
  tabText: {
    fontSize: 18,
    color: '#a0aec0',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  activeTabText: {
    color: '#00ff88',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 5,
    width: 40,
    height: 3,
    backgroundColor: '#00ff88',
    borderRadius: 2,
  },
  scrollView: {
    flex: 1,
    paddingTop: 20,
  },
  cardWrapper: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  appointmentCard: {
    borderRadius: 25,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
  },
  dateContainer: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 15,
    padding: 12,
    alignItems: 'center',
    minWidth: 70,
  },
  dateDay: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    lineHeight: 36,
  },
  dateMonth: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 15,
  },
  timeIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  timeText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
  cardBody: {
    marginBottom: 15,
  },
  departmentText: {
    fontSize: 26,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  doctorText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 6,
  },
  typeText: {
    fontSize: 15,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.75)',
    fontStyle: 'italic',
  },
  instructionsBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 15,
    borderRadius: 15,
    marginTop: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#fff',
  },
  instructionsIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  instructionsText: {
    flex: 1,
    fontSize: 15,
    color: '#fff',
    fontWeight: '600',
    lineHeight: 22,
  },
  cardActions: {
    flexDirection: 'row',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 15,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  confirmBtn: {
    backgroundColor: 'rgba(0,255,136,0.3)',
  },
  cancelBtn: {
    backgroundColor: 'rgba(255,68,68,0.3)',
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: '#a0aec0',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 100,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '800',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  emptySubtext: {
    fontSize: 18,
    color: '#a0aec0',
    fontWeight: '600',
  },
  bottomPadding: {
    height: 30,
  },
});
