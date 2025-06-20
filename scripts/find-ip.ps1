# Script para descobrir o IP da maquina
Write-Host "Descobrindo IPs da sua maquina..." -ForegroundColor Green
Write-Host ""

# Buscar todos os IPs IPv4
$ips = Get-NetIPAddress | Where-Object { 
    $_.AddressFamily -eq "IPv4" -and 
    $_.IPAddress -notlike "127.*" -and 
    $_.IPAddress -notlike "169.*" -and
    $_.IPAddress -notlike "172.*" -and
    $_.IPAddress -notlike "10.*"
}

Write-Host "IPs encontrados para conectar com o app mobile:" -ForegroundColor Yellow
Write-Host ""

foreach ($ip in $ips) {
    Write-Host "   $($ip.IPAddress):3000" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "Instrucoes:" -ForegroundColor Green
Write-Host "1. Copie um dos IPs acima"
Write-Host "2. Va para Configuracoes > Configuracao da API no app"
Write-Host "3. Cole o IP no campo e teste a conexao"
Write-Host ""
Write-Host "Se nenhum IP funcionar, tente:" -ForegroundColor Yellow
Write-Host "   - Verificar se o firewall esta permitindo conexoes na porta 3000"
Write-Host "   - Verificar se sua API esta configurada para aceitar conexoes externas"
Write-Host "   - Tentar usar '10.0.2.2' se estiver usando Android Emulator"
Write-Host "" 