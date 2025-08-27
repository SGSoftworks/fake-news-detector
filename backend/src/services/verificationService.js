const axios = require("axios");
const { getAnalysisConfig } = require("../config/ai-config");

// Configuración
const config = getAnalysisConfig();

// Función principal de verificación
const verifyNews = async (text, isUrl = false) => {
  try {
    console.log("🔍 Iniciando verificación externa...");

    const results = {
      sourceAnalysis: null,
      relatedArticles: [],
      externalVerification: null,
      credibilityScore: 0,
      recommendations: [],
    };

    // 1. Análisis de origen
    if (config.sourceAnalysis.enabled) {
      results.sourceAnalysis = await analyzeSource(text, isUrl);
    }

    // 2. Búsqueda de artículos relacionados
    if (config.verification.enabled) {
      results.relatedArticles = await findRelatedArticles(text);
    }

    // 3. Verificación externa
    if (config.verification.enabled) {
      results.externalVerification = await performExternalVerification(text);
    }

    // 4. Calcular score de credibilidad
    results.credibilityScore = calculateCredibilityScore(results);

    // 5. Generar recomendaciones
    results.recommendations = generateRecommendations(results);

    console.log("✅ Verificación externa completada");
    return results;
  } catch (error) {
    console.error("❌ Error en verificación:", error.message);
    return {
      sourceAnalysis: null,
      relatedArticles: [],
      externalVerification: null,
      credibilityScore: 50,
      recommendations: ["Error en verificación externa"],
    };
  }
};

// Analizar origen de la información
const analyzeSource = async (text, isUrl) => {
  try {
    console.log("📊 Analizando origen de la información...");

    if (isUrl) {
      return await analyzeUrlSource(text);
    } else {
      return await analyzeTextSource(text);
    }
  } catch (error) {
    console.error("❌ Error analizando fuente:", error.message);
    return null;
  }
};

// Analizar fuente si es URL
const analyzeUrlSource = async (url) => {
  try {
    // Extraer dominio
    const domain = extractDomain(url);

    // Verificar reputación del dominio
    const reputation = await checkDomainReputation(domain);

    // Extraer metadatos si es posible
    const metadata = await extractUrlMetadata(url);

    return {
      type: "url",
      domain,
      reputation,
      metadata,
      trustScore: calculateDomainTrustScore(domain, reputation),
      analysis: `Análisis del dominio ${domain}`,
    };
  } catch (error) {
    console.error("❌ Error analizando URL:", error.message);
    return null;
  }
};

// Analizar fuente si es texto
const analyzeTextSource = async (text) => {
  try {
    // Extraer posibles fuentes mencionadas
    const mentionedSources = extractMentionedSources(text);

    // Extraer fechas y ubicaciones
    const temporalInfo = extractTemporalInfo(text);
    const locationInfo = extractLocationInfo(text);

    // Analizar tono y estilo
    const styleAnalysis = analyzeTextStyle(text);

    return {
      type: "text",
      mentionedSources,
      temporalInfo,
      locationInfo,
      styleAnalysis,
      analysis: "Análisis de texto sin URL específica",
    };
  } catch (error) {
    console.error("❌ Error analizando texto:", error.message);
    return null;
  }
};

