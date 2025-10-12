from django.contrib import admin
from .models import Patient, FaceEncoding, RecognitionLog


@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ('patient_id', 'name', 'medical_record_number', 'phone', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('name', 'medical_record_number', 'patient_id', 'phone')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(FaceEncoding)
class FaceEncodingAdmin(admin.ModelAdmin):
    list_display = ('id', 'patient', 'quality_score', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('patient__name', 'patient__medical_record_number')
    readonly_fields = ('created_at',)


@admin.register(RecognitionLog)
class RecognitionLogAdmin(admin.ModelAdmin):
    list_display = ('id', 'patient', 'success', 'confidence', 'timestamp', 'ip_address')
    list_filter = ('success', 'timestamp')
    search_fields = ('patient__name', 'ip_address')
    readonly_fields = ('timestamp',)
    date_hierarchy = 'timestamp'
