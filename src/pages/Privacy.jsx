import React from "react";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Política de Privacidad
            </h1>
            <p className="text-lg text-gray-600">
              Protección y gestión responsable de sus datos personales
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Información General
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Esta política de privacidad describe cómo recopilamos,
                utilizamos y protegemos su información personal cuando utiliza
                nuestra plataforma de detección de IA. Nos comprometemos a
                proteger su privacidad y a manejar sus datos de manera
                transparente y responsable.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Datos que Recopilamos
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Datos de Análisis
                  </h3>
                  <p className="text-blue-800">
                    Contenido que usted sube para análisis (texto, imágenes,
                    videos, audio, código). Estos datos se procesan únicamente
                    para realizar el análisis solicitado.
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">
                    Datos de Uso
                  </h3>
                  <p className="text-green-800">
                    Información sobre cómo utiliza nuestra plataforma,
                    incluyendo páginas visitadas, tiempo de uso y
                    funcionalidades utilizadas.
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h3 className="font-semibold text-yellow-900 mb-2">
                    Datos Técnicos
                  </h3>
                  <p className="text-yellow-800">
                    Información técnica como dirección IP, tipo de navegador,
                    sistema operativo y datos de cookies para mejorar la
                    experiencia del usuario.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Cómo Utilizamos sus Datos
              </h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>
                    Procesar y analizar el contenido que usted sube para
                    detectar IA
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>
                    Mejorar la precisión y eficiencia de nuestros algoritmos de
                    detección
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Proporcionar soporte técnico y resolver problemas</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>
                    Desarrollar nuevas funcionalidades y mejorar la plataforma
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Cumplir con obligaciones legales y regulatorias</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Protección de Datos
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Encriptación
                  </h3>
                  <p className="text-gray-700">
                    Todos los datos se transmiten y almacenan utilizando
                    encriptación de nivel empresarial para garantizar la máxima
                    seguridad.
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Acceso Limitado
                  </h3>
                  <p className="text-gray-700">
                    Solo personal autorizado tiene acceso a los datos, y
                    únicamente para fines específicos y legítimos.
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Retención Temporal
                  </h3>
                  <p className="text-gray-700">
                    Los datos de análisis se eliminan automáticamente después de
                    un período determinado para minimizar el riesgo de
                    exposición.
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Monitoreo Continuo
                  </h3>
                  <p className="text-gray-700">
                    Implementamos sistemas de monitoreo y auditoría para
                    detectar y prevenir accesos no autorizados.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Sus Derechos
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">
                    Acceso y Portabilidad
                  </h3>
                  <p className="text-green-800">
                    Puede solicitar una copia de sus datos personales en un
                    formato estructurado y legible.
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Rectificación
                  </h3>
                  <p className="text-blue-800">
                    Tiene derecho a corregir datos inexactos o incompletos que
                    tengamos sobre usted.
                  </p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <h3 className="font-semibold text-red-900 mb-2">
                    Eliminación
                  </h3>
                  <p className="text-red-800">
                    Puede solicitar la eliminación de sus datos personales en
                    ciertas circunstancias.
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h3 className="font-semibold text-yellow-900 mb-2">
                    Oposición
                  </h3>
                  <p className="text-yellow-800">
                    Puede oponerse al procesamiento de sus datos en ciertos
                    casos específicos.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Contacto
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Si tiene preguntas sobre esta política de privacidad o sobre
                cómo manejamos sus datos, puede contactarnos a través de:
              </p>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700">
                  <strong>Email:</strong> privacy@aidetector.com
                  <br />
                  <strong>Teléfono:</strong> +1 (555) 123-4567
                  <br />
                  <strong>Dirección:</strong> 123 Privacy Street, Security City,
                  SC 12345
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Actualizaciones
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Esta política de privacidad puede actualizarse periódicamente.
                Le notificaremos sobre cualquier cambio significativo a través
                de nuestra plataforma o por correo electrónico. La fecha de la
                última actualización se encuentra al final de este documento.
              </p>
              <p className="text-sm text-gray-500 mt-4">
                <strong>Última actualización:</strong>{" "}
                {new Date().toLocaleDateString("es-ES")}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
