const express = require("express");
const router = express.Router();
const { analyzeText } = require("../services/aiService");
const { validateAnalysisRequest } = require("../utils/validation");
const webExtractionService = require("../services/webExtractionService");
const headlineComparisonService = require("../services/headlineComparisonService");
const { 
  analysisRateLimit, 
  validateAnalysisInput, 
  handleValidationErrors,
  validateAnalysisIntegrity 
} = require("../middleware/security");

// POST /api/analysis - Analizar texto o URL con seguridad mejorada
router.post("/", 
  analysisRateLimit, // Rate limiting específico para análisis
  validateAnalysisInput, // Validación de entrada mejorada
  handleValidationErrors, // Manejo de errores de validación
  validateAnalysisRequest, // Validación existente
  async (req, res) => {
  try {
    const { content, inputType = "text", analyzeUrl = false } = req.body;
    // La validación ya se hizo en validateAnalysisRequest
    const text = content || req.body.text;

    console.log(`🔍 Iniciando análisis de ${inputType}...`);

    let extractedData = null;
    let textToAnalyze = text;
    let originalUrl = null;

    // Si es URL, extraer contenido primero
    if (inputType === "url" || analyzeUrl) {
      try {
        console.log("🔗 Extrayendo contenido de URL...");
        extractedData = await webExtractionService.extractContentFromUrl(text);
        textToAnalyze = extractedData.content;
        originalUrl = text;

        if (!extractedData.hasContent) {
          return res.status(400).json({
            error: "No se pudo extraer contenido válido de la URL",
          });
        }
      } catch (extractionError) {
        console.error("❌ Error extrayendo contenido:", extractionError);
        return res.status(400).json({
          error: "Error extrayendo contenido de la URL",
          message: extractionError.message,
        });
      }
    }

    // Realizar análisis principal
    const startTime = Date.now();
    const result = await analyzeText(textToAnalyze);
    const analysisTime = Date.now() - startTime;

    // Buscar titulares similares si tenemos título
    let similarHeadlines = [];
    let comparisonReport = null;

    if (extractedData?.title || result.title) {
      const title = extractedData?.title || result.title;
      console.log("🔍 Buscando titulares similares...");

      try {
        similarHeadlines = await headlineComparisonService.findSimilarHeadlines(
          title,
          textToAnalyze,
          5
        );

        if (similarHeadlines.length > 0) {
          console.log("📊 Generando reporte de comparación...");
          comparisonReport =
            await headlineComparisonService.generateComparisonReport(
              title,
              textToAnalyze,
              similarHeadlines,
              { analysis: "Análisis de similitud completado" }
            );
        }
      } catch (comparisonError) {
        console.error("⚠️ Error en comparación de titulares:", comparisonError);
        // No fallar el análisis principal por errores de comparación
      }
    }

    // Validar integridad del análisis antes de responder
    const integrityCheck = validateAnalysisIntegrity(result);
    if (!integrityCheck.isValid) {
      console.error("❌ Error de integridad en análisis:", integrityCheck.errors);
      return res.status(500).json({
        error: "Error en la validación del análisis",
        details: "El análisis no cumple con los estándares de calidad"
      });
    }

    // Enriquecer resultado con datos extraídos y comparaciones
    const response = {
      ...result,
      inputType,
      originalUrl,
      extractedData,
      similarHeadlines,
      comparisonReport,
      analysisTime,
      textLength: extractedData ? extractedData.contentLength : text.length,
      timestamp: new Date().toISOString(),
      model: result.model + (inputType === "url" ? " + Extracción Web" : ""),
      // Información de transparencia y confiabilidad
      transparency: {
        ...res.locals.transparencyInfo,
        analysisIntegrity: "Verificado",
        qualityScore: Math.min(95, result.confidence + 10),
        securityValidated: true
      }
    };

    console.log(
      `✅ Análisis completado en ${analysisTime}ms con validación de integridad`
    );
    res.json(response);
  } catch (error) {
    console.error("❌ Error en análisis:", error.message);
    res.status(500).json({
      error: "Error al analizar el contenido",
      message: error.message,
    });
  }
});

// GET /api/analysis/status - Estado del servicio
router.get("/status", (req, res) => {
  res.json({
    status: "operational",
    service: "FakeNewsDetector Analysis",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
