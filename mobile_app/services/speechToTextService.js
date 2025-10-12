// Speech-to-Text Service for VoiceCare
import Voice from '@react-native-voice/voice';
import * as Speech from 'expo-speech';

class SpeechToTextService {
  constructor() {
    this.isInitialized = false;
    this.isListening = false;
    this.results = [];
    
    // Bind methods
    this.onSpeechResults = this.onSpeechResults.bind(this);
    this.onSpeechError = this.onSpeechError.bind(this);
    this.onSpeechStart = this.onSpeechStart.bind(this);
    this.onSpeechEnd = this.onSpeechEnd.bind(this);
  }

  // Initialize speech recognition
  async initialize() {
    if (this.isInitialized) return;

    try {
      Voice.onSpeechStart = this.onSpeechStart;
      Voice.onSpeechEnd = this.onSpeechEnd;
      Voice.onSpeechResults = this.onSpeechResults;
      Voice.onSpeechError = this.onSpeechError;

      this.isInitialized = true;
      console.log('✓ Speech-to-Text initialized');
      return true;
    } catch (error) {
      console.error('Error initializing Speech-to-Text:', error);
      return false;
    }
  }

  // Start listening
  async startListening(options = {}) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      this.results = [];
      this.isListening = true;

      const locale = options.locale || 'en-US';
      
      await Voice.start(locale);
      console.log('✓ Started listening...');

      // Provide voice feedback
      if (options.feedback !== false) {
        await Speech.speak('Listening...', { rate: 0.9 });
      }

      return true;
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      this.isListening = false;
      return false;
    }
  }

  // Stop listening
  async stopListening() {
    try {
      await Voice.stop();
      this.isListening = false;
      console.log('✓ Stopped listening');
      return true;
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
      return false;
    }
  }

  // Cancel listening
  async cancelListening() {
    try {
      await Voice.cancel();
      this.isListening = false;
      this.results = [];
      console.log('✓ Cancelled listening');
      return true;
    } catch (error) {
      console.error('Error cancelling speech recognition:', error);
      return false;
    }
  }

  // Check if currently listening
  getIsListening() {
    return this.isListening;
  }

  // Get latest results
  getResults() {
    return this.results;
  }

  // Event handlers
  onSpeechStart(e) {
    console.log('Speech started');
    this.isListening = true;
  }

  onSpeechEnd(e) {
    console.log('Speech ended');
    this.isListening = false;
  }

  onSpeechResults(e) {
    console.log('Speech results:', e.value);
    this.results = e.value || [];
  }

  onSpeechError(e) {
    console.error('Speech error:', e.error);
    this.isListening = false;
  }

  // Destroy and cleanup
  async destroy() {
    try {
      await Voice.destroy();
      Voice.removeAllListeners();
      this.isInitialized = false;
      this.isListening = false;
      console.log('✓ Speech-to-Text destroyed');
    } catch (error) {
      console.error('Error destroying Speech-to-Text:', error);
    }
  }

  // Process command (for voice commands)
  async processVoiceCommand(command, availableCommands = []) {
    const commandLower = command.toLowerCase().trim();

    // Common voice commands
    const commands = {
      'yes': () => ({ action: 'confirm', value: true }),
      'yeah': () => ({ action: 'confirm', value: true }),
      'ok': () => ({ action: 'confirm', value: true }),
      'confirm': () => ({ action: 'confirm', value: true }),
      
      'no': () => ({ action: 'cancel', value: false }),
      'cancel': () => ({ action: 'cancel', value: false }),
      'stop': () => ({ action: 'stop', value: false }),
      
      'help': () => ({ action: 'help' }),
      'repeat': () => ({ action: 'repeat' }),
      'back': () => ({ action: 'back' }),
      'home': () => ({ action: 'home' }),
      
      'appointments': () => ({ action: 'navigate', screen: 'Appointments' }),
      'services': () => ({ action: 'navigate', screen: 'Services' }),
      'settings': () => ({ action: 'navigate', screen: 'Settings' }),
      'help menu': () => ({ action: 'navigate', screen: 'Help' }),
    };

    // Check if command matches
    if (commands[commandLower]) {
      return commands[commandLower]();
    }

    // Check custom commands
    for (const customCmd of availableCommands) {
      if (commandLower.includes(customCmd.trigger.toLowerCase())) {
        return { action: 'custom', command: customCmd };
      }
    }

    return { action: 'unknown', command: commandLower };
  }

  // Listen for yes/no response
  async listenForYesNo(question, onResult, options = {}) {
    // Speak the question
    await Speech.speak(question, { rate: 0.85 });

    // Wait for speech to finish
    await new Promise(resolve => setTimeout(resolve, question.length * 50 + 1000));

    // Start listening
    const started = await this.startListening({ feedback: true });

    if (!started) {
      if (onResult) onResult(null, 'Failed to start listening');
      return;
    }

    // Set timeout
    const timeout = options.timeout || 5000;
    
    setTimeout(async () => {
      if (this.isListening) {
        await this.stopListening();

        const results = this.getResults();
        
        if (results.length > 0) {
          const answer = results[0].toLowerCase();
          
          if (answer.includes('yes') || answer.includes('yeah') || answer.includes('ok')) {
            if (onResult) onResult(true);
          } else if (answer.includes('no') || answer.includes('cancel')) {
            if (onResult) onResult(false);
          } else {
            if (onResult) onResult(null, 'Could not understand response');
          }
        } else {
          if (onResult) onResult(null, 'No speech detected');
        }
      }
    }, timeout);
  }

  // Listen for command
  async listenForCommand(prompt, availableCommands, onResult, options = {}) {
    // Speak the prompt
    if (prompt) {
      await Speech.speak(prompt, { rate: 0.85 });
      await new Promise(resolve => setTimeout(resolve, prompt.length * 50 + 1000));
    }

    // Start listening
    const started = await this.startListening({ feedback: true });

    if (!started) {
      if (onResult) onResult(null, 'Failed to start listening');
      return;
    }

    // Set timeout
    const timeout = options.timeout || 5000;
    
    setTimeout(async () => {
      if (this.isListening) {
        await this.stopListening();

        const results = this.getResults();
        
        if (results.length > 0) {
          const command = results[0];
          const processed = await this.processVoiceCommand(command, availableCommands);
          
          if (onResult) onResult(processed);
        } else {
          if (onResult) onResult(null, 'No speech detected');
        }
      }
    }, timeout);
  }
}

export default new SpeechToTextService();
