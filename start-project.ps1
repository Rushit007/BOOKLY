# BOOKLY - Automated PowerShell Launcher

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "       BOOKLY - Automated Project Launcher" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

# 1. Check Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Node.js is not installed or not in PATH!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/"
    exit 1
}

# 2. Check Docker (Optional)
if (Get-Command docker -ErrorAction SilentlyContinue) {
    Write-Host "[INFO] Starting PostgreSQL and Redis via Docker..." -ForegroundColor Green
    docker compose up -d
} else {
    Write-Host "[WARNING] Docker not found. Assuming local PostgreSQL is running on port 5432." -ForegroundColor Yellow
}

# 3. Setup Backend
Write-Host "`n[1/3] Preparing Backend..." -ForegroundColor Cyan
Push-Location backend
if (-not (Test-Path node_modules)) {
    Write-Host "Installing backend dependencies..."
    npm install
}
if (-not (Test-Path .env) -and (Test-Path .env.example)) {
    Copy-Item .env.example .env
}
npx prisma generate
Pop-Location

# 4. Setup Frontend
Write-Host "`n[2/3] Preparing Frontend..." -ForegroundColor Cyan
Push-Location frontend
if (-not (Test-Path node_modules)) {
    Write-Host "Installing frontend dependencies..."
    npm install
}
if (-not (Test-Path .env.local)) {
    @"
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_TiGZAxgrQ4uoCX
"@ | Out-File -FilePath .env.local -Encoding utf8
}
Pop-Location

# 5. Launch Servers
Write-Host "`n[3/3] Launching Backend and Frontend in separate windows..." -ForegroundColor Cyan
Start-Process cmd -ArgumentList '/k', 'cd backend && npm run start:dev'
Start-Process cmd -ArgumentList '/k', 'cd frontend && npm run dev'

Write-Host "`n========================================================" -ForegroundColor Green
Write-Host "  BOOKLY is running!" -ForegroundColor Green
Write-Host "  Frontend : http://localhost:3000" -ForegroundColor Green
Write-Host "  Backend  : http://localhost:4000" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Green

Start-Sleep -Seconds 5
Start-Process "http://localhost:3000"
