"""
ASGI config for django_face_recognition project.
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_face_recognition.settings')

application = get_asgi_application()
