import React, { useState } from "react";
import aiService from "../services/aiService";
import historyService from "../services/historyService";
import AnalysisProgress from "../components/AnalysisProgress";
import AnalysisExplanation from "../components/AnalysisExplanation";
import AnalysisLinks from "../components/AnalysisLinks";

const CodeAnalysis = () => {
  const [code, setCode] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [showProgress, setShowProgress] = useState(false);

  const handleCodeSubmit = async e => {
    e.preventDefault();
    if (!code.trim()) return;

    setIsAnalyzing(true);
    setError(null);
    setShowProgress(true);

    try {
      const analysisResults = await aiService.analyzeCode(code);

      const enrichedResults = {
        ...analysisResults,
        type: "Código",
        content: code.substring(0, 200) + (code.length > 200 ? "..." : ""),
        fullContent: code,
        timestamp: new Date().toISOString(),
      };

      historyService.saveAnalysis(enrichedResults);
      setResults(enrichedResults);
    } catch (error) {
      console.error("Error en análisis:", error);
      setError("Error al analizar el código. Por favor, intenta de nuevo.");
    } finally {
      setIsAnalyzing(false);
      setShowProgress(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Análisis de Código
          </h1>
          <p className="text-lg text-gray-600">
            Detecta código generado por IA usando análisis avanzado de patrones
          </p>
        </div>

        {/* Formulario de entrada */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <form onSubmit={handleCodeSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ingresa el código a analizar
              </label>
              <textarea
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="Pega aquí el código que quieres analizar..."
                className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                disabled={isAnalyzing}
              />
            </div>

            <button
              type="submit"
              disabled={!code.trim() || isAnalyzing}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isAnalyzing ? "Analizando..." : "Analizar Código"}
            </button>
          </form>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
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

        {/* Resultados */}
        {results && !showProgress && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Resultados del Análisis
            </h2>

            {/* Información del análisis */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">
                Información del Análisis
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Lenguaje detectado:</span>
                  <span className="ml-2 font-medium">
                    {results.language || "No detectado"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Fecha de análisis:</span>
                  <span className="ml-2 font-medium">
                    {new Date(results.timestamp).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Líneas de código:</span>
                  <span className="ml-2 font-medium">
                    {results.fullContent.split("\n").length}
                  </span>
                </div>
              </div>
            </div>

            {/* Resultados principales */}
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {results.aiProbability}%
                  </div>
                  <div className="text-sm text-blue-700">
                    Probabilidad de IA
                  </div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {results.humanProbability}%
                  </div>
                  <div className="text-sm text-green-700">
                    Probabilidad Humana
                  </div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {results.confidence}%
                  </div>
                  <div className="text-sm text-purple-700">Confianza</div>
                </div>
              </div>
            </div>

            {/* Veredicto */}
            <div className="mb-6">
              <div
                className={`p-4 rounded-lg border ${
                  results.verdict === "AI-Generated"
                    ? "bg-red-50 border-red-200"
                    : "bg-green-50 border-green-200"
                }`}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {results.verdict === "AI-Generated" ? (
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
                    ) : (
                      <svg
                        className="h-5 w-5 text-green-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="ml-3">
                    <h3
                      className={`text-lg font-medium ${
                        results.verdict === "AI-Generated"
                          ? "text-red-800"
                          : "text-green-800"
                      }`}
                    >
                      Veredicto: {results.verdict}
                    </h3>
                    <p
                      className={`text-sm ${
                        results.verdict === "AI-Generated"
                          ? "text-red-700"
                          : "text-green-700"
                      }`}
                    >
                      {results.verdict === "AI-Generated"
                        ? "Este código probablemente fue generado por IA"
                        : "Este código probablemente fue escrito por un humano"}
                    </p>
                  </div>
                </div>
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

            {/* Análisis detallado */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Análisis Detallado
              </h3>
              <div className="space-y-4">
                {results.detailedAnalysis &&
                  Object.entries(results.detailedAnalysis).map(
                    ([key, value]) => (
                      <div key={key} className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2 capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </h4>
                        <p className="text-sm text-gray-700">{value}</p>
                      </div>
                    )
                  )}
              </div>
            </div>

            {/* Sugerencias */}
            {results.suggestions && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Sugerencias
                </h3>
                <div className="space-y-2">
                  {results.suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg"
                    >
                      <svg
                        className="h-5 w-5 text-blue-400 mt-0.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm text-blue-700">
                        {suggestion}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeAnalysis;
