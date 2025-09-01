import React from "react";
import { Link } from "react-router-dom";
import PlatformStats from "../components/PlatformStats";

const Home = () => {
  const analysisTypes = [
    {
      title: "Análisis de Texto",
      description: "Detecta contenido generado por IA en textos escritos",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      link: "/text-analysis",
      color: "blue",
    },
    {
      title: "Análisis de Imágenes",
      description: "Identifica imágenes generadas por inteligencia artificial",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      link: "/image-analysis",
      color: "green",
    },
    {
      title: "Análisis de Video",
      description: "Detecta deepfakes y videos manipulados por IA",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      ),
      link: "/video-analysis",
      color: "purple",
    },
    {
      title: "Análisis de Audio",
      description: "Identifica voces sintéticas y audio generado por IA",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
        </svg>
      ),
      link: "/audio-analysis",
      color: "orange",
    },
    {
      title: "Análisis de Código",
      description: "Detecta código generado por IA en proyectos de desarrollo",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
          />
        </svg>
      ),
      link: "/code-analysis",
      color: "gray",
    },
    {
      title: "Análisis Académico",
      description: "Verifica la originalidad de trabajos académicos",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
      link: "/academic-analysis",
      color: "indigo",
    },
  ];

  const features = [
    {
      title: "Análisis Avanzado",
      description:
        "Utilizamos algoritmos de última generación para detectar contenido generado por IA con alta precisión.",
    },
    {
      title: "Múltiples Formatos",
      description:
        "Soporte para texto, imágenes, videos, audio, código y contenido académico.",
    },
    {
      title: "Resultados Detallados",
      description:
        "Obtén explicaciones claras y sugerencias para comprender mejor los resultados.",
    },
    {
      title: "Historial Completo",
      description:
        "Accede a tu historial de análisis con filtros y exportación de datos.",
    },
    {
      title: "Privacidad Garantizada",
      description:
        "Tus datos están protegidos con las mejores prácticas de seguridad y privacidad.",
    },
    {
      title: "Interfaz Intuitiva",
      description:
        "Diseño responsive y fácil de usar para una experiencia óptima.",
    },
  ];

  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 hover:bg-blue-100",
    green: "bg-green-50 text-green-600 hover:bg-green-100",
    purple: "bg-purple-50 text-purple-600 hover:bg-purple-100",
    orange: "bg-orange-50 text-orange-600 hover:bg-orange-100",
    gray: "bg-gray-50 text-gray-600 hover:bg-gray-100",
    indigo: "bg-indigo-50 text-indigo-600 hover:bg-indigo-100",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Detector de IA
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Plataforma integral para detectar contenido generado por
              inteligencia artificial
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/text-analysis"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Comenzar Análisis
              </Link>
              <Link
                to="/history"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Ver Historial
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas de la Plataforma */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <PlatformStats />
      </div>

      {/* Tipos de Análisis */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Tipos de Análisis Disponibles
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Detecta contenido generado por IA en múltiples formatos con nuestra
            tecnología avanzada
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {analysisTypes.map((type, index) => (
            <Link
              key={index}
              to={type.link}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow group"
            >
              <div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-lg ${colorClasses[type.color]} mb-4 group-hover:scale-110 transition-transform`}
              >
                {type.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {type.title}
              </h3>
              <p className="text-gray-600">{type.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Características */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Características Principales
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Descubre por qué nuestra plataforma es la elección preferida para
              la detección de IA
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-blue-600"
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
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">¿Listo para comenzar?</h2>
          <p className="text-xl mb-8">
            Únete a miles de usuarios que confían en nuestra plataforma para
            detectar contenido generado por IA
          </p>
          <Link
            to="/text-analysis"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Comenzar Ahora
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
