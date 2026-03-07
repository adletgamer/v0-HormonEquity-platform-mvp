# Guía de Autenticación - InSight Health

## Descripción General

InSight Health implementa un sistema completo de autenticación con Supabase que incluye:

- **Registro de usuarios** (Registrarse)
- **Inicio de sesión** (Ingresar)
- **Recuperación de contraseña**
- **Confirmación de email**
- **Páginas protegidas** (Solo usuarios autenticados)
- **Almacenamiento de perfiles** (Datos de usuario)

## Arquitectura

### Base de Datos

```sql
-- Tabla de perfiles (vinculada a auth.users)
profiles
├── id (UUID, llave foránea a auth.users)
├── first_name (text)
├── last_name (text)
├── edad (integer)
├── created_at (timestamp)
└── updated_at (timestamp)

-- Tabla de sesiones de chat
chat_sessions
├── id (UUID)
├── user_id (UUID, llave foránea a auth.users)
├── symptom_summary (text)
├── medical_history (text)
├── medications (text)
├── goals (text)
├── created_at (timestamp)
└── updated_at (timestamp)
```

Ambas tablas tienen **Row Level Security (RLS)** habilitado, lo que significa que cada usuario solo puede acceder a sus propios datos.

### Flujos de Autenticación

```
Landing Page (/)
    ↓
    ├─→ Usuario NO autenticado
    │   ├─→ Registrarse (/auth/registrarse)
    │   │   ├─→ Verificar email
    │   │   └─→ Éxito en registro (/auth/registrarse-exito)
    │   │
    │   └─→ Ingresar (/auth/ingresar)
    │       └─→ Dashboard (/protegido/inicio)
    │
    └─→ Usuario autenticado
        └─→ Ir directamente al Dashboard (/protegido/inicio)

Dashboard (/protegido/inicio)
    ├─→ Comenzar Evaluación → Chat Interfaz
    ├─→ Explorar Recursos
    └─→ Ver Especialistas
```

## Rutas de Autenticación

### Públicas (Sin autenticación requerida)

```
GET  /                           Landing page
GET  /auth/registrarse           Formulario de registro
GET  /auth/ingresar              Formulario de ingreso
GET  /auth/recuperar-contrasena  Formulario de recuperación
GET  /auth/registrarse-exito     Página de éxito post-registro
GET  /auth/confirmar-email       Confirmación de email
GET  /auth/error                 Página de error
```

### Protegidas (Requieren autenticación)

```
GET  /protegido/inicio           Dashboard principal
GET  /protegido/chat             Interfaz de chat
```

## Páginas Disponibles

### `/auth/registrarse` - Registro

Permite a nuevas usuarias crear una cuenta con:
- Nombre y apellido
- Edad
- Correo electrónico
- Contraseña (mínimo 8 caracteres)

**Flujo:**
1. Usuario completa formulario
2. Se crea cuenta en Supabase Auth
3. Se crea perfil en tabla `profiles`
4. Se envía email de confirmación
5. Redirige a `/auth/registrarse-exito`

### `/auth/ingresar` - Inicio de Sesión

Permite a usuarias ingresa con:
- Correo electrónico
- Contraseña

**Flujo:**
1. Usuario ingresa credenciales
2. Se valida contra Supabase Auth
3. Se crea sesión
4. Redirige a `/protegido/inicio`

### `/auth/recuperar-contrasena` - Recuperación

Permite resetear la contraseña:
1. Usuario ingresa su email
2. Se envía correo con enlace de recuperación
3. Usuario hace clic en el enlace
4. Se redirige a `/auth/actualizar-contrasena`
5. Usuario puede establecer nueva contraseña

### `/auth/confirmar-email` - Confirmación

Valida el email del usuario después del registro:
- Supabase envía enlace de confirmación al email
- Usuario hace clic en el enlace
- Esta página verifica el token
- Si es válido, marca email como confirmado

### `/protegido/inicio` - Dashboard Principal

Página principal para usuarios autenticados:
- Muestra información de bienvenida personalizada
- Botón para comenzar evaluación de síntomas
- Tarjetas de acceso rápido a características
- Opción para cerrar sesión

## Estructura de Archivos

```
app/
├── auth/
│   ├── registrarse/
│   │   └── page.tsx
│   ├── ingresar/
│   │   └── page.tsx
│   ├── registrarse-exito/
│   │   └── page.tsx
│   ├── recuperar-contrasena/
│   │   └── page.tsx
│   ├── confirmar-email/
│   │   └── page.tsx
│   ├── error/
│   │   └── page.tsx
│   └── layout.tsx
├── protegido/
│   ├── inicio/
│   │   └── page.tsx
│   └── layout.tsx
├── page.tsx (Landing)
└── layout.tsx
lib/
├── supabase/
│   ├── client.ts (Cliente para navegador)
│   ├── server.ts (Cliente para servidor)
│   └── proxy.ts (Manejo de sesiones)
middleware.ts (Protección de rutas)
```

