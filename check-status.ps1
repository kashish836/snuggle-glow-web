# Check Server Status
Write-Host "`n=== SnuggleNest Server Status ===" -ForegroundColor Cyan
Write-Host ""

# Check Backend
Write-Host "Backend API (http://localhost:8000): " -NoNewline
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/health" -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
    Write-Host "✅ RUNNING" -ForegroundColor Green
    Write-Host "   - API Docs: http://localhost:8000/docs" -ForegroundColor Gray
} catch {
    Write-Host "❌ NOT RUNNING" -ForegroundColor Red
    Write-Host "   Start with: cd backend; python main.py" -ForegroundColor Gray
}

Write-Host ""

# Check Frontend
Write-Host "Frontend App (http://localhost:5173): " -NoNewline
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5173" -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
    Write-Host "✅ RUNNING" -ForegroundColor Green
    Write-Host "   - Open: http://localhost:5173" -ForegroundColor Gray
} catch {
    Write-Host "❌ NOT RUNNING" -ForegroundColor Red
    Write-Host "   Start with: npm run dev" -ForegroundColor Gray
}

Write-Host ""
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

