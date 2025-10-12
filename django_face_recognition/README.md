# VoiceCare Face Recognition API

Django REST API for face recognition authentication in the VoiceCare application.

## Features

- **Face Recognition**: Identify patients using facial recognition
- **Face Enrollment**: Register new patients with their face data
- **Patient Management**: CRUD operations for patient records
- **Recognition Logging**: Track all authentication attempts for security
- **REST API**: JSON-based API for mobile app integration

## Technology Stack

- Django 4.2.7
- Django REST Framework
- face_recognition library (dlib-based)
- SQLite database
- CORS support for mobile apps

## Installation

### Prerequisites

- Python 3.8 or higher
- pip package manager
- CMake (required for dlib)
- Visual Studio Build Tools (Windows) or build-essential (Linux)

### Setup Instructions

1. **Create a virtual environment:**
```bash
cd django_face_recognition
python -m venv venv
```

2. **Activate virtual environment:**
```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

**Note for Windows users:** Installing `dlib` can be challenging. If you encounter issues:
- Install Visual Studio Build Tools
- Or use pre-built wheel: `pip install dlib-binary`
- Or use: `pip install cmake` then retry

4. **Run migrations:**
```bash
python manage.py makemigrations
python manage.py migrate
```

5. **Create superuser (optional):**
```bash
python manage.py createsuperuser
```

6. **Seed test data:**
```bash
python manage.py seed_test_data
```

7. **Run development server:**
```bash
python manage.py runserver 0.0.0.0:8000
```

The API will be available at `http://localhost:8000/api/`

## API Endpoints

### Health Check
```
GET /api/health/
```
Returns service status.

### Face Recognition
```
POST /api/recognize/
Content-Type: application/json

{
    "image": "base64_encoded_image_string"
}
```
**Response (Success):**
```json
{
    "success": true,
    "patient": {
        "id": "patient-001",
        "name": "Ahmed Mohammed",
        "phone": "+966501234567",
        "medical_record_number": "MRN-12345"
    },
    "confidence": 0.85,
    "message": "Face recognized successfully"
}
```

### Face Enrollment
```
POST /api/enroll/
Content-Type: application/json

{
    "patient_id": "patient-001",
    "name": "Ahmed Mohammed",
    "medical_record_number": "MRN-12345",
    "phone": "+966501234567",
    "email": "ahmed@example.com",
    "image": "base64_encoded_image_string"
}
```

### Patient Management
```
GET /api/patients/                      # List all patients
GET /api/patients/{patient_id}/         # Get patient details
DELETE /api/patients/{patient_id}/delete/  # Deactivate patient
```

### Recognition Logs
```
GET /api/logs/?limit=50&success_only=true
```

## Database Schema

### Patient Model
- `patient_id` (Primary Key)
- `name`
- `phone`
- `email`
- `medical_record_number` (Unique)
- `date_of_birth`
- `is_active`
- `created_at`, `updated_at`

### FaceEncoding Model
- `id` (Auto)
- `patient` (Foreign Key)
- `encoding` (JSON stored face embedding)
- `quality_score`
- `image_path`
- `is_active`
- `created_at`

### RecognitionLog Model
- `id` (Auto)
- `patient` (Foreign Key)
- `success`
- `confidence`
- `timestamp`
- `ip_address`
- `error_message`

## Configuration

Edit `django_face_recognition/settings.py` to adjust:

```python
# Face recognition tolerance (lower = more strict)
FACE_RECOGNITION_TOLERANCE = 0.6

# Encoding model ('small' or 'large')
FACE_ENCODING_MODEL = 'large'

# CORS origins for mobile app
CORS_ALLOWED_ORIGINS = [
    'http://localhost:19000',
    'http://localhost:19006',
]
```

## Testing the API

### Using curl

**Health Check:**
```bash
curl http://localhost:8000/api/health/
```

**Enroll a face (replace with actual base64 image):**
```bash
curl -X POST http://localhost:8000/api/enroll/ \
  -H "Content-Type: application/json" \
  -d '{
    "patient_id": "patient-001",
    "name": "Ahmed Mohammed",
    "medical_record_number": "MRN-12345",
    "phone": "+966501234567",
    "image": "base64_image_here"
  }'
```

**Recognize a face:**
```bash
curl -X POST http://localhost:8000/api/recognize/ \
  -H "Content-Type: application/json" \
  -d '{"image": "base64_image_here"}'
```

### Using Python

```python
import requests
import base64

# Read and encode image
with open('face_image.jpg', 'rb') as f:
    image_base64 = base64.b64encode(f.read()).decode('utf-8')

# Enroll face
response = requests.post(
    'http://localhost:8000/api/enroll/',
    json={
        'patient_id': 'patient-001',
        'name': 'Ahmed Mohammed',
        'medical_record_number': 'MRN-12345',
        'image': image_base64
    }
)
print(response.json())

# Recognize face
response = requests.post(
    'http://localhost:8000/api/recognize/',
    json={'image': image_base64}
)
print(response.json())
```

## Security Considerations

1. **Production Deployment:**
   - Change `SECRET_KEY` in settings.py
   - Set `DEBUG = False`
   - Configure proper `ALLOWED_HOSTS`
   - Use HTTPS only
   - Implement rate limiting
   - Add authentication tokens

2. **Face Data:**
   - Face encodings are stored as JSON in database
   - Original images are not stored by default
   - Consider encrypting sensitive data

3. **Logging:**
   - All recognition attempts are logged
   - Monitor failed attempts for security
   - Regular log review recommended

## Troubleshooting

### dlib installation fails
- Install CMake: `pip install cmake`
- Windows: Install Visual Studio Build Tools
- Mac: `brew install cmake`
- Linux: `sudo apt-get install cmake build-essential`

### No face detected
- Ensure good lighting
- Face should be clearly visible
- Only one face in the image
- Image should be high quality

### Low confidence scores
- Adjust `FACE_RECOGNITION_TOLERANCE` in settings
- Re-enroll with better quality images
- Use 'large' model instead of 'small'

### CORS errors from mobile app
- Add mobile app URL to `CORS_ALLOWED_ORIGINS`
- Check network connectivity
- Ensure API is accessible from device

## Admin Interface

Access Django admin at `http://localhost:8000/admin/`

Features:
- View all patients
- Manage face encodings
- Review recognition logs
- Activate/deactivate patients

## Production Deployment

1. Update settings for production
2. Use PostgreSQL instead of SQLite
3. Configure nginx/Apache as reverse proxy
4. Enable SSL/TLS
5. Set up monitoring and logging
6. Regular database backups
7. Implement rate limiting

## License

Proprietary - King Salman Specialist Hospital

## Support

For issues or questions, contact the development team.
