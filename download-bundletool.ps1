# Script para baixar o Bundletool
Write-Host "Baixando Bundletool..." -ForegroundColor Green

# Criar pasta se não existir
$bundletoolDir = "C:\bundletool"
if (!(Test-Path $bundletoolDir)) {
    New-Item -ItemType Directory -Path $bundletoolDir
}

# URL do bundletool (versão mais recente)
$bundletoolUrl = "https://github.com/google/bundletool/releases/download/1.17.2/bundletool-all-1.17.2.jar"
$bundletoolPath = "$bundletoolDir\bundletool.jar"

# Baixar o arquivo
Write-Host "Baixando de: $bundletoolUrl" -ForegroundColor Yellow
Invoke-WebRequest -Uri $bundletoolUrl -OutFile $bundletoolPath

Write-Host "Bundletool baixado em: $bundletoolPath" -ForegroundColor Green
Write-Host "Para usar, execute: java -jar $bundletoolPath" -ForegroundColor Cyan 