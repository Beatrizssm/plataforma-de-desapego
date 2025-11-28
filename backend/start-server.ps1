# Script para iniciar o servidor backend
Write-Host "🚀 Iniciando servidor backend..." -ForegroundColor Green
Write-Host ""

# Verificar se o .env existe
if (-not (Test-Path .env)) {
    Write-Host "❌ Arquivo .env não encontrado!" -ForegroundColor Red
    exit 1
}

# Verificar se node_modules existe
if (-not (Test-Path node_modules)) {
    Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
    npm install
}

# Iniciar servidor
Write-Host "✅ Iniciando servidor na porta 4000..." -ForegroundColor Green
Write-Host ""
npm run dev

