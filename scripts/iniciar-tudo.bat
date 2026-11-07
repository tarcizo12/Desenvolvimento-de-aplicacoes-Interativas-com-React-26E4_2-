@echo off
setlocal
set "SKIP_SCRIPT_PAUSE=1"

echo ==========================================
echo  Iniciando backend e frontend
echo ==========================================
echo.

call "%~dp0windows\iniciar-backend.bat"
if errorlevel 1 (
    echo [ERRO] O backend nao iniciou. O frontend nao sera iniciado.
    pause
    exit /b 1
)

call "%~dp0windows\iniciar-frontend.bat"
if errorlevel 1 (
    echo [ERRO] O frontend nao iniciou. Verifique os logs do container.
    pause
    exit /b 1
)

echo Aplicacao pronta: http://localhost:8082
pause
exit /b 0
