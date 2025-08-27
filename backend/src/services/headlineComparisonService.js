const axios = require("axios");
const { getAnalysisConfig } = require("../config/ai-config");

class HeadlineComparisonService {
  constructor() {
    this.config = getAnalysisConfig();
  }

  async findSimilarHeadlines(title, content, maxResults = 5) {
    try {
      console.log(`🔍 Buscando titulares similares para: "${title}"`);

      const similarHeadlines = [];

      // 1. Búsqueda en Google News
      const googleNewsResults = await this.searchGoogleNews(title);
      similarHeadlines.push(...googleNewsResults);

      // 2. Búsqueda en Google Web
      const googleWebResults = await this.searchGoogleWeb(title);
      similarHeadlines.push(...googleWebResults);

      // 3. Análisis semántico con Gemini
      const semanticAnalysis = await this.analyzeSemanticSimilarity(
        title,
        content,
        similarHeadlines
      );

      // 4. Filtrar y ordenar resultados
      const filteredResults = this.filterAndRankResults(
        similarHeadlines,
        semanticAnalysis
      );

      console.log(
        `✅ Encontrados ${filteredResults.length} titulares similares`
      );
      return filteredResults.slice(0, maxResults);
    } catch (error) {
      console.error("❌ Error buscando titulares similares:", error);
      return [];
    }
  }

  async searchGoogleNews(query) {
    try {
      if (
        !this.config.verification.googleSearchApiKey ||
        !this.config.verification.googleCustomSearchId
      ) {
        console.warn(
          "⚠️ Google Search API no configurada para búsqueda de noticias"
        );
        return [];
      }

      const searchQuery = `${query} news`;
      const url = `https://www.googleapis.com/customsearch/v1`;

      const response = await axios.get(url, {
        params: {
          key: this.config.verification.googleSearchApiKey,
          cx: this.config.verification.googleCustomSearchId,
          q: searchQuery,
          dateRestrict: "m1", // Último mes
          lr: "lang_es", // Español
          num: 10,
          searchType: "news",
        },
        timeout: 10000,
      });

      if (response.data.items) {
        return response.data.items.map((item) => ({
          title: item.title,
          url: item.link,
          snippet: item.snippet,
          source: this.extractDomain(item.link),
          date: item.pagemap?.metatags?.[0]?.["article:published_time"] || null,
          type: "google_news",
        }));
      }

      return [];
    } catch (error) {
      console.error("❌ Error en búsqueda Google News:", error.message);
      return [];
    }
  }

  async searchGoogleWeb(query) {
    try {
      if (
        !this.config.verification.googleSearchApiKey ||
        !this.config.verification.googleCustomSearchId
      ) {
        console.warn("⚠️ Google Search API no configurada para búsqueda web");
        return [];
      }

      const url = `https://www.googleapis.com/customsearch/v1`;

      const response = await axios.get(url, {
        params: {
          key: this.config.verification.googleSearchApiKey,
          cx: this.config.verification.googleCustomSearchId,
          q: query,
          dateRestrict: "m3", // Últimos 3 meses
          lr: "lang_es", // Español
          num: 10,
        },
        timeout: 10000,
      });

      if (response.data.items) {
        return response.data.items.map((item) => ({
          title: item.title,
          url: item.link,
          snippet: item.snippet,
          source: this.extractDomain(item.link),
          date: item.pagemap?.metatags?.[0]?.["article:published_time"] || null,
          type: "google_web",
        }));
      }

      return [];
    } catch (error) {
      console.error("❌ Error en búsqueda Google Web:", error.message);
      return [];
    }
  }

