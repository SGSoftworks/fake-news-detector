// Configuración centralizada de la aplicación
const config = {
  // Configuración de APIs
  apis: {
    openai: {
      baseURL:
        process.env.REACT_APP_OPENAI_API_URL || "https://api.openai.com/v1",
      apiKey: process.env.REACT_APP_OPENAI_API_KEY,
      model: process.env.REACT_APP_OPENAI_MODEL || "gpt-4",
    },
    googleCloud: {
      baseURL:
        process.env.REACT_APP_GOOGLE_CLOUD_API_URL ||
        "https://vision.googleapis.com/v1",
      apiKey: process.env.REACT_APP_GOOGLE_CLOUD_API_KEY,
    },
    azure: {
      baseURL:
        process.env.REACT_APP_AZURE_API_URL ||
        "https://api.cognitive.microsoft.com",
      apiKey: process.env.REACT_APP_AZURE_API_KEY,
      region: process.env.REACT_APP_AZURE_REGION,
    },
    github: {
      baseURL: process.env.REACT_APP_GITHUB_API_URL || "https://api.github.com",
      apiKey: process.env.REACT_APP_GITHUB_API_KEY,
    },
    turnitin: {
      baseURL:
        process.env.REACT_APP_TURNITIN_API_URL || "https://api.turnitin.com",
      apiKey: process.env.REACT_APP_TURNITIN_API_KEY,
    },
  },

  // Configuración de la aplicación
  app: {
    name: "Detector de IA",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
    debug: process.env.REACT_APP_DEBUG === "true",
    maxFileSize: process.env.REACT_APP_MAX_FILE_SIZE || 10 * 1024 * 1024, // 10MB
    supportedImageFormats: [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ],
    supportedVideoFormats: ["video/mp4", "video/avi", "video/mov", "video/wmv"],
    supportedAudioFormats: ["audio/mp3", "audio/wav", "audio/ogg", "audio/m4a"],
  },

  // Configuración de seguridad
  security: {
    encryptionKey: process.env.REACT_APP_ENCRYPTION_KEY,
    sessionTimeout: process.env.REACT_APP_SESSION_TIMEOUT || 3600000, // 1 hora
    maxLoginAttempts: process.env.REACT_APP_MAX_LOGIN_ATTEMPTS || 5,
    passwordMinLength: process.env.REACT_APP_PASSWORD_MIN_LENGTH || 8,
  },

  // Configuración de almacenamiento
  storage: {
    historyKey: "ai_detector_history",
    settingsKey: "ai_detector_settings",
    maxHistoryItems: process.env.REACT_APP_MAX_HISTORY_ITEMS || 1000,
    backupInterval: process.env.REACT_APP_BACKUP_INTERVAL || 86400000, // 24 horas
  },

  // Configuración de análisis
  analysis: {
    defaultConfidence: 0.8,
    maxRetries: process.env.REACT_APP_MAX_RETRIES || 3,
    timeout: process.env.REACT_APP_ANALYSIS_TIMEOUT || 30000, // 30 segundos
    batchSize: process.env.REACT_APP_BATCH_SIZE || 10,
  },

  // Configuración de UI/UX
  ui: {
    theme: process.env.REACT_APP_THEME || "light",
    language: process.env.REACT_APP_LANGUAGE || "es",
    animations: process.env.REACT_APP_ANIMATIONS !== "false",
    autoSave: process.env.REACT_APP_AUTO_SAVE !== "false",
  },

  // Configuración de monitoreo y analytics
  monitoring: {
    enabled: process.env.REACT_APP_MONITORING_ENABLED === "true",
    endpoint: process.env.REACT_APP_MONITORING_ENDPOINT,
    sampleRate: process.env.REACT_APP_MONITORING_SAMPLE_RATE || 0.1,
  },

  // Configuración de exportación
  export: {
    maxItemsPerExport: process.env.REACT_APP_MAX_EXPORT_ITEMS || 1000,
    supportedFormats: ["json", "csv", "pdf"],
    compressionEnabled: process.env.REACT_APP_EXPORT_COMPRESSION !== "false",
  },
};

// Validación de configuración crítica
const validateConfig = () => {
  const requiredKeys = [
    "apis.openai.apiKey",
    "apis.googleCloud.apiKey",
    "apis.azure.apiKey",
  ];

  const missingKeys = requiredKeys.filter(key => {
    const value = key.split(".").reduce((obj, k) => obj?.[k], config);
    return !value;
  });

  if (missingKeys.length > 0) {
    console.warn("Configuración faltante:", missingKeys);
    console.warn("Algunas funcionalidades pueden no estar disponibles");
  }
};

// Ejecutar validación en desarrollo
if (config.app.environment === "development") {
  validateConfig();
}

export default config;
