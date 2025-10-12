"""
Management command to seed test patient data
Usage: python manage.py seed_test_data
"""
from django.core.management.base import BaseCommand
from face_app.models import Patient


class Command(BaseCommand):
    help = 'Seed test patient data for development'

    def handle(self, *args, **options):
        self.stdout.write('Seeding test patient data...')
        
        # Create test patient
        patient, created = Patient.objects.get_or_create(
            patient_id='patient-001',
            defaults={
                'name': 'Ahmed Mohammed',
                'phone': '+966501234567',
                'medical_record_number': 'MRN-12345',
                'is_active': True
            }
        )
        
        if created:
            self.stdout.write(self.style.SUCCESS(f'✓ Created patient: {patient.name}'))
        else:
            self.stdout.write(self.style.WARNING(f'Patient already exists: {patient.name}'))
        
        # Create additional test patients
        test_patients = [
            {
                'patient_id': 'patient-002',
                'name': 'Fatima Abdullah',
                'phone': '+966507654321',
                'medical_record_number': 'MRN-12346',
            },
            {
                'patient_id': 'patient-003',
                'name': 'Mohammed Ali',
                'phone': '+966509876543',
                'medical_record_number': 'MRN-12347',
            }
        ]
        
        for patient_data in test_patients:
            patient, created = Patient.objects.get_or_create(
                patient_id=patient_data['patient_id'],
                defaults=patient_data
            )
            
            if created:
                self.stdout.write(self.style.SUCCESS(f'✓ Created patient: {patient.name}'))
            else:
                self.stdout.write(self.style.WARNING(f'Patient already exists: {patient.name}'))
        
        total_patients = Patient.objects.filter(is_active=True).count()
        self.stdout.write(self.style.SUCCESS(f'\n✓ Total active patients: {total_patients}'))
        self.stdout.write(self.style.SUCCESS('Note: Use the /api/enroll/ endpoint to add face data'))
