const express = require('express');
const router = express.Router();
const { analyzeText } = require('../services/aiService');
const { validateAnalysisRequest } = require('../utils/validation');

// POST /api/analysis - Analizar texto
router.post('/', validateAnalysisRequest, async (req, res) => {
  try {
    const { text } = req.body;
    
    console.log('📝 Analizando texto:', text.substring(0, 100) + '...');
    
    const startTime = Date.now();
    const result = await analyzeText(text);
    const analysisTime = Date.now() - startTime;
    
    const response = {
      ...result,
      analysisTime,
      textLength: text.length,
      timestamp: new Date().toISOString()
    };
    
    console.log(`✅ Análisis completado en ${analysisTime}ms`);
    
    res.json(response);
  } catch (error) {
    console.error('❌ Error en análisis:', error.message);
    res.status(500).json({
      error: 'Error al analizar el texto',
      message: error.message
    });
  }
});

// GET /api/analysis/status - Estado del servicio
router.get('/status', (req, res) => {
  res.json({
    status: 'operational',
    service: 'FakeNewsDetector Analysis',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
