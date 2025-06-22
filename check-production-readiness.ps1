# Script para verificar preparação para produção do Smart Menu Mobile

Write-Host "🔍 Verificando preparação para produção..." -ForegroundColor Cyan
Write-Host "=" * 60

# Verificar se o logger foi implementado
Write-Host "📝 Verificando sistema de logging..." -ForegroundColor Yellow
if (Test-Path "src/utils/logger.ts") {
    Write-Host "✅ Logger implementado" -ForegroundColor Green
} else {
    Write-Host "❌ Logger não encontrado" -ForegroundColor Red
}

# Verificar configuração do Restaurant ID
Write-Host "🍽️ Verificando Restaurant ID..." -ForegroundColor Yellow
$appConfig = Get-Content "src/config/app-config.ts" -Raw
if ($appConfig -match "4a94dbcc-b9b7-470c-9a47-c61062f66579") {
    Write-Host "⚠️ Restaurant ID ainda é o exemplo - CONFIGURAR UUID REAL" -ForegroundColor Yellow
} else {
    Write-Host "✅ Restaurant ID configurado" -ForegroundColor Green
}

# Verificar Bundle ID
Write-Host "📦 Verificando Bundle ID..." -ForegroundColor Yellow
$appJson = Get-Content "app.json" -Raw
if ($appJson -match "com\.yourcompany\.smartmenumobile") {
    Write-Host "⚠️ Bundle ID ainda é genérico - CONFIGURAR ID ÚNICO" -ForegroundColor Yellow
} else {
    Write-Host "✅ Bundle ID configurado" -ForegroundColor Green
}

# Verificar se botões de teste estão ocultos
Write-Host "🧪 Verificando botões de teste..." -ForegroundColor Yellow
$reservationScreen = Get-Content "src/pages/reservations/ReservationScreen.tsx" -Raw
if ($reservationScreen -match "Teste de Notificações.*COMENTADA") {
    Write-Host "✅ Botões de teste ocultos" -ForegroundColor Green
} else {
    Write-Host "❌ Botões de teste ainda visíveis" -ForegroundColor Red
}

# Verificar configurações de produção
Write-Host "⚙️ Verificando configurações de produção..." -ForegroundColor Yellow
if ($appConfig -match "enableTestButtons: false" -and $appConfig -match "enableDebugLogs: false") {
    Write-Host "✅ Configurações de produção ativadas" -ForegroundColor Green
} else {
    Write-Host "❌ Configurações de produção não ativadas" -ForegroundColor Red
}

# Verificar timeout no axios
Write-Host "🌐 Verificando timeout de rede..." -ForegroundColor Yellow
$axiosConfig = Get-Content "src/lib/axios.ts" -Raw
if ($axiosConfig -match "timeout: 10000") {
    Write-Host "✅ Timeout configurado" -ForegroundColor Green
} else {
    Write-Host "❌ Timeout não configurado" -ForegroundColor Red
}

# Verificar ícone de notificação
Write-Host "🔔 Verificando ícone de notificação..." -ForegroundColor Yellow
if (Test-Path "assets/notification-icon.png") {
    Write-Host "✅ Ícone de notificação presente" -ForegroundColor Green
} else {
    Write-Host "❌ Ícone de notificação não encontrado" -ForegroundColor Red
}

# Verificar .gitignore
Write-Host "📁 Verificando .gitignore..." -ForegroundColor Yellow
$gitignore = Get-Content ".gitignore" -Raw
if ($gitignore -match "android/" -and $gitignore -match "ios/") {
    Write-Host "✅ Pastas nativas no .gitignore" -ForegroundColor Green
} else {
    Write-Host "❌ Pastas nativas não estão no .gitignore" -ForegroundColor Red
}

Write-Host "=" * 60
Write-Host "📋 Resumo da verificação:" -ForegroundColor Cyan

# Contar problemas
$issues = 0
if (-not (Test-Path "src/utils/logger.ts")) { $issues++ }
if ($appConfig -match "4a94dbcc-b9b7-470c-9a47-c61062f66579") { $issues++ }
if ($appJson -match "com\.yourcompany\.smartmenumobile") { $issues++ }
if (-not ($reservationScreen -match "Teste de Notificações.*COMENTADA")) { $issues++ }
if (-not ($appConfig -match "enableTestButtons: false")) { $issues++ }
if (-not ($axiosConfig -match "timeout: 10000")) { $issues++ }
if (-not (Test-Path "assets/notification-icon.png")) { $issues++ }
if (-not ($gitignore -match "android/")) { $issues++ }

if ($issues -eq 0) {
    Write-Host "🎉 PROJETO PRONTO PARA PRODUÇÃO!" -ForegroundColor Green
    Write-Host "✅ Todos os itens verificados estão corretos" -ForegroundColor Green
} else {
    Write-Host "⚠️ $issues problema(s) encontrado(s)" -ForegroundColor Yellow
    Write-Host "🔧 Corrija os problemas antes de gerar o build de produção" -ForegroundColor Yellow
}

Write-Host "=" * 60
Write-Host "📖 Para mais detalhes, consulte: docs/production-readiness-report.md" -ForegroundColor Cyan 