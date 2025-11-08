# 🎯 Guía Rápida de Inicio - Integración Completa

## ✅ Resumen de Cambios

Se ha completado la integración completa del frontend con el backend:

1. **Login actualizado** - Conectado al endpoint `/login` del backend
2. **Redirección inteligente** - Verifica `id_restaurante` para decidir si va a onboarding o home
3. **Servicios actualizados** - Manejo correcto de respuestas del backend (ApiResponse)
4. **Gestión de usuarios** - Asignación automática de `id_restaurante`
5. **Gestión de restaurantes** - Creación y actualización correcta

---

## 🚀 Inicio Rápido

### 1. **Iniciar el Backend**

```powershell
cd C:\Users\JUANCHO\Desktop\wabot\backwabot
npm run start:dev
```

El backend debería estar corriendo en `http://localhost:3000`

### 2. **Iniciar el Frontend**

```powershell
cd C:\Users\JUANCHO\Desktop\wabot\frontwabot
npm run dev
```

El frontend debería estar corriendo en `http://localhost:3001`

### 3. **Crear Usuario Inicial (Si no existe)**

**Opción A: Con PowerShell**

```powershell
$body = @{
    name = "Admin Principal"
    email = "admin@wabot.com"
    password = "admin123"
    user_name = "admin"
    phone_number = "+57 300 123 4567"
    address = "Oficina Central"
    tipe = "Gerente"
    is_active = $true
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/users" -Method Post -Body $body -ContentType "application/json"
```

**Nota:** Si el endpoint `/users` requiere autenticación, necesitarás crear el usuario directamente en la base de datos.

### 4. **Probar el Login**

1. Ve a `http://localhost:3001/login`
2. Ingresa:
   - **Email:** admin@wabot.com
   - **Contraseña:** admin123

---

## 🔄 Flujo de Usuario

### **Primer Login (Sin Restaurante)**

```
Login → Usuario sin id_restaurante → Onboarding
       ↓
Completa Onboarding → Crea Restaurante → Actualiza Usuario
       ↓
Redirige a Home
```

### **Login Subsecuente (Con Restaurante)**

```
Login → Usuario con id_restaurante → Home Directamente
```

---

## 🔍 Verificación del Sistema

### 1. **Verificar Backend**

```powershell
# Comprobar que el servidor esté corriendo
Invoke-WebRequest -Uri "http://localhost:3000" -Method Get
```

### 2. **Verificar Login**

```powershell
$loginBody = @{
    email = "admin@wabot.com"
    password = "admin123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3000/login" -Method Post -Body $loginBody -ContentType "application/json"

Write-Host "✅ Login exitoso!" -ForegroundColor Green
Write-Host "Usuario: $($response.user.name)" -ForegroundColor Cyan
Write-Host "Email: $($response.user.email)" -ForegroundColor Cyan
Write-Host "Tipo: $($response.user.tipe)" -ForegroundColor Cyan
Write-Host "ID Restaurante: $($response.user.id_restaurante)" -ForegroundColor Cyan
Write-Host "Token: $($response.token.Substring(0,20))..." -ForegroundColor Cyan
```

### 3. **Verificar Frontend**

```powershell
# Abrir el navegador en la página de login
Start-Process "http://localhost:3001/login"
```

---

## 📝 Estructura de Datos

### **Usuario después del Login**

```javascript
// En localStorage como 'user'
{
  id: "uuid",
  name: "Admin Principal",
  email: "admin@wabot.com",
  is_active: true,
  tipe: "Gerente", // o "Empleado"
  user_name: "admin",
  phone_number: "+57 300 123 4567",
  address: "Oficina Central",
  id_restaurante: null, // o "uuid" si ya tiene restaurante
  last_login: "2025-10-28T..."
}
```

### **Token JWT**

```javascript
// Decodificado
{
  id: "uuid",
  email: "admin@wabot.com",
  name: "Admin Principal",
  address: "Oficina Central",
  phone_number: "+57 300 123 4567",
  iat: 1730000000,
  exp: 1730086400
}
```

---

## 🎯 Funcionalidades por Rol

### **Gerente**

✅ Acceso completo
✅ Crear usuarios
✅ Ver lista de usuarios
✅ Gestionar restaurante
✅ Crear menús
✅ Ver resumen de ventas

### **Empleado**

✅ Gestionar menús
✅ Ver resumen de ventas
❌ NO puede gestionar usuarios
❌ NO puede modificar restaurante

