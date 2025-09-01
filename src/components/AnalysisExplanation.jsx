import React, { useState } from "react";

const AnalysisExplanation = ({ explanation }) => {
  const [activeTab, setActiveTab] = useState("user");

  if (!explanation) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">
        Explicación del Resultado
      </h3>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("user")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "user"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Para Usuarios
          </button>
          <button
            onClick={() => setActiveTab("developer")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "developer"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Para Desarrolladores
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="mt-4">
        {activeTab === "user" && (
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-green-800 mb-2">
                  Explicación para Usuarios
                </h4>
                <p className="text-sm text-green-700 leading-relaxed">
                  {explanation.user}
                </p>
                <div className="mt-3 p-3 bg-white rounded border border-green-200">
                  <h5 className="text-xs font-medium text-green-800 mb-1">
                    ¿Qué significa esto?
                  </h5>
                  <p className="text-xs text-green-700">
                    Esta explicación está diseñada para ser fácil de entender,
                    sin términos técnicos complejos. Te ayuda a comprender por
                    qué el sistema llegó a esta conclusión sobre el contenido
                    analizado.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "developer" && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-blue-800 mb-2">
                  Explicación Técnica
                </h4>
                <p className="text-sm text-blue-700 leading-relaxed">
                  {explanation.developer}
                </p>
                <div className="mt-3 p-3 bg-white rounded border border-blue-200">
                  <h5 className="text-xs font-medium text-blue-800 mb-1">
                    Detalles Técnicos
                  </h5>
                  <p className="text-xs text-blue-700">
                    Esta explicación incluye detalles sobre los algoritmos
                    utilizados, métricas de análisis y metodologías de detección
                    aplicadas en el proceso de análisis.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisExplanation;
