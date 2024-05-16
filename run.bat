@echo off
cd /d "%~dp0"
:where
where pm2 >nul 2>&1
if errorlevel 1 goto check
echo 1: Default (Logger) Mode
echo 2: Tracker Mode
echo 3: Time Game
echo 4: Remove Service
choice /c 1234
cls
if %errorlevel%==1 (
  call pm2 start pm2.config.js
  call pm2 save
  rem Startup doesnt work at the moment
  rem call pm2 startup
)
if %errorlevel%==2 (
  rem call pm2 start pm2.track.config.js
  echo This option is not supported right now.
  pause
  exit
)
if %errorlevel%==3 call bun . timegame
if %errorlevel%==4 call pm2 delete global-keylistener
echo Script finished.
pause
exit
:check
echo Library PM2 missing. Install?
choice
if errorlevel 2 (
  echo Script cancelled.
  pause
  exit /b
)
call npm i pm2 -g
cls
goto where
