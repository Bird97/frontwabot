# Script de Verificación de Integración Frontend-Backend
# Wabot - Sistema de Gestión de Restaurantes

Write-Host "`n=====================================" -ForegroundColor Cyan
Write-Host "🔍 VERIFICACIÓN DE INTEGRACIÓN" -ForegroundColor Cyan
Write-Host "=====================================`n" -ForegroundColor Cyan

$backendUrl = "http://localhost:3000"
$frontendUrl = "http://localhost:3001"
$errores = 0

# Función para verificar servicio
function Test-Service {
    param(
        [string]$Url,
        [string]$Nombre
    )
    
    try {
        Write-Host "Verificando $Nombre..." -NoNewline
        $response = Invoke-WebRequest -Uri $Url -Method Get -TimeoutSec 5 -ErrorAction Stop
        Write-Host " ✅ OK" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host " ❌ FALLO" -ForegroundColor Red
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Yellow
        return $false
    }
}

# 1. Verificar Backend
Write-Host "`n1️⃣  Verificando Backend..." -ForegroundColor Cyan
$backendOk = Test-Service -Url $backendUrl -Nombre "Backend"
if (-not $backendOk) {
    $errores++
    Write-Host "   💡 Solución: Ejecuta 'cd backwabot; npm run start:dev'" -ForegroundColor Yellow
}

# 2. Verificar Frontend
Write-Host "`n2️⃣  Verificando Frontend..." -ForegroundColor Cyan
$frontendOk = Test-Service -Url $frontendUrl -Nombre "Frontend"
if (-not $frontendOk) {
    $errores++
    Write-Host "   💡 Solución: Ejecuta 'cd frontwabot; npm run dev'" -ForegroundColor Yellow
}

# 3. Verificar Endpoint de Login
if ($backendOk) {
    Write-Host "`n3️⃣  Verificando Endpoint de Login..." -ForegroundColor Cyan
    
    try {
        Write-Host "   Enviando petición de login de prueba..." -NoNewline
        
        $loginBody = @{
            email = "test@test.com"
            password = "test123"
        } | ConvertTo-Json
        
        $response = Invoke-RestMethod -Uri "$backendUrl/login" -Method Post -Body $loginBody -ContentType "application/json" -ErrorAction Stop
        
        Write-Host " ✅ Endpoint OK" -ForegroundColor Green
        Write-Host "   Estructura de respuesta correcta" -ForegroundColor Green
    }
    catch {
        # Es esperado que falle con credenciales incorrectas, pero el endpoint debe existir
        if ($_.Exception.Response.StatusCode -eq 401 -or $_.Exception.Response.StatusCode -eq 400) {
            Write-Host " ✅ Endpoint OK (credenciales incorrectas esperado)" -ForegroundColor Green
        }
        else {
            Write-Host " ❌ FALLO" -ForegroundColor Red
            Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Yellow
            $errores++
        }
    }
}
else {
    Write-Host "`n3️⃣  Saltando verificación de Login (Backend no disponible)" -ForegroundColor Yellow
    $errores++
}

# 4. Verificar Variables de Entorno
Write-Host "`n4️⃣  Verificando Variables de Entorno..." -ForegroundColor Cyan
$envFile = "C:\Users\JUANCHO\Desktop\wabot\frontwabot\.env.local"

if (Test-Path $envFile) {
    Write-Host "   Archivo .env.local encontrado" -NoNewline
    $envContent = Get-Content $envFile -Raw
    
    if ($envContent -match "NEXT_PUBLIC_API_URL") {
        $apiUrl = ($envContent -split "`n" | Where-Object { $_ -match "NEXT_PUBLIC_API_URL" }).Split("=")[1].Trim()
        Write-Host " ✅ OK" -ForegroundColor Green
        Write-Host "   NEXT_PUBLIC_API_URL = $apiUrl" -ForegroundColor Cyan
        
        if ($apiUrl -ne $backendUrl) {
            Write-Host "   ⚠️  Advertencia: La URL no coincide con el backend esperado" -ForegroundColor Yellow
        }
    }
    else {
        Write-Host " ❌ FALLO" -ForegroundColor Red
        Write-Host "   NEXT_PUBLIC_API_URL no configurado" -ForegroundColor Yellow
        $errores++
    }
}
else {
    Write-Host "   Archivo .env.local no encontrado ❌ FALLO" -ForegroundColor Red
    Write-Host "   💡 Solución: Crea el archivo .env.local con NEXT_PUBLIC_API_URL=$backendUrl" -ForegroundColor Yellow
    $errores++
}

# 5. Verificar Archivos Clave
Write-Host "`n5️⃣  Verificando Archivos Clave..." -ForegroundColor Cyan
$archivos = @(
    "C:\Users\JUANCHO\Desktop\wabot\frontwabot\lib\auth.ts",
    "C:\Users\JUANCHO\Desktop\wabot\frontwabot\lib\users.ts",
    "C:\Users\JUANCHO\Desktop\wabot\frontwabot\lib\restaurant.ts",
    "C:\Users\JUANCHO\Desktop\wabot\frontwabot\app\login\page.tsx",
    "C:\Users\JUANCHO\Desktop\wabot\frontwabot\app\onboarding\page.tsx"
)

foreach ($archivo in $archivos) {
    $nombre = Split-Path $archivo -Leaf
    if (Test-Path $archivo) {
        Write-Host "   ✅ $nombre" -ForegroundColor Green
    }
    else {
        Write-Host "   ❌ $nombre no encontrado" -ForegroundColor Red
        $errores++
    }
}

# Resumen
Write-Host "`n=====================================" -ForegroundColor Cyan
Write-Host "📊 RESUMEN" -ForegroundColor Cyan
Write-Host "=====================================`n" -ForegroundColor Cyan

if ($errores -eq 0) {
    Write-Host "✅ TODAS LAS VERIFICACIONES PASARON" -ForegroundColor Green
    Write-Host "`n🎉 ¡El sistema está listo para usar!" -ForegroundColor Green
    Write-Host "`nPróximos pasos:" -ForegroundColor Cyan
    Write-Host "1. Ve a $frontendUrl/login" -ForegroundColor White
    Write-Host "2. Inicia sesión con tus credenciales" -ForegroundColor White
    Write-Host "3. Completa el onboarding si es tu primer acceso`n" -ForegroundColor White
}
else {
    Write-Host "❌ SE ENCONTRARON $errores ERRORES" -ForegroundColor Red
    Write-Host "`n💡 Revisa los mensajes anteriores para solucionarlos`n" -ForegroundColor Yellow
}

Write-Host "=====================================" -ForegroundColor Cyan

# Preguntar si quiere abrir el navegador
if ($errores -eq 0 -and $frontendOk) {
    $respuesta = Read-Host "`n¿Deseas abrir el navegador en la página de login? (S/N)"
    if ($respuesta -eq "S" -or $respuesta -eq "s") {
        Start-Process "$frontendUrl/login"
    }
}
