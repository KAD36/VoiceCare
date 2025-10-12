import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';

const { width } = Dimensions.get('window');

export default function WelcomeScreen({ route, navigation }) {
  const { patientId, patientName } = route.params || { patientName: 'Guest' };
  const [currentTime, setCurrentTime] = useState(new Date());
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    const welcomeMessage = `Welcome ${patientName}. You have successfully logged in to VoiceCare.`;
    
    Speech.speak(welcomeMessage, {
      language: 'en-US',
      pitch: 1.0,
      rate: 0.85
    });

    // Animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [patientName]);

  const speak = (text) => {
    Speech.speak(text, {
      language: 'en-US',
      pitch: 1.0,
      rate: 0.85
    });
  };

  const navigateWithVoice = (screen, message) => {
    speak(message);
    setTimeout(() => {
      navigation.navigate(screen, { patientId, patientName });
    }, 500);
  };

  const MenuCard = ({ title, description, onPress, colors, icon }) => {
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
            onPress();
          }}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.menuCard}
          >
            <View style={styles.cardIconContainer}>
              <Text style={styles.cardIcon}>{icon}</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{title}</Text>
              <Text style={styles.cardDescription}>{description}</Text>
            </View>
            <Text style={styles.arrow}>→</Text>
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
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.greetingContainer}>
            <Text style={styles.greetingText}>Welcome back,</Text>
            <Text style={styles.nameText}>{patientName}</Text>
          </View>
          
          <View style={styles.timeContainer}>
            <Text style={styles.dateText}>
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
            <Text style={styles.clockText}>
              {currentTime.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Text>
          </View>
        </Animated.View>

        <Animated.View 
          style={[
            styles.menuContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Quick Access</Text>

          <MenuCard
            title="My Appointments"
            description="View upcoming and past appointments"
            icon="📅"
            colors={['#2563eb', '#3b82f6']}
            onPress={() => navigateWithVoice('Appointments', 'Opening appointments')}
          />

          <MenuCard
            title="Medical Services"
            description="Get guidance and request help"
            icon="🏥"
            colors={['#10b981', '#059669']}
            onPress={() => navigateWithVoice('Services', 'Opening services')}
          />

          <MenuCard
            title="Settings"
            description="Adjust voice and preferences"
            icon="⚙️"
            colors={['#8b5cf6', '#7c3aed']}
            onPress={() => navigateWithVoice('Settings', 'Opening settings')}
          />

          <MenuCard
            title="Help & Support"
            description="Instructions and assistance"
            icon="❓"
            colors={['#f59e0b', '#d97706']}
            onPress={() => navigateWithVoice('Help', 'Opening help')}
          />
        </Animated.View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>King Salman Specialist Hospital</Text>
          <View style={styles.versionBadge}>
            <Text style={styles.versionText}>VoiceCare v1.0</Text>
          </View>
        </View>
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
    paddingTop: 50,
  },
  greetingContainer: {
    marginBottom: 20,
  },
  greetingText: {
    fontSize: 20,
    color: '#a0aec0',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  nameText: {
    fontSize: 38,
    fontWeight: '900',
    color: '#fff',
    marginTop: 5,
    letterSpacing: 1,
  },
  timeContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  dateText: {
    fontSize: 16,
    color: '#e2e8f0',
    fontWeight: '600',
    marginBottom: 5,
  },
  clockText: {
    fontSize: 42,
    fontWeight: '900',
    color: '#00ff88',
    letterSpacing: 2,
    textShadowColor: 'rgba(0,255,136,0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  menuContainer: {
    padding: 20,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 20,
    letterSpacing: 1,
  },
  menuCard: {
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
  cardIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
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
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  cardDescription: {
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
  footer: {
    alignItems: 'center',
    padding: 30,
    paddingBottom: 50,
  },
  footerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#a0aec0',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  versionBadge: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  versionText: {
    color: '#00ff88',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
