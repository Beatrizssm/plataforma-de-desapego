# Script de Configuração do Frontend - Windows PowerShell

Write-Host "🎨 Configurando Frontend..." -ForegroundColor Cyan

# Verificar se Node.js está instalado
Write-Host "`n📦 Verificando Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Node.js não encontrado! Instale Node.js 18+ primeiro." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Node.js encontrado: $nodeVersion" -ForegroundColor Green

# Instalar dependências
Write-Host "`n📥 Instalando dependências..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao instalar dependências!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dependências instaladas!" -ForegroundColor Green

Write-Host "`n✅ Frontend configurado com sucesso!" -ForegroundColor Green
Write-Host "`n🚀 Para iniciar o servidor, execute:" -ForegroundColor Cyan
Write-Host "   npm run dev" -ForegroundColor White

