# Script para gerar build de produção do Smart Menu Mobile
# Com configurações de notificação otimizadas para Play Store

Write-Host "🚀 Gerando build de produção do Smart Menu Mobile..." -ForegroundColor Green

# Limpar cache do Expo
Write-Host "🧹 Limpando cache do Expo..." -ForegroundColor Yellow
npx expo start --clear

# Gerar build de produção para Android
Write-Host "📱 Gerando build de produção para Android..." -ForegroundColor Yellow
npx eas build --platform android --profile production

Write-Host "✅ Build de produção iniciado!" -ForegroundColor Green
Write-Host "📋 Acompanhe o progresso em: https://expo.dev/accounts/nicolasfreitas/projects/smart-menu-mobile/builds" -ForegroundColor Cyan
Write-Host "📦 O arquivo .aab será gerado automaticamente para upload na Play Store" -ForegroundColor Cyan 