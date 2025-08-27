# 🔧 Configuración de Google Custom Search API

Guía paso a paso para configurar la API de Google Search en el Sistema de Detección de Noticias Falsas.

## 📋 Prerrequisitos

- Cuenta de Google (Gmail)
- Acceso a Google Cloud Console
- Acceso a Google Programmable Search Engine

## 🚀 Paso 1: Crear Proyecto en Google Cloud

### 1.1 Ir a Google Cloud Console

- Abre [console.cloud.google.com](https://console.cloud.google.com/)
- Inicia sesión con tu cuenta de Google

### 1.2 Crear Nuevo Proyecto

```
1. Haz clic en el selector de proyectos (arriba a la izquierda)
2. Selecciona "Nuevo proyecto"
3. Nombre: fake-news-detector
4. Haz clic en "Crear"
```

## 🔌 Paso 2: Habilitar Custom Search API

### 2.1 Ir a la Biblioteca de APIs

```
1. En el menú lateral, ve a "APIs y servicios" > "Biblioteca"
2. Busca "Custom Search API"
3. Haz clic en "Custom Search API"
4. Haz clic en "Habilitar"
```

## 🔑 Paso 3: Crear API Key

### 3.1 Ir a Credenciales

```
1. En el menú lateral, ve a "APIs y servicios" > "Credenciales"
2. Haz clic en "Crear credenciales" > "Clave de API"
3. Se generará una API key automáticamente
```

### 3.2 Restringir la API Key (Recomendado)

```
1. Haz clic en la API key creada
2. En "Restricción de aplicación", selecciona "Sitios web HTTP"
3. Agrega tu dominio (para producción)
4. En "Restricción de API", selecciona "Custom Search API"
5. Haz clic en "Guardar"
```

## 🔍 Paso 4: Crear Custom Search Engine

### 4.1 Ir a Google Programmable Search Engine

- Ve a [programmablesearchengine.google.com](https://programmablesearchengine.google.com/)
- Inicia sesión con la misma cuenta de Google

### 4.2 Crear Motor de Búsqueda

```
1. Haz clic en "Crear un motor de búsqueda"
2. Sitios para buscar: "Buscar en toda la web"
3. Nombre: Fake News Detector Search
4. Descripción: Motor de búsqueda para verificación de noticias
5. Haz clic en "Crear"
```

### 4.3 Obtener Search Engine ID

```
1. Una vez creado, ve a "Configuración"
2. Copia el Search Engine ID (formato: 123456789:abcdefghijk)
```

## ⚙️ Paso 5: Configurar en el Proyecto

### 5.1 Usar el Script Automático

```bash
# En la carpeta backend
npm run setup-google
```

### 5.2 Configuración Manual

Si prefieres configurar manualmente, crea o edita el archivo `backend/.env`:

```env
# Google Custom Search API
GOOGLE_SEARCH_API_KEY=tu_api_key_aqui
GOOGLE_CUSTOM_SEARCH_ID=tu_search_engine_id_aqui

# Configuración de verificación
VERIFICATION_ENABLED=true
SOURCE_ANALYSIS_ENABLED=true
MAX_SEARCH_RESULTS=10
VERIFICATION_TIMEOUT=10000
```

## 🧪 Paso 6: Probar la Configuración

### 6.1 Ejecutar Test

```bash
# En la carpeta backend
npm run test-google
```

### 6.2 Verificar Resultados

Deberías ver algo como:

```
✅ Credenciales encontradas
🔑 API Key: AIzaSyC...
🔍 Search Engine ID: 123456789:abcdefghijk

🔍 Probando búsqueda...
✅ Búsqueda exitosa!
📊 Encontrados 3 resultados

🎉 ¡Google Search API está funcionando correctamente!
```

## 🚀 Paso 7: Probar en la Aplicación

### 7.1 Reiniciar Servidor

```bash
# Detener el servidor actual (Ctrl+C)
# Luego reiniciar
npm run dev
```

### 7.2 Probar Análisis

1. Ve a la aplicación web
2. Analiza una noticia
3. Verifica que aparezcan "Fuentes consultadas" en los resultados

## 💰 Límites y Costos

### Límites Gratuitos

- **100 consultas por día** (gratuito)
- **10,000 consultas por día** (con facturación habilitada)

### Habilitar Facturación (Opcional)

```
1. Ve a Google Cloud Console
2. "Facturación" > "Vincular cuenta de facturación"
3. Configura método de pago
4. Aumenta el límite a 10,000 consultas/día
```

## 🚨 Solución de Problemas

### Error: "API key not valid"

- Verifica que la API key sea correcta
- Asegúrate de que la API esté habilitada
- Revisa las restricciones de la API key

### Error: "Search engine not found"

- Verifica que el Search Engine ID sea correcto
- Asegúrate de que el motor de búsqueda esté configurado para "toda la web"

### Error: "Quota exceeded"

- Revisa el uso en Google Cloud Console
- Considera habilitar facturación para aumentar límites

### No aparecen fuentes consultadas

- Verifica que `VERIFICATION_ENABLED=true`
- Revisa los logs del backend
- Ejecuta `npm run test-google` para verificar la API

## 📞 Soporte

Si tienes problemas:

1. **Ejecuta el test**: `npm run test-google`
2. **Revisa los logs** del backend
3. **Verifica las credenciales** en Google Cloud Console
4. **Consulta la documentación** de Google Custom Search API

---

**¡Con esta configuración, tu sistema tendrá verificación externa completa!** 🔍✨
