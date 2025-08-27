# 🚀 Despliegue a Netlify - Guía Completa

Guía paso a paso para desplegar el Sistema de Detección de Noticias Falsas a producción.

## 📋 Prerrequisitos

- Cuenta en [Netlify](https://netlify.com) (gratuita)
- Cuenta en [Vercel](https://vercel.com) o [Railway](https://railway.app) (para el backend)
- APIs configuradas (Google Search, Gemini, Hugging Face)
- Git configurado en tu proyecto

## 🎯 Plan de Despliegue

1. **Backend** → Vercel/Railway
2. **Frontend** → Netlify
3. **Configurar variables de entorno**
4. **Conectar frontend con backend**
5. **Configurar dominio personalizado**

---

## 🔧 Paso 1: Preparar el Backend

### 1.1 Crear archivo vercel.json

```bash
# En la carpeta backend
touch vercel.json
```

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### 1.2 Desplegar Backend en Vercel

1. **Instalar Vercel CLI**

```bash
npm install -g vercel
```

2. **Iniciar sesión en Vercel**

```bash
vercel login
```

3. **Desplegar desde la carpeta backend**

```bash
cd backend
vercel
```

4. **Configurar variables de entorno en Vercel**

```bash
vercel env add GEMINI_API_KEY
vercel env add HUGGINGFACE_API_KEY
vercel env add GOOGLE_SEARCH_API_KEY
vercel env add GOOGLE_CUSTOM_SEARCH_ID
vercel env add VERIFICATION_ENABLED
vercel env add SOURCE_ANALYSIS_ENABLED
```

5. **Obtener URL del backend**

- Copia la URL que te da Vercel (ej: `https://fake-news-backend.vercel.app`)

---

## 🌐 Paso 2: Desplegar Frontend en Netlify

### 2.1 Preparar el proyecto

1. **Verificar que todo esté listo**

```bash
# En la carpeta raíz del proyecto
npm run build
```

2. **Verificar que se creó la carpeta dist**

```bash
ls dist/
```

### 2.2 Opción A: Despliegue desde Git (Recomendado)

1. **Subir código a GitHub**

```bash
git add .
git commit -m "Preparar para despliegue a Netlify"
git push origin main
```

2. **Conectar con Netlify**

- Ve a [netlify.com](https://netlify.com)
- Inicia sesión
- Haz clic en "New site from Git"
- Selecciona tu repositorio de GitHub
- Configura:
  - **Build command**: `npm run build`
  - **Publish directory**: `dist`
  - **Base directory**: (dejar vacío)

3. **Configurar variables de entorno en Netlify**

- Ve a Site settings > Environment variables
- Agrega:
  ```
  VITE_API_BASE_URL=https://tu-backend-url.vercel.app/api
  VITE_APP_NAME=Fake News Detector
  VITE_APP_ENVIRONMENT=production
  ```

### 2.3 Opción B: Despliegue manual

1. **Construir el proyecto**

```bash
npm run build
```

2. **Subir a Netlify**

- Ve a [netlify.com](https://netlify.com)
- Arrastra la carpeta `dist` al área de deploy
- Netlify te dará una URL automáticamente

---

## ⚙️ Paso 3: Configurar Variables de Entorno

### 3.1 En Netlify (Frontend)

Ve a **Site settings > Environment variables** y agrega:

```env
VITE_API_BASE_URL=https://tu-backend-url.vercel.app/api
VITE_APP_NAME=Fake News Detector
VITE_APP_VERSION=1.0.0
VITE_APP_ENVIRONMENT=production
```

### 3.2 En Vercel (Backend)

Ve a **Settings > Environment Variables** y agrega:

```env
NODE_ENV=production
CORS_ORIGIN=https://tu-sitio-netlify.netlify.app

# APIs de IA
GEMINI_API_KEY=tu_gemini_api_key
HUGGINGFACE_API_KEY=tu_huggingface_api_key

# Google Search API
GOOGLE_SEARCH_API_KEY=tu_google_search_api_key
GOOGLE_CUSTOM_SEARCH_ID=tu_search_engine_id

# Configuración de verificación
VERIFICATION_ENABLED=true
SOURCE_ANALYSIS_ENABLED=true
MAX_SEARCH_RESULTS=10
VERIFICATION_TIMEOUT=10000

# Configuración de análisis
LOCAL_WEIGHT=0.2
HUGGINGFACE_WEIGHT=0.3
GEMINI_WEIGHT=0.5
FAKE_THRESHOLD=60
HIGH_CONFIDENCE_THRESHOLD=80
```

---

## 🔗 Paso 4: Conectar Frontend con Backend

### 4.1 Actualizar URL del backend

1. **Obtener URL del backend de Vercel**

- Ve a tu dashboard de Vercel
- Copia la URL del proyecto (ej: `https://fake-news-backend.vercel.app`)

2. **Actualizar en Netlify**

- Ve a Site settings > Environment variables
- Actualiza `VITE_API_BASE_URL` con la URL completa:
  ```
  VITE_API_BASE_URL=https://fake-news-backend.vercel.app/api
  ```

3. **Redeploy**

- Ve a Deploys
- Haz clic en "Trigger deploy" > "Deploy site"

---

## 🧪 Paso 5: Probar el Despliegue

### 5.1 Verificar Frontend

1. Ve a tu URL de Netlify
2. Verifica que la aplicación cargue correctamente
3. Prueba la navegación entre páginas

### 5.2 Verificar Backend

1. Ve a `https://tu-backend-url.vercel.app/api/health`
2. Deberías ver un mensaje de "OK"

### 5.3 Probar Análisis

1. Ve a la página de análisis
2. Pega una noticia de prueba
3. Verifica que:
   - El análisis funcione
   - Aparezcan "Fuentes consultadas"
   - El veredicto sea claro (VERÍDICA/NO VERÍDICA)

---

## 🌍 Paso 6: Configurar Dominio Personalizado (Opcional)

### 6.1 En Netlify

1. Ve a **Site settings > Domain management**
2. Haz clic en "Add custom domain"
3. Sigue las instrucciones para configurar DNS

### 6.2 Configurar HTTPS

- Netlify maneja HTTPS automáticamente
- No necesitas configuración adicional

---

## 🚨 Solución de Problemas

### Error: "Failed to fetch"

- Verifica que `VITE_API_BASE_URL` esté configurado correctamente
- Asegúrate de que el backend esté funcionando
- Revisa los logs de Vercel

### Error: "CORS error"

- Verifica que `CORS_ORIGIN` en Vercel incluya tu dominio de Netlify
- Asegúrate de que no haya espacios extra en la URL

### Error: "API key not valid"

- Verifica que todas las variables de entorno estén configuradas en Vercel
- Revisa que las APIs estén habilitadas y funcionando

### Error: "Build failed"

- Verifica que `npm run build` funcione localmente
- Revisa los logs de build en Netlify
- Asegúrate de que todas las dependencias estén en `package.json`

---

## 📊 Monitoreo y Mantenimiento

### 6.1 Logs y Monitoreo

- **Netlify**: Ve a Deploys > [deploy] > Functions logs
- **Vercel**: Ve a Functions > [function] > Logs

### 6.2 Actualizaciones

1. Haz cambios en tu código
2. Haz commit y push a GitHub
3. Netlify y Vercel se actualizarán automáticamente

### 6.3 Rollback

- **Netlify**: Ve a Deploys > [deploy anterior] > "Publish deploy"
- **Vercel**: Ve a Deployments > [deployment anterior] > "Promote"

---

## 🎉 ¡Despliegue Completado!

Tu sistema de detección de noticias falsas está ahora en producción con:

✅ **Frontend**: Desplegado en Netlify  
✅ **Backend**: Desplegado en Vercel  
✅ **APIs**: Configuradas y funcionando  
✅ **Verificación externa**: Google Search API activa  
✅ **Veredictos claros**: VERÍDICA/NO VERÍDICA  
✅ **Fuentes consultadas**: Búsqueda automática

**¡Tu aplicación está lista para ser usada por el público!** 🚀✨

---

## 📞 Soporte

Si tienes problemas:

1. **Revisa los logs** en Netlify y Vercel
2. **Verifica las variables de entorno**
3. **Prueba localmente** primero
4. **Consulta la documentación** de Netlify y Vercel

**¡Felicitaciones por tu despliegue exitoso!** 🎊
