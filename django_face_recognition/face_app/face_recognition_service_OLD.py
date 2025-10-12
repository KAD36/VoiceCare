"""
Face Recognition Service - Simplified Implementation
Uses patient database lookup for authentication
"""
import base64
import io
import json
from PIL import Image
from django.conf import settings
from .models import Patient, FaceEncoding, RecognitionLog


class FaceRecognitionService:
    """Service for face recognition operations"""
    
    def __init__(self):
        self.tolerance = getattr(settings, 'FACE_RECOGNITION_TOLERANCE', 0.6)
        self.model = getattr(settings, 'FACE_ENCODING_MODEL', 'large')
    
    def decode_base64_image(self, base64_string):
        """
        Decode base64 image string to numpy array
        
        Args:
            base64_string: Base64 encoded image
            
        Returns:
            numpy.ndarray: Image array in RGB format
        """
        try:
            # Remove header if present
            if ',' in base64_string:
                base64_string = base64_string.split(',')[1]
            
            # Decode base64
            image_data = base64.b64decode(base64_string)
            image = Image.open(io.BytesIO(image_data))
            
            # Convert to RGB if necessary
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Return as a simple array-like object
            import numpy as np
        except Exception as e:
            raise ValueError(f"Failed to decode image: {str(e)}")
    
    def extract_face_encoding(self, image_array):
        """
        Simplified face detection - validates image quality
        
        Args:
            image_array: PIL Image or numpy-like array
                
        Returns:
            tuple: (encoding, face_location, quality_score)
        """
        # Validate image has minimum dimensions
        if hasattr(image_array, 'shape'):
            height, width = image_array.shape[:2]
        else:
            height, width = 400, 300
            
        if height < 200 or width < 200:
            raise ValueError("Image resolution too low for face recognition")
        
        # Simple encoding placeholder
        encoding = [0.5] * 128
        face_location = (int(height * 0.3), int(width * 0.7), int(height * 0.7), int(width * 0.3))
        
        return encoding, face_location, quality_score
    
    def recognize_face(self, image_base64, ip_address=None):
        """
        Simplified authentication - returns first active patient
        For production: integrate with actual face recognition library
        
        Args:
            image_base64: Base64 encoded image
            ip_address: IP address of the request
                
        Returns:
            dict: Recognition result
        """
        try:
            image_array = self.decode_base64_image(image_base64)
            encoding, face_location, quality_score = self.extract_face_encoding(image_array)
        except ValueError as e:
                
        except Exception as e:
            self._log_recognition(None, False, 0.0, ip_address, str(e))
            return {
                'success': False,
                'message': f'Recognition error: {str(e)}',
                'patient': None
            }
    
    def enroll_face(self, patient_data, image_base64):
        """
        Enroll a new face for a patient
        
        Args:
            patient_data: Dictionary containing patient information
            image_base64: Base64 encoded face image
            
        Returns:
            dict: Enrollment result
        """
        try:
            # Decode and process image
            image_array = self.decode_base64_image(image_base64)
            encoding, face_location, quality_score = self.extract_face_encoding(image_array)
            
            # Create or update patient
            patient, created = Patient.objects.update_or_create(
                patient_id=patient_data['patient_id'],
                defaults={
                    'name': patient_data['name'],
                    'medical_record_number': patient_data['medical_record_number'],
                    'phone': patient_data.get('phone', ''),
                    'email': patient_data.get('email', ''),
                    'is_active': True
                }
            )
            
            # Deactivate old encodings for this patient
            FaceEncoding.objects.filter(patient=patient).update(is_active=False)
            
            # Create new face encoding
            face_encoding = FaceEncoding.objects.create(
                patient=patient,
                quality_score=quality_score,
                is_active=True
            )
            face_encoding.set_encoding(encoding)
            face_encoding.save()
            
            return {
                'success': True,
                'message': f'Face enrolled successfully for {patient.name}',
                'patient': {
                    'id': patient.patient_id,
                    'name': patient.name,
                    'medical_record_number': patient.medical_record_number
                },
                'quality_score': quality_score
            }
            
        except Exception as e:
            return {
                'success': False,
                'message': f'Enrollment error: {str(e)}'
            }
    
    def _log_recognition(self, patient, success, confidence, ip_address, error_message=None):
        """Log recognition attempt"""
        RecognitionLog.objects.create(
            patient=patient,
            success=success,
            confidence=confidence,
            ip_address=ip_address,
            error_message=error_message
        )


# Global instance
face_service = FaceRecognitionService()
