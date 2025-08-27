import { useState, useEffect } from "react";
import {
  History as HistoryIcon,
  Trash2,
  Search,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Clock,
} from "lucide-react";
import {
  getAnalysisHistory,
  clearAnalysisHistory,
} from "../services/aiService";

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState("all"); // all, fake, real
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const savedHistory = getAnalysisHistory();
    setHistory(savedHistory);
  };

  const handleClearHistory = () => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar todo el historial?")
    ) {
      clearAnalysisHistory();
      setHistory([]);
    }
  };

  const filteredHistory = history.filter((item) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "fake" && item.isFake) ||
      (filter === "real" && !item.isFake);

    const matchesSearch =
      searchTerm === "" ||
      item.text?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getResultIcon = (isFake) => {
    return isFake ? AlertTriangle : CheckCircle;
  };

  const getResultColor = (isFake) => {
    return isFake ? "text-danger-600" : "text-success-600";
  };

  const getResultText = (result) => {
    if (result.verdict) {
      return result.verdict;
    }
    return result.isFake ? "NO VERÍDICA" : "VERÍDICA";
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Historial de Análisis
          </h1>
          <p className="text-gray-600">
            Revisa todos los análisis de noticias que has realizado
          </p>
        </div>
        <button
          onClick={handleClearHistory}
          className="btn-secondary flex items-center text-danger-600 hover:text-danger-700"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Limpiar Historial
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar en el historial..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "all"
                  ? "bg-primary-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilter("fake")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "fake"
                  ? "bg-danger-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Falsas
            </button>
            <button
              onClick={() => setFilter("real")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "real"
                  ? "bg-success-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Confiables
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {filteredHistory.length === 0 ? (
        <div className="card text-center py-12">
          <HistoryIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {history.length === 0
              ? "No hay análisis en el historial"
              : "No se encontraron resultados"}
          </h3>
          <p className="text-gray-600">
            {history.length === 0
              ? "Realiza tu primer análisis de noticias para ver el historial aquí."
              : "Intenta cambiar los filtros o términos de búsqueda."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredHistory.map((item) => {
            const Icon = getResultIcon(item.isFake);
            return (
              <div
                key={item.id}
                className="card hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <Icon
                        className={`h-6 w-6 ${getResultColor(item.isFake)}`}
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {getResultText(item)}
                        </h3>
                        <p
                          className={`text-sm font-medium ${getResultColor(
                            item.isFake
                          )}`}
                        >
                          {item.confidence}% de confianza
                        </p>
                      </div>
                    </div>

                    {item.text && (
                      <p className="text-gray-700 mb-3 line-clamp-2">
                        {item.text.length > 200
                          ? `${item.text.substring(0, 200)}...`
                          : item.text}
                      </p>
                    )}

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(item.savedAt)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{item.analysisTime}ms</span>
                      </div>
                      <span>•</span>
                      <span>{item.textLength} caracteres</span>
                      <span>•</span>
                      <span>{item.model}</span>
                    </div>
                  </div>
                </div>

                {/* Factors */}
                {item.factors && item.factors.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Factores identificados:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {item.factors.slice(0, 3).map((factor, index) => (
                        <span
                          key={index}
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            factor.impact === "high"
                              ? "bg-danger-100 text-danger-700"
                              : factor.impact === "medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-success-100 text-success-700"
                          }`}
                        >
                          {factor.name}
                        </span>
                      ))}
                      {item.factors.length > 3 && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          +{item.factors.length - 3} más
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Stats */}
      {history.length > 0 && (
        <div className="card bg-gray-50">
          <h3 className="font-semibold text-gray-900 mb-4">
            Estadísticas del Historial
          </h3>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {history.length}
              </div>
              <div className="text-sm text-gray-600">Total de análisis</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-danger-600">
                {history.filter((item) => item.isFake).length}
              </div>
              <div className="text-sm text-gray-600">Noticias falsas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success-600">
                {history.filter((item) => !item.isFake).length}
              </div>
              <div className="text-sm text-gray-600">Noticias confiables</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {Math.round(
                  history.reduce((acc, item) => acc + item.confidence, 0) /
                    history.length
                )}
                %
              </div>
              <div className="text-sm text-gray-600">Confianza promedio</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
