import React from "react";

const Security = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Seguridad y Protección
            </h1>
            <p className="text-lg text-gray-600">
              Medidas de seguridad implementadas para proteger su información
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Arquitectura de Seguridad
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Nuestra plataforma implementa múltiples capas de seguridad para
                garantizar la protección integral de sus datos y la privacidad
                de su información.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                  <h3 className="font-semibold text-red-900 mb-2">
                    Encriptación de Datos
                  </h3>
                  <p className="text-red-800 text-sm">
                    Todos los datos se encriptan tanto en tránsito (TLS 1.3)
                    como en reposo (AES-256) para garantizar la máxima
                    protección.
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Autenticación Multi-Factor
                  </h3>
                  <p className="text-blue-800 text-sm">
                    Implementamos sistemas de autenticación robustos para
                    prevenir accesos no autorizados a la plataforma.
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <h3 className="font-semibold text-green-900 mb-2">
                    Monitoreo Continuo
                  </h3>
                  <p className="text-green-800 text-sm">
                    Sistemas de detección de intrusiones y monitoreo 24/7 para
                    identificar y responder a amenazas en tiempo real.
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                  <h3 className="font-semibold text-yellow-900 mb-2">
                    Backups Seguros
                  </h3>
                  <p className="text-yellow-800 text-sm">
                    Copias de seguridad encriptadas y redundantes para
                    garantizar la disponibilidad y recuperación de datos.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Protección de Datos
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Anonimización
                  </h3>
                  <p className="text-gray-700">
                    Los datos personales se anonimizan automáticamente durante
                    el procesamiento para minimizar el riesgo de identificación.
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Retención Limitada
                  </h3>
                  <p className="text-gray-700">
                    Los datos de análisis se eliminan automáticamente después de
                    un período determinado, siguiendo el principio de
                    minimización de datos.
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Acceso Controlado
                  </h3>
                  <p className="text-gray-700">
                    Solo personal autorizado con credenciales específicas puede
                    acceder a los datos, y todas las acciones se registran para
                    auditoría.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Cumplimiento Normativo
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-indigo-50 rounded-lg text-center">
                  <h3 className="font-semibold text-indigo-900 mb-2">GDPR</h3>
                  <p className="text-indigo-800 text-sm">
                    Cumplimiento total con el Reglamento General de Protección
                    de Datos de la UE
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg text-center">
                  <h3 className="font-semibold text-purple-900 mb-2">CCPA</h3>
                  <p className="text-purple-800 text-sm">
                    Adherencia a la Ley de Privacidad del Consumidor de
                    California
                  </p>
                </div>
                <div className="p-4 bg-teal-50 rounded-lg text-center">
                  <h3 className="font-semibold text-teal-900 mb-2">
                    ISO 27001
                  </h3>
                  <p className="text-teal-800 text-sm">
                    Certificación de gestión de seguridad de la información
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Medidas de Seguridad Técnica
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Firewall y Protección de Red
                  </h3>
                  <ul className="text-blue-800 space-y-1">
                    <li>• Firewalls de nueva generación (NGFW)</li>
                    <li>• Protección contra DDoS</li>
                    <li>• Segmentación de red</li>
                    <li>• Monitoreo de tráfico en tiempo real</li>
                  </ul>
                </div>
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">
                    Seguridad de Aplicaciones
                  </h3>
                  <ul className="text-green-800 space-y-1">
                    <li>• Análisis estático de código (SAST)</li>
                    <li>• Análisis dinámico de aplicaciones (DAST)</li>
                    <li>• Protección contra inyección SQL</li>
                    <li>• Validación de entrada de datos</li>
                  </ul>
                </div>
                <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg">
                  <h3 className="font-semibold text-red-900 mb-2">
                    Gestión de Vulnerabilidades
                  </h3>
                  <ul className="text-red-800 space-y-1">
                    <li>• Escaneo regular de vulnerabilidades</li>
                    <li>• Parches de seguridad automáticos</li>
                    <li>• Gestión de dependencias</li>
                    <li>• Evaluación continua de riesgos</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Respuesta a Incidentes
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h3 className="font-semibold text-orange-900 mb-2">
                    Plan de Respuesta
                  </h3>
                  <p className="text-orange-800">
                    Contamos con un plan detallado de respuesta a incidentes que
                    incluye identificación, contención, erradicación y
                    recuperación de amenazas de seguridad.
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-semibold text-purple-900 mb-2">
                    Equipo de Seguridad
                  </h3>
                  <p className="text-purple-800">
                    Un equipo dedicado de expertos en seguridad monitorea la
                    plataforma 24/7 y responde inmediatamente a cualquier
                    amenaza detectada.
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Notificación Transparente
                  </h3>
                  <p className="text-blue-800">
                    En caso de incidente de seguridad, notificamos a los
                    usuarios afectados de manera transparente y proporcionamos
                    orientación sobre las medidas a tomar.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Auditorías y Certificaciones
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Auditorías Regulares
                  </h3>
                  <p className="text-gray-700">
                    Realizamos auditorías de seguridad internas y externas de
                    forma regular para verificar el cumplimiento de nuestros
                    estándares de seguridad.
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Certificaciones
                  </h3>
                  <p className="text-gray-700">
                    Mantenemos certificaciones de seguridad reconocidas
                    internacionalmente que validan nuestras prácticas de
                    protección de datos.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Reporte de Vulnerabilidades
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Si descubre una vulnerabilidad de seguridad en nuestra
                plataforma, le invitamos a reportarla de manera responsable a
                través de nuestro programa de divulgación de vulnerabilidades.
              </p>
              <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                <h3 className="font-semibold text-yellow-900 mb-2">
                  Contacto de Seguridad
                </h3>
                <p className="text-yellow-800">
                  <strong>Email:</strong> security@aidetector.com
                  <br />
                  <strong>PGP Key:</strong> Disponible en nuestra página de
                  seguridad
                  <br />
                  <strong>Respuesta:</strong> Nos comprometemos a responder en
                  un máximo de 48 horas
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Security;
