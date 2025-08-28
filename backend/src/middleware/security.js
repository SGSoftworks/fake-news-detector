const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');

// Rate limiting - Limitar requests por IP
const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      error: message,
      retryAfter: Math.ceil(windowMs / 1000)
    },
    standardHeaders: true,
    legacyHeaders: false,
    // Función personalizada para generar claves (por IP)
    keyGenerator: (req) => {
      return req.ip || req.connection.remoteAddress || 'unknown';
    }
  });
};

// Rate limiter para análisis (más restrictivo)
const analysisRateLimit = createRateLimiter(
  15 * 60 * 1000, // 15 minutos
  10, // máximo 10 análisis por IP cada 15 minutos
  'Demasiados análisis realizados. Intenta de nuevo en 15 minutos.'
);

// Rate limiter general para API
const generalRateLimit = createRateLimiter(
  5 * 60 * 1000, // 5 minutos  
  100, // máximo 100 requests por IP cada 5 minutos
  'Demasiadas solicitudes. Intenta de nuevo en unos minutos.'
);

// Validaciones de entrada para análisis
const validateAnalysisInput = [
  body('content')
    .trim()
    .isLength({ min: 10, max: 50000 })
    .withMessage('El contenido debe tener entre 10 y 50,000 caracteres')
    .matches(/^[\s\S]*$/) // Permitir cualquier carácter pero validar longitud
    .withMessage('El contenido contiene caracteres no válidos'),
  
  body('inputType')
    .optional()
    .isIn(['text', 'url'])
    .withMessage('Tipo de entrada debe ser "text" o "url"'),
    
  body('analyzeUrl')
    .optional()
    .isBoolean()
    .withMessage('analyzeUrl debe ser un valor booleano'),

  // Validar URLs si el tipo es URL
  body('content').custom(async (value, { req }) => {
    if (req.body.inputType === 'url' || req.body.analyzeUrl) {
      try {
        const url = new URL(value);
        
        // Lista blanca de protocolos permitidos
        if (!['http:', 'https:'].includes(url.protocol)) {
          throw new Error('Solo se permiten URLs HTTP y HTTPS');
        }
        
        // Lista negra de dominios no permitidos (opcional)
        const blockedDomains = [
          'localhost',
          '127.0.0.1',
          '0.0.0.0',
          '192.168.',
          '10.',
          '172.'
        ];
        
        if (blockedDomains.some(blocked => url.hostname.includes(blocked))) {
          throw new Error('No se permiten URLs de redes privadas');
        }
        
        return true;
      } catch (error) {
        throw new Error('URL no válida o no permitida');
      }
    }
    return true;
  })
];

// Middleware para manejar errores de validación
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }));
    
    return res.status(400).json({
      error: 'Datos de entrada no válidos',
      details: errorMessages
    });
  }
  
  next();
};

// Middleware de seguridad general
const securityHeaders = (req, res, next) => {
  // Cabeceras de seguridad
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // No revelar información del servidor
  res.removeHeader('X-Powered-By');
  
  next();
};

// Middleware para logging de seguridad
const securityLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('User-Agent') || 'unknown';
  
  // Log de requests sensibles
  if (req.path.includes('/analysis')) {
    console.log(`🔒 [SECURITY] ${timestamp} - Analysis request from ${ip} - User-Agent: ${userAgent}`);
    
    // Detectar patrones sospechosos
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /vbscript:/i,
      /onload=/i,
      /onerror=/i
    ];
    
    const content = req.body?.content || '';
    const hasSuspiciousContent = suspiciousPatterns.some(pattern => 
      pattern.test(content)
    );
    
    if (hasSuspiciousContent) {
      console.warn(`⚠️ [SECURITY] Suspicious content detected from ${ip}`);
      // No bloquear, pero registrar para monitoreo
    }
  }
  
  next();
};

// Middleware para validar content-type
const validateContentType = (req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    const contentType = req.get('Content-Type');
    
    if (!contentType || !contentType.includes('application/json')) {
      return res.status(400).json({
        error: 'Content-Type debe ser application/json'
      });
    }
  }
  
  next();
};

// Función para sanitizar texto de entrada
const sanitizeText = (text) => {
  if (typeof text !== 'string') {
    return '';
  }
  
  // Remover caracteres de control peligrosos pero mantener contenido legítimo
  return text
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Caracteres de control
    .trim();
};

// Middleware para sanitización automática
const sanitizeInput = (req, res, next) => {
  if (req.body && req.body.content) {
    req.body.content = sanitizeText(req.body.content);
  }
  
  next();
};

// Verificación de integridad del análisis
const validateAnalysisIntegrity = (analysisResult) => {
  const requiredFields = ['isFake', 'confidence', 'explanation'];
  const errors = [];
  
  // Verificar campos requeridos
  for (const field of requiredFields) {
    if (!(field in analysisResult)) {
      errors.push(`Campo requerido faltante: ${field}`);
    }
  }
  
  // Validar tipos y rangos
  if (typeof analysisResult.isFake !== 'boolean') {
    errors.push('isFake debe ser un valor booleano');
  }
  
  if (typeof analysisResult.confidence !== 'number' || 
      analysisResult.confidence < 0 || 
      analysisResult.confidence > 100) {
    errors.push('confidence debe ser un número entre 0 y 100');
  }
  
  if (typeof analysisResult.explanation !== 'string' || 
      analysisResult.explanation.length < 10) {
    errors.push('explanation debe ser un texto de al menos 10 caracteres');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Middleware para agregar información de transparencia
const addTransparencyInfo = (req, res, next) => {
  res.locals.transparencyInfo = {
    analysisTimestamp: new Date().toISOString(),
    serverVersion: process.env.npm_package_version || '1.0.0',
    aiModel: 'Gemini 2.0 Flash',
    dataRetention: 'Los análisis no se almacenan permanentemente',
    privacyPolicy: 'No se recopila información personal identificable'
  };
  
  next();
};

module.exports = {
  analysisRateLimit,
  generalRateLimit,
  validateAnalysisInput,
  handleValidationErrors,
  securityHeaders,
  securityLogger,
  validateContentType,
  sanitizeInput,
  validateAnalysisIntegrity,
  addTransparencyInfo,
  sanitizeText
};
