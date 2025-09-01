const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Configuración de APIs
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GOOGLE_SEARCH_API_KEY = process.env.GOOGLE_SEARCH_API_KEY;
const GOOGLE_CUSTOM_SEARCH_ID = process.env.GOOGLE_CUSTOM_SEARCH_ID;

// Pesos de análisis
const LOCAL_WEIGHT = parseFloat(process.env.LOCAL_WEIGHT) || 0.2;
const HUGGINGFACE_WEIGHT = parseFloat(process.env.HUGGINGFACE_WEIGHT) || 0.3;
const GEMINI_WEIGHT = parseFloat(process.env.GEMINI_WEIGHT) || 0.5;

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    message: 'Fake News Detector Backend API',
    version: '1.0.0',
    status: 'running',
    apis: {
      huggingface: !!HUGGINGFACE_API_KEY,
      gemini: !!GEMINI_API_KEY,
      googleSearch: !!GOOGLE_SEARCH_API_KEY
    }
  });
});

// Análisis de texto
app.post('/api/analyze/text', async (req, res) => {
  try {
    const { text, useHuggingFace = true, useGemini = true, useVerification = true } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Texto requerido' });
    }

    console.log('Analizando texto:', text.substring(0, 100) + '...');

    const results = {
      text: text.substring(0, 200) + '...',
      timestamp: new Date().toISOString(),
      analysis: {}
    };

    // Análisis local (métricas básicas)
    if (LOCAL_WEIGHT > 0) {
      results.analysis.local = await performLocalAnalysis(text);
    }

    // Análisis con Hugging Face
    if (useHuggingFace && HUGGINGFACE_API_KEY && HUGGINGFACE_WEIGHT > 0) {
      try {
        results.analysis.huggingface = await performHuggingFaceAnalysis(text);
      } catch (error) {
        console.error('Error en Hugging Face:', error.message);
        results.analysis.huggingface = { error: error.message };
      }
    }

    // Análisis con Gemini
    if (useGemini && GEMINI_API_KEY && GEMINI_WEIGHT > 0) {
      try {
        results.analysis.gemini = await performGeminiAnalysis(text);
      } catch (error) {
        console.error('Error en Gemini:', error.message);
        results.analysis.gemini = { error: error.message };
      }
    }

    // Verificación externa
    if (useVerification && GOOGLE_SEARCH_API_KEY) {
      try {
        results.verification_results = await performExternalVerification(text);
      } catch (error) {
        console.error('Error en verificación:', error.message);
        results.verification_results = { error: error.message };
      }
    }

    // Cálculo de probabilidad combinada
    results.ai_probability = calculateCombinedProbability(results.analysis);
    results.confidence = calculateConfidence(results.analysis);
    results.human_probability = 1 - results.ai_probability;

    // Palabras clave extraídas
    results.keywords = extractKeywords(text);

    res.json(results);

  } catch (error) {
    console.error('Error en análisis de texto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Análisis local (métricas estadísticas)
async function performLocalAnalysis(text) {
  const words = text.split(/\s+/).filter(word => word.length > 0);
  const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
  
  // Métricas de complejidad
  const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
  const avgSentenceLength = words.length / sentences.length;
  
  // Detección de patrones repetitivos
  const wordFrequency = {};
  words.forEach(word => {
    const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
    if (cleanWord.length > 3) {
      wordFrequency[cleanWord] = (wordFrequency[cleanWord] || 0) + 1;
    }
  });
  
  const repetitiveWords = Object.entries(wordFrequency)
    .filter(([_, count]) => count > 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return {
    metrics: {
      wordCount: words.length,
      sentenceCount: sentences.length,
      avgWordLength: Math.round(avgWordLength * 100) / 100,
      avgSentenceLength: Math.round(avgSentenceLength * 100) / 100
    },
    patterns: {
      repetitiveWords,
      complexity: avgWordLength > 6 ? 'high' : avgWordLength > 4 ? 'medium' : 'low'
    }
  };
}

// Análisis con Hugging Face
async function performHuggingFaceAnalysis(text) {
  try {
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${process.env.HUGGINGFACE_MODEL || 'nlptown/bert-base-multilingual-uncased-sentiment'}`,
      { inputs: text },
      {
        headers: {
          'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: parseInt(process.env.HUGGINGFACE_TIMEOUT) || 15000
      }
    );

    return {
      model: process.env.HUGGINGFACE_MODEL || 'nlptown/bert-base-multilingual-uncased-sentiment',
      results: response.data,
      confidence: response.data[0]?.score || 0
    };
  } catch (error) {
    throw new Error(`Error en Hugging Face: ${error.message}`);
  }
}

// Análisis con Gemini
async function performGeminiAnalysis(text) {
  try {
    const prompt = `Analiza el siguiente texto y determina si fue generado por IA o escrito por un humano. 
    Responde en formato JSON con: {"ai_probability": 0.75, "reasoning": "explicación", "confidence": 0.85}
    
    Texto: "${text.substring(0, 1000)}"`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${process.env.GEMINI_MODEL || 'gemini-1.5-flash'}:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      },
      {
        timeout: parseInt(process.env.GEMINI_TIMEOUT) || 12000
      }
    );

    const result = response.data.candidates[0]?.content?.parts[0]?.text;
    
    try {
      const parsed = JSON.parse(result);
      return {
        model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
        ai_probability: parsed.ai_probability || 0.5,
        reasoning: parsed.reasoning || 'Análisis no disponible',
        confidence: parsed.confidence || 0.5
      };
    } catch (parseError) {
      return {
        model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
        ai_probability: 0.5,
        reasoning: result || 'Análisis no disponible',
        confidence: 0.5
      };
    }
  } catch (error) {
    throw new Error(`Error en Gemini: ${error.message}`);
  }
}

// Verificación externa con Google Search
async function performExternalVerification(text) {
  try {
    const query = text.split(' ').slice(0, 5).join(' ');
    const response = await axios.get(
      `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_SEARCH_API_KEY}&cx=${GOOGLE_CUSTOM_SEARCH_ID}&q=${encodeURIComponent(query)}&num=5`
    );

    return {
      searchQuery: query,
      results: response.data.items?.map(item => ({
        title: item.title,
        snippet: item.snippet,
        link: item.link
      })) || [],
      totalResults: response.data.searchInformation?.totalResults || 0
    };
  } catch (error) {
    throw new Error(`Error en verificación externa: ${error.message}`);
  }
}

// Cálculo de probabilidad combinada
function calculateCombinedProbability(analysis) {
  let totalWeight = 0;
  let weightedSum = 0;

  if (analysis.local && LOCAL_WEIGHT > 0) {
    // Métrica basada en complejidad y patrones
    const localScore = analysis.local.patterns.complexity === 'high' ? 0.3 : 
                      analysis.local.patterns.complexity === 'medium' ? 0.5 : 0.7;
    weightedSum += localScore * LOCAL_WEIGHT;
    totalWeight += LOCAL_WEIGHT;
  }

  if (analysis.huggingface && !analysis.huggingface.error && HUGGINGFACE_WEIGHT > 0) {
    // Convertir resultado de Hugging Face a probabilidad
    const hfScore = analysis.huggingface.confidence || 0.5;
    weightedSum += hfScore * HUGGINGFACE_WEIGHT;
    totalWeight += HUGGINGFACE_WEIGHT;
  }

  if (analysis.gemini && !analysis.gemini.error && GEMINI_WEIGHT > 0) {
    weightedSum += (analysis.gemini.ai_probability || 0.5) * GEMINI_WEIGHT;
    totalWeight += GEMINI_WEIGHT;
  }

  return totalWeight > 0 ? weightedSum / totalWeight : 0.5;
}

// Cálculo de confianza
function calculateConfidence(analysis) {
  let totalConfidence = 0;
  let validAnalyses = 0;

  if (analysis.huggingface && !analysis.huggingface.error) {
    totalConfidence += analysis.huggingface.confidence || 0;
    validAnalyses++;
  }

  if (analysis.gemini && !analysis.gemini.error) {
    totalConfidence += analysis.gemini.confidence || 0;
    validAnalyses++;
  }

  return validAnalyses > 0 ? totalConfidence / validAnalyses : 0.5;
}

// Extracción de palabras clave
function extractKeywords(text) {
  const words = text.toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 4)
    .map(word => word.replace(/[^\w]/g, ''))
    .filter(word => word.length > 0);

  const wordFrequency = {};
  words.forEach(word => {
    wordFrequency[word] = (wordFrequency[word] || 0) + 1;
  });

  return Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word, _]) => word);
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Manejo de errores
app.use((error, req, res, next) => {
  console.error('Error no manejado:', error);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend ejecutándose en puerto ${PORT}`);
  console.log(`📊 APIs disponibles:`);
  console.log(`   - Hugging Face: ${HUGGINGFACE_API_KEY ? '✅' : '❌'}`);
  console.log(`   - Gemini: ${GEMINI_API_KEY ? '✅' : '❌'}`);
  console.log(`   - Google Search: ${GOOGLE_SEARCH_API_KEY ? '✅' : '❌'}`);
  console.log(`🔗 CORS Origin: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
});

module.exports = app;