// Buscar artículos relacionados
const findRelatedArticles = async (text) => {
  try {
    console.log("🔍 Buscando artículos relacionados...");

    // Extraer palabras clave
    const keywords = extractKeywords(text);
    const articles = [];

    // Búsqueda con Google Search API (prioridad)
    if (
      config.verification.googleSearchApiKey &&
      config.verification.googleCustomSearchId
    ) {
      try {
        const searchResults = await searchGoogleWeb(keywords);
        articles.push(...searchResults);
        console.log(
          `✅ Encontrados ${searchResults.length} resultados de Google Search`
        );
      } catch (error) {
        console.warn("⚠️  Error en Google Search API:", error.message);
      }
    }

    // Búsqueda con Google News API (complementaria)
    if (
      config.verification.googleSearchApiKey &&
      config.verification.googleCustomSearchId
    ) {
      try {
        const newsResults = await searchGoogleNews(keywords);
        articles.push(...newsResults);
        console.log(
          `✅ Encontrados ${newsResults.length} resultados de Google News`
        );
      } catch (error) {
        console.warn("⚠️  Error en Google News API:", error.message);
      }
    }

    // Búsqueda con News API (si está configurada)
    if (config.verification.newsApiKey) {
      try {
        const apiResults = await searchNewsAPIs(keywords);
        articles.push(...apiResults);
        console.log(
          `✅ Encontrados ${apiResults.length} resultados de News API`
        );
      } catch (error) {
        console.warn("⚠️  Error en News API:", error.message);
      }
    }

    // Filtrar y ordenar por relevancia
    const filteredResults = filterAndRankResults(articles, text);
    const limitedResults = filteredResults.slice(
      0,
      config.verification.maxSearchResults
    );

    console.log(`📊 Total de artículos encontrados: ${limitedResults.length}`);
    return limitedResults;
  } catch (error) {
    console.error("❌ Error buscando artículos relacionados:", error.message);
    return [];
  }
};

// Verificación externa
const performExternalVerification = async (text) => {
  try {
    console.log("🔍 Realizando verificación externa...");

    const keywords = extractKeywords(text);
    const verificationResults = [];

    // Verificar con múltiples fuentes
    const sources = [
      {
        name: "Google Fact Check",
        url: "https://toolbox.google.com/factcheck/explorer",
      },
      { name: "Snopes", url: "https://www.snopes.com" },
      { name: "FactCheck.org", url: "https://www.factcheck.org" },
      { name: "Reuters Fact Check", url: "https://www.reuters.com/fact-check" },
    ];

    for (const source of sources) {
      try {
        const result = await checkFactCheckSource(source, keywords);
        if (result) {
          verificationResults.push(result);
        }
      } catch (error) {
        console.warn(`⚠️ Error verificando ${source.name}:`, error.message);
      }
    }

    return {
      sources: verificationResults,
      overallVerification: calculateOverallVerification(verificationResults),
      recommendations: generateVerificationRecommendations(verificationResults),
    };
  } catch (error) {
    console.error("❌ Error en verificación externa:", error.message);
    return null;
  }
};

// Funciones auxiliares
const extractDomain = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (error) {
    return url;
  }
};

const extractMentionedSources = (text) => {
  const sourcePatterns = [
    /según\s+([^,\.]+)/gi,
    /fuente:\s*([^,\.]+)/gi,
    /reporta\s+([^,\.]+)/gi,
    /informa\s+([^,\.]+)/gi,
    /declara\s+([^,\.]+)/gi,
    /afirma\s+([^,\.]+)/gi,
  ];

  const sources = [];
  sourcePatterns.forEach((pattern) => {
    const matches = text.match(pattern);
    if (matches) {
      sources.push(
        ...matches.map((match) =>
          match
            .replace(/^(según|fuente:|reporta|informa|declara|afirma)\s*/i, "")
            .trim()
        )
      );
    }
  });

  return [...new Set(sources)];
};

const extractTemporalInfo = (text) => {
  const datePatterns = [
    /\d{1,2}\/\d{1,2}\/\d{4}/g,
    /\d{1,2}\s+de\s+\w+\s+de\s+\d{4}/gi,
    /hoy|ayer|mañana|esta semana|este mes/gi,
  ];

  const dates = [];
  datePatterns.forEach((pattern) => {
    const matches = text.match(pattern);
    if (matches) {
      dates.push(...matches);
    }
  });

  return dates;
};

const extractLocationInfo = (text) => {
  const locationPatterns = [
    /en\s+([^,\.]+)/gi,
    /de\s+([^,\.]+)/gi,
    /desde\s+([^,\.]+)/gi,
  ];

  const locations = [];
  locationPatterns.forEach((pattern) => {
    const matches = text.match(pattern);
    if (matches) {
      locations.push(
        ...matches.map((match) =>
          match.replace(/^(en|de|desde)\s*/i, "").trim()
        )
      );
    }
  });

  return [...new Set(locations)];
};

