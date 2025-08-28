const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");

// Importar middleware de seguridad
const {
  generalRateLimit,
  securityHeaders,
  securityLogger,
  validateContentType,
  sanitizeInput,
  addTransparencyInfo
} = require("./src/middleware/security");

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware de seguridad básico
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// Rate limiting general
app.use(generalRateLimit);

// Logging de seguridad
app.use(securityLogger);

// Headers de seguridad personalizados
app.use(securityHeaders);

// Validación de content-type
app.use(validateContentType);

// CORS configurado de forma segura
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || (process.env.NODE_ENV === 'production' ? false : "*"),
    credentials: true,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400 // 24 horas
  })
);

// Parseo de JSON con límite de tamaño
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Sanitización de entrada
app.use(sanitizeInput);

// Información de transparencia
app.use(addTransparencyInfo);

// Rutas
app.use("/api/analysis", require("./src/routes/analysis"));
app.use("/api/health", require("./src/routes/health"));

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({
    message: "FakeNewsDetector API",
    version: "1.0.0",
    status: "running",
  });
});

// Manejo de errores
app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Algo salió mal en el servidor",
    message:
      process.env.NODE_ENV === "development" ? err.message : "Error interno",
  });
});

// Ruta 404
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Ruta no encontrada",
    message: "La ruta solicitada no existe",
  });
});

// Iniciar servidor solo si no estamos en Vercel
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    console.log(`📡 API disponible en: http://localhost:${PORT}`);
    console.log(
      `🔗 Frontend: ${process.env.CORS_ORIGIN || "http://localhost:5173"}`
    );
  });
}

module.exports = app;
