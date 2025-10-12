@echo off
echo ========================================
echo Starting VoiceCare Application Servers
echo ========================================
echo.

echo Starting Node.js Appointments Backend (Port 3000)...
start "Node.js Backend" cmd /k "cd node_appointments_voice && npm start"
timeout /t 2 /nobreak >nul

echo Starting Django Face Recognition API (Port 8000)...
start "Django API" cmd /k "cd django_face_recognition && venv\Scripts\activate && python manage.py runserver"
timeout /t 2 /nobreak >nul

echo Starting React Native Mobile App...
start "Mobile App" cmd /k "cd mobile_app && npm start"

echo.
echo ========================================
echo All servers are starting...
echo ========================================
echo.
echo Node.js Backend:     http://localhost:3000
echo Django API:          http://localhost:8000
echo Mobile App:          Opens in browser
echo.
echo Press any key to close this window (servers will continue running)
pause >nul
