import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';
import * as Speech from 'expo-speech';

export default function SettingsScreen({ route, navigation }) {
  const { patientId } = route.params || {};
  const [speechRate, setSpeechRate] = useState(0.85);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    speak('Settings screen. Adjust voice and preferences.');
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const speak = (text) => {
    if (!voiceEnabled) return;
    Speech.speak(text, { language: 'en-US', pitch: 1.0, rate: speechRate });
  };

  const testVoice = () => {
    speak('This is a voice test with current settings.');
  };

  const resetFaceRecognition = () => {
    speak('Resetting face recognition');
    setTimeout(() => {
      speak('Face data reset. Returning to login screen.');
      navigation.replace('FaceLogin');
    }, 1000);
  };

  const SettingCard = ({ children }) => (
    <View style={styles.settingCard}>
      {children}
    </View>
  );

  const SettingRow = ({ label, value, onValueChange }) => (
    <View style={styles.settingRow}>
      <Text style={styles.settingLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={(newValue) => {
          onValueChange(newValue);
          speak(newValue ? `${label} enabled` : `${label} disabled`);
        }}
        trackColor={{ false: '#475569', true: '#10b981' }}
        thumbColor={value ? '#fff' : '#f4f3f4'}
      />
    </View>
  );

  return (
    <LinearGradient
      colors={['#0f172a', '#1e293b', '#334155']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerSubtitle}>Customize your experience</Text>
        </Animated.View>

        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>🔊 Voice</Text>
          
          <SettingCard>
            <SettingRow
              label="Voice Guidance"
              value={voiceEnabled}
              onValueChange={setVoiceEnabled}
            />
            
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>Speech Speed</Text>
              <View style={styles.sliderRow}>
                <Text style={styles.sliderValue}>Slow</Text>
                <Slider
                  style={styles.slider}
                  minimumValue={0.5}
                  maximumValue={1.5}
                  value={speechRate}
                  onValueChange={setSpeechRate}
                  minimumTrackTintColor="#10b981"
                  maximumTrackTintColor="#3e3e3e"
                  thumbTintColor="#10b981"
                />
                <Text style={styles.sliderValue}>Fast</Text>
              </View>
              <Text style={styles.sliderCurrentValue}>{speechRate.toFixed(2)}x</Text>
            </View>

            <TouchableOpacity style={styles.testButton} onPress={testVoice}>
              <Text style={styles.testButtonText}>🔊 Test Voice</Text>
            </TouchableOpacity>
          </SettingCard>

          <Text style={styles.sectionTitle}>🔔 Notifications</Text>
          
          <SettingCard>
            <SettingRow
              label="Push Notifications"
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
            />
          </SettingCard>

          <Text style={styles.sectionTitle}>🔐 Security</Text>
          
          <SettingCard>
            <TouchableOpacity 
              style={styles.dangerButton}
              onPress={resetFaceRecognition}
            >
              <Text style={styles.dangerIcon}>🔄</Text>
              <View style={styles.dangerTextContainer}>
                <Text style={styles.dangerButtonTitle}>Reset Face Recognition</Text>
                <Text style={styles.dangerButtonSubtitle}>Clear face data and re-register</Text>
              </View>
            </TouchableOpacity>
          </SettingCard>

          <View style={styles.bottomInfo}>
            <Text style={styles.infoText}>VoiceCare v1.0</Text>
            <Text style={styles.infoSubtext}>King Salman Specialist Hospital</Text>
          </View>
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
  settingCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLabel: {
    fontSize: 18,
    color: '#e2e8f0',
    fontWeight: '600',
  },
  sliderContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  sliderLabel: {
    fontSize: 18,
    color: '#e2e8f0',
    fontWeight: '600',
    marginBottom: 15,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  slider: {
    flex: 1,
    height: 40,
    marginHorizontal: 10,
  },
  sliderValue: {
    fontSize: 14,
    color: '#a0aec0',
    fontWeight: '600',
    width: 40,
  },
  sliderCurrentValue: {
    fontSize: 20,
    color: '#00ff88',
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 10,
    letterSpacing: 1,
  },
  testButton: {
    backgroundColor: 'rgba(0,255,136,0.2)',
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 2,
    borderColor: '#00ff88',
  },
  testButtonText: {
    color: '#00ff88',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,68,68,0.15)',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'rgba(255,68,68,0.3)',
  },
  dangerIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  dangerTextContainer: {
    flex: 1,
  },
  dangerButtonTitle: {
    color: '#ff6b6b',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  dangerButtonSubtitle: {
    color: '#ff9999',
    fontSize: 14,
    fontWeight: '500',
  },
  bottomInfo: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    color: '#a0aec0',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  infoSubtext: {
    fontSize: 14,
    color: '#718096',
    fontWeight: '500',
    marginTop: 5,
  },
  bottomPadding: {
    height: 30,
  },
});
