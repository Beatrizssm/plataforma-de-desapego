# Script para gerenciar Docker PostgreSQL
param(
    [Parameter(Position=0)]
    [ValidateSet("up", "down", "logs", "status", "restart", "stop", "start", "clean", "shell")]
    [string]$Action = "up"
)

$ErrorActionPreference = "Stop"

function Show-Header {
    Write-Host ""
    Write-Host "🐘 Docker PostgreSQL Manager" -ForegroundColor Cyan
    Write-Host "==============================" -ForegroundColor Cyan
    Write-Host ""
}

function Start-Containers {
    Show-Header
    Write-Host "🚀 Iniciando containers PostgreSQL..." -ForegroundColor Green
    docker-compose up -d
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Containers iniciados com sucesso!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📊 Status dos containers:" -ForegroundColor Yellow
        docker-compose ps
        Write-Host ""
        Write-Host "💡 Para ver os logs: .\docker-postgres.ps1 logs" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Erro ao iniciar containers!" -ForegroundColor Red
    }
}

function Stop-Containers {
    Show-Header
    Write-Host "🛑 Parando containers..." -ForegroundColor Yellow
    docker-compose down
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Containers parados com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "❌ Erro ao parar containers!" -ForegroundColor Red
    }
}

function Show-Logs {
    Show-Header
    Write-Host "📋 Logs dos containers (Ctrl+C para sair)..." -ForegroundColor Yellow
    Write-Host ""
    docker-compose logs -f
}

function Show-Status {
    Show-Header
    Write-Host "📊 Status dos containers:" -ForegroundColor Yellow
    Write-Host ""
    docker-compose ps
    Write-Host ""
    Write-Host "📦 Todos os containers Docker:" -ForegroundColor Yellow
    docker ps -a
}

function Restart-Containers {
    Show-Header
    Write-Host "🔄 Reiniciando containers..." -ForegroundColor Yellow
    docker-compose restart
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Containers reiniciados com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "❌ Erro ao reiniciar containers!" -ForegroundColor Red
    }
}

function Stop-Only {
    Show-Header
    Write-Host "⏸️  Parando containers (sem remover)..." -ForegroundColor Yellow
    docker-compose stop
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Containers parados!" -ForegroundColor Green
    } else {
        Write-Host "❌ Erro ao parar containers!" -ForegroundColor Red
    }
}

function Start-Only {
    Show-Header
    Write-Host "▶️  Iniciando containers..." -ForegroundColor Yellow
    docker-compose start
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Containers iniciados!" -ForegroundColor Green
    } else {
        Write-Host "❌ Erro ao iniciar containers!" -ForegroundColor Red
    }
}

function Clean-All {
    Show-Header
    Write-Host "⚠️  ATENÇÃO: Isso vai remover containers, volumes e dados!" -ForegroundColor Red
    $confirmation = Read-Host "Tem certeza? (digite 'sim' para confirmar)"
    if ($confirmation -eq "sim") {
        Write-Host "🧹 Limpando tudo..." -ForegroundColor Yellow
        docker-compose down -v
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Limpeza concluída!" -ForegroundColor Green
        } else {
            Write-Host "❌ Erro na limpeza!" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ Operação cancelada." -ForegroundColor Yellow
    }
}

function Open-Shell {
    Show-Header
    Write-Host "🐚 Abrindo shell do PostgreSQL..." -ForegroundColor Yellow
    Write-Host ""
    docker exec -it postgres_desapego psql -U bia -d desapego_db
}

# Executar ação
switch ($Action) {
    "up" { Start-Containers }
    "down" { Stop-Containers }
    "logs" { Show-Logs }
    "status" { Show-Status }
    "restart" { Restart-Containers }
    "stop" { Stop-Only }
    "start" { Start-Only }
    "clean" { Clean-All }
    "shell" { Open-Shell }
    default {
        Show-Header
        Write-Host "Uso: .\docker-postgres.ps1 [ação]" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Ações disponíveis:" -ForegroundColor Cyan
        Write-Host "  up      - Iniciar containers (padrão)" -ForegroundColor White
        Write-Host "  down    - Parar e remover containers" -ForegroundColor White
        Write-Host "  logs    - Ver logs em tempo real" -ForegroundColor White
        Write-Host "  status  - Ver status dos containers" -ForegroundColor White
        Write-Host "  restart - Reiniciar containers" -ForegroundColor White
        Write-Host "  stop    - Parar containers (sem remover)" -ForegroundColor White
        Write-Host "  start   - Iniciar containers parados" -ForegroundColor White
        Write-Host "  clean   - Remover tudo (containers + volumes + dados)" -ForegroundColor White
        Write-Host "  shell   - Abrir shell do PostgreSQL" -ForegroundColor White
        Write-Host ""
    }
}

