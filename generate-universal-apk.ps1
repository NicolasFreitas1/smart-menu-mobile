# Script para gerar APK universal a partir de AAB
param(
    [Parameter(Mandatory=$true)]
    [string]$AabFile
)

Write-Host "Gerando APK universal..." -ForegroundColor Green

# Verificar se o arquivo AAB existe
if (!(Test-Path $AabFile)) {
    Write-Host "Erro: Arquivo AAB não encontrado: $AabFile" -ForegroundColor Red
    exit 1
}

# Configurações
$bundletoolPath = "C:\bundletool\bundletool.jar"
$outputDir = Split-Path $AabFile
$outputName = [System.IO.Path]::GetFileNameWithoutExtension($AabFile)

# Gerar APKs universal
$apksFile = "$outputDir\$outputName.apks"
Write-Host "Gerando APKs universal..." -ForegroundColor Yellow

java -jar $bundletoolPath build-apks --bundle="$AabFile" --output="$apksFile" --mode=universal

if ($LASTEXITCODE -eq 0) {
    Write-Host "APKs universal gerado!" -ForegroundColor Green
    
    # Extrair APK do APKs
    $universalApk = "$outputDir\$outputName-universal.apk"
    Write-Host "Extraindo APK universal..." -ForegroundColor Yellow
    
    # Criar arquivo de especificação universal
    $deviceSpec = @"
{
  "supportedAbis": ["arm64-v8a", "armeabi-v7a", "x86", "x86_64"],
  "supportedLocales": ["en", "pt"],
  "screenDensity": 420,
  "sdkVersion": 24
}
"@
    $deviceSpec | Out-File -FilePath "$outputDir\device-spec.json" -Encoding UTF8
    
    java -jar $bundletoolPath extract-apks --apks="$apksFile" --output-dir="$outputDir" --device-spec="$outputDir\device-spec.json"
    
    Write-Host "APK universal extraído!" -ForegroundColor Green
    Write-Host "Arquivo: $universalApk" -ForegroundColor Cyan
} else {
    Write-Host "Erro ao gerar APKs" -ForegroundColor Red
} 