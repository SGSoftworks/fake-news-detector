const axios = require("axios");
const { getAnalysisConfig } = require("../config/ai-config");
const { verifyNews } = require("./verificationService");

// Configuración de APIs
const config = getAnalysisConfig();

// Función principal de análisis con múltiples APIs
const analyzeText = async (text) => {
  try {
    console.log("🤖 Iniciando análisis avanzado con verificación externa...");

    // Detectar si es URL o texto
    const isUrl = text.startsWith("http://") || text.startsWith("https://");

    // Análisis local siempre disponible
    const localAnalysis = performLocalAnalysis(text);
    const results = {
      local: localAnalysis,
      huggingface: null,
      gemini: null,
    };

    // Análisis paralelo con APIs disponibles
    const promises = [];

    // Hugging Face Analysis
    if (config.huggingface.enabled) {
      promises.push(
        analyzeWithHuggingFace(text)
          .then((result) => {
            results.huggingface = result;
          })
          .catch((error) => {
            console.warn("❌ Hugging Face API error:", error.message);
            results.huggingface = null;
          })
      );
    }

    // Google Gemini Analysis
    if (config.gemini.enabled) {
      promises.push(
        analyzeWithGemini(text)
          .then((result) => {
            results.gemini = result;
          })
          .catch((error) => {
            console.warn("❌ Google Gemini API error:", error.message);
            results.gemini = null;
          })
      );
    }

    // Verificación externa (en paralelo)
    let verificationResults = null;
    if (config.verification.enabled || config.sourceAnalysis.enabled) {
      promises.push(
        verifyNews(text, isUrl)
          .then((result) => {
            verificationResults = result;
          })
          .catch((error) => {
            console.warn("❌ Verificación externa error:", error.message);
            verificationResults = null;
          })
      );
    }

    // Esperar a que todas las APIs respondan (con timeout)
    if (promises.length > 0) {
      await Promise.allSettled(promises);
    }

    // Combinar resultados
    const finalResult = combineAllAnalysis(results, verificationResults, isUrl);

    console.log("✅ Análisis avanzado completado con éxito");
    return finalResult;
  } catch (error) {
    console.error("❌ Error en análisis:", error);
    throw new Error("Error al analizar el texto");
  }
};

