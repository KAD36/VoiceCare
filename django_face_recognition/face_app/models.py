from django.db import models
from django.utils import timezone
import json


class Patient(models.Model):
    """Patient model for storing patient information and face encodings"""
    patient_id = models.CharField(max_length=50, unique=True, primary_key=True)
    name = models.CharField(max_length=200)
    phone = models.CharField(max_length=20, blank=True, null=True)
    email = models.CharField(max_length=100, blank=True, null=True)
    medical_record_number = models.CharField(max_length=50, unique=True)
    date_of_birth = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'patients'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} ({self.medical_record_number})"


class FaceEncoding(models.Model):
    """Store face encodings for patients"""
    id = models.AutoField(primary_key=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='face_encodings')
    encoding = models.TextField(help_text='JSON encoded face embedding')
    image_path = models.CharField(max_length=500, blank=True, null=True)
    quality_score = models.FloatField(default=0.0, help_text='Image quality score (0-1)')
    created_at = models.DateTimeField(default=timezone.now)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'face_encodings'
        ordering = ['-created_at']
    
    def set_encoding(self, encoding_array):
        """Convert array (numpy or list) to JSON string"""
        if hasattr(encoding_array, 'tolist'):
            # It's a numpy array
            self.encoding = json.dumps(encoding_array.tolist())
        else:
            # It's already a list
            self.encoding = json.dumps(encoding_array)
    
    def get_encoding(self):
        """Convert JSON string back to list"""
        return json.loads(self.encoding)
    
    def __str__(self):
        return f"Face encoding for {self.patient.name}"


class RecognitionLog(models.Model):
    """Log all face recognition attempts for security and debugging"""
    id = models.AutoField(primary_key=True)
    patient = models.ForeignKey(Patient, on_delete=models.SET_NULL, null=True, blank=True)
    success = models.BooleanField(default=False)
    confidence = models.FloatField(default=0.0)
    timestamp = models.DateTimeField(default=timezone.now)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    device_info = models.TextField(blank=True, null=True)
    error_message = models.TextField(blank=True, null=True)
    
    class Meta:
        db_table = 'recognition_logs'
        ordering = ['-timestamp']
    
    def __str__(self):
        status = "Success" if self.success else "Failed"
        patient_name = self.patient.name if self.patient else "Unknown"
        return f"{status} - {patient_name} - {self.timestamp}"