## Manejo de Sesiones

### Cliente (navegador)

```typescript
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

// Obtener usuario actual
const { data: { user } } = await supabase.auth.getUser()

// Registrarse
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: { data: { first_name, last_name, edad } }
})

// Ingresar
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password
})

// Cerrar sesión
await supabase.auth.signOut()
```

### Servidor (Server Components)

```typescript
import { createClient } from '@/lib/supabase/server'

async function getData() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  // ...
}
```

## Row Level Security (RLS)

Todas las tablas están protegidas con políticas RLS que aseguran:

**Profiles:**
- Los usuarios solo pueden VER su propio perfil
- Los usuarios solo pueden INSERTAR su propio perfil
- Los usuarios solo pueden ACTUALIZAR su propio perfil
- Los usuarios solo pueden ELIMINAR su propio perfil

**Chat Sessions:**
- Los usuarios solo pueden VER sus propias sesiones
- Los usuarios solo pueden INSERTAR sus propias sesiones
- Los usuarios solo pueden ACTUALIZAR sus propias sesiones
- Los usuarios solo pueden ELIMINAR sus propias sesiones

Esto se asegura usando `auth.uid()` que es el ID del usuario actual.

## Configuración de Variables de Entorno

El proyecto usa variables de entorno automáticamente configuradas por Supabase:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Estas se cargan automáticamente del archivo `.env.local` que crea Vercel.

## Flujo de Emails

### Email de Confirmación

1. Usuario se registra
2. Supabase envía email con enlace de confirmación
3. Enlace redirige a `/auth/confirmar-email?token=...&type=email`
4. Página verifica el token con `supabase.auth.verifyOtp()`
5. Email se marca como confirmado

### Email de Recuperación

1. Usuario hace clic en "¿Olvidaste tu contraseña?"
2. Ingresa su email
3. Supabase envía email con enlace de recuperación
4. Enlace redirige a `/auth/actualizar-contrasena?token=...&type=recovery`
5. Usuario puede establecer nueva contraseña

## Validaciones

### Registro

- ✅ Nombre y apellido requeridos
- ✅ Edad debe ser entre 18 y 120
- ✅ Email debe ser válido
- ✅ Contraseña mínimo 8 caracteres
- ✅ Contraseñas deben coincidir

### Ingreso

- ✅ Email requerido
- ✅ Contraseña requerida
- ✅ Validación contra Supabase

### Recuperación

- ✅ Email requerido
- ✅ Email debe existir en el sistema

## Manejo de Errores

Cada página de autenticación muestra mensajes de error claro en español:

```
- "Las contraseñas no coinciden"
- "La contraseña debe tener al menos 8 caracteres"
- "Las credenciales ingresadas son inválidas"
- "Por favor confirma tu correo electrónico"
- "Se han intentado demasiados correos. Intenta más tarde"
```

## Seguridad

### Contraseñas
- Se hashean automáticamente con bcrypt en Supabase
- Nunca se transmiten en texto plano (HTTPS)
- Requieren mínimo 8 caracteres

### Sesiones
- Se almacenan en cookies HTTP-only
- Se refrescan automáticamente
- El middleware valida tokens

### Datos Sensibles
- Protegidos con Row Level Security
- Solo accesibles al usuario propietario
- Se eliminan si se elimina la cuenta

## Testing

### Flujo de Registro
1. Ir a `/auth/registrarse`
2. Completar formulario
3. Verificar que se envió email
4. Hacer clic en enlace de confirmación
5. Debe redirigir a `/auth/registrarse-exito`

### Flujo de Ingreso
1. Ir a `/auth/ingresar`
2. Ingresa credenciales
3. Debe redirigir a `/protegido/inicio`

### Flujo de Recuperación
1. Ir a `/auth/ingresar`
2. Hacer clic en "¿Olvidaste tu contraseña?"
3. Ingresa email
4. Debe mostrar "Correo Enviado"
5. Verificar email (en desarrollo, Supabase proporciona panel de prueba)

## Próximos Pasos (Fase 2)

- Integración con ElevenLabs para chat con voz
- Conexión con API de IA para respuestas más inteligentes
- Sistema de booking de citas
- Historial completo de conversaciones
- Recomendaciones personalizadas basadas en datos del usuario
