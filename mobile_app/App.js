import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Speech from 'expo-speech';
import { StatusBar } from 'expo-status-bar';

// Import screens
import WelcomeScreen from './screens/WelcomeScreen';
import FaceLoginScreen from './screens/FaceLoginScreen';
import AppointmentsScreen from './screens/AppointmentsScreen';
import ServicesScreen from './screens/ServicesScreen';
import SettingsScreen from './screens/SettingsScreen';
import HelpScreen from './screens/HelpScreen';

const Stack = createStackNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Speak welcome message on app launch
  useEffect(() => {
    Speech.speak('Welcome to VoiceCare Application for King Salman Specialist Hospital', {
      language: 'en-US',
      pitch: 1.0,
      rate: 0.9
    });
  }, []);

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator 
        initialRouteName="FaceLogin"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: 'transparent' },
          animationEnabled: true,
        }}
      >
        <Stack.Screen 
          name="FaceLogin" 
          component={FaceLoginScreen}
        />
        <Stack.Screen 
          name="Welcome" 
          component={WelcomeScreen}
        />
        <Stack.Screen 
          name="Appointments" 
          component={AppointmentsScreen}
        />
        <Stack.Screen 
          name="Services" 
          component={ServicesScreen}
        />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen}
        />
        <Stack.Screen 
          name="Help" 
          component={HelpScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
