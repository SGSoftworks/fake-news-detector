# 🚀 Guía de Despliegue en Vercel

## 📋 Resumen

Esta guía te ayudará a desplegar todo el proyecto **Fake News Detector** en Vercel como una aplicación full-stack, resolviendo los problemas de CORS y simplificando el despliegue.

## ✅ Ventajas del Despliegue en Vercel

- **Un solo dominio**: Frontend y backend en la misma URL
- **Sin problemas de CORS**: Todo funciona en el mismo origen
- **Despliegue automático**: Conecta tu repositorio de GitHub
- **Escalabilidad**: Vercel maneja automáticamente el escalado
- **SSL gratuito**: Certificados HTTPS automáticos
- **CDN global**: Mejor rendimiento mundial

## 🛠️ Preparación

### 1. Instalar Vercel CLI

```bash
npm install -g vercel
```

### 2. Configurar Variables de Entorno

Antes del despliegue, necesitas configurar las siguientes APIs:

#### APIs Requeridas:

- **Google Gemini API**: Para análisis de IA
- **Hugging Face API**: Para análisis de sentimiento
- **Google Search API**: Para verificación externa

#### Scripts de Configuración:

```bash
# Configurar APIs principales
cd backend
npm run setup

# Configurar Google Search API
npm run setup-google

# Probar Google Search API
npm run test-google
```

## 🚀 Despliegue Paso a Paso

### Paso 1: Iniciar Sesión en Vercel

```bash
vercel login
```

### Paso 2: Desplegar el Proyecto

Desde la raíz del proyecto:

```bash
vercel
```

### Paso 3: Configurar el Proyecto

Durante el despliegue, Vercel te preguntará:

```
? Set up and deploy "~/fake-news-detector"? [Y/n] y
? Which scope should contain your project? [Tu cuenta]
? Link to existing project? [y/N] n
? What's your project's name? fake-news-detector
? In which directory is your code located? ./
? Want to override the settings? [y/N] n
```

### Paso 4: Configurar Variables de Entorno

1. Ve al [Dashboard de Vercel](https://vercel.com/dashboard)
2. Selecciona tu proyecto `fake-news-detector`
3. Ve a **Settings** → **Environment Variables**
4. Agrega las siguientes variables:

```
NODE_ENV=production
GEMINI_API_KEY=tu_gemini_api_key_aqui
HUGGING_FACE_API_KEY=tu_hugging_face_api_key_aqui
GOOGLE_SEARCH_API_KEY=tu_google_search_api_key_aqui
GOOGLE_CUSTOM_SEARCH_ID=tu_google_custom_search_id_aqui
MAX_SEARCH_RESULTS=5
VERIFICATION_ENABLED=true
SOURCE_ANALYSIS_ENABLED=true
VERIFICATION_TIMEOUT=10000
CORS_ORIGIN=*
PORT=3001
APP_NAME=Fake News Detector
APP_VERSION=1.0.0
```

### Paso 5: Redesplegar

```bash
vercel --prod
```

## 🔧 Configuración de APIs

### Google Gemini API

1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crea una nueva API key
3. Copia la key en `GEMINI_API_KEY`

### Hugging Face API

1. Ve a [Hugging Face](https://huggingface.co/settings/tokens)
2. Crea un nuevo token
3. Copia el token en `HUGGING_FACE_API_KEY`

### Google Search API

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un proyecto o selecciona uno existente
3. Habilita la API de Custom Search
4. Crea credenciales de API
5. Crea un motor de búsqueda personalizado
6. Copia las credenciales en las variables correspondientes

## 📁 Estructura del Proyecto en Vercel

```
fake-news-detector/
├── vercel.json              # Configuración de Vercel
├── package.json             # Frontend (React + Vite)
├── src/                     # Código del frontend
├── backend/                 # Código del backend
│   ├── server.js           # Servidor Express
│   ├── package.json        # Dependencias del backend
│   └── src/                # Lógica del backend
└── env.vercel.example      # Variables de entorno de ejemplo
```

## 🔄 Despliegues Automáticos

### Conectar con GitHub

1. Ve al dashboard de Vercel
2. Selecciona tu proyecto
3. Ve a **Settings** → **Git**
4. Conecta tu repositorio de GitHub
5. Configura el despliegue automático

### Configuración de Git

```bash
# Agregar archivos de configuración
git add vercel.json env.vercel.example DEPLOY-VERCEL.md

# Commit y push
git commit -m "Configuración para despliegue en Vercel"
git push origin main
```

## 🧪 Pruebas Post-Despliegue

### 1. Verificar Frontend

- Visita tu URL de Vercel
- Verifica que la interfaz se carga correctamente
- Prueba la navegación entre páginas

### 2. Verificar Backend

- Visita `https://tu-dominio.vercel.app/api/health`
- Deberías ver: `{"status":"ok","message":"API funcionando"}`

### 3. Probar Análisis

- Ve a la página de análisis
- Ingresa una noticia de prueba
- Verifica que el análisis funciona correctamente

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

### Error: "CORS error"

- Con Vercel, esto no debería ocurrir ya que todo está en el mismo dominio
- Si ocurre, verifica la configuración de CORS en `backend/server.js`

## 📊 Monitoreo

### Logs de Vercel

- Ve a tu proyecto en Vercel
- Selecciona **Functions** para ver logs del backend
- Selecciona **Deployments** para ver logs de build

### Métricas

- Vercel proporciona métricas automáticas
- Monitorea el rendimiento en el dashboard

## 🔄 Actualizaciones

### Despliegue Manual

```bash
vercel --prod
```

### Despliegue Automático

- Haz push a tu rama principal
- Vercel desplegará automáticamente

## 🎉 ¡Listo!

Tu aplicación estará disponible en:

- **URL**: `https://tu-proyecto.vercel.app`
- **API**: `https://tu-proyecto.vercel.app/api/*`

## 📞 Soporte

Si tienes problemas:

1. Revisa los logs en Vercel
2. Verifica la configuración de variables de entorno
3. Consulta la [documentación de Vercel](https://vercel.com/docs)

---

**¡Tu detector de noticias falsas ahora está completamente desplegado en Vercel! 🎉**
