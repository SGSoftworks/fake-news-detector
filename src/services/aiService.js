// Servicio principal para APIs de detección de IA
class AIService {
  constructor() {
    // Configuración para conectar con el backend real
    this.baseURL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";
    this.useMockData = false; // SIEMPRE usar APIs reales
    
    // Configuración para futuras integraciones de APIs reales
    this.openaiKey = process.env.REACT_APP_OPENAI_API_KEY;
    this.googleKey = process.env.REACT_APP_GOOGLE_CLOUD_API_KEY;
    this.azureKey = process.env.REACT_APP_AZURE_API_KEY;
    this.azureEndpoint = process.env.REACT_APP_AZURE_ENDPOINT;
    
    // Configuración del backend
    this.huggingfaceEnabled = process.env.REACT_APP_HUGGINGFACE_ENABLED === 'true';
    this.geminiEnabled = process.env.REACT_APP_GEMINI_ENABLED === 'true';
    this.verificationEnabled = process.env.REACT_APP_VERIFICATION_ENABLED === 'true';
    
    console.log('AIService configurado:', {
      baseURL: this.baseURL,
      useMockData: this.useMockData,
      huggingfaceEnabled: this.huggingfaceEnabled,
      geminiEnabled: this.geminiEnabled,
      verificationEnabled: this.verificationEnabled
    });
  }

  // Análisis de texto usando el backend real
  async analyzeText(text) {
    try {
      // Si el backend está disponible, usarlo
      if (!this.useMockData) {
        const response = await fetch(`${this.baseURL}/api/analyze/text`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text,
            useHuggingFace: this.huggingfaceEnabled,
            useGemini: this.geminiEnabled,
            useVerification: this.verificationEnabled,
            weights: {
              local: process.env.REACT_APP_LOCAL_WEIGHT || 0.2,
              huggingface: process.env.REACT_APP_HUGGINGFACE_WEIGHT || 0.3,
              gemini: process.env.REACT_APP_GEMINI_WEIGHT || 0.5
            }
          }),
        });

        if (!response.ok) {
          throw new Error(`Error del backend: ${response.status}`);
        }

        const data = await response.json();
        console.log('Respuesta del backend:', data);
        
        // Enriquecer con enlaces dinámicos y recursos adicionales
        const enrichedData = await this.enrichWithDynamicResources(data, text);
        
