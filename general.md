# General Development Guidelines

## Priority: Check Installed Skills First

**Always refer to installed skills BEFORE consulting these general guidelines.** The specialized skills contain comprehensive, up-to-date best practices and take precedence over these general rules.

Mandatory priority order for React/Next.js frontend work:

1. `next-best-practices`
2. `vercel-react-best-practices`
3. `frontend-design` (when constructing or redesigning UI)
4. This `general.md` file (only for project-specific conventions not covered above)

Before starting implementation, explicitly:

- Check which skills are currently installed and available in this workspace/session
- Select the relevant skill(s) for the task
- Apply those skill instructions first, then fall back to this GENERAL guide only where needed

Apply these guidelines **only when they are relevant and necessary** for the specific file or component you're working on.

## UI Design Skill Requirement

When constructing, redesigning, or significantly updating UI:

- **Use `.frontend-design` skill** as a required reference
- Build interfaces that are **unique, intentional, and creative**, not generic templates
- Follow strong design fundamentals: clear visual hierarchy, consistent spacing system, accessible contrast, typography rhythm, and responsive behavior
- Ensure UI decisions support product clarity and trust (especially for fintech/compliance-sensitive surfaces)
- Reuse design tokens/components where available, but avoid repetitive or interchangeable layouts

## Data Layer Priority (tRPC First)

For product features and frontend data access:

- **Primary source of truth**: Use `tRPC` queries/mutations if they already exist
- **If missing**: Create the required `tRPC` procedure first (query or mutation), then consume it
- **Frontend integration**: Use TanStack Query with `tRPC` for caching, invalidation, optimistic updates, retries, and loading/error states
- **Avoid duplication**: Do not implement the same business operation in parallel with custom fetch/server actions unless there is a hard requirement
- **Cross-app rule**: Prefer shared `tRPC` contracts to keep web and mobile aligned with one API definition

Security notes:

- Validate all procedure inputs with schemas (Zod) at the API boundary
- Keep authorization in backend procedures, not in client-only checks
- Never expose server secrets in `NEXT_PUBLIC_*` vars
- Add idempotency + signature verification for webhook-driven mutations

## Rendering and SEO Strategy

Use rendering mode based on page intent, with this priority when SEO matters:

1. **SSR first** when content must be request-accurate, personalized, or frequently changing
2. **SSG second** when content is mostly static and can be generated at build time
3. **ISR third** when content is mostly static but should refresh on a schedule

Rules:

- Apply SSR/SSG/ISR intentionally, not by default
- Use SEO-oriented rendering only when discoverability is important (marketing/docs/public pages)
- For authenticated app surfaces (dashboard-like UX), prioritize UX/performance over SEO

Security notes:

- On SSR pages, never serialize secrets or sensitive internal fields into client props
- Enforce auth and permission checks server-side before returning protected data
- Avoid caching private SSR responses in shared/public caches

## Server Actions

When working on server actions, consider these best practices (apply only as needed):

- **Rate Limiting**: Add rate limiting using server utils only when necessary for performance or security reasons
- **Caching**: Use Redis for caching when necessary for performance optimization
- **Email**: Use Resend and create email functionality only when email sending is required
- **Validation**: Use Zod for input validation with schemas defined in the same file. Integrate with next-intl by getting the locale and using the errorMap utility from the codebase
- **Database Queries**: Use Drizzle ORM for database operations and Prisma DX/schema builder
- **Response Format**: Use the `RESPONSE_TYPES` constant for consistent response structures
- **Authentication**: Add auth checks using Better Auth's approach only when user authentication is required
- **Error Handling**: Add try/catch blocks only when necessary for specific error scenarios
- **Security**: Treat server actions like public API handlers; enforce authorization, validate input, and redact sensitive errors/logs

## Server Components

When working with Server Components:

- **Internationalization**: Always use `getTranslations`, `setMetadata`, and `setRequestLocale` following the next-intl approach
- **Route Parameters**: When using search params or route params, properly type them as `Promise<{ key: string, key2: string }>`
- **Static Pages**: For completely static pages, add `setRequestLocale()` for proper locale handling
- **Loading States**: Prioritize `loading.tsx` files if necessary for async operations and route transitions
- **Modular Architecture**: Use the modules folder structure for organizing each feature/module you're building
- **Performance & SEO**: Apply UI/UX and React/Next.js best practice skills to ensure pages are fully optimized, scalable, and SEO-friendly
- **Security**: Fetch sensitive data server-side and pass only minimal serialized fields to client components

## Client Components

When working with Client Components:

