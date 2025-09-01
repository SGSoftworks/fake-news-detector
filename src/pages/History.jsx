import React, { useState, useEffect } from "react";
import historyService from "../services/historyService";

const History = () => {
  const [analyses, setAnalyses] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    setLoading(true);
    try {
      const history = historyService.getHistory();
      setAnalyses(history);
      setStats(historyService.getHistoryStats());
    } catch (error) {
      console.error("Error al cargar historial:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAnalyses = analyses.filter(analysis => {
    // Filtro por tipo
    let matchesFilter = true;
    if (filter === "high-ai")
      matchesFilter = (analysis.aiProbability || 0) > 70;
    else if (filter === "high-human")
      matchesFilter = (analysis.humanProbability || 0) > 70;
    else if (filter !== "all") matchesFilter = analysis.type === filter;

    // Filtro por búsqueda
    let matchesSearch = true;
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      matchesSearch =
        analysis.content?.toLowerCase().includes(searchLower) ||
        analysis.type?.toLowerCase().includes(searchLower);
    }

    return matchesFilter && matchesSearch;
  });

  const getStatusColor = status => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleClearHistory = () => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar todo el historial?")
    ) {
      historyService.clearHistory();
      loadHistory();
    }
  };

  const handleExportHistory = (format = "json") => {
    const data = historyService.exportHistory(format);
    const blob = new Blob([data], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `historial_analisis.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteAnalysis = id => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar este análisis?")
    ) {
      historyService.deleteAnalysis(id);
      loadHistory();
    }
  };

  const getTypeColor = type => {
    switch (type) {
      case "Texto":
        return "bg-blue-100 text-blue-800";
      case "Imagen":
        return "bg-green-100 text-green-800";
      case "Video":
        return "bg-purple-100 text-purple-800";
      case "Audio":
        return "bg-orange-100 text-orange-800";
      case "Código":
        return "bg-gray-100 text-gray-800";
      case "Académico":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Historial de Análisis
            </h1>
            <p className="text-lg text-gray-600">
              Revisa todos tus análisis anteriores y resultados
            </p>
          </div>

          {/* Estadísticas */}
          {stats && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Estadísticas del Historial
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.totalAnalyses}
                  </div>
                  <div className="text-sm text-gray-600">Total Análisis</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {stats.avgHumanProbability}%
                  </div>
                  <div className="text-sm text-gray-600">Promedio Humano</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {stats.avgAIProbability}%
                  </div>
                  <div className="text-sm text-gray-600">Promedio IA</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {stats.avgConfidence}%
                  </div>
                  <div className="text-sm text-gray-600">
                    Confianza Promedio
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Filtros y búsqueda */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 mb-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Buscar en el historial..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={filter}
                  onChange={e => setFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Todos los tipos</option>
                  <option value="Texto">Texto</option>
                  <option value="Imagen">Imagen</option>
                  <option value="Video">Video</option>
                  <option value="Audio">Audio</option>
                  <option value="Código">Código</option>
                  <option value="Académico">Académico</option>
                  <option value="high-ai">Alta Probabilidad IA</option>
                  <option value="high-human">Alta Probabilidad Humano</option>
                </select>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleClearHistory}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Limpiar Historial
              </button>
              <button
                onClick={() => handleExportHistory("json")}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Exportar JSON
              </button>
              <button
                onClick={() => handleExportHistory("csv")}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Exportar CSV
              </button>
              <button
                onClick={() => handleExportHistory("pdf")}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Exportar PDF
              </button>
            </div>
          </div>

          {/* Lista de análisis */}
          <div className="space-y-4">
            {filteredAnalyses.map(analysis => (
              <div
                key={analysis.id}
                className="bg-white rounded-lg shadow-lg p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div className="flex items-center space-x-4 mb-4 md:mb-0">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(analysis.type)}`}
                    >
                      {analysis.type}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(analysis.status)}`}
                    >
                      {analysis.status === "completed"
                        ? "Completado"
                        : analysis.status === "processing"
                          ? "Procesando"
                          : "Fallido"}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(analysis.date).toLocaleDateString("es-ES")}
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Contenido Analizado
                  </h3>
                  <p className="text-gray-600 text-sm">{analysis.content}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {analysis.aiProbability}%
                    </div>
                    <div className="text-sm text-gray-600">Probabilidad IA</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {analysis.humanProbability}%
                    </div>
                    <div className="text-sm text-gray-600">
                      Probabilidad Humano
                    </div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.round(analysis.confidence * 100)}%
                    </div>
                    <div className="text-sm text-gray-600">Confianza</div>
                  </div>
                </div>

                <div className="mt-4 flex justify-end space-x-2">
                  <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800">
                    Ver Detalles
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800">
                    Descargar Reporte
                  </button>
                  <button
                    onClick={() => handleDeleteAnalysis(analysis.id)}
                    className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredAnalyses.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No hay análisis para mostrar
              </h3>
              <p className="text-gray-600">
                Realiza tu primer análisis para ver el historial aquí
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
