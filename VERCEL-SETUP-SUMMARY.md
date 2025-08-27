# 📋 Resumen de Configuración para Vercel

## ✅ Cambios Realizados

### 1. Archivos de Configuración Creados/Modificados

- ✅ **`vercel.json`** - Configuración principal de Vercel
- ✅ **`package.json`** - Agregado script `vercel-build`
- ✅ **`backend/server.js`** - Actualizado para funcionar en Vercel
- ✅ **`src/services/aiService.js`** - URL actualizada a `/api`
- ✅ **`README.md`** - Sección de despliegue actualizada

### 2. Scripts de Despliegue

- ✅ **`deploy-vercel.sh`** - Script para Linux/Mac
- ✅ **`deploy-vercel.ps1`** - Script para Windows
- ✅ **`DEPLOY-VERCEL.md`** - Guía completa de despliegue
- ✅ **`env.vercel.example`** - Variables de entorno de ejemplo

### 3. Configuración de Vercel

```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/server.js",
      "use": "@vercel/node"
    },
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/backend/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

## 🚀 Próximos Pasos

### 1. Instalar Vercel CLI

```bash
npm install -g vercel
```

### 2. Configurar APIs

```bash
cd backend
npm run setup
npm run setup-google
npm run test-google
```

### 3. Desplegar

```bash
# Desde la raíz del proyecto
vercel
```

### 4. Configurar Variables de Entorno

En el dashboard de Vercel, agregar:

- `GEMINI_API_KEY`
- `HUGGING_FACE_API_KEY`
- `GOOGLE_SEARCH_API_KEY`
- `GOOGLE_CUSTOM_SEARCH_ID`
- `MAX_SEARCH_RESULTS=5`
- `VERIFICATION_ENABLED=true`
- `SOURCE_ANALYSIS_ENABLED=true`
- `VERIFICATION_TIMEOUT=10000`
- `CORS_ORIGIN=*`
- `NODE_ENV=production`

## 🎯 Ventajas de Vercel

- ✅ **Un solo dominio**: Frontend y backend en la misma URL
- ✅ **Sin CORS**: Todo funciona en el mismo origen
- ✅ **Despliegue automático**: Conecta tu repositorio de GitHub
- ✅ **SSL gratuito**: Certificados HTTPS automáticos
- ✅ **CDN global**: Mejor rendimiento mundial
- ✅ **Escalabilidad**: Vercel maneja automáticamente el escalado

## 🔧 Estructura del Proyecto

```
fake-news-detector/
├── vercel.json              # Configuración de Vercel
├── package.json             # Frontend (React + Vite)
├── src/                     # Código del frontend
├── backend/                 # Código del backend
│   ├── server.js           # Servidor Express
│   ├── package.json        # Dependencias del backend
│   └── src/                # Lógica del backend
├── deploy-vercel.sh        # Script de despliegue (Linux/Mac)
├── deploy-vercel.ps1       # Script de despliegue (Windows)
├── DEPLOY-VERCEL.md        # Guía completa
└── env.vercel.example      # Variables de entorno
```

## 🐛 Solución de Problemas

### Error: "Build failed"

- Verifica que todas las dependencias estén en `package.json`
- Revisa los logs de build en Vercel

### Error: "API not found"

- Verifica que las rutas en `vercel.json` sean correctas
- Asegúrate de que el backend esté en la carpeta `backend/`

### Error: "Environment variables not found"

- Verifica que todas las variables estén configuradas en Vercel
- Asegúrate de que los nombres coincidan exactamente

## 📞 Comandos Útiles

```bash
# Desplegar en desarrollo
vercel

# Desplegar en producción
vercel --prod

# Ver logs
vercel logs

# Listar proyectos
vercel ls

# Remover proyecto
vercel remove
```

## 🎉 ¡Listo para Desplegar!

Tu proyecto está completamente configurado para Vercel. Solo necesitas:

1. **Configurar las APIs** (Gemini, Hugging Face, Google Search)
2. **Ejecutar `vercel`** desde la raíz del proyecto
3. **Configurar las variables de entorno** en el dashboard
4. **¡Disfrutar de tu aplicación desplegada!**

---

**¡Tu detector de noticias falsas estará disponible en `https://tu-proyecto.vercel.app`!** 🚀