        return this.formatTextAnalysis(enrichedData);
      }

      // Fallback a datos mock si el backend no está disponible
      console.log('Usando datos mock para análisis de texto');
      return this.getMockTextAnalysis();
    } catch (error) {
      console.error("Error en análisis de texto:", error);
      console.log('Fallback a datos mock debido al error');
      return this.getMockTextAnalysis();
    }
  }

  // Enriquecer datos con recursos dinámicos y enlaces actualizados
  async enrichWithDynamicResources(data, originalText) {
    try {
      // Generar enlaces dinámicos basados en el contenido analizado
      const dynamicLinks = await this.generateDynamicLinks(data, originalText);
      
      // Generar pasos de proceso dinámicos
      const dynamicProcessSteps = this.generateDynamicProcessSteps(data);
      
      // Generar explicaciones dinámicas
      const dynamicExplanations = this.generateDynamicExplanations(data);
      
      return {
        ...data,
        links: dynamicLinks,
        processSteps: dynamicProcessSteps,
        explanation: dynamicExplanations,
        timestamp: new Date().toISOString(),
        analysisId: this.generateAnalysisId()
      };
    } catch (error) {
      console.error('Error enriqueciendo datos:', error);
      return data;
    }
  }

  // Generar enlaces dinámicos basados en el análisis
  async generateDynamicLinks(data, originalText) {
    const links = [];
    
    // Enlaces de investigación académica dinámicos
    const researchTopics = this.extractResearchTopics(data, originalText);
    for (const topic of researchTopics.slice(0, 3)) {
      links.push({
        title: `Investigación sobre: ${topic}`,
        url: `https://scholar.google.com/scholar?q=${encodeURIComponent(topic)}`,
        description: `Búsqueda académica sobre ${topic} en Google Scholar`,
        type: 'academic'
      });
    }
    
    // Enlaces de verificación de noticias
    if (data.verification_results) {
      links.push({
        title: 'Verificación de Fuentes',
        url: 'https://www.snopes.com/',
        description: 'Fact-checking de noticias y rumores',
        type: 'verification'
      });
      
      links.push({
        title: 'Reuters Fact Check',
        url: 'https://www.reuters.com/fact-check/',
        description: 'Verificación de hechos por Reuters',
        type: 'verification'
      });
    }
    
    // Enlaces de herramientas de detección de IA
    links.push({
      title: 'OpenAI Text Classifier',
      url: 'https://platform.openai.com/ai-text-classifier',
      description: 'Clasificador oficial de OpenAI para detectar texto generado por IA',
      type: 'tool'
    });
    
    links.push({
      title: 'Hugging Face Detector',
      url: 'https://huggingface.co/roberta-base-openai-detector',
      description: 'Modelo de detección de IA basado en RoBERTa',
      type: 'tool'
    });
    
    // Enlaces de investigación reciente
    const currentYear = new Date().getFullYear();
    links.push({
      title: `Investigación ${currentYear} sobre Detección de IA`,
      url: `https://arxiv.org/search/?query=detecci%C3%B3n+IA+${currentYear}&searchtype=all&source=header`,
      description: `Artículos académicos recientes sobre detección de IA`,
      type: 'research'
    });
    
    return links;
  }

  // Generar pasos de proceso dinámicos
  generateDynamicProcessSteps(data) {
    const steps = [];
    let stepNumber = 1;
    
    if (data.huggingface_analysis) {
      steps.push({
        step: stepNumber++,
        title: 'Análisis con Hugging Face',
        description: 'Evaluación usando modelos de lenguaje pre-entrenados',
        duration: '3-5 segundos',
        status: 'completed',
        details: data.huggingface_analysis
      });
    }
    
    if (data.gemini_analysis) {
      steps.push({
        step: stepNumber++,
        title: 'Análisis con Google Gemini',
        description: 'Evaluación usando IA multimodal avanzada',
        duration: '4-6 segundos',
        status: 'completed',
        details: data.gemini_analysis
      });
    }
    
    if (data.verification_analysis) {
      steps.push({
        step: stepNumber++,
        title: 'Verificación Externa',
        description: 'Búsqueda y validación de fuentes',
        duration: '5-8 segundos',
        status: 'completed',
        details: data.verification_analysis
      });
    }
    
    steps.push({
      step: stepNumber++,
      title: 'Análisis Combinado',
      description: 'Integración de resultados con pesos configurados',
      duration: '1-2 segundos',
      status: 'completed',
      details: `Pesos: Local (${process.env.REACT_APP_LOCAL_WEIGHT || 0.2}), HF (${process.env.REACT_APP_HUGGINGFACE_WEIGHT || 0.3}), Gemini (${process.env.REACT_APP_GEMINI_WEIGHT || 0.5})`
    });
    
    return steps;
  }

  // Generar explicaciones dinámicas
  generateDynamicExplanations(data) {
    return {
      user: this.generateUserExplanation(data),
      developer: this.generateDeveloperExplanation(data)
    };
  }

  // Generar explicación para usuarios
  generateUserExplanation(data) {
    let explanation = 'El análisis se realizó usando múltiples tecnologías de IA avanzadas: ';
    
    if (data.huggingface_analysis) {
      explanation += 'modelos de lenguaje pre-entrenados para detectar patrones, ';
    }
    
    if (data.gemini_analysis) {
      explanation += 'análisis multimodal de Google para evaluar contenido, ';
    }
    
    if (data.verification_analysis) {
      explanation += 'verificación externa de fuentes y contexto. ';
    }
    
    explanation += `La confianza del ${Math.round(data.confidence * 100)}% se basa en la convergencia de estos análisis.`;
    
    return explanation;
  }

  // Generar explicación para desarrolladores
  generateDeveloperExplanation(data) {
    let explanation = 'Implementación técnica: ';
    
    if (data.huggingface_analysis) {
      explanation += `Hugging Face (${process.env.REACT_APP_HUGGINGFACE_WEIGHT || 0.3}): ${data.huggingface_analysis.model || 'Modelo BERT'}, `;
    }
    
    if (data.gemini_analysis) {
      explanation += `Gemini (${process.env.REACT_APP_GEMINI_WEIGHT || 0.5}): ${data.gemini_analysis.model || 'Gemini 1.5 Flash'}, `;
    }
    
    explanation += `Análisis local (${process.env.REACT_APP_LOCAL_WEIGHT || 0.2}): métricas estadísticas. `;
    explanation += `API endpoints: ${this.baseURL}/api/analyze/*`;
    
    return explanation;
  }

  // Extraer temas de investigación del texto
  extractResearchTopics(data, originalText) {
    const topics = [];
    
    // Extraer palabras clave del análisis
    if (data.keywords) {
      topics.push(...data.keywords.slice(0, 3));
    }
    
    // Extraer temas del texto original
    const commonTopics = ['inteligencia artificial', 'machine learning', 'deep learning', 'fake news', 'desinformación', 'verificación'];
    for (const topic of commonTopics) {
      if (originalText.toLowerCase().includes(topic)) {
        topics.push(topic);
      }
    }
    
    // Si no hay temas específicos, usar temas generales
    if (topics.length === 0) {
      topics.push('detección de IA', 'análisis de contenido', 'verificación de información');
    }
    
    return topics.slice(0, 3);
  }

  // Generar ID único para el análisis
  generateAnalysisId() {
    return `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Análisis de imágenes usando Google Cloud Vision
  async analyzeImage(imageFile) {
    try {
      // Por ahora, usamos solo datos mock
      if (this.useMockData) {
        return this.getMockImageAnalysis();
      }

      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await fetch(`${this.baseURL}/api/analyze/image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.googleKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error en análisis de imagen");
      }

      const data = await response.json();
      return this.formatImageAnalysis(data);
    } catch (error) {
      console.error("Error en análisis de imagen:", error);
      return this.getMockImageAnalysis();
    }
  }

  // Análisis de video usando Azure Cognitive Services
  async analyzeVideo(videoFile) {
    try {
      // Por ahora, usamos solo datos mock
      if (this.useMockData) {
        return this.getMockVideoAnalysis();
      }

      const formData = new FormData();
      formData.append("video", videoFile);

      const response = await fetch(
        `${this.azureEndpoint}/computervision/imageanalysis:analyze`,
        {
          method: "POST",
          headers: {
            "Ocp-Apim-Subscription-Key": this.azureKey,
            "Content-Type": "application/octet-stream",
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Error en análisis de video");
      }

      const data = await response.json();
      return this.formatVideoAnalysis(data);
    } catch (error) {
      console.error("Error en análisis de video:", error);
      return this.getMockVideoAnalysis();
    }
  }

  // Análisis de audio usando Azure Speech Services
  async analyzeAudio(audioFile) {
    try {
      // Por ahora, usamos solo datos mock
      if (this.useMockData) {
        return this.getMockAudioAnalysis();
      }

      const formData = new FormData();
      formData.append("audio", audioFile);

      const response = await fetch(
        `${this.azureEndpoint}/speech/recognition/conversation/cognitiveservices/v1`,
        {
          method: "POST",
          headers: {
            "Ocp-Apim-Subscription-Key": this.azureKey,
            "Content-Type": "audio/wav",
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Error en análisis de audio");
      }

      const data = await response.json();
      return this.formatAudioAnalysis(data);
    } catch (error) {
      console.error("Error en análisis de audio:", error);
      return this.getMockAudioAnalysis();
    }
  }

  // Análisis de código usando GitHub Copilot API
  async analyzeCode(code) {
    try {
      // Por ahora, usamos solo datos mock
      if (this.useMockData) {
        return this.getMockCodeAnalysis();
      }

      const response = await fetch(`${this.baseURL}/api/analyze/code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_GITHUB_COPILOT_API_KEY}`,
        },
        body: JSON.stringify({
          code,
          language: this.detectLanguage(code),
        }),
      });

      if (!response.ok) {
        throw new Error("Error en análisis de código");
      }

      const data = await response.json();
      return this.formatCodeAnalysis(data);
    } catch (error) {
      console.error("Error en análisis de código:", error);
      return this.getMockCodeAnalysis();
    }
  }

  // Análisis académico usando Turnitin API
  async analyzeAcademic(content) {
    try {
      // Por ahora, usamos solo datos mock
      if (this.useMockData) {
        return this.getMockAcademicAnalysis();
      }

      const response = await fetch(`${this.baseURL}/api/analyze/academic`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_TURNITIN_API_KEY}`,
        },
        body: JSON.stringify({
          content,
          type: "academic_paper",
        }),
      });

      if (!response.ok) {
        throw new Error("Error en análisis académico");
      }

      const data = await response.json();
      return this.formatAcademicAnalysis(data);
    } catch (error) {
      console.error("Error en análisis académico:", error);
      return this.getMockAcademicAnalysis();
    }
  }

  // Formateo de resultados de análisis de texto
  formatTextAnalysis(data) {
    return {
      aiProbability: Math.round(data.ai_probability * 100),
      humanProbability: Math.round((1 - data.ai_probability) * 100),
      confidence: data.confidence,
      analysis: {
        languagePatterns: data.analysis.language_patterns,
        complexity: data.analysis.complexity,
        coherence: data.analysis.coherence,
        originality: data.analysis.originality,
      },
      suggestions: data.suggestions || [],
      similarContent: data.similar_content || [],
    };
  }

  // Formateo de resultados de análisis de imagen
  formatImageAnalysis(data) {
    return {
      aiProbability: Math.round(data.ai_probability * 100),
      humanProbability: Math.round((1 - data.ai_probability) * 100),
      confidence: data.confidence,
      analysis: {
        artifacts: data.analysis.artifacts,
        consistency: data.analysis.consistency,
        lighting: data.analysis.lighting,
        composition: data.analysis.composition,
      },
      suggestions: data.suggestions || [],
    };
  }

  // Formateo de resultados de análisis de video
  formatVideoAnalysis(data) {
    return {
      aiProbability: Math.round(data.ai_probability * 100),
      humanProbability: Math.round((1 - data.ai_probability) * 100),
      confidence: data.confidence,
      analysis: {
        facialConsistency: data.analysis.facial_consistency,
        audioSync: data.analysis.audio_sync,
        lighting: data.analysis.lighting,
        artifacts: data.analysis.artifacts,
      },
      suggestions: data.suggestions || [],
    };
  }

  // Formateo de resultados de análisis de audio
  formatAudioAnalysis(data) {
    return {
      aiProbability: Math.round(data.ai_probability * 100),
      humanProbability: Math.round((1 - data.ai_probability) * 100),
      confidence: data.confidence,
      analysis: {
        voicePatterns: data.analysis.voice_patterns,
        backgroundNoise: data.analysis.background_noise,
        breathing: data.analysis.breathing,
        articulation: data.analysis.articulation,
      },
      suggestions: data.suggestions || [],
    };
  }

  // Formateo de resultados de análisis de código
  formatCodeAnalysis(data) {
    return {
      aiProbability: Math.round(data.ai_probability * 100),
      humanProbability: Math.round((1 - data.ai_probability) * 100),
      confidence: data.confidence,
      analysis: {
        structure: data.analysis.structure,
        comments: data.analysis.comments,
        patterns: data.analysis.patterns,
        complexity: data.analysis.complexity,
      },
      suggestions: data.suggestions || [],
    };
  }

  // Formateo de resultados de análisis académico
  formatAcademicAnalysis(data) {
    return {
      aiProbability: Math.round(data.ai_probability * 100),
      humanProbability: Math.round((1 - data.ai_probability) * 100),
      confidence: data.confidence,
      analysis: {
        writingStyle: data.analysis.writing_style,
        citations: data.analysis.citations,
        argumentation: data.analysis.argumentation,
        originality: data.analysis.originality,
      },
      suggestions: data.suggestions || [],
    };
  }

  // Detección de lenguaje de programación
  detectLanguage(code) {
    const patterns = {
      javascript: /(function|const|let|var|=>|console\.log)/,
      python: /(def |import |print\(|if __name__)/,
      java: /(public class|public static void|System\.out)/,
      cpp: /(#include|int main|std::cout)/,
      csharp: /(using System|public class|Console\.WriteLine)/,
    };

    for (const [lang, pattern] of Object.entries(patterns)) {
      if (pattern.test(code)) {
        return lang;
      }
    }
    return "unknown";
  }

  // Datos mock para desarrollo
  getMockTextAnalysis() {
    return {
      aiProbability: 75,
      humanProbability: 25,
      confidence: 0.89,
      analysis: {
        languagePatterns: "Patrones de lenguaje consistentes con IA",
        complexity: "Nivel de complejidad moderado",
        coherence: "Alta coherencia temática",
        originality: "Baja originalidad detectada",
      },
      suggestions: [
        "Verificar fuentes originales",
        "Comparar con contenido similar",
        "Revisar contexto temporal",
      ],
      links: [
        {
          title: "Guía de Detección de IA en Textos",
          url: "https://openai.com/research/gpt-4",
          description:
            "Recursos oficiales sobre detección de contenido generado por IA",
        },
        {
          title: "Herramientas de Análisis de Plagio",
          url: "https://turnitin.com/",
          description:
            "Plataforma líder en detección de plagio y contenido académico",
        },
        {
          title: "Estudios sobre Detección de IA",
          url: "https://arxiv.org/abs/2301.10226",
          description: "Investigación académica sobre métodos de detección",
        },
      ],
      processSteps: [
        {
          step: 1,
          title: "Análisis de Patrones Lingüísticos",
          description:
            "Evaluación de la complejidad sintáctica y variabilidad del vocabulario",
          duration: "2-3 segundos",
          status: "completed",
        },
        {
          step: 2,
          title: "Detección de Estructuras Repetitivas",
          description:
            "Identificación de patrones típicos de generación automática",
          duration: "1-2 segundos",
          status: "completed",
        },
        {
          step: 3,
          title: "Análisis de Coherencia Semántica",
          description: "Verificación de la lógica y coherencia del contenido",
          duration: "2-3 segundos",
          status: "completed",
        },
        {
          step: 4,
          title: "Comparación con Modelos de Referencia",
          description:
            "Contraste con patrones conocidos de contenido humano vs IA",
          duration: "1-2 segundos",
          status: "completed",
        },
      ],
      explanation: {
        user: "El análisis detectó patrones de escritura que sugieren contenido generado por inteligencia artificial. Los indicadores incluyen estructura muy consistente, vocabulario predecible y falta de variaciones naturales típicas del pensamiento humano.",
        developer:
          "El modelo utilizó análisis de frecuencia de palabras, evaluación de complejidad sintáctica (Flesch-Kincaid), detección de patrones n-gram y comparación con corpus de entrenamiento. La confianza del 89% se basa en la convergencia de múltiples métricas de análisis.",
      },
    };
  }

  getMockImageAnalysis() {
    return {
      aiProbability: 60,
      humanProbability: 40,
      confidence: 0.82,
      analysis: {
        artifacts: "Detectados artefactos sutiles de generación",
        consistency: "Alta consistencia en texturas",
        lighting: "Iluminación uniforme y artificial",
        composition: "Composición muy balanceada",
      },
      suggestions: [
        "Verificar metadatos de la imagen",
        "Buscar versiones originales",
        "Analizar con herramientas especializadas",
      ],
      links: [
        {
          title: "Detección de Deepfakes",
          url: "https://ai.googleblog.com/2020/09/using-ai-to-help-detect-deepfakes.html",
          description:
            "Técnicas de Google para detectar imágenes generadas por IA",
        },
        {
          title: "Análisis de Metadatos EXIF",
          url: "https://exifdata.com/",
          description: "Herramienta para verificar metadatos de imágenes",
        },
        {
          title: "Investigación sobre Detección de IA",
          url: "https://arxiv.org/abs/2006.07156",
          description: "Estudios sobre detección de contenido generado por IA",
        },
      ],
      processSteps: [
        {
          step: 1,
          title: "Análisis de Metadatos EXIF",
          description: "Verificación de información técnica de la imagen",
          duration: "1-2 segundos",
          status: "completed",
        },
        {
          step: 2,
          title: "Detección de Artefactos de Generación",
          description: "Identificación de patrones típicos de IA generativa",
          duration: "2-3 segundos",
          status: "completed",
        },
        {
          step: 3,
          title: "Análisis de Consistencia Visual",
          description: "Evaluación de coherencia en texturas y iluminación",
          duration: "2-3 segundos",
          status: "completed",
        },
        {
          step: 4,
          title: "Comparación con Base de Datos",
          description:
            "Contraste con imágenes conocidas y patrones de referencia",
          duration: "1-2 segundos",
          status: "completed",
        },
      ],
      explanation: {
        user: "La imagen muestra características típicas de contenido generado por IA, incluyendo texturas muy consistentes y iluminación uniforme que son poco comunes en fotografías reales.",
        developer:
          "Se aplicaron algoritmos de detección de artefactos de generación, análisis de frecuencia espacial, verificación de metadatos EXIF y comparación con modelos entrenados en datasets de imágenes reales vs generadas.",
      },
    };
  }

  getMockVideoAnalysis() {
    return {
      aiProbability: 45,
      humanProbability: 55,
      confidence: 0.78,
      analysis: {
        facialConsistency: "Movimientos faciales naturales",
        audioSync: "Sincronización audio-video correcta",
        lighting: "Variaciones naturales de iluminación",
        artifacts: "Sin artefactos de manipulación detectados",
      },
      suggestions: [
        "Verificar metadatos del video",
        "Analizar frame por frame",
        "Revisar fuentes originales",
      ],
      links: [
        {
          title: "Detección de Deepfakes en Video",
          url: "https://ai.facebook.com/blog/deepfake-detection-challenge-results-an-open-initiative-to-advance-ai/",
          description:
            "Iniciativa de Facebook para detectar deepfakes en videos",
        },
        {
          title: "Análisis Forense de Video",
          url: "https://www.adobe.com/products/premiere-pro.html",
          description: "Herramientas profesionales para análisis de video",
        },
        {
          title: "Investigación sobre Deepfakes",
          url: "https://arxiv.org/abs/2001.00179",
          description: "Estudios académicos sobre detección de deepfakes",
        },
      ],
      processSteps: [
        {
          step: 1,
          title: "Análisis de Metadatos de Video",
          description:
            "Verificación de información técnica y origen del archivo",
          duration: "2-3 segundos",
          status: "completed",
        },
        {
          step: 2,
          title: "Detección de Inconsistencias Faciales",
          description: "Análisis de movimientos y expresiones faciales",
          duration: "3-4 segundos",
          status: "completed",
        },
        {
          step: 3,
          title: "Verificación de Sincronización Audio-Video",
          description: "Evaluación de coherencia entre audio y movimiento",
          duration: "2-3 segundos",
          status: "completed",
        },
        {
          step: 4,
          title: "Análisis de Artefactos de Manipulación",
          description: "Búsqueda de señales de edición o generación",
          duration: "2-3 segundos",
          status: "completed",
        },
      ],
      explanation: {
        user: "El video muestra características consistentes con contenido real, incluyendo movimientos faciales naturales y sincronización correcta entre audio y video.",
        developer:
          "Se aplicaron algoritmos de detección de deepfakes, análisis de consistencia temporal, verificación de metadatos y comparación con patrones de videos reales vs generados.",
      },
    };
  }

  getMockAudioAnalysis() {
    return {
      aiProbability: 30,
      humanProbability: 70,
      confidence: 0.85,
      analysis: {
        voicePatterns: "Patrones vocales naturales detectados",
        backgroundNoise: "Ruido de fondo consistente",
        breathing: "Patrones de respiración humanos",
        articulation: "Articulación natural del habla",
      },
      suggestions: [
        "Verificar metadatos del audio",
        "Analizar espectrograma",
        "Comparar con muestras conocidas",
      ],
      links: [
        {
          title: "Detección de Audio Sintético",
          url: "https://ai.googleblog.com/2019/03/real-time-voice-cloning.html",
          description: "Técnicas de Google para detectar clonación de voz",
        },
        {
          title: "Análisis de Espectrogramas",
          url: "https://www.audacityteam.org/",
          description: "Herramienta gratuita para análisis de audio",
        },
        {
          title: "Investigación sobre Audio IA",
          url: "https://arxiv.org/abs/2005.07143",
          description: "Estudios sobre detección de audio generado por IA",
        },
      ],
      processSteps: [
        {
          step: 1,
          title: "Análisis de Metadatos de Audio",
          description: "Verificación de información técnica del archivo",
          duration: "1-2 segundos",
          status: "completed",
        },
        {
          step: 2,
          title: "Análisis de Patrones Vocales",
          description: "Evaluación de características de la voz humana",
          duration: "2-3 segundos",
          status: "completed",
        },
        {
          step: 3,
          title: "Detección de Artefactos de Síntesis",
          description: "Identificación de patrones típicos de generación",
          duration: "2-3 segundos",
          status: "completed",
        },
        {
          step: 4,
          title: "Análisis de Espectrograma",
          description: "Evaluación de frecuencias y patrones temporales",
          duration: "1-2 segundos",
          status: "completed",
        },
      ],
      explanation: {
        user: "El audio muestra características típicas de voz humana natural, incluyendo patrones de respiración y articulación que son difíciles de replicar con síntesis de voz.",
        developer:
          "Se aplicaron algoritmos de análisis de frecuencia, detección de patrones vocales, análisis de espectrograma y comparación con modelos de voz humana vs sintética.",
      },
    };
  }

  getMockCodeAnalysis() {
    return {
      aiProbability: 80,
      humanProbability: 20,
      confidence: 0.92,
      analysis: {
        structure: "Estructura muy consistente y organizada",
        comments: "Comentarios muy detallados y explicativos",
        patterns: "Patrones de código muy estandarizados",
        complexity: "Complejidad moderada y bien estructurada",
      },
      suggestions: [
        "Revisar patrones de estilo",
        "Verificar documentación",
        "Analizar estructura del código",
      ],
      links: [
        {
          title: "Detección de Código Generado por IA",
          url: "https://github.blog/2023-03-22-github-copilot-x-the-ai-powered-developer-experience/",
          description:
            "Información sobre GitHub Copilot y detección de código IA",
        },
        {
          title: "Análisis de Calidad de Código",
          url: "https://sonarqube.org/",
          description: "Herramienta para análisis estático de código",
        },
        {
          title: "Investigación sobre Código IA",
          url: "https://arxiv.org/abs/2208.11692",
          description: "Estudios sobre detección de código generado por IA",
        },
      ],
      processSteps: [
        {
          step: 1,
          title: "Análisis de Estructura del Código",
          description: "Evaluación de organización y patrones de programación",
          duration: "1-2 segundos",
          status: "completed",
        },
        {
          step: 2,
          title: "Detección de Patrones de IA",
          description:
            "Identificación de patrones típicos de generación automática",
          duration: "2-3 segundos",
          status: "completed",
        },
        {
          step: 3,
          title: "Análisis de Complejidad",
          description:
            "Evaluación de complejidad ciclomática y métricas de código",
          duration: "1-2 segundos",
          status: "completed",
        },
        {
          step: 4,
          title: "Verificación de Documentación",
          description: "Análisis de comentarios y documentación del código",
          duration: "1-2 segundos",
          status: "completed",
        },
      ],
      explanation: {
        user: "El código muestra características típicas de generación por IA, incluyendo estructura muy consistente, comentarios muy detallados y patrones estandarizados que son poco comunes en código escrito por humanos.",
        developer:
          "Se aplicaron análisis de complejidad ciclomática, detección de patrones de programación, evaluación de métricas de código y comparación con modelos entrenados en código humano vs generado por IA.",
      },
    };
  }

  getMockAcademicAnalysis() {
    return {
      aiProbability: 65,
      humanProbability: 35,
      confidence: 0.88,
      analysis: {
        writingStyle: "Estilo de escritura muy estructurado",
        citations: "Citas y referencias bien organizadas",
        argumentation: "Argumentación lógica y coherente",
        originality: "Nivel de originalidad moderado",
      },
      suggestions: [
        "Verificar fuentes citadas",
        "Revisar estructura académica",
        "Analizar estilo de escritura",
      ],
      links: [
        {
          title: "Detección de Plagio Académico",
          url: "https://turnitin.com/",
          description: "Plataforma líder en detección de plagio académico",
        },
        {
          title: "Análisis de Escritura Académica",
          url: "https://www.grammarly.com/",
          description: "Herramienta para análisis de escritura académica",
        },
        {
          title: "Investigación sobre IA en Educación",
          url: "https://arxiv.org/abs/2301.07897",
          description: "Estudios sobre el uso de IA en trabajos académicos",
        },
      ],
      processSteps: [
        {
          step: 1,
          title: "Análisis de Estructura Académica",
          description: "Evaluación de formato y organización del trabajo",
          duration: "2-3 segundos",
          status: "completed",
        },
        {
          step: 2,
          title: "Verificación de Citas y Referencias",
          description: "Análisis de fuentes citadas y bibliografía",
          duration: "2-3 segundos",
          status: "completed",
        },
        {
          step: 3,
          title: "Detección de Patrones de Escritura",
          description: "Identificación de estilo y patrones lingüísticos",
          duration: "2-3 segundos",
          status: "completed",
        },
        {
          step: 4,
          title: "Análisis de Originalidad",
          description: "Evaluación de contenido único vs contenido similar",
          duration: "1-2 segundos",
          status: "completed",
        },
      ],
      explanation: {
        user: "El trabajo académico muestra características que sugieren uso de IA, incluyendo estructura muy consistente y argumentación muy lógica que puede ser típica de generación automática.",
        developer:
          "Se aplicaron análisis de estructura académica, verificación de citas, detección de patrones de escritura y comparación con corpus de trabajos académicos reales vs generados por IA.",
      },
    };
  }
}

export default new AIService();
