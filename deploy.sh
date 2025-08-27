#!/bin/bash

echo "🚀 Iniciando despliegue a producción..."
echo "======================================"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para imprimir mensajes
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verificar que estamos en la carpeta correcta
if [ ! -f "package.json" ]; then
    print_error "No se encontró package.json. Asegúrate de estar en la carpeta raíz del proyecto."
    exit 1
fi

print_status "Verificando estructura del proyecto..."

# Verificar que existe la carpeta backend
if [ ! -d "backend" ]; then
    print_error "No se encontró la carpeta backend."
    exit 1
fi

# Verificar que existe la carpeta src
if [ ! -d "src" ]; then
    print_error "No se encontró la carpeta src."
    exit 1
fi

print_status "Estructura del proyecto verificada"

# Paso 1: Construir el frontend
echo ""
print_status "Construyendo el frontend..."
npm run build

if [ $? -eq 0 ]; then
    print_status "Frontend construido exitosamente"
else
    print_error "Error al construir el frontend"
    exit 1
fi

# Paso 2: Verificar que se creó la carpeta dist
if [ ! -d "dist" ]; then
    print_error "No se creó la carpeta dist. Verifica el build."
    exit 1
fi

print_status "Carpeta dist creada correctamente"

# Paso 3: Instrucciones para el usuario
echo ""
echo "🎯 Próximos pasos para completar el despliegue:"
echo "=============================================="
echo ""
echo "1. 🌐 DESPLEGAR BACKEND EN VERCEL:"
echo "   cd backend"
echo "   npm install -g vercel"
echo "   vercel login"
echo "   vercel"
echo ""
echo "2. 🔧 CONFIGURAR VARIABLES DE ENTORNO EN VERCEL:"
echo "   - Ve a tu dashboard de Vercel"
echo "   - Settings > Environment Variables"
echo "   - Agrega todas las variables del archivo .env"
echo ""
echo "3. 🌍 DESPLEGAR FRONTEND EN NETLIFY:"
echo "   - Ve a netlify.com"
echo "   - New site from Git"
echo "   - Selecciona tu repositorio"
echo "   - Build command: npm run build"
echo "   - Publish directory: dist"
echo ""
echo "4. ⚙️ CONFIGURAR VARIABLES EN NETLIFY:"
echo "   - Site settings > Environment variables"
echo "   - VITE_API_BASE_URL=https://tu-backend-url.vercel.app/api"
echo ""
echo "5. 🔗 CONECTAR FRONTEND CON BACKEND:"
echo "   - Actualiza VITE_API_BASE_URL con la URL real del backend"
echo "   - Trigger deploy en Netlify"
echo ""

print_status "Script de preparación completado"
print_warning "Sigue los pasos anteriores para completar el despliegue"

echo ""
echo "📚 Documentación completa: DEPLOY-NETLIFY.md"
echo "🔧 Configuración de APIs: GOOGLE-SEARCH-SETUP.md"
echo ""
