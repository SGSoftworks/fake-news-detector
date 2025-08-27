import { Link } from "react-router-dom";
import {
  Shield,
  Search,
  TrendingUp,
  Users,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

const Home = () => {
  const features = [
    {
      icon: Search,
      title: "Análisis Inteligente",
      description:
        "Utilizamos algoritmos de IA avanzados para detectar patrones de noticias falsas en tiempo real.",
    },
    {
      icon: Shield,
      title: "Protección Confiable",
      description:
        "Nuestro sistema está diseñado para proteger a los usuarios de la desinformación digital.",
    },
    {
      icon: TrendingUp,
      title: "Precisión Alta",
      description:
        "Algoritmos entrenados con miles de ejemplos para máxima precisión en la detección.",
    },
    {
      icon: Users,
      title: "Fácil de Usar",
      description:
        "Interfaz intuitiva que permite a cualquier usuario verificar noticias sin conocimientos técnicos.",
    },
  ];

  const stats = [
    { label: "Noticias Analizadas", value: "10,000+", icon: Search },
    { label: "Precisión del Sistema", value: "95%", icon: CheckCircle },
    { label: "Usuarios Activos", value: "5,000+", icon: Users },
    { label: "Alertas Generadas", value: "2,500+", icon: AlertTriangle },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Detecta Noticias Falsas con
            <span className="text-primary-600"> Inteligencia Artificial</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Protege tu información y combate la desinformación con nuestro
            sistema avanzado de detección de noticias falsas en español.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/analysis"
              className="btn-primary text-lg px-8 py-3 inline-flex items-center justify-center"
            >
              <Search className="mr-2 h-5 w-5" />
              Analizar Noticia
            </Link>
            <Link
              to="/about"
              className="btn-secondary text-lg px-8 py-3 inline-flex items-center justify-center"
            >
              <Shield className="mr-2 h-5 w-5" />
              Conoce Más
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            ¿Por qué elegir nuestro detector?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="card text-center">
                  <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white rounded-xl shadow-lg">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Nuestros Números
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-primary-600" />
                  </div>
                  <div className="text-3xl font-bold text-primary-600 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para proteger tu información?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Únete a miles de usuarios que ya confían en nuestro sistema para
            detectar noticias falsas.
          </p>
          <Link
            to="/analysis"
            className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg inline-flex items-center transition-colors duration-200"
          >
            <Search className="mr-2 h-5 w-5" />
            Empezar Ahora
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
