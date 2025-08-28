// Script interactivo para configurar las APIs de IA
const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise(resolve => {
    rl.question(prompt, resolve);
  });
}

async function setupAPIs() {
  console.log(
    "🚀 Configuración de APIs de IA para Detector de Noticias Falsas"
  );
  console.log("=".repeat(60));
  console.log("Este script te ayudará a configurar las APIs de IA necesarias.");
  console.log("Puedes configurar una, varias o todas las APIs disponibles.\n");

  const envPath = path.join(__dirname, ".env");
  const envExamplePath = path.join(__dirname, "env.example");

  // Verificar si existe .env.example
  if (!fs.existsSync(envExamplePath)) {
    console.error("❌ No se encontró el archivo .env.example");
    console.log(
      "Por favor, asegúrate de que el archivo .env.example existe en el directorio backend/"
    );
    process.exit(1);
  }

  // Leer .env.example como base
  let envContent = fs.readFileSync(envExamplePath, "utf8");

  console.log("📋 APIs disponibles:");
  console.log("1. Hugging Face BERT - Análisis de sentimientos");
  console.log("2. Google Gemini - Análisis de texto avanzado");
  console.log("3. Configurar ambas APIs");
  console.log("4. Solo análisis local (sin APIs externas)\n");

  const choice = await question("Selecciona una opción (1-4): ");

  let huggingfaceKey = "";
  let perspectiveKey = "";

  switch (choice) {
    case "1":
      console.log("\n🤗 Configurando Hugging Face API...");
      console.log(
        "Obtén tu API key en: https://huggingface.co/settings/tokens"
      );
      huggingfaceKey = await question("Ingresa tu Hugging Face API Key: ");
      break;

    case "2":
      console.log("\n🔍 Configurando Google Gemini API...");
      console.log(
        "Obtén tu API key en: https://makersuite.google.com/app/apikey"
      );
      perspectiveKey = await question("Ingresa tu Google Gemini API Key: ");
      break;

    case "3":
      console.log("\n🔄 Configurando ambas APIs...");
      console.log("Obtén tus API keys en:");
      console.log("- Hugging Face: https://huggingface.co/settings/tokens");
      console.log("- Google Gemini: https://makersuite.google.com/app/apikey");

      huggingfaceKey = await question("Ingresa tu Hugging Face API Key: ");
      perspectiveKey = await question("Ingresa tu Google Gemini API Key: ");
      break;

    case "4":
      console.log("\n✅ Configurando solo análisis local...");
      console.log(
        "El sistema funcionará con el análisis local sin APIs externas."
      );
      break;

    default:
      console.log("❌ Opción inválida");
      process.exit(1);
  }

  if (huggingfaceKey) {
    envContent = envContent.replace(
      /HUGGINGFACE_API_KEY=.*/,
      `HUGGINGFACE_API_KEY=${huggingfaceKey}`
    );
    envContent = envContent.replace(
      /HUGGINGFACE_ENABLED=.*/,
      "HUGGINGFACE_ENABLED=true"
    );
  }

  if (perspectiveKey) {
    envContent = envContent.replace(
      /GEMINI_API_KEY=.*/,
      `GEMINI_API_KEY=${perspectiveKey}`
    );
    envContent = envContent.replace(/GEMINI_ENABLED=.*/, "GEMINI_ENABLED=true");
  }

  // Escribir el archivo .env
  try {
    fs.writeFileSync(envPath, envContent);
    console.log("\n✅ Archivo .env creado exitosamente!");

    console.log("\n📊 Resumen de configuración:");

    console.log(
      `   - Hugging Face: ${
        huggingfaceKey ? "✅ Configurado" : "❌ No configurado"
      }`
    );
    console.log(
      `   - Google Gemini: ${
        perspectiveKey ? "✅ Configurado" : "❌ No configurado"
      }`
    );

    console.log("\n🚀 Próximos pasos:");
    console.log("1. Reinicia el servidor backend: npm run dev");
    console.log("2. Ejecuta las pruebas: node test-ai-apis.js");
    console.log("3. Prueba el sistema completo: node test-system.js");

    if (huggingfaceKey || perspectiveKey) {
      console.log("\n⚠️  Notas importantes:");
      console.log("- Las APIs pueden tener costos asociados");
      console.log("- Revisa los límites de uso en cada plataforma");
      console.log(
        "- El análisis local siempre estará disponible como respaldo"
      );
    }
  } catch (error) {
    console.error("❌ Error al crear el archivo .env:", error.message);
    process.exit(1);
  }

  rl.close();
}

// Función para mostrar información sobre las APIs
function showAPIInfo() {
  console.log("\n📚 Información sobre las APIs:");
  console.log("=".repeat(40));

  console.log("\n🤗 Hugging Face BERT:");
  console.log("- Análisis de sentimientos y emociones");
  console.log("- Detección de polaridad en el texto");
  console.log("- Modelo multilingüe (español incluido)");
  console.log("- Costo: Gratuito (con límites)");

  console.log("\n🔍 Google Gemini:");
  console.log("- Análisis de texto avanzado con IA");
  console.log("- Detección de patrones de noticias falsas");
  console.log("- Explicaciones detalladas de los resultados");
  console.log("- Costo: Gratuito (con límites generosos)");

  console.log("\n🔧 Análisis Local:");
  console.log("- Algoritmos heurísticos locales");
  console.log("- Detección de patrones básicos");
  console.log("- Sin costos ni dependencias externas");
  console.log("- Siempre disponible como respaldo");
}

// Verificar si el usuario quiere información
async function main() {
  const showInfo = await question(
    "¿Quieres ver información sobre las APIs? (s/n): "
  );

  if (showInfo.toLowerCase() === "s" || showInfo.toLowerCase() === "si") {
    showAPIInfo();
  }

  await setupAPIs();
}

main().catch(console.error);