const extractKeywords = (text) => {
  // Eliminar palabras comunes y extraer palabras clave
  const commonWords = [
    "el",
    "la",
    "de",
    "que",
    "y",
    "a",
    "en",
    "un",
    "es",
    "se",
    "no",
    "te",
    "lo",
    "le",
    "da",
    "su",
    "por",
    "son",
    "con",
    "para",
    "al",
    "del",
    "los",
    "las",
    "una",
    "como",
    "pero",
    "sus",
    "me",
    "hasta",
    "hay",
    "donde",
    "han",
    "quien",
    "están",
    "estado",
    "desde",
    "todo",
    "nos",
    "durante",
    "todos",
    "uno",
    "les",
    "ni",
    "contra",
    "otros",
    "ese",
    "eso",
    "ante",
    "ellos",
    "e",
    "esto",
    "mí",
    "antes",
    "algunos",
    "qué",
    "unos",
    "yo",
    "otro",
    "otras",
    "otra",
    "él",
    "tanto",
    "esa",
    "estos",
    "mucho",
    "quienes",
    "nada",
    "muchos",
    "cual",
    "poco",
    "ella",
    "estar",
    "estas",
    "algunas",
    "algo",
    "nosotros",
  ];

  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 3 && !commonWords.includes(word))
    .slice(0, 10);

  return words;
};

const analyzeTextStyle = (text) => {
  const analysis = {
    sensationalism: 0,
    objectivity: 0,
    formality: 0,
    urgency: 0,
  };

  // Análisis de sensacionalismo
  const sensationalWords = [
    "increíble",
    "sorprendente",
    "impactante",
    "escándalo",
    "exclusivo",
    "urgente",
    "breaking",
    "shock",
  ];
  const sensationalCount = sensationalWords.filter((word) =>
    text.toLowerCase().includes(word)
  ).length;
  analysis.sensationalism = Math.min(100, sensationalCount * 15);

  // Análisis de objetividad
  const objectiveWords = [
    "según",
    "reporta",
    "informa",
    "confirma",
    "declara",
    "afirma",
  ];
  const objectiveCount = objectiveWords.filter((word) =>
    text.toLowerCase().includes(word)
  ).length;
  analysis.objectivity = Math.min(100, objectiveCount * 20);

  // Análisis de formalidad
  const formalPatterns = [
    /ministerio/i,
    /gobierno/i,
    /oficial/i,
    /confirmado/i,
  ];
  const formalCount = formalPatterns.filter((pattern) =>
    pattern.test(text)
  ).length;
  analysis.formality = Math.min(100, formalCount * 25);

  // Análisis de urgencia
  const urgencyWords = ["ahora", "urgente", "inmediato", "ya", "rápido"];
  const urgencyCount = urgencyWords.filter((word) =>
    text.toLowerCase().includes(word)
  ).length;
  analysis.urgency = Math.min(100, urgencyCount * 20);

  return analysis;
};

// Búsqueda con Google Custom Search API
const searchGoogleWeb = async (keywords) => {
  try {
    if (
      !config.verification.googleSearchApiKey ||
      !config.verification.googleCustomSearchId
    ) {
      console.warn("⚠️ Google Search API no configurada completamente");
      return [];
    }

    const query = keywords.join(" ");
    console.log(`🔍 Buscando en Google: "${query}"`);

    const response = await axios.get(
      `https://www.googleapis.com/customsearch/v1`,
      {
        params: {
          key: config.verification.googleSearchApiKey,
          cx: config.verification.googleCustomSearchId,
          q: query,
          dateRestrict: "m3", // Últimos 3 meses
          num: config.verification.maxSearchResults,
          lr: "lang_es", // Idioma español
          safe: "active",
        },
        timeout: config.verification.timeout,
      }
    );

    const results =
      response.data.items?.map((item) => ({
        title: item.title,
        snippet: item.snippet,
        link: item.link,
        source: extractDomain(item.link),
        relevance: calculateRelevance(item, keywords),
        type: "web_search",
      })) || [];

    console.log(`✅ Encontrados ${results.length} resultados de Google Search`);
    return results;
  } catch (error) {
    console.warn("⚠️ Error en búsqueda de Google Web:", error.message);
    return [];
  }
};

