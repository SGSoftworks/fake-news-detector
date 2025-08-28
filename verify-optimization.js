#!/usr/bin/env node

/**
 * Script de verificación de optimizaciones
 * Verifica que todas las mejoras implementadas funcionen correctamente
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("🔍 Verificando optimizaciones del proyecto...\n");

// Función para ejecutar comandos de forma segura
function runCommand(command, description) {
  try {
    console.log(`📋 ${description}...`);
    const result = execSync(command, { encoding: "utf8", stdio: "pipe" });
    console.log(`✅ ${description} - EXITOSO`);
    return true;
  } catch (error) {
    console.log(`❌ ${description} - FALLÓ`);
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

// Función para verificar que un archivo existe
function checkFileExists(filePath, description) {
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${description} - EXISTE`);
    return true;
  } else {
    console.log(`❌ ${description} - NO EXISTE`);
    return false;
  }
}

// Verificaciones
let allChecksPassed = true;

console.log("📁 Verificando archivos de configuración...\n");

// Verificar archivos de configuración
allChecksPassed &= checkFileExists(
  "eslint.config.js",
  "Configuración ESLint principal"
);
allChecksPassed &= checkFileExists(
  "backend/.eslintrc.js",
  "Configuración ESLint backend"
);
allChecksPassed &= checkFileExists(".prettierrc", "Configuración Prettier");
allChecksPassed &= checkFileExists(".gitignore", "Archivo .gitignore");
allChecksPassed &= checkFileExists(
  "OPTIMIZATION-SUMMARY.md",
  "Documentación de optimizaciones"
);

console.log("\n🔧 Verificando linting...\n");

// Verificar linting
allChecksPassed &= runCommand("npm run lint", "Linting del frontend");
allChecksPassed &= runCommand("npm run backend:lint", "Linting del backend");

console.log("\n⚡ Verificando build...\n");

// Verificar build
allChecksPassed &= runCommand("npm run build", "Build de producción");

console.log("\n📊 Verificando scripts disponibles...\n");

// Verificar que los scripts están disponibles
const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
const requiredScripts = [
  "lint",
  "lint:fix",
  "format",
  "clean",
  "analyze",
  "backend:dev",
  "backend:lint",
];

requiredScripts.forEach(script => {
  if (packageJson.scripts[script]) {
    console.log(`✅ Script '${script}' - DISPONIBLE`);
  } else {
    console.log(`❌ Script '${script}' - NO DISPONIBLE`);
    allChecksPassed = false;
  }
});

console.log("\n📦 Verificando dependencias...\n");

// Verificar dependencias importantes
const requiredDeps = ["terser", "prettier", "eslint"];
requiredDeps.forEach(dep => {
  if (packageJson.devDependencies[dep]) {
    console.log(`✅ Dependencia '${dep}' - INSTALADA`);
  } else {
    console.log(`❌ Dependencia '${dep}' - NO INSTALADA`);
    allChecksPassed = false;
  }
});

console.log("\n" + "=".repeat(50));
console.log("📋 RESUMEN DE VERIFICACIÓN");
console.log("=".repeat(50));

if (allChecksPassed) {
  console.log("🎉 ¡TODAS LAS VERIFICACIONES PASARON EXITOSAMENTE!");
  console.log("✅ El proyecto está completamente optimizado");
  console.log("✅ No hay errores de linting");
  console.log("✅ El build funciona correctamente");
  console.log("✅ Todas las herramientas están configuradas");

  console.log("\n🚀 Próximos pasos recomendados:");
  console.log("1. Ejecutar: npm run format (para formatear todo el código)");
  console.log("2. Ejecutar: npm run analyze (para analizar el bundle)");
  console.log("3. Probar el desarrollo: npm run dev");
  console.log("4. Probar el backend: npm run backend:dev");

  process.exit(0);
} else {
  console.log("❌ ALGUNAS VERIFICACIONES FALLARON");
  console.log("🔧 Revisa los errores arriba y corrígelos");
  process.exit(1);
}
