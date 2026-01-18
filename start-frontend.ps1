# Frontend Startup Script for Windows PowerShell
Write-Host "Starting SnuggleNest Frontend..." -ForegroundColor Green

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    @"
VITE_API_BASE_URL=http://localhost:8000/api/v1
"@ | Out-File -FilePath .env -Encoding utf8
}

Write-Host "Starting Vite dev server..." -ForegroundColor Green
npm run dev

