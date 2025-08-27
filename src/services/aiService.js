// Servicio para análisis de noticias usando APIs de IA
// Conecta con el backend real para análisis

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

// Función para analizar texto o URL usando el backend real
export const analyzeNews = async (content, inputType = "text", signal) => {
  const startTime = Date.now();

  try {
    // Conectar con el backend real
    const response = await fetch(`${API_BASE_URL}/analysis`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
        inputType, // "text" o "url"
        analyzeUrl: inputType === "url",
      }),
      signal, // Agregar signal para abortar la petición
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error en el servidor");
    }

    const result = await response.json();

    return {
      ...result,
      analysisTime: Date.now() - startTime,
      textLength: result.extractedText
        ? result.extractedText.length
        : content.length,
      model: result.model || "Local Analysis v2.0",
      timestamp: new Date().toISOString(),
      inputType,
      originalContent: content,
    };
  } catch (error) {
    if (error.name === "AbortError") {
      throw error; // Re-lanzar AbortError
    }
    console.error("Error en análisis:", error);
    throw new Error("Error al analizar la noticia");
  }
};

// Función para guardar análisis en historial (localStorage por ahora)
export const saveAnalysis = (analysis) => {
  try {
    const history = JSON.parse(localStorage.getItem("analysisHistory") || "[]");
    history.unshift({
      ...analysis,
      id: Date.now(),
      savedAt: new Date().toISOString(),
    });

    // Mantener solo los últimos 50 análisis
    if (history.length > 50) {
      history.splice(50);
    }

    localStorage.setItem("analysisHistory", JSON.stringify(history));
    return true;
  } catch (error) {
    console.error("Error al guardar análisis:", error);
    return false;
  }
};

// Función para obtener historial de análisis
export const getAnalysisHistory = () => {
  try {
    return JSON.parse(localStorage.getItem("analysisHistory") || "[]");
  } catch (error) {
    console.error("Error al obtener historial:", error);
    return [];
  }
};

// Función para limpiar historial
export const clearAnalysisHistory = () => {
  try {
    localStorage.removeItem("analysisHistory");
    return true;
  } catch (error) {
    console.error("Error al limpiar historial:", error);
    return false;
  }
};

// APIs reales que se pueden integrar (comentadas por ahora)
/*
// OpenAI GPT Detector
const analyzeWithOpenAI = async (text) => {
  const response = await fetch(`${API_BASE_URL}/openai/detect`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text })
  });
  return response.json();
};

// Hugging Face BERT
const analyzeWithBERT = async (text) => {
  const response = await fetch(`${API_BASE_URL}/bert/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text })
  });
  return response.json();
};

// Google Perspective API
const analyzeWithPerspective = async (text) => {
  const response = await fetch(`${API_BASE_URL}/perspective/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text })
  });
  return response.json();
};
*/