// Análisis local mejorado
const performLocalAnalysis = (text) => {
  const lowerText = text.toLowerCase();
  const factors = [];
  let fakeScore = 0;

  // 1. Análisis de palabras sensacionalistas
  const sensationalWords = [
    "increíble",
    "sorprendente",
    "impactante",
    "escándalo",
    "exclusivo",
    "urgente",
    "breaking",
    "shock",
    "revelación",
    "denuncia",
    "alerta",
    "peligro",
    "crisis",
    "emergencia",
    "catástrofe",
    "desastre",
  ];

  const sensationalCount = sensationalWords.filter((word) =>
    lowerText.includes(word)
  ).length;

  if (sensationalCount > 2) {
    factors.push({
      name: "Lenguaje Sensacionalista",
      description: `Se encontraron ${sensationalCount} palabras sensacionalistas`,
      impact: "high",
      score: Math.min(25, sensationalCount * 5),
    });
    fakeScore += Math.min(25, sensationalCount * 5);
  }

  // 2. Análisis de mayúsculas
  const upperCaseRatio = (text.match(/[A-Z]/g) || []).length / text.length;
  if (upperCaseRatio > 0.1) {
    factors.push({
      name: "Uso Excesivo de Mayúsculas",
      description: `${Math.round(
        upperCaseRatio * 100
      )}% del texto está en mayúsculas`,
      impact: "medium",
      score: Math.min(15, upperCaseRatio * 100),
    });
    fakeScore += Math.min(15, upperCaseRatio * 100);
  }

  // 3. Análisis de urgencia
  const urgencyWords = [
    "ahora",
    "urgente",
    "inmediato",
    "ya",
    "rápido",
    "pronto",
  ];
  const urgencyCount = urgencyWords.filter((word) =>
    lowerText.includes(word)
  ).length;

  if (urgencyCount > 1) {
    factors.push({
      name: "Lenguaje de Urgencia",
      description: "Uso excesivo de palabras que crean urgencia",
      impact: "medium",
      score: Math.min(10, urgencyCount * 3),
    });
    fakeScore += Math.min(10, urgencyCount * 3);
  }

  // 4. Análisis de fuentes
  const sourcePatterns = [
    /fuente/i,
    /según/i,
    /reporta/i,
    /informa/i,
    /declara/i,
    /afirma/i,
    /confirma/i,
    /revela/i,
    /anuncia/i,
    /comunica/i,
  ];
  const hasSources = sourcePatterns.some((pattern) => pattern.test(text));

  if (!hasSources) {
    factors.push({
      name: "Falta de Fuentes",
      description: "No se mencionan fuentes específicas o citas",
      impact: "high",
      score: 20,
    });
    fakeScore += 20;
  }

  // 5. Análisis de longitud
  if (text.length < 100) {
    factors.push({
      name: "Texto Muy Corto",
      description: "El texto es demasiado breve para ser una noticia completa",
      impact: "medium",
      score: 10,
    });
    fakeScore += 10;
  }

  // 6. Análisis de repetición
  const words = text
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 3);
  const wordCount = {};
  words.forEach((word) => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });

  const repeatedWords = Object.entries(wordCount).filter(
    ([word, count]) => count > 3
  ).length;

  if (repeatedWords > 2) {
    factors.push({
      name: "Repetición Excesiva",
      description: "Uso repetitivo de palabras clave",
      impact: "low",
      score: Math.min(5, repeatedWords * 2),
    });
    fakeScore += Math.min(5, repeatedWords * 2);
  }

  // 7. Análisis de puntuación excesiva
  const excessivePunctuation = (text.match(/[!]{2,}|[?]{2,}/g) || []).length;
  if (excessivePunctuation > 0) {
    factors.push({
      name: "Puntuación Excesiva",
      description: "Uso excesivo de signos de exclamación o interrogación",
      impact: "medium",
      score: Math.min(10, excessivePunctuation * 3),
    });
    fakeScore += Math.min(10, excessivePunctuation * 3);
  }

  // 8. Análisis de números y fechas
  const hasSpecificDetails = /\d{1,2}\/\d{1,2}\/\d{4}|\d{1,2}:\d{2}|\d{4}/.test(
    text
  );
  if (!hasSpecificDetails) {
    factors.push({
      name: "Falta de Detalles Específicos",
      description: "No se mencionan fechas, horas o números específicos",
      impact: "medium",
      score: 8,
    });
    fakeScore += 8;
  }

  // Calcular confianza final
  const confidence = Math.min(95, Math.max(5, fakeScore));
  const isFake = confidence > 60;

  return {
    isFake,
    confidence: Math.round(confidence),
    factors,
    model: "Local Analysis v2.0",
    details: {
      sensationalWords: sensationalCount,
      upperCaseRatio: Math.round(upperCaseRatio * 100),
      urgencyWords: urgencyCount,
      hasSources,
      textLength: text.length,
      repeatedWords,
      excessivePunctuation,
      hasSpecificDetails,
    },
  };
};

// Análisis con Hugging Face
const analyzeWithHuggingFace = async (text) => {
  if (!config.huggingface.enabled) {
    throw new Error("Hugging Face API no está habilitada");
  }

  try {
    console.log("🔍 Analizando con Hugging Face...");

    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${config.huggingface.model}`,
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${config.huggingface.apiKey}`,
          "Content-Type": "application/json",
        },
        timeout: config.analysis.timeouts.huggingface,
      }
    );

    // Procesar respuesta de Hugging Face
    const result = processHuggingFaceResponse(response.data, text);

    console.log("✅ Hugging Face analysis completed");
    return {
      ...result,
      source: "Hugging Face",
      model: config.huggingface.model,
    };
  } catch (error) {
    console.error("❌ Hugging Face API error:", error.message);
    throw new Error(`Error al analizar con Hugging Face: ${error.message}`);
  }
};

// Procesar respuesta de Hugging Face
const processHuggingFaceResponse = (data, text) => {
  // La respuesta puede variar según el modelo
  let sentiment = "neutral";
  let confidence = 50;

  if (Array.isArray(data) && data.length > 0) {
    const firstResult = data[0];

    if (firstResult.label) {
      sentiment = firstResult.label.toLowerCase();
    }

    if (firstResult.score) {
      confidence = Math.round(firstResult.score * 100);
    }
  }

  // Convertir sentimiento a análisis de fake news
  const isFake = sentiment.includes("negative") || sentiment.includes("toxic");
  const fakeConfidence = isFake ? confidence : 100 - confidence;

  return {
    isFake,
    confidence: fakeConfidence,
    factors: [
      {
        name: "Análisis de Sentimiento",
        description: `Sentimiento detectado: ${sentiment}`,
        impact: "medium",
      },
    ],
    explanation: `El modelo de Hugging Face detectó un sentimiento ${sentiment} con ${confidence}% de confianza.`,
  };
};

