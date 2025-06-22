# Script para converter AAB para APK
param(
    [Parameter(Mandatory=$true)]
    [string]$AabFile
)

Write-Host "Convertendo AAB para APK..." -ForegroundColor Green

# Verificar se o arquivo AAB existe
if (!(Test-Path $AabFile)) {
    Write-Host "Erro: Arquivo AAB não encontrado: $AabFile" -ForegroundColor Red
    exit 1
}

# Configurações
$bundletoolPath = "C:\bundletool\bundletool.jar"
$outputDir = Split-Path $AabFile
$outputName = [System.IO.Path]::GetFileNameWithoutExtension($AabFile)

# Comando para gerar APKs
$apksFile = "$outputDir\$outputName.apks"
Write-Host "Gerando APKs em: $apksFile" -ForegroundColor Yellow

java -jar $bundletoolPath build-apks --bundle="$AabFile" --output="$apksFile"

if ($LASTEXITCODE -eq 0) {
    Write-Host "APKs gerado com sucesso!" -ForegroundColor Green
    Write-Host "Arquivo: $apksFile" -ForegroundColor Cyan
    
    # Extrair APK universal
    $universalApk = "$outputDir\$outputName-universal.apk"
    Write-Host "Extraindo APK universal..." -ForegroundColor Yellow
    
    java -jar $bundletoolPath extract-apks --apks="$apksFile" --output-dir="$outputDir" --device-spec="$outputDir\device-spec.json"
    
    Write-Host "APK universal extraído: $universalApk" -ForegroundColor Green
} else {
    Write-Host "Erro ao gerar APKs" -ForegroundColor Red
} 