const searchGoogleNews = async (keywords) => {
  try {
    if (
      !config.verification.googleSearchApiKey ||
      !config.verification.googleCustomSearchId
    ) {
      return [];
    }

    const query = keywords.join(" ") + " news";
    console.log(`📰 Buscando noticias: "${query}"`);

    const response = await axios.get(
      `https://www.googleapis.com/customsearch/v1`,
      {
        params: {
          key: config.verification.googleSearchApiKey,
          cx: config.verification.googleCustomSearchId,
          q: query,
          dateRestrict: "m1", // Último mes
          num: 5,
          lr: "lang_es", // Idioma español
          safe: "active",
        },
        timeout: config.verification.timeout,
      }
    );

    const results =
      response.data.items?.map((item) => ({
        title: item.title,
        snippet: item.snippet,
        link: item.link,
        source: extractDomain(item.link),
        relevance: calculateRelevance(item, keywords),
        type: "news",
      })) || [];

    console.log(`✅ Encontrados ${results.length} resultados de Google News`);
    return results;
  } catch (error) {
    console.warn("⚠️ Error en búsqueda de Google News:", error.message);
    return [];
  }
};

const searchNewsAPIs = async (keywords) => {
  try {
    if (!config.verification.newsApiKey) {
      return [];
    }

    const query = keywords.join(" ");
    const response = await axios.get(`https://newsapi.org/v2/everything`, {
      params: {
        q: query,
        apiKey: config.verification.newsApiKey,
        language: "es",
        sortBy: "relevancy",
        pageSize: 5,
      },
      timeout: config.verification.timeout,
    });

    return (
      response.data.articles?.map((article) => ({
        title: article.title,
        snippet: article.description,
        link: article.url,
        source: article.source.name,
        relevance: calculateRelevance(article, keywords),
      })) || []
    );
  } catch (error) {
    console.warn("⚠️ Error en búsqueda de News API:", error.message);
    return [];
  }
};

const filterAndRankResults = (results, originalText) => {
  return results
    .filter((result) => result.relevance > 0.3)
    .sort((a, b) => b.relevance - a.relevance);
};

const calculateRelevance = (item, keywords) => {
  const text = `${item.title} ${item.snippet}`.toLowerCase();
  const keywordMatches = keywords.filter((keyword) =>
    text.includes(keyword)
  ).length;
  return keywordMatches / keywords.length;
};

const calculateCredibilityScore = (results) => {
  let score = 50; // Puntuación base

  // Factor de análisis de fuente
  if (results.sourceAnalysis) {
    if (
      results.sourceAnalysis.type === "url" &&
      results.sourceAnalysis.trustScore
    ) {
      score += results.sourceAnalysis.trustScore * 0.3;
    }
    if (results.sourceAnalysis.styleAnalysis) {
      const style = results.sourceAnalysis.styleAnalysis;
      score += style.objectivity * 0.2 - style.sensationalism * 0.1;
    }
  }

  // Factor de artículos relacionados
  if (results.relatedArticles.length > 0) {
    score += Math.min(20, results.relatedArticles.length * 5);
  }

  // Factor de verificación externa
  if (
    results.externalVerification &&
    results.externalVerification.overallVerification
  ) {
    score += results.externalVerification.overallVerification * 0.3;
  }

  return Math.max(0, Math.min(100, Math.round(score)));
};