- **Data Fetching**: Use `tRPC + TanStack Query` as the default pattern when data comes from internal APIs
- **Fallback Data Fetching**: Use direct fetch only for third-party/public endpoints where `tRPC` is not the right transport
- **State Modeling**: Group related local state into one object/slice instead of many disconnected `useState` calls for the same domain
- **State Updates**: Use partial/functional updates when mutating object state to avoid stale updates and accidental field overwrites
- **Form Submission**: Use Sonner toast for form submission feedback and the `useClientFormSubmission` hook only when necessary
- **Loading States**: Use skeleton loaders that are exact clones of the UI components to create smooth loading transitions
- **Helpers**: Utilize any available helpers if necessary for common functionality
- **Security**: Never trust client-side validation alone; avoid storing sensitive tokens or PII in localStorage

## State and Composition

- **Avoid Prop Drilling**: Do not pass props through many intermediate layers when the data is shared broadly
- **Preferred Alternatives**: Use React Context (for low-frequency/shared UI state), dedicated stores when needed, and colocate state near where it is consumed
- **Server State vs UI State**: Keep server state in TanStack Query/tRPC and reserve local stores/context for UI interaction state
- **Boundary Discipline**: Keep components focused; lift state only to the nearest common owner, not automatically to top-level layouts

## Components

When building UI components:

- **Premade Components**: For any input elements, select elements, or custom components, use the premade custom components available in the components folder instead of creating new ones
- **Styling Utilities**: Always refer to existing Tailwind utilities in the global.css file first. If utilities don't exist, create the necessary ones following best UI practices with proper text hierarchy and design principles
- **Security**: Prefer safe rendering patterns; avoid unsafe HTML injection (`dangerouslySetInnerHTML`) unless sanitized and justified

## Codebase Exploration

Before implementing new features:

- **Folder Structure**: Always skim the codebase folders to understand available utilities:
  - Check the `lib` folder for shared utilities and configurations
  - Check the `hooks` folder for custom React hooks
  - Check the `utils` folder for helper functions and utilities
  - Check the `components` folder for existing reusable components
- **Security**: Reuse existing auth, validation, and permission utilities before introducing new ad-hoc patterns

---

## HormonEquity — Producto

### Rutas de Atención

| Ruta | Para qué sirve | Cuándo priorizarla |
|------|----------------|-------------------|
| Teleorientación inicial | Ordenar el primer paso | Primera vez, síntomas difusos |
| Ginecología especializada | Síntomas físicos/hormonales | Bochornos, ciclo, sueño, energía |
| Endocrinología ginecológica | Casos persistentes o complejos | Síntomas prolongados o más intensos |
| Paquete inicial de evaluación | Claridad integral + costos | Varios síntomas y necesidad de previsibilidad |
| Psicología | Impacto emocional y mental | Ansiedad, insomnio, irritabilidad, sobrecarga |

### Checklist MVP

#### A. Claridad de producto

- Se entiende en menos de 10 segundos qué hace HormonEquity
- Queda claro que no diagnostica
- La propuesta de valor combina salud + acceso + claridad financiera
- El flujo completo tiene una lógica clara de inicio a fin

#### B. Flujo de usuario

- La usuaria puede empezar sin fricción
- Puede escribir o hablar síntomas
- El sistema devuelve una ruta comprensible
- Puede comparar opciones de atención
- Puede visualizar costos y pagos
- Puede dejar una solicitud o agendar

#### C. Calidad de UX

- El lenguaje es humano, no médico frío
- La interfaz transmite calma y confianza
- Los botones principales son visibles
- No hay demasiados pasos ni saturación visual
- El flujo se siente guiado, no abrumador

#### D. Calidad visual

- La landing tiene buen hero
- Hay jerarquía visual clara
- Espaciado consistente
- Cards alineadas y limpias
- El diseño se ve premium y moderno

#### E. Calidad técnica

- Tipado en TypeScript claro
- Componentes reutilizables
- Buen naming de archivos
- Responsive en móvil, tablet y desktop
- Estados de loading y error
- Formularios validados

#### F. Calidad de demo

- Puedes hacer el flujo completo en 2–3 minutos
- Hay data mock coherente
- El recomendador devuelve resultados creíbles
- El simulador financiero se entiende al instante

### Dirección Visual

La marca debe sentirse como:
- Salud femenina moderna
- Claridad financiera
- Cuidado premium
- Calma profesional

No debe verse como:
- Hospital frío
- Fintech dura
- App "girly cliché"
- Wellness genérico sin credibilidad

### Principios de Diseño

- Usar mucho espacio en blanco
- Bordes redondeados suaves
- Tipografía limpia
- Cards con sombra muy sutil
- Iconografía simple
- Pocos colores, bien elegidos
- CTA claro y consistente

### Jerarquía Visual

**Hero**: titular fuerte + subtítulo corto + CTA

**Secciones**: cada bloque con título, texto corto, card/visual

**Pantallas internas**: encabezado claro, paso actual visible, contenido central, CTA al final

### Componentes Clave

- Navbar
- Hero
- Chat bubbles
- Recommendation cards
- Pricing cards
- Financing simulator
- Booking form
- Dashboard summary cards
