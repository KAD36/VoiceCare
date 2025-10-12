# 🌐 VoiceCare Web Application

Web interface for the VoiceCare Medical Application.

## Features

- 🔐 **Simplified Authentication** - Web-based login
- 📱 **Responsive Design** - Works on all screen sizes
- 🔊 **Voice Feedback** - Web Speech API integration
- 📅 **Appointments Management** - View and manage appointments
- 🏥 **Medical Services** - Access guidance and instructions
- ⚙️ **Customizable Settings** - Adjust voice and preferences
- ❓ **Help System** - Comprehensive instructions

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
cd web_app
npm install
```

### Development

```bash
npm start
```

Opens on `http://localhost:3000`

### Build for Production

```bash
npm run build
```

Creates optimized production build in `build/` directory.

## Configuration

### Environment Variables

Create `.env` file:

```env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_APPOINTMENTS_API=http://localhost:3000/api
```

### API Endpoints

- Face Recognition: `http://localhost:8000/api`
- Appointments: `http://localhost:3000/api`

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Features by Page

### Login Page
- Simplified authentication
- Voice feedback
- Responsive design

### Welcome Page
- 4 main navigation cards
- Voice announcements
- Quick access to all features

### Appointments Page
- View upcoming/past appointments
- Listen to appointment details
- Confirm/cancel appointments
- Color-coded by department

### Services Page
- Medical guidance
- Medication instructions
- Test preparation
- Emergency help request

### Settings Page
- Voice speed adjustment
- Voice enable/disable
- Notifications toggle
- Face recognition reset

### Help Page
- 8 help topics
- Voice instructions
- Contact information

## Deployment

### Vercel

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm run build
# Upload build/ folder to Netlify
```

### GitHub Pages

```bash
npm install --save-dev gh-pages

# Add to package.json:
"homepage": "https://username.github.io/carevoiceapp"
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}

npm run deploy
```

## Technology Stack

- React 18
- React Router 6
- Axios
- Web Speech API
- CSS3 with Gradients

## License

Proprietary - King Salman Specialist Hospital

## Version

1.0.0
