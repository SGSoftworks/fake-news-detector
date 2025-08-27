const express = require('express');
const router = express.Router();

// GET /api/health - Health check
router.get('/', (req, res) => {
  const healthCheck = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    services: {
      analysis: 'operational',
      database: 'not_configured',
      ai_apis: 'simulated'
    }
  };
  
  res.status(200).json(healthCheck);
});

// GET /api/health/detailed - Health check detallado
router.get('/detailed', (req, res) => {
  const detailedHealth = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      external: Math.round(process.memoryUsage().external / 1024 / 1024)
    },
    services: {
      analysis: {
        status: 'operational',
        response_time: '< 3s'
      },
      database: {
        status: 'not_configured',
        message: 'MongoDB no configurado'
      },
      ai_apis: {
        status: 'simulated',
        message: 'Usando algoritmos locales'
      }
    }
  };
  
  res.status(200).json(detailedHealth);
});

module.exports = router;
