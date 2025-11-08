# Guía de Configuración - Sistema de Gestión de Usuarios

## 📋 Resumen

Se ha implementado un sistema completo de autenticación y gestión de usuarios que incluye:

- ✅ Login funcional conectado con el backend
- ✅ Página de creación de usuarios (solo para Gerentes)
- ✅ Listado de usuarios (solo para Gerentes)
- ✅ Protección de rutas basada en roles
- ✅ Integración completa con el backend

## 🔧 Configuración Inicial

### 1. Variables de Entorno

Crea/edita el archivo `.env.local` en la raíz de `frontwabot`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Asegúrate de que la URL coincida con la URL de tu backend.

### 2. Backend

Asegúrate de que tu backend esté corriendo en el puerto configurado (por defecto 3000) y que tenga CORS habilitado para el frontend.

En tu backend (`backwabot`), verifica que el CORS esté configurado:

```typescript
// En main.ts o app.module.ts
app.enableCors({
  origin: "http://localhost:3001", // Puerto del frontend
  credentials: true,
});
```

### 3. Iniciar el Frontend

```bash
cd frontwabot
npm run dev
```

El frontend estará disponible en `http://localhost:3001`

## 👥 Tipos de Usuario

### Gerente

- Acceso completo al sistema
- Puede crear nuevos usuarios
- Puede ver lista de todos los usuarios
- Puede asignar roles (Empleado o Gerente)

### Empleado

- Acceso a funcionalidades básicas
- NO puede gestionar usuarios

## 🚀 Flujo de Uso

### 1. Login

1. Accede a `http://localhost:3001/login`
2. Ingresa tus credenciales (email y contraseña)
3. Si las credenciales son correctas, serás redirigido a `/home`

### 2. Crear Usuario (Solo Gerentes)

1. Desde el Home, haz clic en "Crear Nuevo Usuario" o ve a `/usuarios/crear`
2. Completa el formulario:
   - Nombre completo
   - Nombre de usuario
   - Email
   - Teléfono
   - Contraseña (mínimo 6 caracteres)
   - Tipo de usuario (Empleado o Gerente)
   - Dirección
3. Haz clic en "Crear Usuario"
4. Serás redirigido a la lista de usuarios

### 3. Ver Usuarios (Solo Gerentes)

1. Desde el Home, haz clic en "Ver Todos los Usuarios" o ve a `/usuarios`
2. Verás una tabla con todos los usuarios registrados
3. La tabla muestra:
   - Nombre
   - Nombre de usuario
   - Tipo (con badge de color)
   - Información de contacto (email, teléfono, dirección)
   - Estado (Activo/Inactivo)
   - Fecha de creación

### 4. Navegación

- El menú superior muestra "Usuarios" solo si eres Gerente
- El botón "Cerrar Sesión" cierra tu sesión y te redirige al login

## 📁 Archivos Creados/Modificados

### Nuevos Archivos:

- `lib/auth.ts` - Servicio de autenticación
- `lib/users.ts` - Servicio de gestión de usuarios
- `app/(dashboard)/usuarios/page.tsx` - Lista de usuarios
- `app/(dashboard)/usuarios/crear/page.tsx` - Formulario de creación
- `middleware.ts` - Middleware de protección de rutas
- `.env.local` - Variables de entorno

### Archivos Modificados:

- `app/login/page.tsx` - Login conectado al backend
- `app/(dashboard)/home/page.tsx` - Sección de gestión de usuarios para Gerentes
- `components/navbar.tsx` - Opción de "Usuarios" para Gerentes
- `components/auth-guard.tsx` - Protección de rutas actualizada

## 🔐 Seguridad

- Los tokens JWT se almacenan en localStorage
- Las rutas están protegidas tanto en el cliente como en el servidor
- Solo los Gerentes pueden acceder a las páginas de gestión de usuarios
- Las contraseñas se envían de forma segura al backend

## 🐛 Solución de Problemas

### Error: "Credenciales incorrectas"

- Verifica que el backend esté corriendo
- Verifica que la URL del backend en `.env.local` sea correcta
- Verifica que el usuario exista en la base de datos

### La página de usuarios no aparece

- Verifica que tu usuario tenga el tipo "Gerente" en la base de datos
- Cierra sesión y vuelve a iniciar sesión

### Error de CORS

- Verifica que el backend tenga CORS habilitado
- Verifica que la URL del frontend esté permitida en el backend

### Los cambios no se reflejan

- Limpia el caché del navegador
- Reinicia el servidor de desarrollo (`npm run dev`)

## 📞 Endpoints del Backend Utilizados

- `POST /auth/login` - Login
- `GET /users` - Obtener lista de usuarios
- `POST /users` - Crear usuario
- `GET /users/:id` - Obtener usuario por ID
- `PATCH /users/:id` - Actualizar usuario
- `DELETE /users/:id` - Eliminar usuario

## 🎨 Diseño

El diseño mantiene la estética del frontend existente:

- Colores: Verde (#25D366), Verde oscuro (#0B3C2E)
- Tipografía consistente
- Cards con sombras
- Botones con hover effects
- Responsive design

## ✅ Próximos Pasos

1. Probar el login con un usuario existente
2. Si eres Gerente, probar la creación de usuarios
3. Verificar que los usuarios se creen correctamente en el backend
4. Personalizar según necesites (agregar edición, eliminación, etc.)
