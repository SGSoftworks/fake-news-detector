import React, { useState, useEffect } from "react";

const PlatformStats = () => {
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    aiDetected: 0,
    humanDetected: 0,
    accuracy: 0,
    activeUsers: 0,
  });

  useEffect(() => {
    // Simular carga de estadísticas
    const loadStats = () => {
      setTimeout(() => {
        setStats({
          totalAnalyses: 15420,
          aiDetected: 8234,
          humanDetected: 7186,
          accuracy: 94.2,
          activeUsers: 1247,
        });
      }, 1000);
    };

    loadStats();
  }, []);

  const statItems = [
    {
      title: "Análisis Totales",
      value: stats.totalAnalyses.toLocaleString(),
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      color: "blue",
    },
    {
      title: "IA Detectada",
      value: stats.aiDetected.toLocaleString(),
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      color: "red",
    },
    {
      title: "Contenido Humano",
      value: stats.humanDetected.toLocaleString(),
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
      color: "green",
    },
    {
      title: "Precisión",
      value: `${stats.accuracy}%`,
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      color: "purple",
    },
    {
      title: "Usuarios Activos",
      value: stats.activeUsers.toLocaleString(),
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          />
        </svg>
      ),
      color: "indigo",
    },
  ];

  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    red: "bg-red-50 text-red-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    indigo: "bg-indigo-50 text-indigo-600",
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Estadísticas de la Plataforma
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {statItems.map((item, index) => (
          <div
            key={index}
            className="text-center p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div
              className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${colorClasses[item.color]} mb-3`}
            >
              {item.icon}
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {item.value}
            </div>
            <div className="text-sm text-gray-600">{item.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlatformStats;
