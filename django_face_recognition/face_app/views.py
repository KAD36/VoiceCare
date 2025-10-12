from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from .face_recognition_service import face_service
from .models import Patient, FaceEncoding, RecognitionLog
from .serializers import (
    PatientSerializer,
    FaceEncodingSerializer,
    RecognitionLogSerializer,
    FaceRecognitionRequestSerializer,
    FaceEnrollmentRequestSerializer
)


def get_client_ip(request):
    """Get client IP address from request"""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


@method_decorator(csrf_exempt, name='dispatch')
class HealthCheckView(APIView):
    """Health check endpoint"""
    
    def get(self, request):
        return Response({
            'status': 'healthy',
            'service': 'VoiceCare Face Recognition API',
            'version': '1.0.0'
        })


@method_decorator(csrf_exempt, name='dispatch')
class FaceRecognitionView(APIView):
    """
    API endpoint for face recognition
    POST /api/recognize/
    """
    
    def post(self, request):
        serializer = FaceRecognitionRequestSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response({
                'success': False,
                'message': 'Invalid request data',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        image_base64 = serializer.validated_data['image']
        ip_address = get_client_ip(request)
        
        # Perform face recognition
        result = face_service.recognize_face(image_base64, ip_address)
        
        if result['success']:
            return Response(result, status=status.HTTP_200_OK)
        else:
            return Response(result, status=status.HTTP_404_NOT_FOUND)


@method_decorator(csrf_exempt, name='dispatch')
class FaceEnrollmentView(APIView):
    """
    API endpoint for face enrollment
    POST /api/enroll/
    """
    
    def post(self, request):
        serializer = FaceEnrollmentRequestSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response({
                'success': False,
                'message': 'Invalid request data',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        patient_data = {
            'patient_id': serializer.validated_data['patient_id'],
            'name': serializer.validated_data['name'],
            'medical_record_number': serializer.validated_data['medical_record_number'],
            'phone': serializer.validated_data.get('phone', ''),
            'email': serializer.validated_data.get('email', '')
        }
        image_base64 = serializer.validated_data['image']
        
        # Perform face enrollment
        result = face_service.enroll_face(patient_data, image_base64)
        
        if result['success']:
            return Response(result, status=status.HTTP_201_CREATED)
        else:
            return Response(result, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class PatientListView(APIView):
    """
    API endpoint for listing all patients
    GET /api/patients/
    """
    
    def get(self, request):
        patients = Patient.objects.filter(is_active=True)
        serializer = PatientSerializer(patients, many=True)
        return Response({
            'success': True,
            'count': len(serializer.data),
            'patients': serializer.data
        })


@method_decorator(csrf_exempt, name='dispatch')
class PatientDetailView(APIView):
    """
    API endpoint for patient details
    GET /api/patients/<patient_id>/
    """
    
    def get(self, request, patient_id):
        try:
            patient = Patient.objects.get(patient_id=patient_id, is_active=True)
            serializer = PatientSerializer(patient)
            return Response({
                'success': True,
                'patient': serializer.data
            })
        except Patient.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Patient not found'
            }, status=status.HTTP_404_NOT_FOUND)


@method_decorator(csrf_exempt, name='dispatch')
class RecognitionLogsView(APIView):
    """
    API endpoint for recognition logs
    GET /api/logs/
    """
    
    def get(self, request):
        # Get query parameters
        limit = int(request.GET.get('limit', 50))
        success_only = request.GET.get('success_only', 'false').lower() == 'true'
        
        logs = RecognitionLog.objects.all()
        
        if success_only:
            logs = logs.filter(success=True)
        
        logs = logs[:limit]
        serializer = RecognitionLogSerializer(logs, many=True)
        
        return Response({
            'success': True,
            'count': len(serializer.data),
            'logs': serializer.data
        })


@method_decorator(csrf_exempt, name='dispatch')
class DeletePatientView(APIView):
    """
    API endpoint to delete/deactivate a patient
    DELETE /api/patients/<patient_id>/
    """
    
    def delete(self, request, patient_id):
        try:
            patient = Patient.objects.get(patient_id=patient_id)
            patient.is_active = False
            patient.save()
            
            # Deactivate face encodings
            FaceEncoding.objects.filter(patient=patient).update(is_active=False)
            
            return Response({
                'success': True,
                'message': f'Patient {patient.name} deactivated successfully'
            })
        except Patient.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Patient not found'
            }, status=status.HTTP_404_NOT_FOUND)
