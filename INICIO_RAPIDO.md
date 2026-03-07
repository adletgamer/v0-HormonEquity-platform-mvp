# Inicio Rápido - InSight Health LATAM

## 🎯 Resumen Ejecutivo

**InSight Health** es una plataforma de salud conversacional para mujeres en perimenopausia/menopausia en LATAM.

- **Interfaz**: Completamente en español
- **Autenticación**: Sistema seguro con Supabase
- **Evaluación**: Chat conversacional de 7 etapas
- **Base de Datos**: Almacenamiento seguro de perfiles y sesiones

## ⚡ Inicio en 5 Minutos

### 1. Clonar y Instalar
```bash
git clone <tu-repo>
cd vercel/share/v0-project
pnpm install
```

### 2. Configurar Variables de Entorno
Las variables de Supabase se configuran automáticamente en Vercel:
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### 3. Ejecutar Localmente
```bash
pnpm dev
```

Abre: `http://localhost:3000`

### 4. Probar Flujo Completo
```
1. Landing page → Hacer clic en "Registrarse"
2. Completar: Nombre, Apellido, Edad, Email, Contraseña
3. Confirmar email (Supabase env proporciona link)
4. Ingresar con credenciales
5. Ver dashboard personalizado
6. Hacer clic en "Comenzar Evaluación"
7. Responder 7 preguntas del chat
8. Ver resumen guardado
```

## 📋 Rutas Disponibles

### Públicas
| Ruta | Descripción |
|------|-------------|
| `/` | Landing page principal |
| `/auth/registrarse` | Formulario de registro |
| `/auth/ingresar` | Formulario de ingreso |
| `/auth/recuperar-contrasena` | Recuperación de contraseña |
| `/auth/registrarse-exito` | Confirmación de registro |
| `/auth/error` | Página de error |

### Protegidas (requieren login)
| Ruta | Descripción |
|------|-------------|
| `/protegido/inicio` | Dashboard principal |

## 🗂️ Estructura Principal

```
app/
├── page.tsx                    Landing (español)
├── auth/                       Autenticación (6 páginas)
└── protegido/                  Páginas protegidas

components/
├── chat-interface-es.tsx       Chat en español
└── ui/                         Componentes shadcn

lib/supabase/
├── client.ts                   Cliente browser
├── server.ts                   Cliente servidor
└── proxy.ts                    Middleware de sesión
```

## 👤 Flujo de Usuario

### 1️⃣ Registro
```
Registrarse → Ingresar datos → Crear usuario → Enviar email → Confirmar email
```

### 2️⃣ Ingreso
```
Ingresar → Validar credenciales → Crear sesión → Ir a dashboard
```

### 3️⃣ Dashboard
```
Mostrar bienvenida → Opciones de acceso → Comenzar evaluación
```

### 4️⃣ Evaluación
```
Pregunta 1 (nombre) → ... → Pregunta 7 (objetivos) → Mostrar resumen → Guardar en BD
```

## 🔒 Seguridad

✅ **Autenticación**: Supabase Auth con email/password
✅ **Sesiones**: Cookies HTTP-only, refrescadas automáticamente
✅ **Base de Datos**: Row Level Security (RLS)
✅ **Validación**: Input validation en cliente y servidor
✅ **Contraseñas**: Hashing con bcrypt

## 🎨 Personalización

### Cambiar Colores
Editar `app/globals.css`:
```css
:root {
  --primary: oklch(0.52 0.12 195);    /* Azul teal */
  --accent: oklch(0.68 0.11 15);      /* Rosa cálida */
}
```

### Cambiar Textos
- Landing: `app/page.tsx`
- Auth: `app/auth/*/page.tsx`
- Chat: `components/chat-interface-es.tsx`
- Dashboard: `app/protegido/inicio/page.tsx`

### Agregar Campos al Registro
1. Editar `app/auth/registrarse/page.tsx`
2. Agregar campo al formulario
3. Actualizar tipo de dato en base de datos
4. Actualizar tabla `profiles`

## 📊 Base de Datos

### Obtener Acceso
1. Ir a Supabase Dashboard
2. Usar credenciales del proyecto
3. Navegar a "SQL Editor" o "Table Editor"

### Ver Datos de Usuarios
```sql
SELECT id, first_name, last_name, edad, created_at 
FROM profiles 
ORDER BY created_at DESC;
```

### Ver Evaluaciones
```sql
SELECT user_id, symptom_summary, goals, created_at 
FROM chat_sessions 
ORDER BY created_at DESC;
```

## 🐛 Debugging

### Usuario no puede registrarse
```
Verificar:
1. ¿Email es válido?
2. ¿Contraseña >= 8 caracteres?
3. ¿Está Supabase conectado?
4. Revisar logs en Supabase → Auth → Users
```

### Usuario no recibe email de confirmación
```
En desarrollo:
1. Ir a Supabase → Email Templates
2. Copiar enlace de confirmación manualmente
3. Reemplazar token en URL: /auth/confirmar-email?token=XXX&type=email
```

### Chat no guarda datos
```
Verificar:
1. Usuario está autenticado
2. RLS está habilitado en chat_sessions
3. Revisar logs en Supabase → SQL Editor
```

## 📱 Testing en Dispositivos

### Mobile
```bash
# Ver en telefóno en la misma red
pnpm dev --host
# Ir a: http://tu-ip-local:3000
```

### Diferentes navegadores
- Chrome: ✅ Soportado
- Safari: ✅ Soportado (iOS 13+)
- Firefox: ✅ Soportado
- Edge: ✅ Soportado

## 🚀 Deploy a Producción

### En Vercel
1. Pushear código a GitHub
2. Conectar repo en Vercel
3. Las variables de Supabase se configuran automáticamente
4. Deploy automático en cada push

```bash
git push origin main
```

### Variables de Entorno en Vercel
Las variables de Supabase se añaden automáticamente:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 📞 Documentación Completa

- **`AUTHENTICATION_GUIDE.md`** - Sistema de autenticación detallado
- **`SPANISH_LATAM_IMPLEMENTATION.md`** - Implementación completa en español
- **`CUSTOMIZATION_GUIDE.md`** - Cómo personalizar
- **`USER_JOURNEY.md`** - Flujos de usuario

## ✨ Características Actuales

- ✅ Landing page en español
- ✅ Registro e ingreso
- ✅ Recuperación de contraseña
- ✅ Confirmación de email
- ✅ Dashboard personalizado
- ✅ Chat de evaluación (7 preguntas)
- ✅ Almacenamiento en Supabase
- ✅ Diseño responsive
- ✅ Seguridad completa

## 🚧 Próximas Fases

- **Fase 2**: IA para respuestas inteligentes, catálogo de especialistas
- **Fase 3**: Sistema de booking, precios transparentes
- **Fase 4**: Comunidad, seguimiento longitudinal

## 🆘 Ayuda Rápida

### Contacto
- **Soporte Técnico**: Revisar documentación en el repo
- **Bugs**: Crear issue en GitHub
- **Feature Requests**: Discusión en GitHub

### Recursos
- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)

---

**¿Listo para comenzar?** 🚀

```bash
pnpm dev
# Abre http://localhost:3000
```

¡Bienvenida a InSight Health! 💚
