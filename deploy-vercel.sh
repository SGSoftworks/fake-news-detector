#!/bin/bash

# 🚀 Script de Despliegue en Vercel
# Sistema de Detección de Noticias Falsas

echo "🚀 Iniciando despliegue en Vercel..."
echo ""

# Verificar si Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI no está instalado"
    echo "📦 Instalando Vercel CLI..."
    npm install -g vercel
fi

# Verificar si estamos en la raíz del proyecto
if [ ! -f "package.json" ] || [ ! -f "vercel.json" ]; then
    echo "❌ No estás en la raíz del proyecto"
    echo "📁 Navega a la carpeta raíz del proyecto"
    exit 1
fi

echo "✅ Verificando configuración..."

# Verificar archivos necesarios
if [ ! -f "backend/server.js" ]; then
    echo "❌ No se encontró backend/server.js"
    exit 1
fi

if [ ! -f "src/main.jsx" ]; then
    echo "❌ No se encontró src/main.jsx"
    exit 1
fi

echo "✅ Archivos de configuración encontrados"
echo ""

# Verificar variables de entorno
echo "📋 Variables de entorno requeridas:"
echo "   - GEMINI_API_KEY"
echo "   - HUGGING_FACE_API_KEY"
echo "   - GOOGLE_SEARCH_API_KEY"
echo "   - GOOGLE_CUSTOM_SEARCH_ID"
echo ""

echo "⚠️  IMPORTANTE: Asegúrate de configurar las variables de entorno en el dashboard de Vercel"
echo ""

# Preguntar si continuar
read -p "¿Continuar con el despliegue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Despliegue cancelado"
    exit 1
fi

echo ""
echo "🚀 Iniciando despliegue..."

# Desplegar en Vercel
vercel --prod

echo ""
echo "✅ Despliegue completado!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Ve al dashboard de Vercel"
echo "2. Configura las variables de entorno"
echo "3. Prueba tu aplicación"
echo ""
echo "🔗 Tu aplicación estará disponible en: https://tu-proyecto.vercel.app"
echo ""
echo "📚 Para más información, consulta: DEPLOY-VERCEL.md"
