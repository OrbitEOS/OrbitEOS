# OpenEMS POC Launch Script
Write-Host "🚀 Launching OpenEMS POC Environment..." -ForegroundColor Cyan

# Check if Docker is running
Write-Host "`nChecking Docker status..." -ForegroundColor Yellow
docker version
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker is not running. Please start Docker Desktop and try again." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Docker is running!" -ForegroundColor Green

# Launch Edge Stack
Write-Host "`n📡 Starting OpenEMS Edge..." -ForegroundColor Yellow
Set-Location "$PSScriptRoot\orbiteos-edge"
docker-compose up -d

# Launch Cloud Stack
Write-Host "`n☁️  Starting OpenEMS Cloud..." -ForegroundColor Yellow
Set-Location "$PSScriptRoot\orbiteos-core"
docker-compose up -d

# Show running containers
Write-Host "`n📊 Running Containers:" -ForegroundColor Cyan
Set-Location $PSScriptRoot
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

Write-Host "`n✅ POC Environment Launched!" -ForegroundColor Green
Write-Host "`n🌐 Access Points:" -ForegroundColor Cyan
Write-Host "   Edge Felix Console:  http://localhost:8080 (admin:admin)"
Write-Host "   Local Edge UI:       http://localhost:8085"
Write-Host "   Cloud UI:            http://localhost:80"
Write-Host "   Grafana:             http://localhost:3000 (admin:admin)"
