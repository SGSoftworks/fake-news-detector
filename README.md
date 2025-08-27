# 🛡️ Sistema de Detección de Noticias Falsas

Sistema avanzado de detección de noticias falsas basado en Inteligencia Artificial, desarrollado en React y Node.js.

## 🚀 Características Principales

### 🤖 Análisis Inteligente

- **Detección automática** de URLs vs texto
- **Análisis de dominio** y reputación de sitios web
- **Extracción de metadatos** de páginas web
- **Identificación de fuentes mencionadas** en el texto

### 🌐 Verificación Externa

- **Búsqueda con Google Search API** para información relevante
- **Análisis de credibilidad** de fuentes consultadas
- **Verificación con fact-checkers** reconocidos
- **Score de credibilidad** basado en múltiples factores
- **Fuentes consultadas** con enlaces y explicaciones

### 🔧 APIs Optimizadas

- **Google Gemini** (50% peso) - Análisis de texto avanzado
- **Hugging Face** (30% peso) - Análisis de sentimientos
- **Análisis Local** (20% peso) - Algoritmos heurísticos

### 📊 Análisis Contextual

- **Detección de patrones** de noticias falsas
- **Análisis de estilo** y tono del texto
- **Identificación de elementos** sensacionalistas
- **Evaluación de objetividad** y formalidad

## 🛠️ Tecnologías

### Frontend

- **React 18** - Framework de UI
- **Vite** - Build tool
- **Tailwind CSS 3.4.x** - Framework de estilos
- **React Router** - Navegación
- **Lucide React** - Iconos

### Backend

- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **Axios** - Cliente HTTP
- **dotenv** - Variables de entorno

### APIs Externas

- **Google Gemini API** - Análisis de texto avanzado
- **Hugging Face API** - Análisis de sentimientos

## 📦 Instalación

### Prerrequisitos

- Node.js 18+
- npm o yarn
- APIs de Google Gemini y Hugging Face (opcionales)

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd fake-news-detector
```

### 2. Instalar dependencias del frontend

```bash
npm install
```

### 3. Instalar dependencias del backend

```bash
cd backend
npm install
```

### 4. Configurar variables de entorno

```bash
# En el directorio backend/
cp env.example .env
```

Editar el archivo `.env` con tus API keys:

```env
# APIs de IA (opcionales)
GEMINI_API_KEY=tu_api_key_aqui
HUGGINGFACE_API_KEY=tu_api_key_aqui

# Configuración del servidor
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### 5. Configurar APIs (opcional)

```bash
cd backend
npm run setup
```

## 🚀 Uso

### Desarrollo Local

#### Opción 1: Inicio Manual

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npm run dev
```

#### Opción 2: Inicio Automático

```bash
# Windows
.\start-simple.bat

# PowerShell
.\start-simple.ps1
```

### Producción

```bash
# Build del frontend
npm run build

# Iniciar servidor de producción
cd backend
npm start
```

## 🧪 Pruebas

### Prueba Básica

```bash
cd backend
npm run test-apis
```

### Prueba del Sistema Completo

```bash
cd backend
npm run test-system
```

### Prueba del Sistema Avanzado

```bash
cd backend
npm run test-advanced
```

## 📁 Estructura del Proyecto

```
fake-news-detector/
├── src/                    # Frontend React
│   ├── components/         # Componentes reutilizables
│   ├── pages/             # Páginas de la aplicación
│   ├── services/          # Servicios de API
│   └── utils/             # Utilidades
├── backend/               # Servidor Node.js
│   ├── src/
│   │   ├── config/        # Configuración
│   │   ├── routes/        # Rutas de API
│   │   ├── services/      # Servicios de IA
│   │   └── utils/         # Utilidades
│   ├── server.js          # Servidor principal
│   └── server-simple.js   # Servidor simplificado
├── public/                # Archivos estáticos
├── dist/                  # Build de producción
└── README.md             # Esta documentación
```

## 🔧 Configuración

### Variables de Entorno

#### Backend (.env)

```env
# Servidor
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# APIs de IA
GEMINI_API_KEY=tu_api_key_aqui
GEMINI_MODEL=gemini-1.5-flash
HUGGINGFACE_API_KEY=tu_api_key_aqui
HUGGINGFACE_MODEL=nlptown/bert-base-multilingual-uncased-sentiment

