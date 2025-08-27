// Configuración para APIs de Inteligencia Artificial
require("dotenv").config();

const aiConfig = {
  // OpenAI Configuration
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
    maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 500,
    temperature: parseFloat(process.env.OPENAI_TEMPERATURE) || 0.3,
    enabled: !!process.env.OPENAI_API_KEY,
  },

  // Hugging Face Configuration
  huggingface: {
    apiKey: process.env.HUGGINGFACE_API_KEY,
    model:
      process.env.HUGGINGFACE_MODEL ||
      "nlptown/bert-base-multilingual-uncased-sentiment",
    enabled: !!process.env.HUGGINGFACE_API_KEY,
  },

  // Google Gemini API Configuration
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
    enabled: !!process.env.GEMINI_API_KEY,
  },

  // Configuración de análisis combinado mejorada
  analysis: {
    // Ponderaciones para combinar resultados (IA más agresiva)
    weights: {
      local: parseFloat(process.env.LOCAL_WEIGHT) || 0.1, // Peso mínimo
      openai: parseFloat(process.env.OPENAI_WEIGHT) || 0.0, // No usar OpenAI
      huggingface: parseFloat(process.env.HUGGINGFACE_WEIGHT) || 0.3, // Peso medio
      gemini: parseFloat(process.env.GEMINI_WEIGHT) || 0.6, // Peso máximo
    },

    // Umbrales de confianza más estrictos
    thresholds: {
      fake: parseFloat(process.env.FAKE_THRESHOLD) || 55, // Más estricto
      highConfidence: parseFloat(process.env.HIGH_CONFIDENCE_THRESHOLD) || 85,
    },

    // Timeouts para APIs (más tiempo para análisis detallado)
    timeouts: {
      openai: parseInt(process.env.OPENAI_TIMEOUT) || 10000,
      huggingface: parseInt(process.env.HUGGINGFACE_TIMEOUT) || 15000,
      gemini: parseInt(process.env.GEMINI_TIMEOUT) || 20000, // Más tiempo para Gemini
    },

    // Configuración automática
    autoEnable: {
      gemini: true, // Siempre usar Gemini si está disponible
      huggingface: true, // Siempre usar Hugging Face si está disponible
      verification: true, // Siempre usar verificación externa
    },
  },

  // Configuración de fallback
  fallback: {
    enabled: true,
    useLocalOnly: true,
    maxRetries: 2,
  },

  // Configuración de verificación externa
  verification: {
    enabled: process.env.VERIFICATION_ENABLED === "true",
    googleSearchApiKey: process.env.GOOGLE_SEARCH_API_KEY,
    googleCustomSearchId: process.env.GOOGLE_CUSTOM_SEARCH_ID,
    newsApiKey: process.env.NEWS_API_KEY,
    timeout: parseInt(process.env.VERIFICATION_TIMEOUT) || 10000,
    maxSearchResults: parseInt(process.env.MAX_SEARCH_RESULTS) || 10,
  },

  // Configuración de análisis de fuentes
  sourceAnalysis: {
    enabled: process.env.SOURCE_ANALYSIS_ENABLED === "true",
    maxRelatedArticles: parseInt(process.env.MAX_RELATED_ARTICLES) || 5,
  },
};

// Función para validar configuración
const validateConfig = () => {
  const errors = [];

  if (!aiConfig.huggingface.enabled && !aiConfig.gemini.enabled) {
    console.warn(
      "⚠️  No hay APIs de IA configuradas. Usando solo análisis local."
    );
  }

  if (aiConfig.huggingface.enabled && !aiConfig.huggingface.apiKey) {
    errors.push("Hugging Face API key no configurada");
  }

  if (aiConfig.gemini.enabled && !aiConfig.gemini.apiKey) {
    errors.push("Google Gemini API key no configurada");
  }

  return errors;
};

// Función para obtener configuración de análisis
const getAnalysisConfig = () => {
  const errors = validateConfig();

  if (errors.length > 0) {
    console.warn("⚠️  Errores en configuración de IA:", errors.join(", "));
  }

  return {
    ...aiConfig,
    errors,
    hasAnyAI: aiConfig.huggingface.enabled || aiConfig.gemini.enabled,
  };
};

module.exports = {
  aiConfig,
  validateConfig,
  getAnalysisConfig,
};