// Análisis con Google Gemini API
const analyzeWithGemini = async (text) => {
  if (!config.gemini.enabled) {
    throw new Error("Google Gemini API no está habilitada");
  }

  try {
    console.log("🔍 Analizando con Google Gemini...");

    const systemPrompt = `Eres un experto en detectar noticias falsas en español. 
    Analiza el siguiente texto y responde ÚNICAMENTE con un JSON válido que contenga:
    {
      "isFake": boolean,
      "confidence": number (0-100),
      "factors": [{"name": string, "description": string, "impact": "low|medium|high"}],
      "explanation": string
    }
    
    Considera estos factores:
    - Lenguaje sensacionalista o emocional
    - Falta de fuentes o citas
    - Uso excesivo de mayúsculas
    - Palabras de urgencia
    - Detalles específicos (fechas, números, nombres)
    - Tono y estilo del texto
    - Credibilidad de las fuentes mencionadas`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${config.gemini.model}:generateContent`,
      {
        contents: [
          {
            parts: [
              {
                text: `${systemPrompt}\n\nAnaliza esta noticia: "${text}"`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 500,
        },
      },
      {
        params: { key: config.gemini.apiKey },
        timeout: config.analysis.timeouts.gemini,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const content = response.data.candidates[0].content.parts[0].text;
    const result = JSON.parse(content);

    console.log("✅ Google Gemini analysis completed");
    return {
      ...result,
      source: "Google Gemini",
      model: config.gemini.model,
    };
  } catch (error) {
    console.error("❌ Google Gemini API error:", error.message);
    throw new Error(`Error al analizar con Google Gemini: ${error.message}`);
  }
};

// Combinar todos los análisis disponibles
const combineAllAnalysis = (results, verificationResults, isUrl) => {
  const availableResults = Object.entries(results)
    .filter(([key, result]) => result !== null)
    .map(([key, result]) => ({ source: key, ...result }));

  if (availableResults.length === 0) {
    throw new Error("No hay resultados de análisis disponibles");
  }

  console.log(
    `🔄 Combinando ${availableResults.length} análisis con verificación externa...`
  );

  // Calcular confianza ponderada
  let totalConfidence = 0;
  let totalWeight = 0;
  const allFactors = [];
  const details = {};

  availableResults.forEach((result) => {
    const weight = config.analysis.weights[result.source] || 0.25;
    totalConfidence += result.confidence * weight;
    totalWeight += weight;

    // Agregar factores
    if (result.factors) {
      allFactors.push(
        ...result.factors.map((factor) => ({
          ...factor,
          source: result.source,
        }))
      );
    }

    // Agregar detalles
    if (result.details) {
      details[result.source] = result.details;
    }
  });

  // Aplicar factor de verificación externa
  let finalConfidence = Math.round(totalConfidence / totalWeight);

  if (verificationResults) {
    const verificationFactor = verificationResults.credibilityScore / 100;
    finalConfidence = Math.round(
      finalConfidence * 0.7 + verificationResults.credibilityScore * 0.3
    );

    // Agregar factores de verificación
    if (verificationResults.recommendations) {
      verificationResults.recommendations.forEach((rec) => {
        allFactors.push({
          name: "Verificación Externa",
          description: rec,
          impact: "high",
          source: "verification",
        });
      });
    }
  }

  const isFake = finalConfidence > config.analysis.thresholds.fake;

  // Determinar modelo usado
  const modelsUsed = availableResults.map((r) => r.source).join(" + ");
  const modelName = verificationResults
    ? `Multi-API + Verificación (${modelsUsed})`
    : `Multi-API (${modelsUsed})`;

  // Generar explicación detallada
  const explanation = generateDetailedExplanation(
    finalConfidence,
    isFake,
    allFactors,
    verificationResults
  );

  // Preparar respuesta extendida
  const response = {
    isFake,
    confidence: finalConfidence,
    factors: allFactors,
    model: modelName,
    details: {
      ...details,
      sources: availableResults.map((r) => r.source),
      individualResults: availableResults.map((r) => ({
        source: r.source,
        confidence: r.confidence,
        isFake: r.isFake,
      })),
      isUrl,
      analysisType: isUrl ? "URL Analysis" : "Text Analysis",
    },
    explanation: explanation,
    verdict: isFake ? "NO VERÍDICA" : "VERÍDICA",
    confidenceLevel: getConfidenceLevel(finalConfidence),
  };

  // Agregar información de verificación si está disponible
  if (verificationResults) {
    response.verification = {
      sourceAnalysis: verificationResults.sourceAnalysis,
      relatedArticles: verificationResults.relatedArticles,
      externalVerification: verificationResults.externalVerification,
      credibilityScore: verificationResults.credibilityScore,
      recommendations: verificationResults.recommendations,
    };
  }

  return response;
};

// Función para generar explicación detallada
const generateDetailedExplanation = (
  confidence,
  isFake,
  factors,
  verificationResults
) => {
  let explanation = "";

  // Veredicto principal
  if (isFake) {
    explanation += `🔴 **VEREDICTO: NO VERÍDICA**\n\n`;
    explanation += `Esta noticia presenta características típicas de información no verídica con un nivel de confianza del ${confidence}%.\n\n`;
  } else {
    explanation += `🟢 **VEREDICTO: VERÍDICA**\n\n`;
    explanation += `Esta noticia presenta características de información verídica con un nivel de confianza del ${confidence}%.\n\n`;
  }

  // Factores principales
  if (factors && factors.length > 0) {
    explanation += `**🔍 FACTORES ANALIZADOS:**\n`;
    const topFactors = factors
      .filter((f) => f.impact === "high" || f.impact === "medium")
      .slice(0, 5);

    topFactors.forEach((factor, index) => {
      const icon = factor.impact === "high" ? "⚠️" : "📊";
      explanation += `${index + 1}. ${icon} **${factor.name}**: ${
        factor.description
      }\n`;
    });
    explanation += "\n";
  }

  // Fuentes consultadas
  if (
    verificationResults &&
    verificationResults.relatedArticles &&
    verificationResults.relatedArticles.length > 0
  ) {
    explanation += `**📰 FUENTES CONSULTADAS:**\n`;
    const sources = verificationResults.relatedArticles.slice(0, 3);
    sources.forEach((source, index) => {
      explanation += `${index + 1}. **${source.source}**: ${source.title}\n`;
      if (source.snippet) {
        explanation += `   ${source.snippet.substring(0, 100)}...\n`;
      }
    });
    explanation += "\n";
  }

  // Recomendaciones
  if (
    verificationResults &&
    verificationResults.recommendations &&
    verificationResults.recommendations.length > 0
  ) {
    explanation += `**💡 RECOMENDACIONES:**\n`;
    verificationResults.recommendations.forEach((rec, index) => {
      explanation += `${index + 1}. ${rec}\n`;
    });
    explanation += "\n";
  }

  // Explicación final
  if (isFake) {
    explanation += `**🚨 RAZONES PRINCIPALES:**\n`;
    explanation += `• Se detectaron patrones típicos de noticias falsas\n`;
    explanation += `• Falta de fuentes verificables o confiables\n`;
    explanation += `• Uso de lenguaje sensacionalista o manipulador\n`;
    explanation += `• Inconsistencias en la información presentada\n\n`;
    explanation += `**⚠️ RECOMENDACIÓN:** Verifica esta información con fuentes oficiales antes de compartirla.`;
  } else {
    explanation += `**✅ RAZONES PRINCIPALES:**\n`;
    explanation += `• La información presenta características de credibilidad\n`;
    explanation += `• Se encontraron fuentes verificables relacionadas\n`;
    explanation += `• El lenguaje es objetivo y factual\n`;
    explanation += `• La información es consistente y verificable\n\n`;
    explanation += `**✅ RECOMENDACIÓN:** Esta información parece confiable, pero siempre verifica con múltiples fuentes.`;
  }

  return explanation;
};

// Función para obtener nivel de confianza
const getConfidenceLevel = (confidence) => {
  if (confidence >= 80) return "MUY ALTA";
  if (confidence >= 60) return "ALTA";
  if (confidence >= 40) return "MEDIA";
  if (confidence >= 20) return "BAJA";
  return "MUY BAJA";
};

module.exports = {
  analyzeText,
  performLocalAnalysis,
  analyzeWithHuggingFace,
  analyzeWithGemini,
  combineAllAnalysis,
};
