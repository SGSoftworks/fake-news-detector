import React from "react";

const AnalysisLinks = ({ links, colorScheme = "blue" }) => {
  if (!links || links.length === 0) return null;

  const colorClasses = {
    blue: {
      title: "text-blue-600",
      hover: "hover:bg-blue-50",
      border: "border-blue-200",
    },
    green: {
      title: "text-green-600",
      hover: "hover:bg-green-50",
      border: "border-green-200",
    },
    purple: {
      title: "text-purple-600",
      hover: "hover:bg-purple-50",
      border: "border-purple-200",
    },
    orange: {
      title: "text-orange-600",
      hover: "hover:bg-orange-50",
      border: "border-orange-200",
    },
    gray: {
      title: "text-gray-600",
      hover: "hover:bg-gray-50",
      border: "border-gray-200",
    },
    indigo: {
      title: "text-indigo-600",
      hover: "hover:bg-indigo-50",
      border: "border-indigo-200",
    },
  };

  const colors = colorClasses[colorScheme] || colorClasses.blue;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Enlaces y Recursos</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {links.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`block p-4 bg-gray-50 rounded-lg border transition-all duration-200 ${colors.hover} ${colors.border} group`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div
                  className={`font-medium mb-1 group-hover:underline ${colors.title}`}
                >
                  {link.title}
                </div>
                <div className="text-sm text-gray-600 leading-relaxed">
                  {link.description}
                </div>
              </div>
              <div className="flex-shrink-0 ml-2">
                <svg
                  className={`w-4 h-4 ${colors.title} group-hover:translate-x-1 transition-transform duration-200`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">Enlace externo</div>
          </a>
        ))}
      </div>

      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-yellow-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-yellow-800">
              Información Importante
            </h4>
            <p className="text-sm text-yellow-700 mt-1">
              Estos enlaces te proporcionan recursos adicionales para comprender
              mejor los resultados del análisis y aprender más sobre la
              detección de contenido generado por IA.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisLinks;
