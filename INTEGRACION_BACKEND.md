# 🔗 Integración Frontend - Backend

## 📋 Resumen

Se ha completado la integración del frontend con el backend, conectando todos los endpoints necesarios para:

- ✅ Autenticación (Login)
- ✅ Gestión de Usuarios
- ✅ Gestión de Restaurantes
- ✅ Verificación de `id_restaurante` para onboarding

---

## 🔌 Endpoints Integrados

### 1. **Autenticación**

#### **POST /login**

**Request:**

```typescript
{
  email: string;
  password: string;
  ip?: string;
}
```

**Response:**

```typescript
{
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    is_active: boolean;
    tipe: string; // "Gerente" | "Empleado"
    user_name: string;
    phone_number: string;
    last_login: string | null;
    address: string;
    id_restaurante: string | null; // ⚠️ Importante para redirección
  };
  token: string;
  module: string;
  details: {...}; // mismo que user
}
```

**Uso en Frontend:**

```typescript
// lib/auth.ts
const data = await authService.login(email, password);
// Guarda token y user en localStorage
// Verifica id_restaurante para redirigir
```

---

### 2. **Usuarios**

#### **POST /users** (Requiere Auth)

**Request:**

```typescript
{
  name: string;
  email: string;
  password: string;
  user_name: string;
  phone_number: string;
  address: string;
  tipe: "Empleado" | "Gerente";
  is_active?: boolean;
  id_restaurante?: string; // Se asigna automáticamente del usuario actual
}
```

**Response:**

```typescript
{
  isSuccess: boolean;
  message: string;
  data: User;
}
```

#### **GET /users** (Requiere Auth)

**Response:**

```typescript
{
  isSuccess: boolean;
  message: string;
  data: User[];
}
```

#### **GET /users/:id** (Requiere Auth)

**Response:**

```typescript
{
  isSuccess: boolean;
  message: string;
  data: User;
}
```

#### **PUT /users/:id** (Requiere Auth)

**Request:**

```typescript
{
  name?: string;
  email?: string;
  user_name?: string;
  phone_number?: string;
  address?: string;
  tipe?: "Empleado" | "Gerente";
  is_active?: boolean;
  id_restaurante?: string;
}
```

**Response:**

```typescript
{
  isSuccess: boolean;
  message: string;
  data: User;
}
```

#### **DELETE /users/:id** (Requiere Auth)

**Response:**

```typescript
{
  isSuccess: boolean;
  message: string;
}
```

---

### 3. **Restaurantes**

#### **POST /restaurantes** (Requiere Auth)

**Request:**

```typescript
{
  name: string;
  metodos_pago: string;
  fecha_inicio_suscripcion: Date;
  fecha_fin_suscripcion: Date;
}
```

**Response:**

```typescript
{
  isSuccess: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    metodos_pago: string;
    fecha_inicio_suscripcion: string;
    fecha_fin_suscripcion: string;
  }
}
```

#### **GET /restaurantes** (Requiere Auth)

**Response:**

```typescript
{
  isSuccess: boolean;
  message: string;
  data: Restaurant[];
}
```

#### **GET /restaurantes/:id** (Requiere Auth)

**Response:**

```typescript
{
  isSuccess: boolean;
  message: string;
  data: Restaurant;
}
```

#### **PUT /restaurantes/:id** (Requiere Auth)

**Request:**

```typescript
{
  name?: string;
  metodos_pago?: string;
  fecha_inicio_suscripcion?: Date;
  fecha_fin_suscripcion?: Date;
}
```

**Response:**

```typescript
{
  isSuccess: boolean;
  message: string;
  data: Restaurant;
}
```

#### **DELETE /restaurantes/:id** (Requiere Auth)

**Response:**

```typescript
{
  isSuccess: boolean;
  message: string;
}
```

---

## 🔄 Flujo de Autenticación y Redirección

### 1. **Login**

```typescript
// app/login/page.tsx
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setError("");

  try {
    const loginResponse = await authService.login(email, password);

    // Verificar si el usuario tiene id_restaurante
    const user = loginResponse.user;

    if (!user.id_restaurante) {
      // Si no tiene restaurante, redirigir al onboarding
      console.log("Usuario sin restaurante, redirigiendo a onboarding");
      router.push("/onboarding");
    } else {
      // Si tiene restaurante, redirigir al home
      console.log("Usuario con restaurante, redirigiendo a home");
      router.push("/home");
    }
  } catch (err: any) {
    setError(
      err.message || "Credenciales incorrectas. Por favor, intenta de nuevo."
    );
  } finally {
    setIsLoading(false);
  }
};
```

### 2. **Onboarding**

Cuando el usuario completa el onboarding:

```typescript
// app/onboarding/page.tsx
// 1. Crear restaurante
const restaurant = await restaurantService.createRestaurant({
  name: restaurantName,
  metodos_pago: paymentMethods,
});

// 2. Actualizar usuario con id_restaurante
await restaurantService.updateUserRestaurant(user.id, restaurant.id);

// 3. Actualizar localStorage
const updatedUser = { ...user, id_restaurante: restaurant.id };
localStorage.setItem("user", JSON.stringify(updatedUser));

// 4. Redirigir a home
router.push("/home");
```

---

## 🛡️ Autenticación

### Headers

Todos los endpoints protegidos requieren el header:

```
Authorization: Bearer <token>
```

El token se obtiene del login y se almacena en `localStorage.getItem('token')`.

### Verificación en Frontend

