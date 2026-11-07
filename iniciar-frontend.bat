@echo off
setlocal
pushd "%~dp0frontend"

echo ==========================================
echo  Iniciando o frontend em container Docker
echo ==========================================

where docker >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Docker nao foi encontrado no PATH.
    popd
    pause
    exit /b 1
)

docker info >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Inicie o Docker Desktop e tente novamente.
    popd
    pause
    exit /b 1
)

echo Construindo e iniciando somente o frontend...
docker compose up --build --remove-orphans -d
if errorlevel 1 (
    echo [ERRO] Nao foi possivel iniciar o frontend.
    echo Consulte os logs com: docker compose logs -f
    popd
    pause
    exit /b 1
)

echo Aguardando o frontend ficar pronto...
for /L %%i in (1,1,45) do (
    curl.exe --fail --silent --output NUL http://localhost:8082
    if not errorlevel 1 goto :frontend_pronto
    timeout /t 2 /nobreak >nul
)

echo [AVISO] O container iniciou, mas o frontend ainda nao respondeu.
echo Consulte os logs com: docker compose logs -f frontend
popd
pause
exit /b 1

:frontend_pronto
echo Frontend pronto: http://localhost:8082
start "" "http://localhost:8082"
popd
pause
exit /b 0
