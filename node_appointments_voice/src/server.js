const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const appointmentsRoutes = require('./routes/appointments');
const notificationsRoutes = require('./routes/notifications');
const notificationsService = require('./services/notifications');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:19000', 'http://localhost:19006', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Logging middleware
app.use(morgan('combined'));

// Body parsing middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'VoiceCare Appointments API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/notifications', notificationsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Endpoint not found',
    path: req.path 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✓ VoiceCare Appointments API running on port ${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✓ Health check: http://localhost:${PORT}/health`);
  
  // Initialize notification scheduler
  notificationsService.startScheduler();
});

module.exports = app;
