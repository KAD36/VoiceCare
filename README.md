# 🏥 VoiceCare Medical Application

**Voice-guided healthcare system for accessible patient care**

A comprehensive medical appointment management system designed for King Salman Specialist Hospital, specifically built for illiterate, elderly, and visually impaired patients.

[![License](https://img.shields.io/badge/license-Proprietary-red)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)
[![Python](https://img.shields.io/badge/python-%3E%3D3.9-blue)](https://python.org)
[![React Native](https://img.shields.io/badge/react--native-0.81-61dafb)](https://reactnative.dev)

## System Architecture

```
CareVoiceApp/
├── mobile_app/                    # React Native mobile application
├── web_app/                       # React web application (NEW!)
├── node_appointments_voice/       # Node.js appointments backend
├── django_face_recognition/       # Django face recognition API
└── README.md                      # This file
```

## 🎉 **NEW in Version 1.0.0**

- ✅ **Push Notifications System** - Full Expo Push Notifications
- ✅ **Speech-to-Text** - Voice command recognition  
- ✅ **Web Application** - Complete React web version

### Components

1. **Mobile App** (React Native + Expo)
   - Face recognition login
   - Voice-guided navigation
   - Appointment management
   - Medical instructions
   - Emergency services

2. **Appointments API** (Node.js + Express)
   - REST API for appointments
   - Automated reminders
   - Patient management
   - Notification scheduling

3. **Face Recognition API** (Django + face_recognition)
   - Biometric authentication
   - Patient enrollment
   - Recognition logging
   - Security tracking

## 🚀 Quick Start

### ⚠️ First Time Setup

**For detailed installation instructions, see [INSTALLATION.md](INSTALLATION.md)**

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org))
- **Python** 3.9+ ([Download](https://python.org))
- **Git** ([Download](https://git-scm.com))
- **Expo Go** on mobile ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

### 1. Setup Node.js Backend

```bash
cd node_appointments_voice
npm install
npm start
```
Server runs on `http://localhost:3000`

### 2. Setup Django Face Recognition

```bash
cd django_face_recognition
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_test_data
python manage.py runserver 0.0.0.0:8000
```
API runs on `http://localhost:8000`

### 3. Setup Mobile App

```bash
cd mobile_app
npm install
npm start
```
Expo DevTools opens in browser.

## Running the Full System

### Option 1: Manual (3 Terminals)

**Terminal 1 - Node.js Backend:**
```bash
cd node_appointments_voice
npm start
```

**Terminal 2 - Django API:**
```bash
cd django_face_recognition
venv\Scripts\activate
python manage.py runserver
```

**Terminal 3 - Mobile App:**
```bash
cd mobile_app
npm start
```

### Option 2: Using Start Script

Create `start_all.bat` (Windows):
```batch
@echo off
start cmd /k "cd node_appointments_voice && npm start"
start cmd /k "cd django_face_recognition && venv\Scripts\activate && python manage.py runserver"
start cmd /k "cd mobile_app && npm start"
```

## API Endpoints

### Node.js Appointments API (Port 3000)

```
GET  /health                              # Health check
GET  /api/appointments/:patientId         # Get appointments
POST /api/appointments                    # Create appointment
PUT  /api/appointments/:id/confirm        # Confirm appointment
PUT  /api/appointments/:id/reschedule     # Reschedule
DELETE /api/appointments/:id              # Cancel
```

### Django Face Recognition API (Port 8000)

```
GET  /api/health/                         # Health check
POST /api/recognize/                      # Recognize face
POST /api/enroll/                         # Enroll new face
GET  /api/patients/                       # List patients
GET  /api/logs/                           # Recognition logs
```

## Development Workflow

### Testing Face Recognition

1. **Enroll a test face:**
```bash
cd django_face_recognition
python test_enrollment.py path/to/face_image.jpg
```

2. **Test from mobile app:**
   - Launch mobile app
   - Allow camera permission
   - Position face in frame
   - Tap to login

### Testing Appointments

1. **Check API health:**
```bash
curl http://localhost:3000/health
```

2. **Get appointments:**
```bash
curl http://localhost:3000/api/appointments/patient-001
```

3. **Use mobile app:**
   - Login with face
   - Navigate to "My Appointments"
   - Listen to appointment details

## Configuration

### Mobile App (mobile_app/services/config.js)

```javascript
const CURRENT_ENV = 'development'; // or 'production'

const ENVIRONMENTS = {
  development: {
    FACE_RECOGNITION_URL: 'http://localhost:8000/api',
    APPOINTMENTS_API_URL: 'http://localhost:3000/api',
  },
  production: {
    FACE_RECOGNITION_URL: 'https://voicecare-face.hospital.sa/api',
    APPOINTMENTS_API_URL: 'https://voicecare-appointments.hospital.sa/api',
  }
};
```

### Django Settings (django_face_recognition/django_face_recognition/settings.py)

```python
FACE_RECOGNITION_TOLERANCE = 0.6  # Lower = stricter
FACE_ENCODING_MODEL = 'large'     # 'small' or 'large'
DEBUG = True                       # Set False in production
```

### Node.js Settings (node_appointments_voice/src/server.js)

```javascript
const PORT = process.env.PORT || 3000;
app.use(cors({
  origin: ['http://localhost:19000', 'http://localhost:19006'],
  credentials: true
}));
```

## Mobile App Features

### 1. Face Login Screen
- Front camera activation
- Real-time face detection
- Voice guidance
- Manual assistance option

### 2. Appointments Screen
- View upcoming/past appointments
- Voice announcement of details
- Confirm attendance
- Cancel/reschedule
- Special instructions

### 3. Services Screen
- Medical test guidance
- Medication instructions
- Health tips
- Emergency contact

### 4. Settings Screen
- Voice settings (speed, pitch, volume)
- Language selection (EN/AR)
- Notification preferences

### 5. Help Screen
- Voice tutorial
- Feature explanations
- Contact information

## Database Schemas

### Node.js SQLite (appointments)

**Appointments Table:**
- id, patient_id, date, time
- department, doctor, type
- instructions, status
- created_at, updated_at

**Patients Table:**
- id, name, phone, email
- medical_record_number
- face_data_id

**Notifications Table:**
- id, patient_id, appointment_id
- type, message, sent_at

### Django SQLite (face recognition)

**Patients Table:**
- patient_id (PK), name, phone
- medical_record_number
- is_active

**FaceEncodings Table:**
- id, patient (FK), encoding
- quality_score, is_active

**RecognitionLogs Table:**
- id, patient (FK), success
- confidence, timestamp, ip_address

## Security Features

- **Face encodings** stored as embeddings, not raw images
- **CORS** configured for mobile app origins only
- **HTTPS** enforced in production
- **Recognition logging** for audit trail
- **SQL injection** protection via parameterized queries
- **Rate limiting** recommended for production

## Troubleshooting

### Issue: Face recognition not working

**Solution:**
- Ensure good lighting
- Face clearly visible
- Only one face in frame
- Check Django server is running
- Verify mobile app can reach `localhost:8000`

### Issue: Appointments not loading

**Solution:**
- Check Node.js server running on port 3000
- Verify database file exists: `node_appointments_voice/data/voicecare.db`
- Check CORS settings in server.js

### Issue: dlib installation fails (Django)

**Solution Windows:**
```bash
pip install cmake
pip install dlib-binary
```

**Solution Linux:**
```bash
sudo apt-get install cmake build-essential
pip install dlib
```

### Issue: Expo won't start

**Solution:**
```bash
cd mobile_app
rm -rf node_modules
npm install
npm start -- --clear
```

### Issue: "Connection refused" from mobile app

**Solution:**
- If using physical device, change `localhost` to your computer's IP
- Find IP: `ipconfig` (Windows) or `ifconfig` (Linux/Mac)
- Update `mobile_app/services/config.js`:
  ```javascript
  FACE_RECOGNITION_URL: 'http://192.168.1.100:8000/api'
  APPOINTMENTS_API_URL: 'http://192.168.1.100:3000/api'
  ```

## Production Deployment

### Checklist

- [ ] Change Django `SECRET_KEY`
- [ ] Set `DEBUG = False` in Django
- [ ] Configure production database (PostgreSQL)
- [ ] Set up HTTPS/SSL certificates
- [ ] Configure proper `ALLOWED_HOSTS`
- [ ] Set up reverse proxy (nginx/Apache)
- [ ] Enable rate limiting
- [ ] Set up monitoring and logging
- [ ] Regular database backups
- [ ] Implement authentication tokens
- [ ] Configure CDN for static files
- [ ] Set up CI/CD pipeline

### Deployment Structure

```
Production Server:
├── nginx (Reverse Proxy)
│   ├── Port 443 (HTTPS)
│   └── SSL Certificate
├── Node.js Backend (PM2)
│   └── Port 3000 (internal)
├── Django API (Gunicorn)
│   └── Port 8000 (internal)
└── Mobile App (Expo Build)
    ├── iOS App Store
    └── Android Play Store
```

## Testing

### Unit Tests

**Node.js:**
```bash
cd node_appointments_voice
npm test
```

**Django:**
```bash
cd django_face_recognition
python manage.py test
```

### Integration Tests

1. Enroll test face
2. Recognize enrolled face
3. Create appointment
4. Retrieve appointments
5. Confirm appointment

## Performance Optimization

- **Face Recognition**: Use 'small' model for faster recognition
- **Image Size**: Compress images before sending to API
- **Caching**: Cache patient data in mobile app
- **Database**: Index frequently queried fields
- **API**: Implement response caching

## Accessibility Features

- **Large UI elements**: Minimum 44x44px touch targets
- **High contrast**: WCAG AA compliant colors
- **Voice feedback**: All actions announced
- **No text input**: Core functions work without typing
- **Error recovery**: Clear voice instructions on errors
- **Simple navigation**: Linear flow, no complex menus

## Support & Maintenance

### Monitoring

- Check recognition logs daily: `/api/logs/`
- Monitor failed authentication attempts
- Review appointment creation/cancellation rates
- Track API response times

### Regular Maintenance

- Weekly database backup
- Monthly security updates
- Quarterly user feedback review
- Annual accessibility audit

## License

Proprietary - King Salman Specialist Hospital

## Contributors

Development Team - King Salman Specialist Hospital IT Department

---

**Version:** 1.0.0  
**Last Updated:** 2025-10-11  
**Status:** Development/Testing
