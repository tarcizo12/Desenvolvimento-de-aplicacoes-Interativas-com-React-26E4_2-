@echo off
setlocal
set "hadError=0"
pushd "%~dp0..\..\backend"

echo ==========================================
echo  Encerrando os servicos da aplicacao
echo ==========================================
echo.
echo Os containers do backend, frontend e bancos serao encerrados.
echo Os volumes do banco serao preservados, a menos que voce escolha apaga-los.
echo.
set /p apagarVolumes=Apagar tambem os dados dos bancos para recomecar do zero? (S/N):

if /i "%apagarVolumes%"=="S" (
    echo.
    echo ATENCAO: encerrando o backend e apagando os volumes dos bancos...
    docker compose down --volumes --remove-orphans
) else (
    echo.
    echo Encerrando o backend e preservando os dados dos bancos...
    docker compose down --remove-orphans
)

if errorlevel 1 (
    echo [ERRO] Nao foi possivel encerrar o backend.
    set "hadError=1"
)

popd
pushd "%~dp0..\..\frontend"
echo.
echo Encerrando o frontend...
docker compose down --remove-orphans
if errorlevel 1 (
    echo [ERRO] Nao foi possivel encerrar o frontend.
    set "hadError=1"
)

echo.
if "%hadError%"=="0" (
    echo Backend e frontend encerrados.
) else (
    echo [ERRO] Uma ou mais partes nao puderam ser encerradas.
)
popd
pause
exit /b %hadError%
