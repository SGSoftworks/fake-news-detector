import React, { useState } from "react";
import aiService from "../services/aiService";
import historyService from "../services/historyService";
import AnalysisProgress from "../components/AnalysisProgress";
import AnalysisExplanation from "../components/AnalysisExplanation";
import AnalysisLinks from "../components/AnalysisLinks";

const TextAnalysis = () => {
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [showProgress, setShowProgress] = useState(false);

  const handleTextSubmit = async e => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsAnalyzing(true);
    setError(null);
    setShowProgress(true);

    try {
      // Realizar análisis usando el servicio de IA
      const analysisResults = await aiService.analyzeText(text);

      // Agregar metadatos adicionales
      const enrichedResults = {
        ...analysisResults,
        type: "Texto",
        content: text.substring(0, 200) + (text.length > 200 ? "..." : ""),
        fullContent: text,
        timestamp: new Date().toISOString(),
      };

      // Guardar en historial
      historyService.saveAnalysis(enrichedResults);

      setResults(enrichedResults);
    } catch (error) {
      console.error("Error en análisis:", error);
      setError("Error al analizar el texto. Por favor, intenta de nuevo.");
    } finally {
      setIsAnalyzing(false);
      setShowProgress(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Análisis de Texto
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Detecta si el contenido textual fue generado por IA o escrito por
            humanos
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <form onSubmit={handleTextSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contenido a Analizar
                </label>
                <textarea
                  value={text}
                  onChange={e => setText(e.target.value)}
                  placeholder="Pega aquí el texto que deseas analizar..."
                  className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isAnalyzing || !text.trim()}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Analizando...
                  </>
                ) : (
                  "Analizar Contenido"
                )}
              </button>
            </form>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Error en el análisis
                  </h3>
                  <div className="mt-2 text-sm text-red-700">{error}</div>
                </div>
              </div>
            </div>
          )}

          {/* Progreso del Análisis */}
          {showProgress && results?.processSteps && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <AnalysisProgress
                steps={results.processSteps}
                onComplete={() => setShowProgress(false)}
              />
            </div>
          )}

          {results && !showProgress && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Resultados del Análisis
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {results.aiProbability}%
                  </div>
                  <div className="text-sm text-gray-600">Probabilidad IA</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {results.humanProbability}%
                  </div>
                  <div className="text-sm text-gray-600">
                    Probabilidad Humano
                  </div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(results.confidence * 100)}%
                  </div>
                  <div className="text-sm text-gray-600">Confianza</div>
                </div>
              </div>

              {/* Explicaciones */}
              <div className="mb-6">
                <AnalysisExplanation explanation={results.explanation} />
              </div>

              {/* Enlaces y Recursos */}
              <div className="mb-6">
                <AnalysisLinks links={results.links} colorScheme="blue" />
              </div>

              {/* Análisis Detallado */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Análisis Detallado
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(results.analysis).map(([key, value]) => (
                    <div key={key} className="p-4 bg-gray-50 rounded-lg">
                      <div className="font-medium text-gray-900 capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </div>
                      <div className="text-gray-600">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextAnalysis;
