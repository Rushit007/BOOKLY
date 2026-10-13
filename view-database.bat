@echo off
title BOOKLY - Database Studio Viewer
color 0B

echo ========================================================
echo        BOOKLY - Interactive Database Studio Viewer
echo ========================================================
echo.
echo Launching Prisma Visual Database Studio on http://localhost:5555 ...
echo.

cd /d "%~dp0backend"
call npx prisma studio

pause
