@echo off
setlocal
pushd "%~dp0frontend"

echo ==========================================
echo  Iniciando o frontend React
echo ==========================================

where node >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Node.js nao foi encontrado. Instale o Node.js 20.19+ ou 22.12+.
    popd
    pause
    exit /b 1
)

where npm >nul 2>&1
if errorlevel 1 (
    echo [ERRO] npm nao foi encontrado.
    popd
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo Instalando as dependencias do frontend...
    call npm.cmd install
    if errorlevel 1 (
        echo [ERRO] Falha ao instalar as dependencias.
        popd
        pause
        exit /b 1
    )
)

echo Frontend: http://localhost:8082
echo Use Ctrl+C para encerrar o servidor.
call npm.cmd run dev -- --host 0.0.0.0
set "resultado=%errorlevel%"
popd
exit /b %resultado%
