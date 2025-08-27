#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("🔧 Configuración de Google Custom Search API");
console.log("============================================\n");

console.log("📋 Pasos para obtener las credenciales:");
console.log("1. Ve a https://console.cloud.google.com/");
console.log("2. Crea un proyecto o selecciona uno existente");
console.log('3. Habilita "Custom Search API"');
console.log("4. Crea credenciales (API Key)");
console.log("5. Ve a https://programmablesearchengine.google.com/");
console.log("6. Crea un motor de búsqueda para toda la web");
console.log("7. Copia el Search Engine ID\n");

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupGoogleSearch() {
  try {
    const apiKey = await question("🔑 Google Search API Key: ");
    const searchEngineId = await question("🔍 Search Engine ID: ");

    if (!apiKey || !searchEngineId) {
      console.log("❌ Error: Ambas credenciales son requeridas");
      return;
    }

    // Leer archivo .env existente o crear uno nuevo
    const envPath = path.join(__dirname, ".env");
    let envContent = "";

    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, "utf8");
    }

    // Actualizar o agregar las variables
    const lines = envContent.split("\n");
    let apiKeyFound = false;
    let searchIdFound = false;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith("GOOGLE_SEARCH_API_KEY=")) {
        lines[i] = `GOOGLE_SEARCH_API_KEY=${apiKey}`;
        apiKeyFound = true;
      }
      if (lines[i].startsWith("GOOGLE_CUSTOM_SEARCH_ID=")) {
        lines[i] = `GOOGLE_CUSTOM_SEARCH_ID=${searchEngineId}`;
        searchIdFound = true;
      }
    }

    if (!apiKeyFound) {
      lines.push(`GOOGLE_SEARCH_API_KEY=${apiKey}`);
    }
    if (!searchIdFound) {
      lines.push(`GOOGLE_CUSTOM_SEARCH_ID=${searchEngineId}`);
    }

    // Agregar otras variables necesarias si no existen
    const requiredVars = [
      "VERIFICATION_ENABLED=true",
      "SOURCE_ANALYSIS_ENABLED=true",
      "MAX_SEARCH_RESULTS=10",
      "VERIFICATION_TIMEOUT=10000",
    ];

    requiredVars.forEach((varName) => {
      const varKey = varName.split("=")[0];
      if (!lines.some((line) => line.startsWith(varKey + "="))) {
        lines.push(varName);
      }
    });

    // Escribir archivo .env
    fs.writeFileSync(envPath, lines.join("\n"));

    console.log("\n✅ Configuración completada exitosamente!");
    console.log("📁 Archivo .env actualizado");
    console.log("\n🚀 Para probar la configuración:");
    console.log("1. Reinicia el servidor backend");
    console.log("2. Analiza una noticia en la aplicación");
    console.log(
      '3. Verifica que aparezcan "Fuentes consultadas" en los resultados'
    );
  } catch (error) {
    console.error("❌ Error durante la configuración:", error.message);
  } finally {
    rl.close();
  }
}

setupGoogleSearch();
