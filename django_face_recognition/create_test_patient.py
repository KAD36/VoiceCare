import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'voicecare_project.settings')
django.setup()

from face_app.models import Patient, FaceEncoding

# Create or get patient
patient, created = Patient.objects.get_or_create(
    patient_id='P001',
    defaults={
        'name': 'Ahmed Mohammed',
        'medical_record_number': 'MRN-001',
        'is_active': True
    }
)

# Delete old encodings
FaceEncoding.objects.filter(patient=patient).delete()

# Create new encoding
face_enc = FaceEncoding.objects.create(
    patient=patient,
    quality_score=0.95,
    is_active=True
)
face_enc.set_encoding([0.5] * 128)
face_enc.save()

print(f"SUCCESS: Patient '{patient.name}' enrolled with face recognition")
print(f"Patient ID: {patient.patient_id}")
print(f"Medical Record: {patient.medical_record_number}")
