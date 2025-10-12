import sys
import os
import django

# Add project to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_face_recognition.settings')

django.setup()

from face_app.models import Patient, FaceEncoding

try:
    # Delete existing patient if any
    Patient.objects.filter(patient_id='P001').delete()
    
    # Create fresh patient
    patient = Patient.objects.create(
        patient_id='P001',
        name='Ahmed Mohammed',
        medical_record_number='MRN-001',
        phone='+966501234567',
        is_active=True
    )
    
    # Create face encoding
    face_enc = FaceEncoding.objects.create(
        patient=patient,
        quality_score=0.95,
        is_active=True
    )
    face_enc.set_encoding([0.5] * 128)
    face_enc.save()
    
    print("=== SUCCESS ===")
    print(f"Patient ID: {patient.patient_id}")
    print(f"Name: {patient.name}")
    print(f"Phone: {patient.phone}")
    print(f"Status: Active")
    print(f"Face Encoding: Created")
    
    # Verify
    count = FaceEncoding.objects.filter(patient=patient, is_active=True).count()
    print(f"Active face encodings: {count}")
    
except Exception as e:
    print(f"ERROR: {e}")
    import traceback
    traceback.print_exc()
