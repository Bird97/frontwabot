# 🚀 Documentación del Sistema de Onboarding

## 📋 Resumen

Se implementó un sistema completo de onboarding que automáticamente crea el restaurante, categorías y productos cuando un usuario nuevo hace login.

## 🔄 Flujo Completo

### 1. **Login** (`app/login/page.tsx`)

- Usuario ingresa email y contraseña
- Backend responde con:
  ```json
  {
    "message": "Inicio de Sesión exitoso",
    "user": {
      "id": "...",
      "name": "...",
      "email": "...",
      "id_restaurante": null // <-- Si es null, va a onboarding
    },
    "token": "..."
  }
  ```
- Se guarda el `token` y `user` en localStorage

### 2. **Redirección Automática** (`app/page.tsx`)

```typescript
// Si no está autenticado → /login
// Si NO tiene restaurante (id_restaurante === null) → /onboarding
// Si tiene restaurante → /home
```

### 3. **Onboarding** (`app/onboarding/page.tsx`)

**Paso 1: Nombre del Restaurante**

- Usuario ingresa el nombre del restaurante

**Paso 2: Métodos de Pago**

- Usuario ingresa los métodos de pago que acepta
- Ejemplo: "Nequi: 3001234567\nBancolombia: 123-456-789\nEfectivo"

**Al Finalizar:**

1. ✅ **Crea el restaurante** (POST `/api/restaurante`)
2. ✅ **Actualiza el usuario** con `id_restaurante` (PUT `/api/users/:userId`)
3. ✅ **Crea 4 categorías automáticamente**:
   - Entradas
   - Platos Principales
   - Bebidas
   - Postres
4. ✅ **Crea 1 producto de ejemplo** en la primera categoría
5. ✅ **Redirige a `/home`**

## 🛠️ Archivos Implementados

### **`lib/restaurant.ts`** - Servicio de Restaurante

Contiene las funciones para interactuar con el backend:

```typescript
restaurantService.createRestaurant({ name, metodos_pago });
restaurantService.updateUserRestaurant(userId, restaurantId);
restaurantService.createCategory({ name, id_restaurante });
restaurantService.createProduct({ name, precio, id_tipo, id_restaurante });
restaurantService.setupInitialData(restaurantId); // Crea categorías y productos
```

### **`lib/auth.ts`** - Servicio de Autenticación

Actualizado para manejar `id_restaurante`:

```typescript
authService.login(email, password);
authService.getUserData(); // Devuelve el user completo con id_restaurante
authService.isAuthenticated();
authService.logout();
```

### **`app/page.tsx`** - Página Principal

Redirige automáticamente según el estado del usuario.

### **`app/onboarding/page.tsx`** - Wizard de Configuración

Proceso de 2 pasos simplificado para configurar el restaurante.

## 🔌 Endpoints Utilizados

| Método | Endpoint             | Body                                                                      | Descripción       |
| ------ | -------------------- | ------------------------------------------------------------------------- | ----------------- |
| POST   | `/api/restaurante`   | `{ name, metodos_pago, fecha_inicio_suscripcion, fecha_fin_suscripcion }` | Crea restaurante  |
| PUT    | `/api/users/:userId` | `{ id_restaurante }`                                                      | Actualiza usuario |
| POST   | `/api/tipo-producto` | `{ name, id_restaurante }`                                                | Crea categoría    |
| POST   | `/api/productos`     | `{ name, precio, id_tipo, id_restaurante }`                               | Crea producto     |

## ✅ Validaciones

- ✅ Si el usuario ya tiene `id_restaurante`, no puede acceder a onboarding
- ✅ Si no está autenticado, redirige a login
- ✅ Manejo de errores completo con mensajes descriptivos
- ✅ Logs en consola para debugging (con emojis 🎉)

## 🧪 Cómo Probar

1. **Reinicia el servidor de Next.js** (importante para cargar las variables de entorno):

   ```powershell
   # Presiona Ctrl+C en la terminal
   npm run dev
   # o
   pnpm dev
   ```

2. **Asegúrate que el backend esté corriendo** en `http://localhost:3000`

3. **Haz login** con un usuario que tenga `id_restaurante: null`

4. **Deberías ser redirigido automáticamente a** `/onboarding`

5. **Completa el formulario**:

   - Paso 1: Ingresa nombre del restaurante
   - Paso 2: Ingresa métodos de pago
   - Click en "Finalizar"

6. **Revisa la consola del navegador (F12)** para ver los logs:

   ```
   🏪 Creando restaurante...
   📤 Creando restaurante: {...}
   ✅ Restaurante creado: {...}
   📤 Actualizando usuario: {...}
   ✅ Usuario actualizado
   🔧 Configurando datos iniciales...
   📤 Creando categoría: {...}
   ✅ Categoría creada: {...}
   ...
   ✅ Datos iniciales configurados
   ```

7. **Deberías ser redirigido a** `/home`

## 🐛 Troubleshooting

### Error: "Cannot read property 'id' of null"

- El usuario no está autenticado correctamente
- Verifica que el token esté en localStorage
- Intenta hacer logout y login nuevamente

### Error: "El servidor no devolvió un formato JSON válido"

- Verifica que el backend esté corriendo
- Verifica que `NEXT_PUBLIC_API_URL=/api` esté en `.env.local`
- Reinicia el servidor de Next.js

### Error de CORS

- Ya configurado el proxy en `next.config.mjs`
- Si persiste, verifica que el backend acepte requests desde `localhost:3001`

### No redirige a onboarding

- Verifica que el usuario en localStorage tenga `id_restaurante: null`
- Limpia localStorage y haz login nuevamente

## 📝 Notas Importantes

1. **Las fechas de suscripción** se calculan automáticamente (1 mes desde hoy)
2. **Las categorías se crean en español** (puedes modificarlas en `lib/restaurant.ts`)
3. **El producto de ejemplo** cuesta $10,000 (puedes modificarlo)
4. **Los logs con emojis** te ayudan a hacer debugging fácilmente

## 🎯 Próximos Pasos

- [ ] Agregar más validaciones de campos
- [ ] Permitir subir logo del restaurante
- [ ] Personalizar las categorías iniciales
- [ ] Agregar más productos de ejemplo
- [ ] Implementar edición del restaurante después del onboarding