# Configuración de análisis
LOCAL_WEIGHT=0.2
HUGGINGFACE_WEIGHT=0.3
GEMINI_WEIGHT=0.5
FAKE_THRESHOLD=60
HIGH_CONFIDENCE_THRESHOLD=80

# Verificación externa
VERIFICATION_ENABLED=true
SOURCE_ANALYSIS_ENABLED=true
MAX_RELATED_ARTICLES=5
VERIFICATION_TIMEOUT=10000
```

### Scripts Disponibles

#### Frontend

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run preview` - Preview de producción

#### Backend

- `npm run dev` - Servidor de desarrollo
- `npm start` - Servidor de producción
- `npm run setup` - Configurar APIs
- `npm run test-apis` - Probar APIs
- `npm run test-system` - Probar sistema completo
- `npm run test-advanced` - Probar sistema avanzado

## 🎯 Casos de Uso

### Análisis de Texto

```
Input: "Según informa el Ministerio de Salud..."
Output:
- Tipo: Text Analysis
- Fuentes mencionadas: ["Ministerio de Salud"]
- Análisis: Local + Hugging Face + Gemini + Verificación Externa
- Confianza: 75%
- Veredicto: VERÍDICA
- Nivel de confianza: ALTA
- Fuentes consultadas: 3 artículos relacionados
- Explicación detallada con factores y recomendaciones
```

### Análisis de URL

```
Input: "https://www.eltiempo.com/noticia..."
Output:
- Tipo: URL Analysis
- Dominio: eltiempo.com
- Confianza del dominio: 90%
- Metadatos extraídos: ✅
```

### Verificación Completa

```
Input: Cualquier noticia
Output:
- Análisis de IA: ✅
- Verificación externa: ✅
- Búsqueda Google Search: ✅
- Artículos relacionados: 5 encontrados
- Score de credibilidad: 82%
- Veredicto: VERÍDICA/NO VERÍDICA
- Explicación detallada con fuentes
- Recomendaciones específicas
```

## 📈 Métricas de Precisión

### Antes vs Ahora

- **Precisión básica**: 60-70%
- **Precisión avanzada**: 80-90%
- **Verificación externa**: +15% precisión
- **Análisis contextual**: +10% precisión

### Factores de Mejora

1. **Múltiples APIs**: Combinación inteligente de resultados
2. **Verificación externa**: Validación con fuentes confiables
3. **Análisis de fuentes**: Evaluación de credibilidad
4. **Contexto**: Análisis de estilo y tono
5. **Artículos relacionados**: Consistencia informativa

## 🚀 Despliegue

### Vercel (Recomendado - Full Stack)

**Ventajas:**

- ✅ Un solo dominio para frontend y backend
- ✅ Sin problemas de CORS
- ✅ Despliegue automático
- ✅ SSL gratuito
- ✅ CDN global

**Pasos:**

1. Instalar Vercel CLI: `npm install -g vercel`
2. Configurar APIs (Gemini, Hugging Face, Google Search)
3. Ejecutar: `vercel` desde la raíz del proyecto
4. Configurar variables de entorno en el dashboard

Consulta la guía completa en [DEPLOY-VERCEL.md](./DEPLOY-VERCEL.md)

### Despliegue Local

```bash
# Frontend
npm run dev

# Backend (en otra terminal)
cd backend
npm run dev
```

### Docker (Opcional)

```dockerfile
# Dockerfile para backend
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## 🔮 Roadmap

### Fase 3 (Próximamente)

- [ ] Análisis de imágenes
- [ ] Análisis de videos
- [ ] Base de datos MongoDB
- [ ] Autenticación de usuarios
- [ ] Dashboard de administración

### Fase 4 (Futuro)

- [ ] Docker containers
- [ ] CI/CD pipeline
- [ ] Escalabilidad distribuida
- [ ] APIs públicas
- [ ] Machine Learning avanzado

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Equipo

- **Juan Gómez** - Desarrollador Full Stack
- **Ivan Jair** - Desarrollador Backend
- **Mayo 30** - Desarrollador Frontend

## 🙏 Agradecimientos

- Google Gemini API por el análisis de texto avanzado
- Hugging Face por los modelos de IA
- React y Node.js por las tecnologías base
- Tailwind CSS por el framework de estilos

---

**¡Combatamos juntos la desinformación!** 🛡️✨
