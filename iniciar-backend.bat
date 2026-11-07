@echo off
setlocal
pushd "%~dp0backend"

echo ==========================================
echo  Iniciando o backend do Gerenciador Estoque
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

echo Subindo banco de desenvolvimento e API Spring Boot...
docker compose up --build --remove-orphans -d api
if errorlevel 1 (
    echo [ERRO] Nao foi possivel iniciar o backend.
    popd
    pause
    exit /b 1
)

echo Aguardando a API ficar pronta...
for /L %%i in (1,1,60) do (
    curl.exe --fail --silent --output NUL http://localhost:8080/api-docs
    if not errorlevel 1 goto :api_pronta
    timeout /t 2 /nobreak >nul
)

echo [AVISO] Os containers iniciaram, mas a API ainda nao respondeu.
echo Consulte os logs com: docker compose logs -f api
popd
pause
exit /b 1

:api_pronta
echo Backend pronto: http://localhost:8080
echo Swagger: http://localhost:8080/swagger-ui.html
popd
pause
exit /b 0
