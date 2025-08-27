@echo off
echo ========================================
echo    SISTEMA DE DETECCIÓN DE NOTICIAS FALSAS
echo ========================================
echo.
echo Iniciando servidores...
echo.

REM Iniciar backend
echo Iniciando Backend (puerto 3001)...
start "Backend" cmd /k "cd backend && npm run dev"

REM Esperar un momento
timeout /t 3 /nobreak > nul

REM Iniciar frontend
echo Iniciando Frontend (puerto 5173)...
start "Frontend" cmd /k "npm run dev"

REM Esperar un momento
timeout /t 5 /nobreak > nul

REM Abrir navegador
echo Abriendo navegador...
start http://localhost:5173

echo.
echo ========================================
echo    SISTEMA INICIADO CORRECTAMENTE
echo ========================================
echo.
echo Backend:  http://localhost:3001
echo Frontend: http://localhost:5173
echo.
echo Características:
echo - Análisis con IA avanzada
echo - Verificación externa
echo - APIs de Gemini y Hugging Face
echo.
echo Presiona cualquier tecla para cerrar esta ventana...
pause > nul
