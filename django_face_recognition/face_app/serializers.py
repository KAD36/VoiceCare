from rest_framework import serializers
from .models import Patient, FaceEncoding, RecognitionLog


class PatientSerializer(serializers.ModelSerializer):
    """Serializer for Patient model"""
    
    class Meta:
        model = Patient
        fields = [
            'patient_id', 'name', 'phone', 'email', 
            'medical_record_number', 'date_of_birth', 
            'created_at', 'is_active'
        ]
        read_only_fields = ['created_at']


class FaceEncodingSerializer(serializers.ModelSerializer):
    """Serializer for FaceEncoding model"""
    patient_name = serializers.CharField(source='patient.name', read_only=True)
    
    class Meta:
        model = FaceEncoding
        fields = [
            'id', 'patient', 'patient_name', 'quality_score', 
            'image_path', 'created_at', 'is_active'
        ]
        read_only_fields = ['created_at']


class RecognitionLogSerializer(serializers.ModelSerializer):
    """Serializer for RecognitionLog model"""
    patient_name = serializers.CharField(source='patient.name', read_only=True)
    
    class Meta:
        model = RecognitionLog
        fields = [
            'id', 'patient', 'patient_name', 'success', 
            'confidence', 'timestamp', 'ip_address', 'error_message'
        ]
        read_only_fields = ['timestamp']


class FaceRecognitionRequestSerializer(serializers.Serializer):
    """Serializer for face recognition request"""
    image = serializers.CharField(help_text='Base64 encoded image')


class FaceRecognitionResponseSerializer(serializers.Serializer):
    """Serializer for face recognition response"""
    success = serializers.BooleanField()
    patient = PatientSerializer(required=False, allow_null=True)
    confidence = serializers.FloatField(required=False)
    message = serializers.CharField(required=False)


class FaceEnrollmentRequestSerializer(serializers.Serializer):
    """Serializer for face enrollment request"""
    patient_id = serializers.CharField()
    name = serializers.CharField()
    medical_record_number = serializers.CharField()
    phone = serializers.CharField(required=False, allow_blank=True)
    email = serializers.CharField(required=False, allow_blank=True)
    image = serializers.CharField(help_text='Base64 encoded image')
