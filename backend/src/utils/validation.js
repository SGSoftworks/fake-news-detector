// Validación de peticiones de análisis
const validateAnalysisRequest = (req, res, next) => {
  const { text, content, inputType = "text" } = req.body;

  // Compatibilidad con formato anterior (text) y nuevo (content)
  const contentToValidate = content || text;

  // Validar que el contenido existe
  if (!contentToValidate) {
    return res.status(400).json({
      error: "Contenido requerido",
      message: 'El campo "content" o "text" es obligatorio',
    });
  }

  // Validar que el contenido es una cadena
  if (typeof contentToValidate !== "string") {
    return res.status(400).json({
      error: "Tipo de dato inválido",
      message: 'El campo "content" debe ser una cadena de texto',
    });
  }

  // Validar longitud mínima (más flexible para URLs)
  const minLength = inputType === "url" ? 10 : 50;
  if (contentToValidate.trim().length < minLength) {
    return res.status(400).json({
      error: "Contenido muy corto",
      message:
        inputType === "url"
          ? "La URL debe tener al menos 10 caracteres"
          : "El texto debe tener al menos 50 caracteres para un análisis preciso",
    });
  }

  // Validar longitud máxima
  if (contentToValidate.length > 10000) {
    return res.status(400).json({
      error: "Contenido muy largo",
      message: "El contenido no puede exceder los 10,000 caracteres",
    });
  }

  // Limpiar el contenido y normalizar
  req.body.content = contentToValidate.trim();
  req.body.text = contentToValidate.trim(); // Mantener compatibilidad
  req.body.inputType = inputType;

  next();
};

// Validación de rate limiting (simplificada)
const rateLimit = (req, res, next) => {
  // Por ahora es una implementación básica
  // En producción se debería usar una librería como express-rate-limit

  const clientIP = req.ip || req.connection.remoteAddress;
  const now = Date.now();

  // Simular rate limiting básico
  if (!req.app.locals.rateLimit) {
    req.app.locals.rateLimit = {};
  }

  if (!req.app.locals.rateLimit[clientIP]) {
    req.app.locals.rateLimit[clientIP] = {
      count: 0,
      resetTime: now + 15 * 60 * 1000, // 15 minutos
    };
  }

  const rateLimitData = req.app.locals.rateLimit[clientIP];

  // Resetear contador si ha pasado el tiempo
  if (now > rateLimitData.resetTime) {
    rateLimitData.count = 0;
    rateLimitData.resetTime = now + 15 * 60 * 1000;
  }

  // Incrementar contador
  rateLimitData.count++;

  // Verificar límite (100 requests por 15 minutos)
  if (rateLimitData.count > 100) {
    return res.status(429).json({
      error: "Demasiadas peticiones",
      message:
        "Has excedido el límite de peticiones. Intenta de nuevo en 15 minutos.",
    });
  }

  next();
};

// Validación de headers
const validateHeaders = (req, res, next) => {
  const contentType = req.get("Content-Type");

  if (
    req.method === "POST" &&
    (!contentType || !contentType.includes("application/json"))
  ) {
    return res.status(400).json({
      error: "Content-Type inválido",
      message: "El Content-Type debe ser application/json",
    });
  }

  next();
};

// Sanitización básica de texto
const sanitizeText = (text) => {
  if (typeof text !== "string") {
    return "";
  }

  // Remover caracteres peligrosos
  return text
    .replace(/[<>]/g, "") // Remover < y >
    .replace(/javascript:/gi, "") // Remover javascript:
    .replace(/on\w+=/gi, "") // Remover event handlers
    .trim();
};

module.exports = {
  validateAnalysisRequest,
  rateLimit,
  validateHeaders,
  sanitizeText,
};
