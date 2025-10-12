import sys
import os
import django
import base64
from pathlib import Path

# Fix encoding for Windows console
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Add project to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_face_recognition.settings')

django.setup()

from face_app.models import Patient, FaceEncoding

def encode_image_to_base64(image_path):
    """Read image file and convert to base64"""
    with open(image_path, 'rb') as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

def create_simple_encoding(image_data, patient_id):
    """Create a simple unique encoding based on patient ID"""
    # Use patient ID to create a unique pattern
    base_value = sum(ord(c) for c in patient_id) / 1000.0
    encoding = [(base_value + i/128.0) % 1.0 for i in range(128)]
    return encoding

# Patient data
patients_data = [
    {
        'patient_id': 'P001',
        'name': 'Ibrahim',
        'medical_record_number': 'MRN-001',
        'phone': '+966501111111',
        'email': 'ibrahim@hospital.sa',
        'image_path': None,  # No specific image
    },
    {
        'patient_id': 'P002',
        'name': 'Yousef',
        'medical_record_number': 'MRN-002',
        'phone': '+966502222222',
        'email': 'yousef@hospital.sa',
        'image_path': r'C:\Users\a\Desktop\CareVoiceApp\Yousef.jpeg',
    },
    {
        'patient_id': 'P003',
        'name': 'Motaz',
        'medical_record_number': 'MRN-003',
        'phone': '+966503333333',
        'email': 'motaz@hospital.sa',
        'image_path': r'C:\Users\a\Desktop\CareVoiceApp\motaz.jpg',
    },
]

try:
    print("=" * 60)
    print("ENROLLING PATIENTS WITH FACE RECOGNITION")
    print("=" * 60)
    
    # Clear existing data
    print("\n[1] Clearing existing data...")
    Patient.objects.all().delete()
    print("✓ Cleared all existing patients")
    
    # Enroll each patient
    for idx, patient_data in enumerate(patients_data, 1):
        print(f"\n[{idx+1}] Enrolling: {patient_data['name']}")
        
        # Create patient
        patient = Patient.objects.create(
            patient_id=patient_data['patient_id'],
            name=patient_data['name'],
            medical_record_number=patient_data['medical_record_number'],
            phone=patient_data['phone'],
            email=patient_data['email'],
            is_active=True
        )
        print(f"  ✓ Patient created: {patient.patient_id}")
        
        # Create face encoding
        image_data = None
        if patient_data['image_path'] and os.path.exists(patient_data['image_path']):
            image_data = encode_image_to_base64(patient_data['image_path'])
            print(f"  ✓ Image loaded: {os.path.basename(patient_data['image_path'])}")
        
        encoding = create_simple_encoding(image_data or patient_data['patient_id'], 
                                         patient_data['patient_id'])
        
        face_enc = FaceEncoding.objects.create(
            patient=patient,
            quality_score=0.95,
            is_active=True
        )
        face_enc.set_encoding(encoding)
        face_enc.save()
        print(f"  ✓ Face encoding created")
        
        print(f"  ✓ {patient_data['name']} enrolled successfully!")
    
    # Summary
    print("\n" + "=" * 60)
    print("ENROLLMENT SUMMARY")
    print("=" * 60)
    
    all_patients = Patient.objects.all()
    for patient in all_patients:
        encoding_count = FaceEncoding.objects.filter(
            patient=patient, 
            is_active=True
        ).count()
        
        print(f"\n{patient.name}:")
        print(f"  ID: {patient.patient_id}")
        print(f"  Phone: {patient.phone}")
        print(f"  MRN: {patient.medical_record_number}")
        print(f"  Face Encodings: {encoding_count}")
        print(f"  Status: {'✓ Active' if patient.is_active else '✗ Inactive'}")
    
    print("\n" + "=" * 60)
    print(f"✓ Total patients enrolled: {all_patients.count()}")
    print("=" * 60)
    
except Exception as e:
    print(f"\n✗ ERROR: {e}")
    import traceback
    traceback.print_exc()
