# 🚀 Configuración para Netlify

Guía paso a paso para desplegar el Sistema de Detección de Noticias Falsas en Netlify.

## 📋 Prerrequisitos

- Cuenta en Netlify
- Backend desplegado (Vercel, Railway, Render, etc.)
- APIs configuradas (Google Gemini, Hugging Face)

## 🔧 Paso 1: Preparar el Repositorio

### 1.1 Verificar estructura

```
fake-news-detector/
├── src/
├── public/
├── package.json
├── netlify.toml          ✅ Ya configurado
├── vite.config.js
└── README.md
```

### 1.2 Verificar dependencias

```json
// package.json debe tener:
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

## 🌐 Paso 2: Desplegar Backend

### Opción A: Vercel (Recomendado)

1. **Ir a Vercel**

   - Ve a [vercel.com](https://vercel.com)
   - Conecta tu repositorio de GitHub

2. **Configurar proyecto**

   ```
   Framework Preset: Node.js
   Root Directory: backend
   Build Command: npm install
   Output Directory: .
   Install Command: npm install
   ```

3. **Variables de entorno**

   ```env
   NODE_ENV=production
   PORT=3001
   GEMINI_API_KEY=tu_api_key_real
   HUGGINGFACE_API_KEY=tu_api_key_real
   CORS_ORIGIN=https://tu-app.netlify.app
   ```

4. **Desplegar**
   - Vercel desplegará automáticamente
   - Guarda la URL del backend (ej: `https://tu-backend.vercel.app`)

### Opción B: Railway

1. **Ir a Railway**

   - Ve a [railway.app](https://railway.app)
   - Conecta tu repositorio

2. **Configurar servicio**

   ```
   Service Type: Web Service
   Source Directory: backend
   ```

3. **Variables de entorno**

   - Agregar las mismas variables que en Vercel

4. **Desplegar**
   - Railway desplegará automáticamente
   - Guarda la URL del backend

## 🎯 Paso 3: Desplegar Frontend en Netlify

### 3.1 Conectar repositorio

1. **Ir a Netlify**

   - Ve a [netlify.com](https://netlify.com)
   - Haz clic en "New site from Git"

2. **Conectar GitHub**
   - Selecciona tu repositorio
   - Selecciona la rama `main`

### 3.2 Configurar build

```
Build command: npm run build
Publish directory: dist
```

### 3.3 Variables de entorno

Ve a **Site settings > Environment variables** y agrega:

```env
# URL del backend (IMPORTANTE!)
VITE_API_BASE_URL=https://tu-backend.vercel.app

# Otras variables opcionales
VITE_APP_NAME=FakeNewsDetector
VITE_APP_VERSION=1.0.0
```

### 3.4 Desplegar

- Haz clic en "Deploy site"
- Netlify construirá y desplegará tu aplicación

## 🔍 Paso 4: Verificar Configuración

### 4.1 Verificar build

En Netlify, ve a **Deploys** y verifica:

- ✅ Build exitoso
- ✅ Sin errores de compilación
- ✅ Archivos generados en `/dist`

### 4.2 Verificar variables de entorno

1. Ve a **Site settings > Environment variables**
2. Verifica que `VITE_API_BASE_URL` esté configurada
3. Asegúrate de que apunte a tu backend

### 4.3 Probar la aplicación

1. Ve a tu URL de Netlify
2. Intenta analizar una noticia
3. Verifica que se conecte al backend

## 🛠️ Paso 5: Configuración Avanzada

### 5.1 Dominio personalizado

1. Ve a **Domain settings**
2. Agrega tu dominio personalizado
3. Configura DNS según las instrucciones

### 5.2 HTTPS

- Netlify proporciona HTTPS automáticamente
- No necesitas configuración adicional

### 5.3 Formularios (si los agregas)

Si agregas formularios, Netlify los procesará automáticamente.

## 🚨 Solución de Problemas

### Error: "Cannot fetch from API"

**Causa:** CORS o URL incorrecta del backend

**Solución:**

1. Verificar `VITE_API_BASE_URL` en Netlify
2. Verificar `CORS_ORIGIN` en el backend
3. Asegurar que la URL del backend sea correcta

### Error: "Build failed"

**Causa:** Problemas de dependencias o configuración

**Solución:**

1. Verificar `package.json`
2. Verificar que todas las dependencias estén instaladas
3. Revisar logs de build en Netlify

### Error: "Page not found"

**Causa:** Problemas de routing en SPA

**Solución:**

- El archivo `netlify.toml` ya incluye la configuración correcta
- Verificar que el redirect esté funcionando

## 📊 Monitoreo

### 4.1 Analytics

Netlify proporciona analytics básicos:

- Visitas
- Páginas más visitadas
- Tiempo de carga

### 4.2 Logs

Ve a **Functions > Functions log** para ver logs de funciones (si las usas).

### 4.3 Performance

Netlify optimiza automáticamente:

- Compresión gzip
- Caché de archivos estáticos
- CDN global

## 🔄 Actualizaciones

### Despliegue automático

Netlify se actualiza automáticamente cuando:

- Haces push a la rama principal
- Creas un pull request (preview)

### Despliegue manual

1. Ve a **Deploys**
2. Haz clic en "Trigger deploy"
3. Selecciona "Deploy site"

## 📞 Soporte

### Recursos útiles

- [Documentación de Netlify](https://docs.netlify.com)
- [Guía de Vite en Netlify](https://vitejs.dev/guide/static-deploy.html#netlify)
- [Soporte de Netlify](https://www.netlify.com/support/)

### Comandos útiles

```bash
# Probar build localmente
npm run build

# Probar producción localmente
npm run preview

# Verificar variables de entorno
echo $VITE_API_BASE_URL
```

---

**¡Tu aplicación estará lista en Netlify!** 🚀✨