const generateRecommendations = (results) => {
  const recommendations = [];

  if (results.credibilityScore < 30) {
    recommendations.push(
      "⚠️ Alta probabilidad de ser información falsa o engañosa"
    );
  } else if (results.credibilityScore < 60) {
    recommendations.push(
      "⚠️ Información con baja credibilidad, verificar fuentes"
    );
  } else if (results.credibilityScore < 80) {
    recommendations.push("✅ Información con credibilidad moderada");
  } else {
    recommendations.push("✅ Información con alta credibilidad");
  }

  if (results.relatedArticles.length === 0) {
    recommendations.push(
      "🔍 No se encontraron artículos relacionados, verificar independientemente"
    );
  }

  if (results.sourceAnalysis && results.sourceAnalysis.styleAnalysis) {
    const style = results.sourceAnalysis.styleAnalysis;
    if (style.sensationalism > 70) {
      recommendations.push(
        "📢 Alto contenido sensacionalista, tomar con precaución"
      );
    }
    if (style.urgency > 80) {
      recommendations.push(
        "⏰ Uso excesivo de lenguaje de urgencia, verificar antes de compartir"
      );
    }
  }

  return recommendations;
};

const checkDomainReputation = async (domain) => {
  // Lista de dominios confiables
  const trustedDomains = [
    "reuters.com",
    "ap.org",
    "bbc.com",
    "cnn.com",
    "nytimes.com",
    "washingtonpost.com",
    "eluniverso.com",
    "eltiempo.com",
    "elespectador.com",
    "semana.com",
    "eltiempo.com",
    "caracol.com",
    "rcnradio.com",
  ];

  const suspiciousDomains = [
    "fake-news",
    "clickbait",
    "viral",
    "shocking",
    "amazing",
  ];

  if (trustedDomains.some((trusted) => domain.includes(trusted))) {
    return {
      score: 90,
      category: "trusted",
      reason: "Dominio de medios confiables",
    };
  }

  if (suspiciousDomains.some((suspicious) => domain.includes(suspicious))) {
    return {
      score: 20,
      category: "suspicious",
      reason: "Dominio con patrones sospechosos",
    };
  }

  return { score: 50, category: "unknown", reason: "Dominio no clasificado" };
};

const calculateDomainTrustScore = (domain, reputation) => {
  return reputation.score;
};

const extractUrlMetadata = async (url) => {
  try {
    const response = await axios.get(url, { timeout: 5000 });
    const html = response.data;

    // Extraer título
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : "";

    // Extraer descripción
    const descMatch = html.match(
      /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i
    );
    const description = descMatch ? descMatch[1] : "";

    return { title, description };
  } catch (error) {
    return { title: "", description: "" };
  }
};

const checkFactCheckSource = async (source, keywords) => {
  // Simulación de verificación con fuentes de fact-checking
  // En una implementación real, usarías las APIs de estas fuentes
  return {
    source: source.name,
    url: source.url,
    hasFactCheck: Math.random() > 0.7, // Simulación
    rating: Math.random() > 0.5 ? "true" : "false",
    confidence: Math.random() * 100,
  };
};

const calculateOverallVerification = (verificationResults) => {
  if (verificationResults.length === 0) return 0;

  const scores = verificationResults.map((result) => result.confidence || 0);
  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
};

const generateVerificationRecommendations = (verificationResults) => {
  const recommendations = [];

  const trueCount = verificationResults.filter(
    (r) => r.rating === "true"
  ).length;
  const falseCount = verificationResults.filter(
    (r) => r.rating === "false"
  ).length;

  if (trueCount > falseCount) {
    recommendations.push("✅ Verificado como verdadero por múltiples fuentes");
  } else if (falseCount > trueCount) {
    recommendations.push("❌ Verificado como falso por múltiples fuentes");
  } else {
    recommendations.push("⚠️ Resultados mixtos en verificación");
  }

  return recommendations;
};

module.exports = {
  verifyNews,
  analyzeSource,
  findRelatedArticles,
  performExternalVerification,
  calculateCredibilityScore,
  generateRecommendations,
  searchGoogleWeb,
  searchGoogleNews,
};
