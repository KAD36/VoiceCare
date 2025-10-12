import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';

export default function ServicesScreen({ route }) {
  const { patientId, patientName } = route.params || {};
  const [selectedService, setSelectedService] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    speak('Services menu. Choose from medical guidance, medications, tests, or request help.');
    
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

  const handleRequestHelp = () => {
    speak('Request submitted. Hospital staff will assist you shortly.');
    Alert.alert(
      'Help Request Sent',
      'A staff member will come to assist you soon.',
      [{ text: 'OK', onPress: () => speak('Request confirmed') }]
    );
  };

  const handleDepartmentInfo = () => {
    speak('Hospital departments: Cardiology, Orthopedics, Pediatrics, Emergency, and more.');
    Alert.alert(
      'Departments',
      'Cardiology\nOrthopedics\nPediatrics\nEmergency\nLaboratory\nRadiology',
      [{ text: 'OK' }]
    );
  };

  const handleEmergency = () => {
    speak('Emergency alert sent. Medical staff notified immediately.');
    Alert.alert(
      'Emergency Alert',
      'Medical team has been notified and will arrive shortly.',
      [{ text: 'OK', style: 'default' }]
    );
  };

  const ServiceCard = ({ title, description, icon, colors, onPress }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.95,
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

    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={() => {
            speak(description);
            setTimeout(onPress, 100);
          }}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.serviceCard}
          >
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>{icon}</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.description}>{description}</Text>
            </View>
            <Text style={styles.arrow}>→</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const InfoCard = ({ icon, title, text, onPress }) => (
    <TouchableOpacity style={styles.infoCard} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.infoIcon}>{icon}</Text>
      <View style={styles.infoContent}>
        <Text style={styles.infoTitle}>{title}</Text>
        <Text style={styles.infoText}>{text}</Text>
      </View>
    </TouchableOpacity>
  );

  if (selectedService === 'guidance') {
    return (
      <LinearGradient colors={['#0f172a', '#1e293b', '#334155']} style={styles.container}>
        <ScrollView style={styles.detailView} showsVerticalScrollIndicator={false}>
          <Text style={styles.detailTitle}>Medical Guidance</Text>
          
          <InfoCard
            icon="🏥"
            title="Surgery Preparation"
            text="Fast for 8 hours. Bring insurance and ID. Arrange transport."
            onPress={() => speak('Before surgery: Fast for 8 hours. Bring insurance card and ID. Arrange for someone to drive you home.')}
          />

          <InfoCard
            icon="🍽️"
            title="Fasting Instructions"
            text="Fast 8-12 hours for blood tests. Water is okay. No alcohol 24 hours."
            onPress={() => speak('Fasting instructions: Fast 8 to 12 hours for blood tests. You may drink water. Avoid alcohol for 24 hours.')}
          />

          <InfoCard
            icon="💊"
            title="Post-Procedure Care"
            text="Rest 24 hours. Keep area clean. Take prescribed medications."
            onPress={() => speak('Post-procedure care: Rest for 24 hours. Keep the area clean and dry. Take medications as prescribed. Watch for signs of infection.')}
          />

          <InfoCard
            icon="🩹"
            title="Wound Care"
            text="Wash hands first. Change dressings daily. Keep dry."
            onPress={() => speak('Wound care: Wash hands before touching wound. Change dressings daily. Keep area dry. Apply prescribed ointment.')}
          />

          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => {
              setSelectedService(null);
              speak('Returning to services');
            }}
          >
            <Text style={styles.backButtonText}>← Back to Services</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    );
  }

  if (selectedService === 'medication') {
    return (
      <LinearGradient colors={['#0f172a', '#1e293b', '#334155']} style={styles.container}>
        <ScrollView style={styles.detailView} showsVerticalScrollIndicator={false}>
          <Text style={styles.detailTitle}>Medication Instructions</Text>
          
          <InfoCard
            icon="💊"
            title="Antibiotics"
            text="Complete full course. Take at same time daily. Take with food if upset."
            onPress={() => speak('Antibiotics: Complete the full course even if you feel better. Take at the same time each day. Take with food if it upsets your stomach.')}
          />

          <InfoCard
            icon="🩺"
            title="Pain Medication"
            text="Take only as prescribed. Don't exceed dose. Take with food. Avoid alcohol."
            onPress={() => speak('Pain medication: Take only as prescribed. Do not exceed recommended dose. Take with food. Avoid alcohol. Do not drive if drowsy.')}
          />

          <InfoCard
            icon="❤️"
            title="Blood Pressure"
            text="Take same time daily, usually morning. Don't stop suddenly. Monitor regularly."
            onPress={() => speak('Blood pressure medication: Take at same time daily, usually in morning. Do not stop suddenly. Monitor your blood pressure regularly.')}
          />

          <InfoCard
            icon="💉"
            title="Diabetes Medication"
            text="Take with meals. Monitor blood sugar. Keep glucose tablets nearby."
            onPress={() => speak('Diabetes medication: Take as prescribed with meals. Monitor blood sugar levels. Keep glucose tablets nearby. Store insulin in refrigerator.')}
          />

          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => {
              setSelectedService(null);
              speak('Returning to services');
            }}
          >
            <Text style={styles.backButtonText}>← Back to Services</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    );
  }

  if (selectedService === 'tests') {
    return (
      <LinearGradient colors={['#0f172a', '#1e293b', '#334155']} style={styles.container}>
        <ScrollView style={styles.detailView} showsVerticalScrollIndicator={false}>
          <Text style={styles.detailTitle}>Test Preparation</Text>
          
          <InfoCard
            icon="🩸"
            title="Blood Tests"
            text="Fast 8-12 hours. Drink water. Wear short sleeves. Results in 24-48 hours."
            onPress={() => speak('Blood test preparation: Fast for 8 to 12 hours. Drink plenty of water. Wear short sleeves. Results available in 24 to 48 hours.')}
          />

          <InfoCard
            icon="🔬"
            title="X-Ray"
            text="Remove jewelry and metal. Wear comfortable clothes. Inform if pregnant."
            onPress={() => speak('X-ray preparation: Remove jewelry and metal objects. Wear comfortable clothing. Inform staff if you are pregnant. Test takes 10 to 15 minutes.')}
          />

          <InfoCard
            icon="📡"
            title="Ultrasound"
            text="For abdominal: fast 6 hours. Drink water 1 hour before. Wear loose clothing."
            onPress={() => speak('Ultrasound preparation: For abdominal ultrasound, fast for 6 hours. Drink water 1 hour before. Do not urinate before pelvic ultrasound.')}
          />

          <InfoCard
            icon="🧲"
            title="MRI Scan"
            text="Remove all metal objects. Inform about implants. Stay very still. 30-60 minutes."
            onPress={() => speak('M R I scan preparation: Remove all metal including jewelry. Inform staff if you have implants or pacemaker. Test takes 30 to 60 minutes. Stay very still.')}
          />

          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => {
              setSelectedService(null);
              speak('Returning to services');
            }}
          >
            <Text style={styles.backButtonText}>← Back to Services</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#0f172a', '#1e293b', '#334155']} style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <Text style={styles.headerTitle}>Services & Guidance</Text>
          <Text style={styles.headerSubtitle}>Tap any service for help</Text>
        </Animated.View>

        <Animated.View style={[styles.servicesContainer, { opacity: fadeAnim }]}>
          <ServiceCard
            title="Medical Guidance"
            description="Surgery prep, fasting, post-procedure care"
            icon="🏥"
            colors={['#2563eb', '#3b82f6']}
            onPress={() => setSelectedService('guidance')}
          />

          <ServiceCard
            title="Medication Instructions"
            description="How to take prescribed medications safely"
            icon="💊"
            colors={['#10b981', '#059669']}
            onPress={() => setSelectedService('medication')}
          />

          <ServiceCard
            title="Test Preparation"
            description="Guidelines for blood tests, X-rays, MRI"
            icon="🔬"
            colors={['#8b5cf6', '#7c3aed']}
            onPress={() => setSelectedService('tests')}
          />

          <ServiceCard
            title="Request Help"
            description="Emergency assistance and support"
            icon="🆘"
            colors={['#ef4444', '#dc2626']}
            onPress={handleRequestHelp}
          />
        </Animated.View>

        <View style={styles.bottomPadding} />
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
  },
  servicesContainer: {
    padding: 20,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  icon: {
    fontSize: 32,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
    lineHeight: 20,
  },
  arrow: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    opacity: 0.7,
  },
  detailView: {
    flex: 1,
    padding: 20,
  },
  detailTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 1,
    marginBottom: 25,
    marginTop: 20,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  infoIcon: {
    fontSize: 40,
    marginRight: 15,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#00ff88',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  infoText: {
    fontSize: 15,
    color: '#e2e8f0',
    fontWeight: '500',
    lineHeight: 22,
  },
  backButton: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 18,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  backButtonText: {
    color: '#00ff88',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  bottomPadding: {
    height: 30,
  },
});
