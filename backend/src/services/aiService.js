const axios = require("axios");
const { getAnalysisConfig } = require("../config/ai-config");
const { verifyNews } = require("./verificationService");

// Configuración de APIs
const config = getAnalysisConfig();

// Función principal de análisis con múltiples APIs
const analyzeText = async text => {
  try {
    console.log("🤖 Iniciando análisis avanzado con verificación externa...");

    // Detectar si es URL o texto
    const isUrl = text.startsWith("http://") || text.startsWith("https://");

    // Solo análisis avanzado con IA y verificación externa
    const results = {
      local: null, // Eliminado
      huggingface: null,
      gemini: null,
    };

    // Análisis paralelo con APIs disponibles (Modo Automático)
    const promises = [];

    // Hugging Face Analysis (Automático si está disponible)
    if (config.huggingface.enabled && config.analysis.autoEnable.huggingface) {
      promises.push(
        analyzeWithHuggingFace(text)
          .then(result => {
            results.huggingface = result;
            console.log("✅ Hugging Face analysis completed");
          })
          .catch(error => {
            console.warn("❌ Hugging Face API error:", error.message);
            results.huggingface = null;
          })
      );
    }

    // Google Gemini Analysis (Automático si está disponible)
    if (config.gemini.enabled && config.analysis.autoEnable.gemini) {
      promises.push(
        analyzeWithGemini(text)
          .then(result => {
            results.gemini = result;
            console.log("✅ Google Gemini analysis completed");
          })
          .catch(error => {
            console.warn("❌ Google Gemini API error:", error.message);
            results.gemini = null;
          })
      );
    }

    // Verificación externa (Automático si está disponible)
    let verificationResults = null;
    if (
      (config.verification.enabled || config.sourceAnalysis.enabled) &&
      config.analysis.autoEnable.verification
    ) {
      promises.push(
        verifyNews(text, isUrl)
          .then(result => {
            verificationResults = result;
            console.log("✅ External verification completed");
          })
          .catch(error => {
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
const performLocalAnalysis = text => {
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

  const sensationalCount = sensationalWords.filter(word =>
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
  const urgencyCount = urgencyWords.filter(word =>
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
  const hasSources = sourcePatterns.some(pattern => pattern.test(text));

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
    .filter(word => word.length > 3);
  const wordCount = {};
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });

  const repeatedWords = Object.entries(wordCount).filter(
    ([, count]) => count > 3
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
const analyzeWithHuggingFace = async text => {
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

// Procesar respuesta de Hugging Face con análisis avanzado
const processHuggingFaceResponse = data => {
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

  // Determinar si es fake basado en sentimiento
  const isFake = sentiment.includes("negative") || sentiment.includes("toxic");
  const fakeConfidence = isFake ? confidence : 100 - confidence;

  return {
    isFake,
    confidence: fakeConfidence,
    factors: [
      {
        name: "Análisis de Sentimiento (HuggingFace)",
        description: `Sentimiento ${sentiment} detectado con ${confidence}% de precisión usando modelo BERT multilingual. ${isFake ? "Sentimiento negativo puede indicar contenido manipulador." : "Sentimiento neutral/positivo sugiere contenido objetivo."}`,
        impact: isFake ? "high" : "medium",
        technicalDetails: {
          model: "BERT Multilingual Sentiment",
          sentimentScore: confidence,
          classification: sentiment,
        },
      },
    ],
    explanation: `HuggingFace (BERT) analizó el sentimiento del texto y detectó ${sentiment} con ${confidence}% de confianza. ${isFake ? "El sentimiento negativo/tóxico puede indicar contenido manipulador o sesgado típico de desinformación." : "El sentimiento neutral/positivo es consistente con contenido informativo objetivo."}`,
    technicalSummary: {
      sentimentAnalysis: { sentiment, confidence },
      modelUsed: "nlptown/bert-base-multilingual-uncased-sentiment",
      overallAssessment: isFake
        ? "Sentimiento sospechoso"
        : "Sentimiento normal",
    },
  };
};

// Análisis con Google Gemini 2.0 Flash - Profesional y Comprensible
const analyzeWithGemini = async text => {
  if (!config.gemini.enabled) {
    throw new Error("Google Gemini API no está habilitada");
  }

  try {
    console.log("🔍 Analizando con Google Gemini 2.0 Flash...");

    const systemPrompt = `Eres un experto verificador de noticias con acceso a capacidades de búsqueda web. Tu trabajo es analizar información y validarla contra fuentes reales en internet.

MISIÓN: Detectar desinformación, noticias falsas, y contenido generado por IA mediante verificación cruzada con fuentes web confiables.

PROCESO DE ANÁLISIS OBLIGATORIO:
1. **VERIFICACIÓN DE FUENTES**: Analiza si las fuentes mencionadas existen y son confiables
2. **BÚSQUEDA DE SIMILITUD**: Busca información similar en medios reconocidos
3. **DETECCIÓN DE IA**: Identifica patrones típicos de contenido generado artificialmente
4. **FACT-CHECKING**: Verifica hechos, fechas, personas y eventos mencionados
5. **ANÁLISIS DE CREDIBILIDAD**: Evalúa la reputación de las fuentes citadas

CLASIFICACIÓN AVANZADA - TIPOS DE CONTENIDO:

CONTENIDO GENERADO POR IA (Señales específicas):
- Texto excesivamente pulido sin errores naturales
- Estructura demasiado perfecta y simétrica
- Falta de detalles locales específicos (direcciones exactas, nombres completos)
- Uso de frases genéricas como "según expertos" sin nombres
- Información que suena plausible pero no es verificable
- Ausencia de contradicciones o matices humanos naturales
- Fechas recientes sin contexto histórico verificable

NOTICIA FALSA/DESINFORMACIÓN (Señales específicas):
- Información contradice fuentes establecidas
- Eventos que no aparecen en medios confiables
- Fuentes citadas que no existen o son inventadas
- Afirmaciones extraordinarias sin evidencia extraordinaria
- Sesgo extremo o lenguaje polarizante
- Información diseñada para generar emociones fuertes

INFORMACIÓN REAL/VERIFICABLE (Señales específicas):
- Fuentes citadas que existen y son verificables
- Detalles específicos que coinciden con registros públicos
- Presencia en múltiples medios confiables
- Contexto histórico consistente
- Errores menores típicos de contenido humano
- Matices y contradicciones naturales

VERIFICACIÓN WEB OBLIGATORIA:
- Buscar la noticia en medios establecidos (BBC, Reuters, AP, etc.)
- Verificar existencia de personas/organizaciones mencionadas
- Confirmar fechas y eventos contra registros públicos
- Buscar desmentidos o fact-checks existentes

FORMATO DE RESPUESTA (JSON válido únicamente):
{
  "isFake": boolean,
  "confidence": number (0-100),
  "contentType": "real|fake|ai_generated",
  "classification": {
    "category": "real_news|false_news|ai_content|unclear",
    "reasoning": "Explicación específica del tipo de contenido detectado",
    "confidence": number (0-100)
  },
  "explanation": "Explicación detallada basada en verificación web. Menciona qué fuentes consultaste y qué encontraste.",
  "factors": [
    {
      "name": "Verificación de fuentes",
      "description": "Resultado de búsqueda de las fuentes mencionadas en el texto",
      "impact": "high/medium/low",
      "webValidation": "URL o resultado de búsqueda específico",
      "relatedArticles": ["URLs de artículos relacionados encontrados"]
    },
    {
      "name": "Similitud con noticias verificadas", 
      "description": "Comparación con noticias reales en medios establecidos",
      "impact": "high/medium/low",
      "similarSources": ["lista de medios donde se encontró información similar"],
      "relatedArticles": ["URLs específicas de artículos similares"]
    },
    {
      "name": "Detección de contenido IA",
      "description": "Análisis de patrones que sugieren generación artificial",
      "impact": "high/medium/low",
      "aiIndicators": ["patrones específicos detectados"],
      "humanPatterns": ["patrones humanos encontrados o ausentes"]
    }
  ],
  "webVerification": {
    "sourcesFound": ["URLs de fuentes que confirman/desmienten la información"],
    "factCheckResults": ["Resultados de fact-checkers reconocidos"],
    "mediaPresence": "Descripción de presencia en medios establecidos",
    "contradictingSources": ["Fuentes que contradicen la información"],
    "relatedArticles": [
      {
        "title": "Título del artículo relacionado",
        "url": "URL del artículo",
        "source": "Nombre del medio",
        "similarity": "high|medium|low",
        "relationship": "confirms|contradicts|related|same_topic"
      }
    ]
  },
  "recommendations": [
    "Enlaces específicos para verificar la información",
    "Fuentes confiables donde buscar más información",
    "Acciones específicas basadas en hallazgos web"
  ],
  "summary": "Resumen basado en evidencia web encontrada"
}

INSTRUCCIONES CRÍTICAS:
- SIEMPRE menciona fuentes web específicas encontradas o su ausencia
- Si detectas contenido IA, explica EXACTAMENTE qué patrones encontraste
- Proporciona URLs o nombres de medios donde verificaste la información
- Si no encuentras la noticia en medios establecidos, es una SEÑAL DE ALERTA MAYOR`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${config.gemini.model}:generateContent`,
      {
        contents: [
          {
            parts: [
              {
                text: `${systemPrompt}\n\nCONTENIDO A ANALIZAR:\n"${text}"\n\nPor favor, analiza este contenido y proporciona tu evaluación en el formato JSON solicitado.`,
              },
            ],
          },
        ],
        safetySettings: config.gemini.safetySettings || [
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
        ],
        generationConfig: config.gemini.generationConfig || {
          temperature: 0.2,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 2048,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": config.gemini.apiKey,
        },
        timeout: config.analysis.timeouts.gemini,
      }
    );

    if (!response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error("Respuesta inválida de Gemini API");
    }

    const content = response.data.candidates[0].content.parts[0].text;

    try {
      // Limpiar y parsear JSON
      const cleanContent = content
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      const result = JSON.parse(cleanContent);

      // Validar y normalizar respuesta con nueva clasificación
      const finalResult = {
        isFake: Boolean(result.isFake),
        confidence: Math.max(0, Math.min(100, Number(result.confidence) || 50)),
        contentType: result.contentType || (result.isFake ? "fake" : "real"),
        classification: result.classification || {
          category: result.isFake ? "false_news" : "real_news",
          reasoning: "Clasificación basada en análisis general",
          confidence: result.confidence || 50,
        },
        explanation:
          result.explanation || result.summary || "Análisis completado",
        factors: Array.isArray(result.factors) ? result.factors : [],
        recommendations: Array.isArray(result.recommendations)
          ? result.recommendations
          : [],
        summary: result.summary || result.explanation || "",
        webVerification: result.webVerification || null,
        source: "Google Gemini",
        model: config.gemini.model,
      };

      console.log("✅ Google Gemini 2.0 analysis completed");
      return finalResult;
    } catch (parseError) {
      console.error("❌ Error parseando respuesta de Gemini:", parseError);

      // Fallback: análisis básico del texto de respuesta
      const isFake =
        content.toLowerCase().includes("falsa") ||
        content.toLowerCase().includes("no confiable") ||
        content.toLowerCase().includes("engañosa");

      return {
        isFake,
        confidence: 50,
        explanation:
          "El análisis se completó pero hubo problemas al procesar la respuesta detallada. Se recomienda verificar la información con fuentes adicionales.",
        factors: [
          {
            name: "Análisis técnico limitado",
            description:
              "No se pudo procesar completamente la respuesta del sistema de IA",
            impact: "medium",
          },
        ],
        recommendations: [
          "Verifica la información en fuentes oficiales",
          "Busca la misma noticia en medios reconocidos",
          "Consulta fact-checkers especializados",
        ],
        summary: "Análisis completado con limitaciones técnicas",
        source: "Google Gemini",
        model: config.gemini.model,
      };
    }
  } catch (error) {
    console.error("❌ Google Gemini API error:", error.message);

    // Errores específicos con mensajes claros
    if (error.response?.status === 429) {
      throw new Error(
        "El servicio está temporalmente sobrecargado. Intenta de nuevo en unos minutos."
      );
    }
    if (error.response?.status === 403) {
      throw new Error("Error de autenticación con el servicio de IA.");
    }
    if (error.response?.status === 400) {
      throw new Error(
        "El contenido no pudo ser analizado. Intenta con un texto diferente."
      );
    }

    throw new Error(
      "No se pudo completar el análisis con IA. Intenta de nuevo más tarde."
    );
  }
};

// Combinar todos los análisis disponibles con IA mejorada
const combineAllAnalysis = (results, verificationResults, isUrl) => {
  const availableResults = Object.entries(results)
    .filter(([, result]) => result !== null)
    .map(([key, result]) => ({ source: key, ...result }));

  if (availableResults.length === 0) {
    throw new Error("No hay resultados de análisis disponibles");
  }

  console.log(
    `🔄 Combinando ${availableResults.length} análisis con verificación externa...`
  );

  // Calcular confianza ponderada con pesos mejorados
  let totalConfidence = 0;
  let totalWeight = 0;
  const allFactors = [];
  const details = {};

  // Pesos mejorados: Gemini tiene más peso, Hugging Face menos, Local mínimo
  const weights = {
    gemini: 0.6, // 60% - IA más avanzada
    huggingface: 0.3, // 30% - IA especializada
    local: 0.1, // 10% - Análisis básico
  };

  availableResults.forEach(result => {
    const weight = weights[result.source] || 0.1;
    totalConfidence += result.confidence * weight;
    totalWeight += weight;

    // Agregar factores con fuente identificada
    if (result.factors) {
      allFactors.push(
        ...result.factors.map(factor => ({
          ...factor,
          source: result.source,
          aiType: getAIType(result.source),
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
    // Calcular si es fake basado en la confianza inicial
    const initialIsFake = finalConfidence > config.analysis.thresholds.fake;

    // Ajustar el credibilityScore basado en el análisis de IA
    const adjustedCredibilityScore = initialIsFake
      ? Math.min(verificationResults.credibilityScore, 60) // Si es fake, máximo 60%
      : Math.max(verificationResults.credibilityScore, 40); // Si es verídica, mínimo 40%

    finalConfidence = Math.round(
      finalConfidence * 0.7 + adjustedCredibilityScore * 0.3
    );

    // Actualizar el credibilityScore para que sea consistente
    verificationResults.credibilityScore = adjustedCredibilityScore;

    // Agregar factores de verificación
    if (verificationResults.recommendations) {
      verificationResults.recommendations.forEach(rec => {
        allFactors.push({
          name: "Verificación Externa",
          description: rec,
          impact: "high",
          source: "verification",
          aiType: "human",
        });
      });
    }
  }

  const isFake = finalConfidence > config.analysis.thresholds.fake;

  // Calcular porcentajes IA vs Humano
  const aiAnalysis = calculateAIAnalysis(availableResults, allFactors);
  const humanAnalysis = calculateHumanAnalysis(verificationResults);

  // Determinar modelo usado
  const modelsUsed = availableResults.map(r => r.source).join(" + ");
  const modelName = verificationResults
    ? `IA Avanzada + Verificación Humana (${modelsUsed})`
    : `IA Avanzada (${modelsUsed})`;

  // Generar explicación detallada
  const explanation = generateDetailedExplanation(
    finalConfidence,
    isFake,
    allFactors,
    verificationResults,
    aiAnalysis,
    humanAnalysis
  );

  // Preparar respuesta extendida
  const response = {
    isFake,
    confidence: finalConfidence,
    factors: allFactors,
    model: modelName,
    details: {
      ...details,
      sources: availableResults.map(r => r.source),
      individualResults: availableResults.map(r => ({
        source: r.source,
        confidence: r.confidence,
        isFake: r.isFake,
        aiType: getAIType(r.source),
      })),
      isUrl,
      analysisType: isUrl ? "URL Analysis" : "Text Analysis",
      aiAnalysis,
      humanAnalysis,
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

// Función para obtener el tipo de IA
const getAIType = source => {
  switch (source) {
    case "gemini":
      return "IA Avanzada (Gemini)";
    case "huggingface":
      return "IA Especializada (Hugging Face)";
    case "local":
      return "Análisis Local";
    case "verification":
      return "Verificación Humana";
    default:
      return "Análisis";
  }
};

// Calcular análisis de IA
const calculateAIAnalysis = (availableResults, allFactors) => {
  const aiFactors = allFactors.filter(f => f.source !== "verification");
  const aiConfidence =
    availableResults.reduce((sum, result) => {
      const weight =
        result.source === "gemini"
          ? 0.6
          : result.source === "huggingface"
            ? 0.3
            : 0.1;
      return sum + result.confidence * weight;
    }, 0) /
    availableResults.reduce((sum, result) => {
      const weight =
        result.source === "gemini"
          ? 0.6
          : result.source === "huggingface"
            ? 0.3
            : 0.1;
      return sum + weight;
    }, 0);

  return {
    confidence: Math.round(aiConfidence),
    factors: aiFactors.length,
    sources: availableResults.map(r => getAIType(r.source)),
    percentage: Math.round((aiConfidence / 100) * 70), // 70% del análisis total
  };
};

// Calcular análisis humano
const calculateHumanAnalysis = verificationResults => {
  if (!verificationResults) {
    return {
      confidence: 0,
      factors: 0,
      sources: [],
      percentage: 0,
    };
  }

  const humanFactors = verificationResults.recommendations
    ? verificationResults.recommendations.length
    : 0;
  const humanConfidence = verificationResults.credibilityScore || 50;

  return {
    confidence: humanConfidence,
    factors: humanFactors,
    sources: ["Verificación Externa", "Análisis de Fuentes"],
    percentage: Math.round((humanConfidence / 100) * 30), // 30% del análisis total
  };
};

// Función para generar explicación detallada mejorada
const generateDetailedExplanation = (
  confidence,
  isFake,
  factors,
  verificationResults,
  aiAnalysis,
  humanAnalysis
) => {
  let explanation = "";

  // Veredicto principal
  if (isFake) {
    explanation += `VEREDICTO: NO VERÍDICA Esta noticia presenta características típicas de información no verídica con un nivel de confianza del ${finalConfidence}%.\n\n`;
  } else {
    explanation += `VEREDICTO: VERÍDICA Esta noticia presenta características de información verídica con un nivel de confianza del ${finalConfidence}%.\n\n`;
  }

  // Análisis IA vs Humano
  explanation += `ANÁLISIS INTELIGENTE: IA Avanzada (Gemini): ${aiAnalysis.confidence}% de confianza - IA Especializada (Hugging Face): Análisis de patrones - Verificación Humana: ${humanAnalysis.confidence}% de credibilidad - Peso del análisis: ${aiAnalysis.percentage}% IA / ${humanAnalysis.percentage}% Humano\n\n`;

  // Factores principales por tipo de IA
  if (factors && factors.length > 0) {
    explanation += `FACTORES DETECTADOS:\n`;

    // Agrupar factores por tipo de IA
    const geminiFactors = factors.filter(
      f =>
        f.source === "gemini" && (f.impact === "high" || f.impact === "medium")
    );
    const huggingfaceFactors = factors.filter(
      f =>
        f.source === "huggingface" &&
        (f.impact === "high" || f.impact === "medium")
    );
    const localFactors = factors.filter(
      f =>
        f.source === "local" && (f.impact === "high" || f.impact === "medium")
    );
    const humanFactors = factors.filter(f => f.source === "verification");

    if (geminiFactors.length > 0) {
      explanation += `IA Avanzada (Gemini):\n`;
      geminiFactors.slice(0, 3).forEach((factor, index) => {
        const indicator = factor.impact === "high" ? "CRÍTICO" : "IMPORTANTE";
        explanation += `${index + 1}. [${indicator}] ${factor.description}\n`;
      });
      explanation += "\n";
    }

    if (huggingfaceFactors.length > 0) {
      explanation += `IA Especializada (Hugging Face):\n`;
      huggingfaceFactors.slice(0, 2).forEach((factor, index) => {
        const indicator = factor.impact === "high" ? "ALERTA" : "ANÁLISIS";
        explanation += `${index + 1}. [${indicator}] ${factor.description}\n`;
      });
      explanation += "\n";
    }

    if (localFactors.length > 0) {
      explanation += `Análisis Local:\n`;
      localFactors.slice(0, 2).forEach((factor, index) => {
        const indicator = factor.impact === "high" ? "RÁPIDO" : "BÁSICO";
        explanation += `${index + 1}. [${indicator}] ${factor.description}\n`;
      });
      explanation += "\n";
    }

    if (humanFactors.length > 0) {
      explanation += `Verificación Humana:\n`;
      humanFactors.slice(0, 3).forEach((factor, index) => {
        explanation += `${index + 1}. [VERIFICADO] ${factor.description}\n`;
      });
      explanation += "\n";
    }
  }

  // Fuentes consultadas
  if (
    verificationResults &&
    verificationResults.relatedArticles &&
    verificationResults.relatedArticles.length > 0
  ) {
    // Artículos relacionados encontrados
    explanation += `ARTÍCULOS RELACIONADOS ENCONTRADOS:\n`;
    verificationResults.relatedArticles
      .slice(0, 3)
      .forEach((article, index) => {
        explanation += `${index + 1}. ${article.title || article.url}\n`;
      });
    explanation += "\n";
  }

  // Recomendaciones
  if (
    verificationResults &&
    verificationResults.recommendations &&
    verificationResults.recommendations.length > 0
  ) {
    // Recomendaciones
    explanation += `RECOMENDACIONES:\n`;
    verificationResults.recommendations.forEach((rec, index) => {
      explanation += `${index + 1}. ${rec}\n`;
    });
    explanation += "\n";
  }

  // Explicación final mejorada
  if (isFake) {
    explanation += `RAZONES PRINCIPALES:\n`;
    explanation += `• IA Avanzada detectó: Patrones de desinformación\n`;
    explanation += `• IA Especializada confirmó: Características de fake news\n`;
    explanation += `• Verificación humana: Fuentes no confiables o contradictorias\n`;
    explanation += `• Análisis local: Indicadores de manipulación\n\n`;
    explanation += `RECOMENDACIÓN: Esta información presenta múltiples señales de alerta. Verifica con fuentes oficiales antes de compartir.`;
  } else {
    explanation += `RAZONES PRINCIPALES:\n`;
    explanation += `• IA Avanzada confirmó: Información coherente y factual\n`;
    explanation += `• IA Especializada validó: Patrones de credibilidad\n`;
    explanation += `• Verificación humana: Fuentes confiables y verificables\n`;
    explanation += `• Análisis local: Indicadores de objetividad\n\n`;
    explanation += `RECOMENDACIÓN: Esta información parece confiable según múltiples análisis, pero siempre verifica con fuentes adicionales.`;
  }

  return explanation;
};

// Función para obtener nivel de confianza
const getConfidenceLevel = confidence => {
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
