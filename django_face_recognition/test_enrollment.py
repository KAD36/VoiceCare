"""
Simple test script to enroll and recognize faces
Prerequisites: 
- Django server running on localhost:8000
- Test image file available
"""

import requests
import base64
import sys


def encode_image_to_base64(image_path):
    """Read image file and encode to base64"""
    try:
        with open(image_path, 'rb') as image_file:
            return base64.b64encode(image_file.read()).decode('utf-8')
    except FileNotFoundError:
        print(f"Error: Image file not found: {image_path}")
        sys.exit(1)


def test_health_check():
    """Test API health check"""
    print("Testing health check...")
    response = requests.get('http://localhost:8000/api/health/')
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}\n")
    return response.status_code == 200


def enroll_face(image_path, patient_id='test-patient-001', name='Test Patient'):
    """Enroll a face in the system"""
    print(f"Enrolling face for {name}...")
    
    image_base64 = encode_image_to_base64(image_path)
    
    data = {
        'patient_id': patient_id,
        'name': name,
        'medical_record_number': f'MRN-{patient_id}',
        'phone': '+966501234567',
        'email': 'test@hospital.sa',
        'image': image_base64
    }
    
    response = requests.post('http://localhost:8000/api/enroll/', json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}\n")
    
    return response.status_code in [200, 201]


def recognize_face(image_path):
    """Recognize a face"""
    print("Recognizing face...")
    
    image_base64 = encode_image_to_base64(image_path)
    
    data = {'image': image_base64}
    
    response = requests.post('http://localhost:8000/api/recognize/', json=data)
    print(f"Status: {response.status_code}")
    result = response.json()
    print(f"Response: {result}\n")
    
    if result.get('success'):
        patient = result.get('patient', {})
        confidence = result.get('confidence', 0)
        print(f"✓ Recognized: {patient.get('name')}")
        print(f"  Confidence: {confidence:.2%}")
        print(f"  Medical Record: {patient.get('medical_record_number')}")
    else:
        print(f"✗ Recognition failed: {result.get('message')}")
    
    return result.get('success', False)


def list_patients():
    """List all enrolled patients"""
    print("Listing enrolled patients...")
    response = requests.get('http://localhost:8000/api/patients/')
    result = response.json()
    
    if result.get('success'):
        patients = result.get('patients', [])
        print(f"Total patients: {result.get('count')}")
        for patient in patients:
            print(f"  - {patient['name']} ({patient['patient_id']})")
    print()


def main():
    """Main test function"""
    print("=" * 60)
    print("VoiceCare Face Recognition API Test")
    print("=" * 60 + "\n")
    
    # Check if image path is provided
    if len(sys.argv) < 2:
        print("Usage: python test_enrollment.py <path_to_face_image>")
        print("\nExample:")
        print("  python test_enrollment.py ../1759965961268.jpg")
        sys.exit(1)
    
    image_path = sys.argv[1]
    
    # Test health check
    if not test_health_check():
        print("Error: API is not responding. Make sure Django server is running.")
        sys.exit(1)
    
    # List current patients
    list_patients()
    
    # Enroll a test face
    if enroll_face(image_path):
        print("✓ Enrollment successful!\n")
        
        # Try to recognize the same face
        if recognize_face(image_path):
            print("✓ Recognition successful!")
        else:
            print("✗ Recognition failed")
    else:
        print("✗ Enrollment failed")
    
    print("\n" + "=" * 60)
    print("Test completed!")
    print("=" * 60)


if __name__ == '__main__':
    main()
