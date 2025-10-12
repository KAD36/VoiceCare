import React, { useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';

export default function HelpScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    speak('Help and instructions. Tap any topic to learn more.');
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const speak = (text) => {
    Speech.speak(text, {
      language: 'en-US',
      pitch: 1.0,
      rate: 0.85
    });
  };

  const HelpCard = ({ icon, title, description, instruction }) => (
    <TouchableOpacity
      style={styles.helpCard}
      onPress={() => speak(instruction)}
      activeOpacity={0.8}
    >
      <View style={styles.cardIconContainer}>
        <Text style={styles.cardIcon}>{icon}</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDescription}>{description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={['#0f172a', '#1e293b', '#334155']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <Text style={styles.headerTitle}>Help & Instructions</Text>
          <Text style={styles.headerSubtitle}>Tap any card to hear guidance</Text>
        </Animated.View>

        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Getting Started</Text>

          <HelpCard
            icon="👤"
            title="Face Recognition Login"
            description="Position your face in the frame and tap login"
            instruction="To use face recognition: Position your face in the center of the screen within the green frame. Make sure your face is clearly visible. Tap the login button when ready. The system will recognize you and log you in automatically."
          />

          <HelpCard
            icon="🔊"
            title="Voice Guidance"
            description="All buttons speak when you tap them"
            instruction="Voice guidance: Every button and screen in this app will speak to you when you tap it. The app will read out appointment details, instructions, and help information. You don't need to read anything on the screen - just listen and tap."
          />

          <Text style={styles.sectionTitle}>Using the App</Text>

          <HelpCard
            icon="📅"
            title="View Appointments"
            description="See upcoming and past appointments"
            instruction="To view appointments: Tap the My Appointments button from the main menu. You can switch between upcoming and past appointments by tapping the tabs at the top. Tap any appointment card to hear full details including date, time, doctor, and special instructions."
          />

          <HelpCard
            icon="✓"
            title="Confirm Appointments"
            description="Let us know you're coming"
            instruction="To confirm an appointment: Open your appointments, tap the appointment card, then tap the green Confirm button at the bottom. You will receive a reminder 24 hours before your appointment."
          />

          <HelpCard
            icon="🏥"
            title="Medical Services"
            description="Get guidance for tests and medications"
            instruction="Medical services: Tap the Services button to access medical guidance. You can get instructions for surgery preparation, medication usage, test preparation, and request emergency help. Each topic has detailed voice instructions."
          />

          <HelpCard
            icon="⚙️"
            title="Adjust Settings"
            description="Change voice speed and preferences"
            instruction="Settings: Tap the Settings button to adjust the voice speed. Move the slider left for slower speech or right for faster speech. You can also enable or disable notifications and reset your face recognition data."
          />

          <Text style={styles.sectionTitle}>Getting Help</Text>

          <HelpCard
            icon="🆘"
            title="Emergency Assistance"
            description="Request immediate help"
            instruction="For emergency help: Go to Services and tap Request Help. You can get assistance finding your department, request medical emergency support, or contact technical support. Staff will be notified immediately if you request emergency help."
          />

          <HelpCard
            icon="📞"
            title="Contact Hospital"
            description="Reach hospital staff anytime"
            instruction="To contact the hospital: You can ask any staff member for help at any time. For technical support, call extension 1234. For medical emergencies, use the emergency help button in the Services menu."
          />

          <View style={styles.contactCard}>
            <Text style={styles.contactTitle}>King Salman Specialist Hospital</Text>
            <Text style={styles.contactInfo}>Emergency: Extension 9-1-1</Text>
            <Text style={styles.contactInfo}>Tech Support: Extension 1234</Text>
            <Text style={styles.contactInfo}>Reception: Extension 100</Text>
          </View>

          <View style={styles.bottomPadding} />
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 25,
    paddingTop: 40,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 1,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#a0aec0',
    fontWeight: '600',
    textAlign: 'center',
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 15,
    marginTop: 10,
    letterSpacing: 0.5,
  },
  helpCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  cardIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(16,185,129,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  cardIcon: {
    fontSize: 32,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  cardDescription: {
    fontSize: 15,
    color: '#a0aec0',
    fontWeight: '500',
    lineHeight: 22,
  },
  contactCard: {
    backgroundColor: 'rgba(16,185,129,0.15)',
    borderRadius: 20,
    padding: 25,
    marginTop: 20,
    borderWidth: 2,
    borderColor: '#10b981',
  },
  contactTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#10b981',
    marginBottom: 15,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  contactInfo: {
    fontSize: 16,
    color: '#e2e8f0',
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  bottomPadding: {
    height: 30,
  },
});
