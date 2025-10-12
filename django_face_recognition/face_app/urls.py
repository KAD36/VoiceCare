from django.urls import path
from .views import (
    HealthCheckView,
    FaceRecognitionView,
    FaceEnrollmentView,
    PatientListView,
    PatientDetailView,
    RecognitionLogsView,
    DeletePatientView
)

urlpatterns = [
    # Health check
    path('health/', HealthCheckView.as_view(), name='health-check'),
    
    # Face recognition
    path('recognize/', FaceRecognitionView.as_view(), name='face-recognize'),
    
    # Face enrollment
    path('enroll/', FaceEnrollmentView.as_view(), name='face-enroll'),
    
    # Patient management
    path('patients/', PatientListView.as_view(), name='patient-list'),
    path('patients/<str:patient_id>/', PatientDetailView.as_view(), name='patient-detail'),
    path('patients/<str:patient_id>/delete/', DeletePatientView.as_view(), name='patient-delete'),
    
    # Logs
    path('logs/', RecognitionLogsView.as_view(), name='recognition-logs'),
]
