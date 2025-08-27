# Script PowerShell para iniciar el sistema de detección de noticias falsas

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   SISTEMA DE DETECCIÓN DE NOTICIAS FALSAS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Iniciando servidores..." -ForegroundColor Yellow
Write-Host ""

# Iniciar backend
Write-Host "Iniciando Backend (puerto 3001)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev"

# Esperar un momento
Start-Sleep -Seconds 3

# Iniciar frontend
Write-Host "Iniciando Frontend (puerto 5173)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"

# Esperar un momento
Start-Sleep -Seconds 5

# Abrir navegador
Write-Host "Abriendo navegador..." -ForegroundColor Green
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   SISTEMA INICIADO CORRECTAMENTE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend:  http://localhost:3001" -ForegroundColor White
Write-Host "Frontend: http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host "Características:" -ForegroundColor Yellow
Write-Host "- Análisis con IA avanzada" -ForegroundColor White
Write-Host "- Verificación externa" -ForegroundColor White
Write-Host "- APIs de Gemini y Hugging Face" -ForegroundColor White
Write-Host ""
Write-Host "Presiona cualquier tecla para cerrar esta ventana..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
