// Servicio para gestión del historial de análisis
class HistoryService {
  constructor() {
    this.storageKey = "ai_detector_history";
    this.maxHistoryItems = 100;
  }

  // Guardar análisis en el historial
  saveAnalysis(analysis) {
    try {
      const history = this.getHistory();

      const newAnalysis = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...analysis,
      };

      history.unshift(newAnalysis);

      // Mantener solo los últimos análisis
      if (history.length > this.maxHistoryItems) {
        history.splice(this.maxHistoryItems);
      }

      localStorage.setItem(this.storageKey, JSON.stringify(history));
      return newAnalysis;
    } catch (error) {
      console.error("Error al guardar análisis:", error);
      return null;
    }
  }

  // Obtener todo el historial
  getHistory() {
    try {
      const history = localStorage.getItem(this.storageKey);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error("Error al obtener historial:", error);
      return [];
    }
  }

  // Obtener análisis por ID
  getAnalysisById(id) {
    const history = this.getHistory();
    return history.find(analysis => analysis.id === id);
  }

  // Filtrar historial por tipo
  filterByType(type) {
    const history = this.getHistory();
    return history.filter(analysis => analysis.type === type);
  }

  // Filtrar historial por rango de fechas
  filterByDateRange(startDate, endDate) {
    const history = this.getHistory();
    return history.filter(analysis => {
      const analysisDate = new Date(analysis.timestamp);
      return analysisDate >= startDate && analysisDate <= endDate;
    });
  }

  // Buscar en el historial
  searchHistory(query) {
    const history = this.getHistory();
    const searchTerm = query.toLowerCase();

    return history.filter(analysis => {
      return (
        analysis.content?.toLowerCase().includes(searchTerm) ||
        analysis.type?.toLowerCase().includes(searchTerm) ||
        analysis.analysis?.toLowerCase().includes(searchTerm)
      );
    });
  }

  // Obtener estadísticas del historial
  getHistoryStats() {
    const history = this.getHistory();

    const stats = {
      total: history.length,
      byType: {},
      averageConfidence: 0,
      averageAIProbability: 0,
      recentActivity: 0,
    };

    if (history.length === 0) return stats;

    // Estadísticas por tipo
    history.forEach(analysis => {
      const type = analysis.type || "unknown";
      stats.byType[type] = (stats.byType[type] || 0) + 1;
    });

    // Promedios
    const totalConfidence = history.reduce(
      (sum, analysis) => sum + (analysis.confidence || 0),
      0
    );
    const totalAIProb = history.reduce(
      (sum, analysis) => sum + (analysis.aiProbability || 0),
      0
    );

    stats.averageConfidence = Math.round(
      (totalConfidence / history.length) * 100
    );
    stats.averageAIProbability = Math.round(totalAIProb / history.length);

    // Actividad reciente (últimos 7 días)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    stats.recentActivity = history.filter(
      analysis => new Date(analysis.timestamp) > weekAgo
    ).length;

    return stats;
  }

  // Exportar historial
  exportHistory(format = "json") {
    const history = this.getHistory();

    switch (format.toLowerCase()) {
      case "json":
        return JSON.stringify(history, null, 2);

      case "csv":
        return this.convertToCSV(history);

      case "pdf":
        return this.convertToPDF(history);

      default:
        return JSON.stringify(history, null, 2);
    }
  }

  // Convertir a CSV
  convertToCSV(history) {
    if (history.length === 0) return "";

    const headers = [
      "ID",
      "Tipo",
      "Fecha",
      "Probabilidad IA",
      "Probabilidad Humano",
      "Confianza",
      "Contenido",
    ];
    const rows = history.map(analysis => [
      analysis.id,
      analysis.type,
      new Date(analysis.timestamp).toLocaleDateString("es-ES"),
      `${analysis.aiProbability}%`,
      `${analysis.humanProbability}%`,
      `${Math.round((analysis.confidence || 0) * 100)}%`,
      `"${(analysis.content || "").substring(0, 100)}..."`,
    ]);

    return [headers, ...rows].map(row => row.join(",")).join("\n");
  }

  // Convertir a PDF (simulado)
  convertToPDF(history) {
    // En una implementación real, usaría una librería como jsPDF
    return `PDF generado con ${history.length} análisis`;
  }

  // Limpiar historial
  clearHistory() {
    try {
      localStorage.removeItem(this.storageKey);
      return true;
    } catch (error) {
      console.error("Error al limpiar historial:", error);
      return false;
    }
  }

  // Eliminar análisis específico
  deleteAnalysis(id) {
    try {
      const history = this.getHistory();
      const filteredHistory = history.filter(analysis => analysis.id !== id);
      localStorage.setItem(this.storageKey, JSON.stringify(filteredHistory));
      return true;
    } catch (error) {
      console.error("Error al eliminar análisis:", error);
      return false;
    }
  }

  // Obtener análisis recientes
  getRecentAnalyses(limit = 10) {
    const history = this.getHistory();
    return history.slice(0, limit);
  }

  // Obtener análisis con alta probabilidad de IA
  getHighAIAnalyses(threshold = 70) {
    const history = this.getHistory();
    return history.filter(
      analysis => (analysis.aiProbability || 0) > threshold
    );
  }

  // Obtener análisis con alta probabilidad humana
  getHighHumanAnalyses(threshold = 70) {
    const history = this.getHistory();
    return history.filter(
      analysis => (analysis.humanProbability || 0) > threshold
    );
  }

  // Backup del historial
  backupHistory() {
    try {
      const history = this.getHistory();
      const backup = {
        timestamp: new Date().toISOString(),
        version: "1.0",
        data: history,
      };

      const backupKey = `${this.storageKey}_backup_${Date.now()}`;
      localStorage.setItem(backupKey, JSON.stringify(backup));

      // Mantener solo los últimos 5 backups
      this.cleanupBackups();

      return backupKey;
    } catch (error) {
      console.error("Error al crear backup:", error);
      return null;
    }
  }

  // Restaurar backup
  restoreBackup(backupKey) {
    try {
      const backupData = localStorage.getItem(backupKey);
      if (!backupData) return false;

      const backup = JSON.parse(backupData);
      localStorage.setItem(this.storageKey, JSON.stringify(backup.data));

      return true;
    } catch (error) {
      console.error("Error al restaurar backup:", error);
      return false;
    }
  }

  // Limpiar backups antiguos
  cleanupBackups() {
    try {
      const keys = Object.keys(localStorage);
      const backupKeys = keys.filter(key =>
        key.startsWith(`${this.storageKey}_backup_`)
      );

      if (backupKeys.length > 5) {
        backupKeys
          .sort()
          .slice(0, backupKeys.length - 5)
          .forEach(key => localStorage.removeItem(key));
      }
    } catch (error) {
      console.error("Error al limpiar backups:", error);
    }
  }

  // Sincronizar con servidor (futuro)
  async syncWithServer() {
    try {
      const history = this.getHistory();

      // Aquí se implementaría la sincronización con el servidor
      const response = await fetch("/api/history/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ history }),
      });

      if (response.ok) {
        const serverData = await response.json();
        // Actualizar con datos del servidor
        localStorage.setItem(
          this.storageKey,
          JSON.stringify(serverData.history)
        );
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error al sincronizar:", error);
      return false;
    }
  }
}

export default new HistoryService();
