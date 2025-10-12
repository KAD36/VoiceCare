import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Speech from 'expo-speech';
import axios from 'axios';
import { API_BASE_URL, FACE_RECOGNITION_URL } from '../services/config';

export default function FaceLoginScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const cameraRef = useRef(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      if (!permission) {
        await requestPermission();
      }
      
      // Fade in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
      
      // Pulse animation for button
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
      
      if (permission?.granted) {
        speak('Welcome to VoiceCare. Position your face in the frame and tap to login.');
      } else {
        speak('Camera permission is required for face recognition.');
      }
    })();
  }, [permission]);

  const speak = (text) => {
    setIsSpeaking(true);
    Speech.speak(text, {
      language: 'en-US',
      pitch: 1.0,
      rate: 0.85,
      onDone: () => setIsSpeaking(false)
    });
  };

  const handleFaceLogin = async () => {
    if (!cameraRef.current || isProcessing) return;

    setIsProcessing(true);
    speak('Processing face recognition. Please hold still.');

    try {
      // Capture photo
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: true,
      });

      // Send to face recognition API
      const response = await axios.post(`${FACE_RECOGNITION_URL}/recognize/`, {
        image: photo.base64,
      }, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.data.success && response.data.patient) {
        const patient = response.data.patient;
        speak(`Welcome ${patient.name}. Taking you to Voice Care`);
        
        setTimeout(() => {
          // Navigate to Welcome screen
          navigation.replace('Welcome', { 
            patientId: patient.id,
            patientName: patient.name 
          });
        }, 1500);
      } else {
        speak('Face not recognized. Please try again or contact hospital staff for assistance.');
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Face recognition error:', error);
      speak('Connection error. Please check your internet connection and try again.');
      setIsProcessing(false);
    }
  };

  const handleManualLogin = () => {
    speak('Redirecting to manual login assistance. Please ask a staff member for help.');
    // In a real app, this could redirect to a staff assistance screen
    Alert.alert(
      'Manual Login',
      'Please ask hospital staff to help you login manually.',
      [{ text: 'OK', onPress: () => speak('Returning to face recognition.') }]
    );
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>Loading camera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Camera access is required</Text>
        <Text style={styles.instructionText}>
          Please enable camera permissions in your device settings
        </Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={handleManualLogin}
        >
          <Text style={styles.buttonText}>Get Help from Staff</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView 
        style={styles.camera} 
        facing="front"
        ref={cameraRef}
      />
      <LinearGradient
        colors={['rgba(0,102,204,0.7)', 'rgba(0,170,102,0.7)', 'rgba(153,51,204,0.7)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.overlay}
      >
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <Text style={styles.title}>VoiceCare</Text>
          <Text style={styles.subtitle}>King Salman Specialist Hospital</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Face Recognition Login</Text>
          </View>
        </Animated.View>

        <Animated.View style={[styles.faceFrame, { opacity: fadeAnim }]}>
          <View style={styles.scanLine} />
          <View style={styles.cornerTopLeft} />
          <View style={styles.cornerTopRight} />
          <View style={styles.cornerBottomLeft} />
          <View style={styles.cornerBottomRight} />
        </Animated.View>

        <Animated.View style={[styles.instructionsContainer, { opacity: fadeAnim }]}>
          <Text style={styles.instructionText}>
            {isProcessing ? '🔄 Analyzing...' : '👤 Position Your Face'}
          </Text>
          <Text style={styles.subInstructionText}>
            {isProcessing ? 'Please wait' : 'Tap the button below to login'}
          </Text>
        </Animated.View>

        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <TouchableOpacity 
            style={[styles.captureButton, isProcessing && styles.captureButtonDisabled]}
            onPress={handleFaceLogin}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : (
              <>
                <Text style={styles.captureIcon}>👆</Text>
                <Text style={styles.captureButtonText}>TAP TO LOGIN</Text>
              </>
            )}
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity 
          style={styles.helpButton}
          onPress={handleManualLogin}
        >
          <Text style={styles.helpIcon}>💬</Text>
          <Text style={styles.helpButtonText}>Need Assistance?</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 50,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 25,
    padding: 20,
    backdropFilter: 'blur(10px)',
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 15,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.95,
    fontWeight: '600',
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
  faceFrame: {
    width: 280,
    height: 350,
    position: 'relative',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 30,
  },
  scanLine: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#00ff88',
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  cornerTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 60,
    height: 60,
    borderTopWidth: 5,
    borderLeftWidth: 5,
    borderColor: '#00ff88',
    borderTopLeftRadius: 30,
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  cornerTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 60,
    height: 60,
    borderTopWidth: 5,
    borderRightWidth: 5,
    borderColor: '#00ff88',
    borderTopRightRadius: 30,
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 60,
    height: 60,
    borderBottomWidth: 5,
    borderLeftWidth: 5,
    borderColor: '#00ff88',
    borderBottomLeftRadius: 30,
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 60,
    height: 60,
    borderBottomWidth: 5,
    borderRightWidth: 5,
    borderColor: '#00ff88',
    borderBottomRightRadius: 30,
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  instructionsContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 20,
    borderRadius: 20,
    width: '90%',
    backdropFilter: 'blur(10px)',
  },
  instructionText: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '800',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },
  subInstructionText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.9,
    fontWeight: '500',
  },
  captureButton: {
    backgroundColor: '#00ff88',
    paddingVertical: 22,
    paddingHorizontal: 50,
    borderRadius: 50,
    marginBottom: 20,
    minWidth: 250,
    alignItems: 'center',
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
  captureButtonDisabled: {
    backgroundColor: '#666',
    shadowColor: '#000',
  },
  captureIcon: {
    fontSize: 32,
    marginBottom: 5,
  },
  captureButtonText: {
    color: '#000',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 2,
  },
  helpButton: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginBottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  helpIcon: {
    fontSize: 22,
    marginRight: 8,
  },
  helpButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  loadingText: {
    fontSize: 20,
    color: '#0066cc',
    marginTop: 20,
  },
  errorText: {
    fontSize: 24,
    color: '#ff0000',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  instructionText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#0066cc',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
