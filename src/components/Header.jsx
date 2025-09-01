import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAnalysisDropdownOpen, setIsAnalysisDropdownOpen] = useState(false);

  const analysisItems = [
    { path: "/text-analysis", label: "Análisis de Texto", icon: "📝" },
    { path: "/image-analysis", label: "Análisis de Imágenes", icon: "🖼️" },
    { path: "/video-analysis", label: "Análisis de Videos", icon: "🎥" },
    { path: "/audio-analysis", label: "Análisis de Audio", icon: "🎵" },
    { path: "/code-analysis", label: "Análisis de Código", icon: "💻" },
    { path: "/academic-analysis", label: "Análisis Académico", icon: "📚" },
  ];

  const navItems = [
    { path: "/", label: "Inicio" },
    { path: "/history", label: "Historial" },
    { path: "/privacy", label: "Privacidad" },
    { path: "/security", label: "Seguridad" },
    { path: "/about", label: "Acerca de" },
  ];

  const isActive = path => location.pathname === path;
  const isAnalysisActive = () =>
    analysisItems.some(item => isActive(item.path));

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 relative">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
              <span className="text-white text-lg">🤖</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Detector de IA
              </h1>
              <p className="text-xs text-gray-500">
                Plataforma Integral de Detección
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {/* Analysis Dropdown */}
            <div className="relative">
              <button
                onClick={() =>
                  setIsAnalysisDropdownOpen(!isAnalysisDropdownOpen)
                }
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                  isAnalysisActive()
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <span>🔍</span>
                <span className="font-medium">Análisis</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isAnalysisDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="py-2">
                    {analysisItems.map(item => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsAnalysisDropdownOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-3 text-sm hover:bg-gray-50 transition-colors ${
                          isActive(item.path)
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-700"
                        }`}
                      >
                        <span className="text-lg">{item.icon}</span>
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Other Navigation Items */}
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                  isActive(item.path)
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              <div className="px-4 py-2">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  Análisis
                </h3>
                <div className="space-y-1">
                  {analysisItems.map(item => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm ${
                        isActive(item.path)
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-2">
                {navItems.map(item => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-2 text-sm ${
                      isActive(item.path)
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Overlay for dropdown */}
      {isAnalysisDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsAnalysisDropdownOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;