  async analyzeSemanticSimilarity(originalTitle, originalContent, headlines) {
    try {
      if (!this.config.gemini.enabled || !this.config.gemini.apiKey) {
        console.warn("⚠️ Gemini no configurado para análisis semántico");
        return { similarity: [], analysis: "Análisis semántico no disponible" };
      }

      const { GoogleGenerativeAI } = require("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(this.config.gemini.apiKey);
      const model = genAI.getGenerativeModel({
        model: this.config.gemini.model,
      });

      const prompt = `
Analiza la similitud semántica entre el titular original y los titulares encontrados.

TITULAR ORIGINAL: "${originalTitle}"

TITULARES ENCONTRADOS:
${headlines.map((h, i) => `${i + 1}. "${h.title}" (${h.source})`).join("\n")}

INSTRUCCIONES:
1. Evalúa la similitud temática entre el titular original y cada uno encontrado
2. Asigna un puntaje de 0-100 donde:
   - 0-20: No relacionado
   - 21-40: Poco relacionado
   - 41-60: Moderadamente relacionado
   - 61-80: Muy relacionado
   - 81-100: Extremadamente similar
3. Identifica si hay posibles casos de:
   - Noticias duplicadas
   - Desinformación
   - Contradicciones
   - Fuentes confiables vs no confiables

RESPONDE EN FORMATO JSON:
{
  "similarity": [
    {
      "index": 1,
      "score": 85,
      "reason": "Mismo evento, diferentes ángulos",
      "type": "related"
    }
  ],
  "analysis": "Análisis general de similitudes y diferencias",
  "warnings": ["Posibles problemas detectados"],
  "recommendations": ["Recomendaciones para verificación"]
}
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      try {
        const analysis = JSON.parse(text);
        return analysis;
      } catch (parseError) {
        console.error("❌ Error parseando respuesta de Gemini:", parseError);
        return { similarity: [], analysis: text };
      }
    } catch (error) {
      console.error("❌ Error en análisis semántico:", error);
      return { similarity: [], analysis: "Error en análisis semántico" };
    }
  }

  filterAndRankResults(headlines, semanticAnalysis) {
    try {
      // Combinar análisis semántico con resultados
      const enrichedHeadlines = headlines.map((headline, index) => {
        const semanticScore = semanticAnalysis.similarity?.find(
          (s) => s.index === index + 1
        );
        return {
          ...headline,
          semanticScore: semanticScore?.score || 0,
          semanticReason: semanticScore?.reason || "No analizado",
          semanticType: semanticScore?.type || "unknown",
        };
      });

      // Filtrar por relevancia mínima
      const filtered = enrichedHeadlines.filter((h) => h.semanticScore > 20);

      // Ordenar por puntaje semántico descendente
      const ranked = filtered.sort((a, b) => b.semanticScore - a.semanticScore);

      return ranked;
    } catch (error) {
      console.error("❌ Error filtrando resultados:", error);
      return headlines;
    }
  }

  extractDomain(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace("www.", "");
    } catch (error) {
      return "unknown";
    }
  }

  async generateComparisonReport(
    originalTitle,
    originalContent,
    similarHeadlines,
    semanticAnalysis
  ) {
    try {
      if (!this.config.gemini.enabled || !this.config.gemini.apiKey) {
        return {
          summary: "Análisis de comparación no disponible",
          recommendations: ["Configurar Gemini para análisis detallado"],
        };
      }

      const { GoogleGenerativeAI } = require("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(this.config.gemini.apiKey);
      const model = genAI.getGenerativeModel({
        model: this.config.gemini.model,
      });

      const prompt = `
Genera un reporte de comparación detallado para verificar la credibilidad de una noticia.

TITULAR ORIGINAL: "${originalTitle}"

TITULARES SIMILARES ENCONTRADOS:
${similarHeadlines
  .map(
    (h, i) =>
      `${i + 1}. "${h.title}" (${h.source}) - Similitud: ${h.semanticScore}%`
  )
  .join("\n")}

ANÁLISIS SEMÁNTICO: ${semanticAnalysis.analysis || "No disponible"}

INSTRUCCIONES:
1. Analiza la consistencia entre las noticias
2. Identifica posibles contradicciones
3. Evalúa la credibilidad de las fuentes
4. Detecta patrones de desinformación
5. Proporciona recomendaciones específicas

RESPONDE EN FORMATO JSON:
{
  "summary": "Resumen ejecutivo del análisis",
  "consistency": "Evaluación de consistencia entre fuentes",
  "contradictions": ["Contradicciones encontradas"],
  "credibility": "Evaluación de credibilidad general",
  "redFlags": ["Señales de alerta detectadas"],
  "recommendations": ["Recomendaciones específicas"],
  "confidence": 85
}
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      try {
        const report = JSON.parse(text);
        return report;
      } catch (parseError) {
        console.error("❌ Error parseando reporte de Gemini:", parseError);
        return {
          summary: text,
          recommendations: ["Error al generar reporte detallado"],
        };
      }
    } catch (error) {
      console.error("❌ Error generando reporte de comparación:", error);
      return {
        summary: "Error generando reporte de comparación",
        recommendations: ["Verificar configuración de APIs"],
      };
    }
  }
}

module.exports = new HeadlineComparisonService();
