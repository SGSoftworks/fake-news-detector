import {
  Shield,
  Users,
  Target,
  Award,
  BookOpen,
  Globe,
  Zap,
  Heart,
} from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Shield,
      title: "Protección Confiable",
      description:
        "Nuestro sistema utiliza algoritmos de IA avanzados para detectar patrones de noticias falsas con alta precisión.",
    },
    {
      icon: Zap,
      title: "Análisis Rápido",
      description:
        "Obtén resultados en segundos con nuestro sistema optimizado para análisis en tiempo real.",
    },
    {
      icon: Globe,
      title: "Enfoque en Español",
      description:
        "Especialmente diseñado para detectar noticias falsas en contenido en español.",
    },
    {
      icon: Users,
      title: "Fácil de Usar",
      description:
        "Interfaz intuitiva que permite a cualquier usuario verificar noticias sin conocimientos técnicos.",
    },
  ];

  const team = [
    {
      name: "Juan Gómez",
      role: "Desarrollador Frontend",
      description: "Especialista en React y diseño de interfaces de usuario.",
    },
    {
      name: "Iván Jair",
      role: "Desarrollador Backend",
      description: "Experto en APIs y sistemas de IA.",
    },
  ];

  const technologies = [
    "React.js",
    "Node.js",
    "Tailwind CSS",
    "Python",
    "BERT",
    "NLTK",
    "spaCy",
    "Scikit-learn",
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Acerca de <span className="text-primary-600">FakeNewsDetector</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Un sistema basado en Inteligencia Artificial para combatir la
            desinformación y promover la alfabetización digital en Colombia.
          </p>
          <div className="flex justify-center">
            <div className="bg-primary-100 p-4 rounded-full">
              <Shield className="h-12 w-12 text-primary-600" />
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="card">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nuestra Misión
            </h2>
            <p className="text-gray-600 mb-6">
              En un mundo donde la información se propaga más rápido que nunca,
              nuestro objetivo es proporcionar herramientas confiables para que
              los usuarios puedan distinguir entre noticias reales y falsas.
            </p>
            <p className="text-gray-600 mb-6">
              Creemos que la alfabetización digital es fundamental para una
              sociedad informada y democrática. Por eso, hemos desarrollado este
              sistema que combina tecnología de vanguardia con facilidad de uso.
            </p>
            <div className="flex items-center space-x-2 text-primary-600">
              <Heart className="h-5 w-5" />
              <span className="font-medium">Comprometidos con la verdad</span>
            </div>
          </div>
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-8 rounded-xl">
            <h3 className="text-xl font-semibold text-primary-900 mb-4">
              Impacto Esperado
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Target className="h-6 w-6 text-primary-600" />
                <span className="text-primary-800">
                  Reducción del 30% en propagación de noticias falsas
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="h-6 w-6 text-primary-600" />
                <span className="text-primary-800">
                  Mejora en la alfabetización digital
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Award className="h-6 w-6 text-primary-600" />
                <span className="text-primary-800">
                  Apoyo a periodistas y fact-checkers
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section>
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          ¿Por qué elegir nuestro sistema?
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
      </section>

      {/* Technologies Section */}
      <section className="card">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Tecnologías Utilizadas
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Frontend
            </h3>
            <div className="flex flex-wrap gap-2">
              {technologies.slice(0, 3).map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Backend & IA
            </h3>
            <div className="flex flex-wrap gap-2">
              {technologies.slice(3).map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-success-100 text-success-700 rounded-full text-sm font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section>
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Nuestro Equipo
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {team.map((member, index) => (
            <div key={index} className="card text-center">
              <div className="bg-gray-100 w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="h-12 w-12 text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                {member.name}
              </h3>
              <p className="text-primary-600 font-medium mb-3">{member.role}</p>
              <p className="text-gray-600">{member.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Project Info */}
      <section className="card bg-gray-50">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Información del Proyecto
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Detalles Técnicos
            </h3>
            <div className="space-y-3 text-gray-600">
              <div className="flex justify-between">
                <span>Metodología:</span>
                <span className="font-medium">
                  Cuantitativa, aplicada y experimental
                </span>
              </div>
              <div className="flex justify-between">
                <span>Enfoque:</span>
                <span className="font-medium">
                  Detección automática de noticias falsas
                </span>
              </div>
              <div className="flex justify-between">
                <span>Idioma:</span>
                <span className="font-medium">Español</span>
              </div>
              <div className="flex justify-between">
                <span>Precisión objetivo:</span>
                <span className="font-medium">95%</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Aspectos Éticos
            </h3>
            <div className="space-y-3 text-gray-600">
              <div className="flex items-start space-x-2">
                <Shield className="h-5 w-5 mt-0.5 text-primary-600" />
                <span>Uso responsable de IA</span>
              </div>
              <div className="flex items-start space-x-2">
                <BookOpen className="h-5 w-5 mt-0.5 text-primary-600" />
                <span>Transparencia algorítmica</span>
              </div>
              <div className="flex items-start space-x-2">
                <Users className="h-5 w-5 mt-0.5 text-primary-600" />
                <span>Respeto por datos personales</span>
              </div>
              <div className="flex items-start space-x-2">
                <Award className="h-5 w-5 mt-0.5 text-primary-600" />
                <span>Cumplimiento de marcos regulatorios</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="card text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          ¿Tienes preguntas?
        </h2>
        <p className="text-gray-600 mb-6">
          Estamos aquí para ayudarte. Si tienes alguna pregunta sobre nuestro
          sistema o quieres contribuir al proyecto, no dudes en contactarnos.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="btn-primary">Contactar Equipo</button>
          <button className="btn-secondary">Documentación Técnica</button>
        </div>
      </section>
    </div>
  );
};

export default About;
