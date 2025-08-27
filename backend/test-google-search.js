#!/usr/bin/env node

require("dotenv").config();
const axios = require("axios");

console.log("🧪 Probando Google Custom Search API");
console.log("====================================\n");

async function testGoogleSearch() {
  try {
    const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
    const searchEngineId = process.env.GOOGLE_CUSTOM_SEARCH_ID;

    if (!apiKey || !searchEngineId) {
      console.log("❌ Error: Credenciales no configuradas");
      console.log("Ejecuta: node setup-google-search.js");
      return;
    }

    console.log("✅ Credenciales encontradas");
    console.log(`🔑 API Key: ${apiKey.substring(0, 10)}...`);
    console.log(`🔍 Search Engine ID: ${searchEngineId}\n`);

    // Test de búsqueda
    console.log("🔍 Probando búsqueda...");
    const query = "noticias falsas Colombia";

    const response = await axios.get(
      "https://www.googleapis.com/customsearch/v1",
      {
        params: {
          key: apiKey,
          cx: searchEngineId,
          q: query,
          num: 3,
          lr: "lang_es",
          safe: "active",
        },
        timeout: 10000,
      }
    );

    if (response.data.items && response.data.items.length > 0) {
      console.log("✅ Búsqueda exitosa!");
      console.log(`📊 Encontrados ${response.data.items.length} resultados\n`);

      console.log("📰 Resultados de ejemplo:");
      response.data.items.slice(0, 2).forEach((item, index) => {
        console.log(`${index + 1}. ${item.title}`);
        console.log(`   Fuente: ${item.displayLink}`);
        console.log(`   URL: ${item.link}`);
        console.log("");
      });

      console.log("🎉 ¡Google Search API está funcionando correctamente!");
      console.log("\n🚀 Ahora puedes:");
      console.log("1. Reiniciar el servidor backend");
      console.log("2. Probar el análisis de noticias con verificación externa");
    } else {
      console.log("⚠️ No se encontraron resultados");
      console.log("Esto puede ser normal para algunas consultas");
    }
  } catch (error) {
    console.error("❌ Error en la prueba:", error.message);

    if (error.response) {
      console.log("Detalles del error:");
      console.log(`Status: ${error.response.status}`);
      console.log(`Data: ${JSON.stringify(error.response.data, null, 2)}`);
    }

    console.log("\n🔧 Posibles soluciones:");
    console.log("1. Verifica que las credenciales sean correctas");
    console.log("2. Asegúrate de que la API esté habilitada en Google Cloud");
    console.log("3. Verifica que el Search Engine ID sea correcto");
    console.log("4. Revisa los límites de cuota en Google Cloud Console");
  }
}

testGoogleSearch();
