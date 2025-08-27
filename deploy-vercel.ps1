# 🚀 Script de Despliegue en Vercel (PowerShell)
# Sistema de Detección de Noticias Falsas

Write-Host "🚀 Iniciando despliegue en Vercel..." -ForegroundColor Green
Write-Host ""

# Verificar si Vercel CLI está instalado
try {
    $vercelVersion = vercel --version 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "Vercel CLI no encontrado"
    }
    Write-Host "✅ Vercel CLI encontrado: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI no está instalado" -ForegroundColor Red
    Write-Host "📦 Instalando Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

# Verificar si estamos en la raíz del proyecto
if (-not (Test-Path "package.json") -or -not (Test-Path "vercel.json")) {
    Write-Host "❌ No estás en la raíz del proyecto" -ForegroundColor Red
    Write-Host "📁 Navega a la carpeta raíz del proyecto" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Verificando configuración..." -ForegroundColor Green

# Verificar archivos necesarios
if (-not (Test-Path "backend/server.js")) {
    Write-Host "❌ No se encontró backend/server.js" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "src/main.jsx")) {
    Write-Host "❌ No se encontró src/main.jsx" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Archivos de configuración encontrados" -ForegroundColor Green
Write-Host ""

# Verificar variables de entorno
Write-Host "📋 Variables de entorno requeridas:" -ForegroundColor Cyan
Write-Host "   - GEMINI_API_KEY" -ForegroundColor White
Write-Host "   - HUGGING_FACE_API_KEY" -ForegroundColor White
Write-Host "   - GOOGLE_SEARCH_API_KEY" -ForegroundColor White
Write-Host "   - GOOGLE_CUSTOM_SEARCH_ID" -ForegroundColor White
Write-Host ""

Write-Host "⚠️  IMPORTANTE: Asegúrate de configurar las variables de entorno en el dashboard de Vercel" -ForegroundColor Yellow
Write-Host ""

# Preguntar si continuar
$continue = Read-Host "¿Continuar con el despliegue? (y/N)"
if ($continue -ne "y" -and $continue -ne "Y") {
    Write-Host "❌ Despliegue cancelado" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🚀 Iniciando despliegue..." -ForegroundColor Green

# Desplegar en Vercel
vercel --prod

Write-Host ""
Write-Host "✅ Despliegue completado!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos pasos:" -ForegroundColor Cyan
Write-Host "1. Ve al dashboard de Vercel" -ForegroundColor White
Write-Host "2. Configura las variables de entorno" -ForegroundColor White
Write-Host "3. Prueba tu aplicación" -ForegroundColor White
Write-Host ""
Write-Host "🔗 Tu aplicación estará disponible en: https://tu-proyecto.vercel.app" -ForegroundColor Green
Write-Host ""
Write-Host "📚 Para más información, consulta: DEPLOY-VERCEL.md" -ForegroundColor Cyan