---

## 🐛 Solución de Problemas Comunes

### **Error: "Cannot connect to backend"**

**Solución:**

1. Verifica que el backend esté corriendo: `http://localhost:3000`
2. Verifica el archivo `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```
3. Reinicia el frontend si cambiaste las variables de entorno

### **Error: "Credenciales incorrectas"**

**Solución:**

1. Verifica que el usuario existe en la base de datos
2. Verifica que la contraseña sea correcta
3. Revisa los logs del backend para ver el error específico

### **Error: "CORS policy"**

**Solución:**
Asegúrate de que el backend tenga CORS habilitado en `main.ts`:

```typescript
app.enableCors({
  origin: "http://localhost:3001",
  credentials: true,
});
```

### **Usuario creado pero no puede iniciar sesión**

**Solución:**

1. Verifica que `is_active` sea `true`
2. Verifica que la contraseña esté correctamente hasheada en la BD
3. Revisa los logs del backend

### **Después del login, queda en blanco**

**Solución:**

1. Abre la consola del navegador (F12)
2. Verifica que `localStorage` tenga `token` y `user`
3. Verifica la redirección en los logs de la consola

---

## 📊 Endpoints Disponibles

### **Autenticación**

- `POST /login` - Login

### **Usuarios**

- `GET /users` - Listar todos los usuarios (Auth)
- `POST /users` - Crear usuario (Auth)
- `GET /users/:id` - Obtener usuario por ID (Auth)
- `PUT /users/:id` - Actualizar usuario (Auth)
- `DELETE /users/:id` - Eliminar usuario (Auth)

### **Restaurantes**

- `GET /restaurantes` - Listar todos los restaurantes (Auth)
- `POST /restaurantes` - Crear restaurante (Auth)
- `GET /restaurantes/:id` - Obtener restaurante por ID (Auth)
- `PUT /restaurantes/:id` - Actualizar restaurante (Auth)
- `DELETE /restaurantes/:id` - Eliminar restaurante (Auth)

---

## 🔐 Autenticación

Todos los endpoints protegidos requieren el header:

```
Authorization: Bearer <token>
```

El token se obtiene del endpoint `/login` y tiene una duración configurada en el backend.

---

## 📁 Archivos Clave

### **Frontend**

- `lib/auth.ts` - Servicio de autenticación
- `lib/users.ts` - Servicio de usuarios
- `lib/restaurant.ts` - Servicio de restaurantes
- `app/login/page.tsx` - Página de login con redirección
- `app/onboarding/page.tsx` - Onboarding para crear restaurante
- `.env.local` - Variables de entorno

### **Backend**

- `src/Presentation/Controllers/AuthController.ts` - Controlador de autenticación
- `src/Presentation/Controllers/UserController.ts` - Controlador de usuarios
- `src/Presentation/Controllers/RestauranteController.ts` - Controlador de restaurantes
- `src/Application/Services/AuthService.ts` - Lógica de autenticación
- `src/Application/DTOs/` - DTOs de request/response

---

## ✅ Checklist Final

Antes de usar el sistema, verifica:

- [ ] Backend corriendo en puerto 3000
- [ ] Frontend corriendo en puerto 3001
- [ ] Base de datos conectada y migraciones ejecutadas
- [ ] CORS habilitado en el backend
- [ ] Variable `NEXT_PUBLIC_API_URL` configurada
- [ ] Usuario Gerente creado
- [ ] Puedes hacer login exitosamente
- [ ] La redirección funciona según `id_restaurante`
- [ ] Puedes completar el onboarding
- [ ] Puedes crear usuarios (como Gerente)

---

## 📞 Documentación Adicional

Para más detalles, consulta:

- `INTEGRACION_BACKEND.md` - Documentación completa de endpoints
- `USUARIOS_README.md` - Guía de gestión de usuarios
- `ONBOARDING_README.md` - Guía del proceso de onboarding
- `IMPLEMENTACION_COMPLETA.md` - Resumen de toda la implementación

---

## 🎉 ¡Todo Listo!

El sistema está completamente integrado y listo para usar.

**Próximos pasos sugeridos:**

1. Probar el login con diferentes usuarios
2. Completar el onboarding si es necesario
3. Crear usuarios adicionales
4. Personalizar según tus necesidades

---

**Fecha de implementación:** 28 de octubre de 2025
