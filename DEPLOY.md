# 🚀 Guía de Despliegue a Producción

Esta guía te ayudará a desplegar el Sistema de Detección de Noticias Falsas en producción.

## 📋 Prerrequisitos

- Servidor con Node.js 18+ o Docker
- APIs configuradas (Google Gemini, Hugging Face)
- Dominio configurado (opcional)

## 🐳 Despliegue con Docker (Recomendado)

### 1. Preparar el entorno

```bash
# Clonar el repositorio
git clone <repository-url>
cd fake-news-detector

# Configurar variables de entorno
cp backend/env.production.example backend/.env
# Editar backend/.env con tus API keys
```

### 2. Desplegar con Docker Compose

```bash
# Desplegar todos los servicios
docker-compose up -d

# Verificar que todo esté funcionando
docker-compose ps
docker-compose logs
```

### 3. Acceder a la aplicación

- Frontend: http://localhost
- Backend API: http://localhost:3001
- Health Check: http://localhost:3001/api/health

## ☁️ Despliegue en la Nube

### Netlify (Frontend)

1. **Conectar repositorio**

   - Ve a [Netlify](https://netlify.com)
   - Conecta tu repositorio de GitHub

2. **Configurar build**

   ```
   Build command: npm run build
   Publish directory: dist
   ```

3. **Variables de entorno**

   ```
   VITE_API_BASE_URL=https://tu-backend.com
   ```

4. **Desplegar**
   - Netlify desplegará automáticamente en cada push

### Vercel (Backend)

1. **Conectar repositorio**

   - Ve a [Vercel](https://vercel.com)
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

   - Copia todas las variables de `backend/.env`

4. **Desplegar**
   - Vercel desplegará automáticamente

### Railway (Backend Alternativo)

1. **Conectar repositorio**

   - Ve a [Railway](https://railway.app)
   - Conecta tu repositorio

2. **Configurar servicio**

   ```
   Service Type: Web Service
   Source Directory: backend
   ```

3. **Variables de entorno**

   - Agregar todas las variables necesarias

4. **Desplegar**
   - Railway desplegará automáticamente

## 🖥️ Despliegue Manual

### 1. Preparar el servidor

```bash
# Instalar Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PM2 para gestión de procesos
npm install -g pm2
```

### 2. Configurar el proyecto

```bash
# Clonar repositorio
git clone <repository-url>
cd fake-news-detector

# Instalar dependencias
npm install
cd backend && npm install && cd ..

# Configurar variables de entorno
cp backend/env.production.example backend/.env
# Editar backend/.env
```

### 3. Build del frontend

```bash
npm run build
```

### 4. Configurar servidor web

```bash
# Instalar nginx
sudo apt-get install nginx

# Configurar nginx para servir el frontend
sudo cp nginx.conf /etc/nginx/sites-available/fakenews
sudo ln -s /etc/nginx/sites-available/fakenews /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 5. Iniciar servicios

```bash
# Iniciar backend con PM2
cd backend
pm2 start server.js --name "fakenews-backend"
pm2 save
pm2 startup

# Verificar que esté funcionando
pm2 status
pm2 logs fakenews-backend
```

## 🔧 Configuración de Producción

### Variables de Entorno Críticas

```env
# Producción
NODE_ENV=production
PORT=3001

# APIs de IA
GEMINI_API_KEY=tu_api_key_real
HUGGINGFACE_API_KEY=tu_api_key_real

# Seguridad
CORS_ORIGIN=https://tu-dominio.com
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW=900000
```

### Configuración de Seguridad

1. **HTTPS**

   ```bash
   # Usar Let's Encrypt
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d tu-dominio.com
   ```

2. **Firewall**

   ```bash
   sudo ufw allow 22
   sudo ufw allow 80
   sudo ufw allow 443
   sudo ufw enable
   ```

3. **Monitoreo**
   ```bash
   # Instalar herramientas de monitoreo
   npm install -g pm2-logrotate
   pm2 install pm2-logrotate
   ```

## 📊 Monitoreo y Mantenimiento

### Health Checks

```bash
# Verificar estado del backend
curl http://localhost:3001/api/health

# Verificar logs
pm2 logs fakenews-backend
docker-compose logs backend
```

### Backup

```bash
# Backup de configuración
tar -czf backup-$(date +%Y%m%d).tar.gz backend/.env logs/
```

### Actualizaciones

```bash
# Actualizar código
git pull origin main

# Rebuild y restart
npm run build
pm2 restart fakenews-backend
# o
docker-compose up -d --build
```

## 🚨 Troubleshooting

### Problemas Comunes

1. **Error de CORS**

   - Verificar `CORS_ORIGIN` en variables de entorno
   - Asegurar que el frontend y backend usen el mismo dominio

2. **APIs no funcionan**

   - Verificar API keys en `.env`
   - Revisar logs del backend
   - Verificar límites de uso de las APIs

3. **Servidor no inicia**
   - Verificar puerto disponible
   - Revisar logs de error
   - Verificar variables de entorno

### Logs Útiles

```bash
# Backend logs
pm2 logs fakenews-backend
docker-compose logs backend

# Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# System logs
sudo journalctl -u nginx
sudo journalctl -u pm2-root
```

## 📞 Soporte

Para problemas específicos:

1. Revisar logs del sistema
2. Verificar configuración de variables de entorno
3. Probar endpoints individuales
4. Contactar al equipo de desarrollo

---

**¡Sistema listo para producción!** 🚀✨
