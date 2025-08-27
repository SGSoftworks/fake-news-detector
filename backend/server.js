const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.use((err, req, res, next) => {
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

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📡 API disponible en: http://localhost:${PORT}`);
  console.log(
    `🔗 Frontend: ${process.env.CORS_ORIGIN || "http://localhost:5173"}`
  );
});

module.exports = app;
