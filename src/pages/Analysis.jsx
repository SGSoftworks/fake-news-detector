import { useState, useEffect } from "react";
import {
  Search,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Share2,
  ExternalLink,
  Globe,
  Shield,
  TrendingUp,
  Eye,
  Link as LinkIcon,
  AlertCircle,
  Info,
  Users,
  Bot,
  Calendar,
  BookOpen,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { analyzeNews } from "../services/aiService";

const Analysis = () => {
  const [newsText, setNewsText] = useState("");
  const [inputType, setInputType] = useState("text");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [detectedUrls, setDetectedUrls] = useState([]);

  // Detectar URLs automáticamente en el texto
  useEffect(() => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = newsText.match(urlRegex) || [];
    setDetectedUrls(urls);
  }, [newsText]);

  // Función para validar URLs
  const isValidUrl = string => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  // Cambiar automáticamente a modo URL si se detectan URLs
  const handleTextChange = (text) => {
    setNewsText(text);
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = text.match(urlRegex) || [];
    
    if (urls.length > 0 && inputType === "text") {
      // Sugerir cambio a modo URL si hay URLs detectadas
      setDetectedUrls(urls);
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
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 90000); // 90 segundos

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
          "El análisis se demoró más de lo esperado. Intenta con contenido más corto o verifica tu conexión."
        );
      } else if (err.message.includes("Failed to fetch")) {
        setError("No se pudo conectar con el servidor. Verifica tu conexión a internet.");
      } else {
        setError(err.message || "Ocurrió un error durante el análisis. Por favor, intenta nuevamente.");
      }
      console.error("Analysis error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getCredibilityLevel = (confidence) => {
    if (confidence >= 90) return { level: "Muy alta", color: "success" };
    if (confidence >= 75) return { level: "Alta", color: "success" };
    if (confidence >= 60) return { level: "Media", color: "warning" };
    if (confidence >= 40) return { level: "Baja", color: "danger" };
    return { level: "Muy baja", color: "danger" };
  };

  const getVeracityStatus = (result) => {
    // La lógica correcta: si NO es fake, entonces es confiable
    // El porcentaje de confianza indica qué tan seguro está el sistema
    if (!result.isFake) {
      return {
        status: "Confiable",
        description: "Esta información parece ser verdadera según nuestro análisis",
        icon: CheckCircle,
        color: "success"
      };
    }
    return {
      status: "No Confiable",
      description: "Esta información presenta características que sugieren que podría ser falsa",
      icon: AlertTriangle,
      color: "danger"
    };
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Análisis de Veracidad
        </h1>
        <p className="text-lg text-gray-600">
          Verifica la credibilidad de noticias usando inteligencia artificial avanzada
        </p>
      </div>

      {/* Input Form */}
      <div className="card">
        <div className="mb-6">
          <label htmlFor="analysisType" className="block text-sm font-medium text-gray-700 mb-3">
            Tipo de análisis
          </label>
          <div className="flex space-x-4">
            <button
              onClick={() => setInputType("text")}
              className={`flex items-center px-4 py-2 rounded-lg border-2 transition-all ${
                inputType === "text"
                  ? "border-primary-500 bg-primary-50 text-primary-700"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <FileText className="mr-2 h-4 w-4" />
              Texto
            </button>
            <button
              onClick={() => setInputType("url")}
              className={`flex items-center px-4 py-2 rounded-lg border-2 transition-all ${
                inputType === "url"
                  ? "border-primary-500 bg-primary-50 text-primary-700"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <Globe className="mr-2 h-4 w-4" />
              URL
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="newsInput" className="block text-sm font-medium text-gray-700 mb-2">
            {inputType === "text" ? "Contenido de la noticia" : "URL de la noticia"}
          </label>
          
          {inputType === "text" ? (
            <textarea
              id="newsInput"
              value={newsText}
              onChange={e => handleTextChange(e.target.value)}
              placeholder="Pega aquí el contenido de la noticia que deseas verificar..."
              className="input-field h-40 resize-none"
              disabled={isAnalyzing}
            />
          ) : (
            <input
              type="url"
              id="newsInput"
              value={newsText}
              onChange={e => setNewsText(e.target.value)}
              placeholder="https://ejemplo.com/noticia-para-verificar"
              className="input-field"
              disabled={isAnalyzing}
            />
          )}

          {/* URL Detection Alert */}
          {detectedUrls.length > 0 && inputType === "text" && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start">
                <LinkIcon className="h-4 w-4 text-blue-600 mt-0.5 mr-2" />
                <div className="flex-1">
                  <p className="text-sm text-blue-800 font-medium">
                    URLs detectadas en el texto
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Para un análisis más completo, considera usar el modo "URL" con:
                  </p>
                  <div className="mt-2 space-y-1">
                    {detectedUrls.slice(0, 3).map((url, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setInputType("url");
                          setNewsText(url);
                        }}
                        className="block text-xs text-blue-600 hover:text-blue-800 underline truncate max-w-full"
                      >
                        {url}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-2 flex justify-between items-center text-sm text-gray-500">
            <span>
              {inputType === "text"
                ? `${newsText.length} caracteres (mínimo 50 recomendado)`
                : "Ingresa la URL completa de la noticia"}
            </span>
            {inputType === "text" && newsText.length > 0 && (
              <span className={newsText.length >= 50 ? "text-green-600" : "text-yellow-600"}>
                {newsText.length >= 50 ? "Longitud adecuada" : "Muy corto para análisis preciso"}
              </span>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={
            isAnalyzing ||
            !newsText.trim() ||
            (inputType === "text" && newsText.length < 10) ||
            (inputType === "url" && !isValidUrl(newsText))
          }
          className="btn-primary w-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed h-12"
        >
          {isAnalyzing ? (
            <>
              <Clock className="mr-2 h-5 w-5 animate-spin" />
              Analizando con IA...
            </>
          ) : (
            <>
              <Search className="mr-2 h-5 w-5" />
              Verificar Veracidad
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="card">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Resultado del Análisis
            </h2>
            <div className="flex space-x-3">
              <button className="btn-secondary flex items-center">
                <Share2 className="mr-2 h-4 w-4" />
                Compartir
              </button>
              <button className="btn-secondary flex items-center">
                <BookOpen className="mr-2 h-4 w-4" />
                Guardar
              </button>
            </div>
          </div>

          {/* Main Verdict */}
          <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-6 mb-8">
            <div className="flex items-start space-x-4">
              {(() => {
                const veracity = getVeracityStatus(result);
                const credibility = getCredibilityLevel(result.confidence || 0);
                const Icon = veracity.icon;
                
                return (
                  <>
                    <div className={`p-3 rounded-full bg-${veracity.color}-100`}>
                      <Icon className={`h-8 w-8 text-${veracity.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {veracity.status}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {veracity.description}
                      </p>
                      <div className="flex items-center space-x-6">
                        <div>
                          <span className="text-sm text-gray-500">Confianza del análisis</span>
                          <div className={`text-lg font-bold text-${credibility.color}-600`}>
                            {credibility.level} ({result.confidence || 0}%)
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {result.confidence >= 80 
                              ? "Porcentaje alto indica alta probabilidad de ser verdadera"
                              : result.confidence >= 50
                              ? "Porcentaje medio requiere verificación adicional"  
                              : "Porcentaje bajo sugiere posible desinformación o contenido generado por IA"
                            }
                          </p>
                        </div>
                        {result.analysisTime && (
                          <div>
                            <span className="text-sm text-gray-500">Tiempo de análisis</span>
                            <div className="text-lg font-semibold text-gray-700">
                              {Math.round(result.analysisTime / 1000)}s
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>

          {/* Analysis Details Grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Key Findings */}
            <div>
              <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                <Search className="mr-2 h-5 w-5 text-blue-600" />
                Análisis Detallado
              </h4>
              
              {result.explanation && (
                <div className="mb-4 p-5 bg-blue-50 border-l-4 border-blue-400 rounded-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    </div>
                    <div className="ml-3">
                      <h5 className="font-semibold text-blue-900 mb-2">Resumen del Análisis</h5>
                      <p className="text-blue-800 leading-relaxed">
                        {result.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {result.factors && result.factors.length > 0 && (
                <div className="space-y-3">
                  <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <TrendingUp className="mr-2 h-4 w-4 text-gray-600" />
                    Factores Evaluados
                  </h5>
                  {result.factors.slice(0, 5).map((factor, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          {factor.impact === "high" && <AlertTriangle className="h-4 w-4 text-red-500 mt-1" />}
                          {factor.impact === "medium" && <AlertCircle className="h-4 w-4 text-yellow-500 mt-1" />}
                          {factor.impact === "low" && <CheckCircle className="h-4 w-4 text-green-500 mt-1" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h6 className="font-medium text-gray-900 text-sm">{factor.name}</h6>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              factor.impact === "high" ? "bg-red-100 text-red-800" :
                              factor.impact === "medium" ? "bg-yellow-100 text-yellow-800" : 
                              "bg-green-100 text-green-800"
                            }`}>
                              {factor.impact === "high" ? "Alto impacto" : 
                               factor.impact === "medium" ? "Impacto medio" : "Bajo impacto"}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {factor.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Technical Details */}
            <div>
              <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                <Info className="mr-2 h-5 w-5 text-gray-600" />
                Detalles Técnicos
              </h4>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-500">Tipo de entrada</span>
                    <div className="font-semibold text-gray-900 capitalize">
                      {result.inputType === "url" ? "URL" : "Texto"}
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-500">Longitud analizada</span>
                    <div className="font-semibold text-gray-900">
                      {result.textLength || newsText.length} caracteres
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-500">Modelo de IA</span>
                    <div className="font-semibold text-gray-900">
                      {result.model || "Gemini 2.0 Flash"}
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-500">Fecha de análisis</span>
                    <div className="font-semibold text-gray-900">
                      {new Date(result.timestamp || Date.now()).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {result.originalUrl && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Globe className="h-4 w-4 text-blue-600 mr-2" />
                      <span className="text-sm font-medium text-blue-800">URL Analizada</span>
                    </div>
                    <a 
                      href={result.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline text-sm break-all"
                    >
                      {result.originalUrl}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Verification Results Section */}
          {(result.similarHeadlines && result.similarHeadlines.length > 0) || 
           (result.relatedArticles && result.relatedArticles.length > 0) && (
            <div className="border-t border-gray-200 pt-8">
              <h4 className="font-bold text-gray-900 mb-6 flex items-center">
                <Globe className="mr-2 h-5 w-5 text-purple-600" />
                Verificación Externa y Búsquedas Relacionadas
              </h4>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-5 mb-6">
                <div className="flex items-start">
                  <Shield className="h-5 w-5 text-purple-600 mt-0.5 mr-3" />
                  <div>
                    <h5 className="font-semibold text-purple-900 mb-2">Estado de Verificación</h5>
                    <p className="text-purple-800 text-sm">
                      Hemos buscado esta información en múltiples fuentes para verificar su veracidad. 
                      {result.similarHeadlines && result.similarHeadlines.length > 0 
                        ? ` Encontramos ${result.similarHeadlines.length} artículos similares para comparar.`
                        : " No se encontraron artículos idénticos, lo que podría indicar información nueva o única."
                      }
                    </p>
                  </div>
                </div>
              </div>

              {result.similarHeadlines && result.similarHeadlines.length > 0 && (
                <div className="mb-8">
                  <h5 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <TrendingUp className="mr-2 h-4 w-4 text-blue-600" />
                    Noticias Similares Encontradas ({result.similarHeadlines.length})
                  </h5>
                  <div className="grid md:grid-cols-2 gap-4">
                    {result.similarHeadlines.slice(0, 4).map((headline, index) => (
                      <div key={index} className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <h6 className="font-medium text-gray-900 text-sm leading-tight flex-1">
                            {headline.title || headline.headline}
                          </h6>
                          {headline.url && (
                            <a
                              href={headline.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-2 text-blue-600 hover:text-blue-800 flex-shrink-0"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                        {headline.source && (
                          <div className="flex items-center mb-2">
                            <Globe className="h-3 w-3 text-gray-400 mr-1" />
                            <span className="text-xs text-gray-500">{headline.source}</span>
                          </div>
                        )}
                        {headline.similarity && (
                          <div className="flex items-center">
                            <div className="flex-1 bg-gray-200 rounded-full h-1.5 mr-2">
                              <div 
                                className="bg-blue-600 h-1.5 rounded-full" 
                                style={{ width: `${headline.similarity * 100}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-600">
                              {Math.round(headline.similarity * 100)}% similar
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Related Articles Section */}
          {result.relatedArticles && result.relatedArticles.length > 0 && (
            <div className="border-t border-gray-200 pt-8">
              <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                <BookOpen className="mr-2 h-5 w-5 text-gray-600" />
                Artículos Adicionales Relacionados
              </h4>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {result.relatedArticles.slice(0, 6).map((article, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <h5 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">
                        {article.title || article.headline}
                      </h5>
                      {article.url && (
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-blue-600 hover:text-blue-800 flex-shrink-0"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                    
                    {article.source && (
                      <div className="flex items-center mb-2">
                        <Globe className="h-3 w-3 text-gray-400 mr-1" />
                        <span className="text-xs text-gray-500">{article.source}</span>
                      </div>
                    )}
                    
                    {article.description && (
                      <p className="text-xs text-gray-600 line-clamp-3 mb-3">
                        {article.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      {article.publishedAt && (
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 text-gray-400 mr-1" />
                          <span className="text-xs text-gray-500">
                            {new Date(article.publishedAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      
                      {article.relevance && (
                        <div className="flex items-center">
                          <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                          <span className="text-xs text-green-600 font-medium">
                            {Math.round(article.relevance * 100)}% relevante
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Analysis Breakdown */}
          {result.details && (result.details.aiAnalysis || result.details.geminiAnalysis) && (
            <div className="border-t border-gray-200 pt-8">
              <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                <Bot className="mr-2 h-5 w-5 text-gray-600" />
                Análisis Detallado de IA
              </h4>
              <div className="grid md:grid-cols-2 gap-6">
                {result.details.geminiAnalysis && (
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-blue-900">
                        Análisis Gemini 2.0
                      </span>
                      <span className="text-lg font-bold text-blue-700">
                        {result.details.geminiAnalysis.confidence}%
                      </span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2 mb-3">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${result.details.geminiAnalysis.confidence}%`,
                        }}
                      />
                    </div>
                    <p className="text-sm text-blue-800">
                      {result.details.geminiAnalysis.summary || result.details.geminiAnalysis.explanation}
                    </p>
                  </div>
                )}

                {result.details.verificationAnalysis && (
                  <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-green-900">
                        Verificación Externa
                      </span>
                      <span className="text-lg font-bold text-green-700">
                        {result.details.verificationAnalysis.confidence}%
                      </span>
                    </div>
                    <div className="w-full bg-green-200 rounded-full h-2 mb-3">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${result.details.verificationAnalysis.confidence}%`,
                        }}
                      />
                    </div>
                    <p className="text-sm text-green-800">
                      Verificado contra {result.details.verificationAnalysis.sources?.length || 0} fuentes externas
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="border-t border-gray-200 pt-6 mt-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button className="flex items-center text-green-600 hover:text-green-700">
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  <span className="text-sm">Útil</span>
                </button>
                <button className="flex items-center text-red-600 hover:text-red-700">
                  <ThumbsDown className="h-4 w-4 mr-1" />
                  <span className="text-sm">No útil</span>
                </button>
              </div>
              
              <div className="text-sm text-gray-500">
                Análisis completado con tecnología de IA avanzada
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analysis;