```typescript
// lib/auth.ts
export const authService = {
  getToken() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  },

  isAuthenticated() {
    const user = this.getUser();
    if (!user) return false;
    return user.exp * 1000 > Date.now(); // Verifica expiración
  },

  getUserData() {
    if (typeof window === "undefined") return null;
    const userData = localStorage.getItem("user");
    if (!userData) return null;
    return JSON.parse(userData);
  },
};
```

---

## 📁 Estructura de Archivos

### Frontend (frontwabot)

```
lib/
├── auth.ts          # Servicio de autenticación
├── users.ts         # Servicio de usuarios
└── restaurant.ts    # Servicio de restaurantes

app/
├── login/
│   └── page.tsx     # Login con redirección condicional
├── onboarding/
│   └── page.tsx     # Crear restaurante y asignar a usuario
└── (dashboard)/
    ├── home/
    │   └── page.tsx # Home principal
    └── usuarios/
        ├── page.tsx         # Lista de usuarios
        └── crear/page.tsx   # Crear usuario
```

### Backend (backwabot)

```
src/
├── Presentation/
│   └── Controllers/
│       ├── AuthController.ts
│       ├── UserController.ts
│       └── RestauranteController.ts
├── Application/
│   ├── Services/
│   │   ├── AuthService.ts
│   │   ├── UserService.ts
│   │   └── RestauranteService.ts
│   └── DTOs/
│       ├── User/
│       │   ├── LoginRequest.ts
│       │   ├── UserRequestDto.ts
│       │   └── UserResponseDto.ts
│       └── Restaurante/
│           ├── RestauranteRequestDto.ts
│           └── RestauranteResponseDto.ts
└── Domain/
    └── Entities/
        ├── User.ts
        └── Restaurante.ts
```

---

## 🔧 Configuración

### 1. **Variables de Entorno**

**Frontend (.env.local):**

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**Backend (.env):**

```env
PORT=3000
DATABASE_URL=...
JWT_SECRET=...
```

### 2. **CORS en Backend**

Asegúrate de que el backend tenga CORS habilitado para el frontend:

```typescript
// backwabot/src/main.ts
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors({
    origin: "http://localhost:3001", // Puerto del frontend
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
```

---

## 🚀 Comandos de Inicio

### Backend

```powershell
cd backwabot
npm run start:dev
```

### Frontend

```powershell
cd frontwabot
npm run dev
```

---

## 🧪 Pruebas

### 1. **Probar Login**

```powershell
# PowerShell
$body = @{
    email = "admin@wabot.com"
    password = "admin123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/login" -Method Post -Body $body -ContentType "application/json"
```

### 2. **Probar Crear Usuario**

```powershell
# Primero obtener token del login
$loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/login" -Method Post -Body $body -ContentType "application/json"
$token = $loginResponse.token

# Crear usuario
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$userBody = @{
    name = "Test User"
    email = "test@wabot.com"
    password = "test123"
    user_name = "testuser"
    phone_number = "+57 300 123 4567"
    address = "Test Address"
    tipe = "Empleado"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/users" -Method Post -Headers $headers -Body $userBody
```

### 3. **Probar Crear Restaurante**

```powershell
$restaurantBody = @{
    name = "Mi Restaurante"
    metodos_pago = "Efectivo, Tarjeta, Nequi"
    fecha_inicio_suscripcion = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
    fecha_fin_suscripcion = (Get-Date).AddMonths(1).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/restaurantes" -Method Post -Headers $headers -Body $restaurantBody
```

---

## ⚠️ Notas Importantes

1. **`id_restaurante` es clave:** Este campo determina si el usuario va al onboarding o al home después del login.

2. **Respuestas del Backend:** Todos los endpoints del backend devuelven:

   ```typescript
   {
     isSuccess: boolean;
     message: string;
     data?: T;
   }
   ```

3. **Tokens JWT:** Los tokens contienen:

   ```typescript
   {
     id: string;
     email: string;
     name: string;
     address: string;
     phone_number: string;
     iat: number;
     exp: number;
   }
   ```

4. **Asignación automática de restaurante:** Cuando un Gerente crea un usuario, automáticamente se le asigna el `id_restaurante` del Gerente.

5. **Actualización del usuario en localStorage:** Después del onboarding, el objeto `user` en localStorage se actualiza con el `id_restaurante`.

---

## 📊 Diagrama de Flujo

```
┌─────────────┐
│   Login     │
└──────┬──────┘
       │
       ▼
┌──────────────────────┐
│ ¿Tiene id_restaurante?│
└──────┬────────┬───────┘
       │ NO     │ SÍ
       ▼        ▼
┌─────────┐  ┌──────┐
│Onboarding│  │ Home │
└────┬────┘  └──────┘
     │
     ▼
┌────────────────┐
│Crear Restaurante│
└────┬───────────┘
     │
     ▼
┌────────────────────┐
│Actualizar Usuario  │
│con id_restaurante  │
└────┬───────────────┘
     │
     ▼
┌──────┐
│ Home │
└──────┘
```

---

## ✅ Checklist de Verificación

- [ ] Backend corriendo en puerto 3000
- [ ] Frontend corriendo en puerto 3001
- [ ] CORS habilitado en el backend
- [ ] Variable `NEXT_PUBLIC_API_URL` configurada en `.env.local`
- [ ] Usuario Gerente creado en la base de datos
- [ ] Login redirige correctamente según `id_restaurante`
- [ ] Onboarding crea restaurante y actualiza usuario
- [ ] Gestión de usuarios funcional para Gerentes
- [ ] Tokens JWT funcionando correctamente

---

**¡Integración completada! 🎉**
