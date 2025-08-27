import { useState } from "react";
import {
  Search,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Share2,
  ExternalLink,
  Globe,
  CheckSquare,
  TrendingUp,
} from "lucide-react";
import { analyzeNews } from "../services/aiService";

const Analysis = () => {
  const [newsText, setNewsText] = useState("");
  const [inputType, setInputType] = useState("text"); // "text" o "url"
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // Función para validar URLs
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleAnalyze = async () => {
    if (!newsText.trim()) {
      setError("Por favor, ingresa el contenido para analizar.");
      return;
    }

    if (inputType === "url" && !isValidUrl(newsText)) {
      setError("Por favor, ingresa una URL válida.");
      return;
    }

    setIsAnalyzing(true);
    setError("");
    setResult(null);

    try {
      // Agregar timeout para evitar errores de conexión
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 segundos

      const analysisResult = await analyzeNews(
        newsText,
        inputType,
        controller.signal
      );
      clearTimeout(timeoutId);
      setResult(analysisResult);
    } catch (err) {
      if (err.name === "AbortError") {
        setError(
          "El análisis tardó demasiado. Por favor, intenta con un contenido más corto."
        );
      } else if (err.message.includes("Failed to fetch")) {
        setError("Error de conexión. Verifica tu internet e intenta de nuevo.");
      } else {
        setError("Error al analizar la noticia. Por favor, intenta de nuevo.");
      }
      console.error("Analysis error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getResultColor = (confidence) => {
    if (confidence >= 80) return "text-success-600";
    if (confidence >= 60) return "text-yellow-600";
    return "text-danger-600";
  };

  const getResultIcon = (isFake) => {
    return isFake ? AlertTriangle : CheckCircle;
  };

  const getResultText = (result) => {
    if (result.verdict) {
      return result.verdict;
    }
    return result.isFake ? "NO VERÍDICA" : "VERÍDICA";
  };

  const getResultDescription = (result) => {
    if (result.explanation) {
      return result.explanation;
    }

    const confidence = result.confidence || 0;
    if (result.isFake) {
      return `Esta noticia muestra características típicas de contenido no verídico con un nivel de confianza ${getConfidenceLevel(
        confidence
      )}. Te recomendamos verificar la información con fuentes confiables.`;
    }
    return `Esta noticia parece ser verídica con un nivel de confianza ${getConfidenceLevel(
      confidence
    )}. Sin embargo, siempre es buena práctica verificar múltiples fuentes.`;
  };

  const getConfidenceLevel = (confidence) => {
    if (confidence >= 85) return "MUY ALTA";
    if (confidence >= 70) return "ALTA";
    if (confidence >= 50) return "MEDIA";
    if (confidence >= 30) return "BAJA";
    return "MUY BAJA";
  };

  // Función para asegurar consistencia entre confidence y credibilityScore
  const getConsistentCredibilityScore = (result) => {
    if (!result.verification || !result.verification.credibilityScore) {
      return result.confidence || 0;
    }

    // Si el análisis indica que es fake, ajustar el credibilityScore
    if (result.isFake) {
      return Math.min(result.verification.credibilityScore, 60);
    } else {
      return Math.max(result.verification.credibilityScore, 40);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Analizar Noticia
        </h1>
        <p className="text-gray-600">
          Analiza texto o URLs de noticias con nuestro sistema de IA avanzado.
        </p>
      </div>

      {/* Analysis Form */}
      <div className="card">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="newsInput"
              className="block text-sm font-medium text-gray-700"
            >
              Noticia a Analizar
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="inputType"
                  value="text"
                  checked={inputType === "text"}
                  onChange={(e) => setInputType(e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-600">Texto</span>
              </label>
              <label className="flex items-center">
                <span className="text-sm text-gray-600">URL</span>
                <input
                  type="radio"
                  name="inputType"
                  value="url"
                  checked={inputType === "url"}
                  onChange={(e) => setInputType(e.target.value)}
                  className="ml-2"
                />
              </label>
            </div>
          </div>

          {inputType === "text" ? (
            <textarea
              id="newsInput"
              value={newsText}
              onChange={(e) => setNewsText(e.target.value)}
              placeholder="Pega aquí el texto de la noticia que quieres analizar..."
              className="input-field h-32 resize-none"
              disabled={isAnalyzing}
            />
          ) : (
            <input
              type="url"
              id="newsInput"
              value={newsText}
              onChange={(e) => setNewsText(e.target.value)}
              placeholder="https://ejemplo.com/noticia-para-verificar"
              className="input-field"
              disabled={isAnalyzing}
            />
          )}

          <p className="text-sm text-gray-500 mt-2">
            {inputType === "text"
              ? "Mínimo 50 caracteres para un análisis preciso"
              : "Ingresa la URL completa de la noticia para análisis automático"}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-danger-50 border border-danger-200 rounded-lg">
            <p className="text-danger-700">{error}</p>
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={
            isAnalyzing ||
            !newsText.trim() ||
            (inputType === "url" && !isValidUrl(newsText))
          }
          className="btn-primary w-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? (
            <>
              <Clock className="mr-2 h-5 w-5 animate-spin" />
              Analizando...
            </>
          ) : (
            <>
              <Search className="mr-2 h-5 w-5" />
              Analizar Noticia
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Resultado del Análisis
            </h2>
            <button className="btn-secondary flex items-center">
              <Share2 className="mr-2 h-4 w-4" />
              Compartir
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Main Result */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                {(() => {
                  const Icon = getResultIcon(result.isFake);
                  return (
                    <Icon
                      className={`h-8 w-8 ${getResultColor(result.confidence)}`}
                    />
                  );
                })()}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {getResultText(result)}
                  </h3>
                  <p
                    className={`text-lg font-bold ${getResultColor(
                      result.confidence
                    )}`}
                  >
                    Nivel de confianza:{" "}
                    {result.confidenceLevel ||
                      getConfidenceLevel(result.confidence)}
                  </p>
                </div>
              </div>
              <div className="text-gray-600 whitespace-pre-line">
                {getResultDescription(result)}
              </div>
            </div>

            {/* Analysis Details */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">
                Detalles del Análisis
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tipo de entrada:</span>
                  <span className="font-medium capitalize">
                    {result.inputType || "texto"}
                  </span>
                </div>
                {result.originalUrl && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">URL analizada:</span>
                    <span className="font-medium text-blue-600 truncate max-w-xs">
                      {result.originalUrl}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Longitud del contenido:</span>
                  <span className="font-medium">
                    {result.textLength} caracteres
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tiempo de análisis:</span>
                  <span className="font-medium">{result.analysisTime}ms</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Modelo utilizado:</span>
                  <span className="font-medium">{result.model}</span>
                </div>
              </div>

              {/* AI vs Human Analysis */}
              {result.details &&
                (result.details.aiAnalysis || result.details.humanAnalysis) && (
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <h5 className="font-medium text-gray-800 mb-3">
                      Análisis IA vs Humano
                    </h5>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {result.details.aiAnalysis && (
                        <div className="bg-blue-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-blue-800">
                              🤖 Análisis IA
                            </span>
                            <span className="text-sm font-bold text-blue-600">
                              {result.details.aiAnalysis.percentage}%
                            </span>
                          </div>
                          <div className="w-full bg-blue-200 rounded-full h-2 mb-3">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${result.details.aiAnalysis.confidence}%`,
                              }}
                            />
                          </div>
                          <div className="text-xs text-blue-700 space-y-1">
                            <p className="flex justify-between">
                              <span>Confianza:</span>
                              <span className="font-medium">
                                {result.details.aiAnalysis.confidence}%
                              </span>
                            </p>
                            <p className="flex justify-between">
                              <span>Factores:</span>
                              <span className="font-medium">
                                {result.details.aiAnalysis.factors}
                              </span>
                            </p>
                            <p className="text-blue-600 font-medium truncate">
                              {result.details.aiAnalysis.sources.join(", ")}
                            </p>
                          </div>
                        </div>
                      )}

                      {result.details.humanAnalysis &&
                        result.details.humanAnalysis.percentage > 0 && (
                          <div className="bg-green-50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm font-medium text-green-800">
                                👥 Verificación Humana
                              </span>
                              <span className="text-sm font-bold text-green-600">
                                {result.details.humanAnalysis.percentage}%
                              </span>
                            </div>
                            <div className="w-full bg-green-200 rounded-full h-2 mb-3">
                              <div
                                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                style={{
                                  width: `${result.details.humanAnalysis.confidence}%`,
                                }}
                              />
                            </div>
                            <div className="text-xs text-green-700 space-y-1">
                              <p className="flex justify-between">
                                <span>Credibilidad:</span>
                                <span className="font-medium">
                                  {result.details.humanAnalysis.confidence}%
                                </span>
                              </p>
                              <p className="flex justify-between">
                                <span>Factores:</span>
                                <span className="font-medium">
                                  {result.details.humanAnalysis.factors}
                                </span>
                              </p>
                              <p className="text-green-600 font-medium truncate">
                                {result.details.humanAnalysis.sources.join(
                                  ", "
                                )}
                              </p>
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                )}
            </div>
          </div>

          {/* Similar Headlines */}
          {result.similarHeadlines && result.similarHeadlines.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-4">
                Titulares Similares Encontrados
              </h4>
              <div className="space-y-3">
                {result.similarHeadlines.map((headline, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-medium text-gray-900 text-sm leading-relaxed">
                        {headline.title}
                      </h5>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ml-2 flex-shrink-0 ${
                          headline.semanticScore >= 80
                            ? "bg-green-100 text-green-800"
                            : headline.semanticScore >= 60
                            ? "bg-yellow-100 text-yellow-800"
                            : headline.semanticScore >= 40
                            ? "bg-orange-100 text-orange-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {headline.semanticScore}% similitud
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span className="font-medium">{headline.source}</span>
                      <a
                        href={headline.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        Ver noticia →
                      </a>
                    </div>
                    {headline.snippet && (
                      <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                        {headline.snippet}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {result.comparisonReport && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-medium text-blue-900 mb-2">
                    📊 Reporte de Comparación
                  </h5>
                  <div className="text-sm text-blue-800 space-y-2">
                    <p>
                      <strong>Resumen:</strong>{" "}
                      {result.comparisonReport.summary}
                    </p>
                    {result.comparisonReport.consistency && (
                      <p>
                        <strong>Consistencia:</strong>{" "}
                        {result.comparisonReport.consistency}
                      </p>
                    )}
                    {result.comparisonReport.credibility && (
                      <p>
                        <strong>Credibilidad:</strong>{" "}
                        {result.comparisonReport.credibility}
                      </p>
                    )}
                    {result.comparisonReport.recommendations &&
                      result.comparisonReport.recommendations.length > 0 && (
                        <div>
                          <strong>Recomendaciones:</strong>
                          <ul className="list-disc list-inside mt-1 ml-2">
                            {result.comparisonReport.recommendations.map(
                              (rec, i) => (
                                <li key={i}>{rec}</li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Factors */}
          {result.factors && result.factors.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-4">
                Factores Detectados por IA
              </h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {result.factors.map((factor, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div
                      className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${
                        factor.impact === "high"
                          ? "bg-danger-500"
                          : factor.impact === "medium"
                          ? "bg-yellow-500"
                          : "bg-success-500"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1">
                        <p className="font-medium text-gray-900 text-sm sm:text-base truncate">
                          {factor.name}
                        </p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                            factor.source === "gemini"
                              ? "bg-blue-100 text-blue-800"
                              : factor.source === "huggingface"
                              ? "bg-purple-100 text-purple-800"
                              : factor.source === "local"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {factor.aiType || factor.source}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {factor.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* External Verification */}
          {result.verification && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                Verificación Externa
              </h4>

              {/* Source Analysis */}
              {result.verification.sourceAnalysis && (
                <div className="mb-6">
                  <h5 className="font-medium text-gray-800 mb-3 flex items-center">
                    <CheckSquare className="h-4 w-4 mr-2" />
                    Análisis de Fuente
                  </h5>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700 mb-2">
                      {result.verification.sourceAnalysis.analysis}
                    </p>
                    {result.verification.sourceAnalysis.type === "url" && (
                      <div className="text-sm">
                        <p>
                          <strong>Dominio:</strong>{" "}
                          {result.verification.sourceAnalysis.domain}
                        </p>
                        <p>
                          <strong>Confianza del dominio:</strong>{" "}
                          {result.verification.sourceAnalysis.trustScore}%
                        </p>
                      </div>
                    )}
                    {result.verification.sourceAnalysis.styleAnalysis && (
                      <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p>
                            <strong>Objetividad:</strong>{" "}
                            {
                              result.verification.sourceAnalysis.styleAnalysis
                                .objectivity
                            }
                            %
                          </p>
                          <p>
                            <strong>Formalidad:</strong>{" "}
                            {
                              result.verification.sourceAnalysis.styleAnalysis
                                .formality
                            }
                            %
                          </p>
                        </div>
                        <div>
                          <p>
                            <strong>Sensacionalismo:</strong>{" "}
                            {
                              result.verification.sourceAnalysis.styleAnalysis
                                .sensationalism
                            }
                            %
                          </p>
                          <p>
                            <strong>Urgencia:</strong>{" "}
                            {
                              result.verification.sourceAnalysis.styleAnalysis
                                .urgency
                            }
                            %
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Related Articles */}
              {result.verification.relatedArticles &&
                result.verification.relatedArticles.length > 0 && (
                  <div className="mb-6">
                    <h5 className="font-medium text-gray-800 mb-3 flex items-center">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Artículos Relacionados
                    </h5>
                    <div className="space-y-3">
                      {result.verification.relatedArticles
                        .slice(0, 3)
                        .map((article, index) => (
                          <div
                            key={index}
                            className="bg-gray-50 rounded-lg p-3"
                          >
                            <h6 className="font-medium text-gray-900 text-sm mb-1">
                              {article.title}
                            </h6>
                            <p className="text-xs text-gray-600 mb-2">
                              {article.snippet}
                            </p>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-500">
                                Fuente: {article.source}
                              </span>
                              <span className="text-blue-600">
                                Relevancia:{" "}
                                {Math.round(article.relevance * 100)}%
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

              {/* Credibility Score */}
              <div className="mb-6">
                <h5 className="font-medium text-gray-800 mb-3 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Score de Credibilidad
                </h5>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      Credibilidad General
                    </span>
                    <span className="text-lg font-bold text-blue-600">
                      {getConsistentCredibilityScore(result)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${getConsistentCredibilityScore(result)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Verification Recommendations */}
              {result.verification.recommendations &&
                result.verification.recommendations.length > 0 && (
                  <div className="mb-6">
                    <h5 className="font-medium text-gray-800 mb-3">
                      Recomendaciones de Verificación
                    </h5>
                    <div className="space-y-2">
                      {result.verification.recommendations.map((rec, index) => (
                        <div
                          key={index}
                          className="flex items-start space-x-2 p-3 bg-blue-50 rounded-lg"
                        >
                          <CheckCircle className="h-4 w-4 mt-0.5 text-blue-600 flex-shrink-0" />
                          <p className="text-sm text-blue-800">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          )}

          {/* Recommendations */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-4">
              Recomendaciones Generales
            </h4>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <ul className="space-y-2 text-blue-800">
                <li>• Verifica la fuente de la noticia</li>
                <li>• Busca la misma información en medios confiables</li>
                <li>• Revisa la fecha de publicación</li>
                <li>• Analiza el tono y lenguaje utilizado</li>
                <li>• Consulta fact-checkers reconocidos</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="card bg-primary-50 border-primary-200">
        <h3 className="text-lg font-semibold text-primary-900 mb-3">
          Consejos para identificar noticias falsas
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-primary-800">
          <div className="flex items-start space-x-2">
            <FileText className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <p>
              Verifica siempre la fuente y busca información sobre el medio de
              comunicación
            </p>
          </div>
          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <p>
              Desconfía de titulares sensacionalistas o que prometen información
              exclusiva
            </p>
          </div>
          <div className="flex items-start space-x-2">
            <Clock className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <p>
              Revisa la fecha de publicación y si la noticia es reciente o
              antigua
            </p>
          </div>
          <div className="flex items-start space-x-2">
            <Search className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <p>
              Busca la misma información en otros medios confiables para
              comparar
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
