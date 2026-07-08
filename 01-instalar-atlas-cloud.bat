@echo off
cd /d "%~dp0"
echo.
echo ==========================================
echo  ATLAS Cloud - Instalacion
echo ==========================================
echo.
echo Este paso descarga las dependencias necesarias.
echo Necesitas conexion a internet.
echo.
npm install
echo.
echo Si no ves errores, ya puedes abrir:
echo 02-iniciar-atlas-cloud.bat
echo.
pause

