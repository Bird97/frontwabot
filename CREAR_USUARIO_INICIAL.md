# Script para Crear Usuario Gerente Inicial

Este documento explica cómo crear el primer usuario Gerente para poder acceder al sistema.

## Opción 1: Usar API directamente

Usa Postman, Thunder Client o cualquier cliente HTTP para hacer una petición POST:

**Endpoint:** `http://localhost:3000/users`

**Headers:**

```json
{
  "Content-Type": "application/json"
}
```

**Body (JSON):**

```json
{
  "name": "Administrador Principal",
  "email": "admin@wabot.com",
  "password": "admin123",
  "user_name": "admin",
  "phone_number": "+57 300 123 4567",
  "address": "Calle 123 #45-67",
  "tipe": "Gerente"
}
```

## Opción 2: Usar cURL (PowerShell)

```powershell
$body = @{
    name = "Administrador Principal"
    email = "admin@wabot.com"
    password = "admin123"
    user_name = "admin"
    phone_number = "+57 300 123 4567"
    address = "Calle 123 #45-67"
    tipe = "Gerente"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/users" -Method Post -Body $body -ContentType "application/json"
```

## Opción 3: Desde la Base de Datos

Si tienes acceso directo a la base de datos:

```sql
-- Nota: La contraseña debe estar hasheada con bcrypt
-- Este es un ejemplo, ajusta según tu implementación
INSERT INTO users (name, email, password_hash, user_name, phone_number, address, tipe, is_active, created_at, updated_at)
VALUES (
  'Administrador Principal',
  'admin@wabot.com',
  '$2b$10$hash_de_la_contraseña', -- Debes hashear 'admin123'
  'admin',
  '+57 300 123 4567',
  'Calle 123 #45-67',
  'Gerente',
  true,
  NOW(),
  NOW()
);
```

## Credenciales del Usuario Inicial

Una vez creado, podrás iniciar sesión con:

- **Email:** admin@wabot.com
- **Contraseña:** admin123

⚠️ **Importante:** Cambia estas credenciales después del primer inicio de sesión.

## Verificar la Creación

1. Ve a `http://localhost:3001/login`
2. Ingresa las credenciales
3. Si todo está correcto, serás redirigido a `/home`
4. Como Gerente, verás la sección de "Gestión de Usuarios"

## Troubleshooting

### Error 401 al crear usuario

- El endpoint `/users` puede requerir autenticación
- Si es así, necesitas primero crear el usuario directamente en la base de datos
- O temporalmente desactivar la protección del endpoint para crear el primer usuario

### Error de conexión

- Verifica que el backend esté corriendo
- Verifica que esté en el puerto correcto (por defecto 3000)

### Error al hacer hash de la contraseña

Si necesitas hashear una contraseña manualmente:

```javascript
// En Node.js con bcrypt
const bcrypt = require("bcrypt");
const password = "admin123";
const hash = await bcrypt.hash(password, 10);
console.log(hash);
```
