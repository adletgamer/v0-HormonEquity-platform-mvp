# Documentación: Seguridad Médica en HormonEquity

## 🚨 Sistema de Triage Médico

### Propósito
Detectar síntomas graves que requieren atención médica INMEDIATA y guiar a las usuarias hacia recursos de emergencia.

### Niveles de Severidad

```
1. EMERGENCIA (Rojo)
   - Sangrado vaginal abundante y prolongado
   - Dolor en el pecho
   - Dificultad para respirar
   - Síntomas de accidente cerebrovascular
   - Ideación suicida o de autolesión
   → ACCIÓN: Mostrar números de emergencia, recomendar 911
   → AVISO: "CUELGA Y LLAMA AHORA"

2. PRIORITARIO (Amarillo)
   - Síntomas severos (promedio 7+/10)
   - Cambios bruscos en síntomas
   - Signos vitales anormales
   → ACCIÓN: Recomendar atención presencial hoy
   → AVISO: Contactar médico inmediatamente

3. RECOMENDADO
   - Síntomas moderados (5-6.9/10)
   → ACCIÓN: Ofertar cuidado por telemedicina o presencial

4. OPCIONAL
   - Síntomas leves (<5/10)
   → ACCIÓN: Ofertar opciones de cuidado
```

### Implementación Técnica

**Archivo:** `lib/triage-engine.ts`

```typescript
// Detecta síntomas de emergencia
const redFlags = {
  sangrado_severo: ['sangrado abundante', 'empapando toalla'],
  sintomas_cardiacos: ['dolor en pecho', 'dificultad respirar'],
  salud_mental: ['ideación suicida', 'pensamiento autolesión'],
  neurologia: ['accidente cerebrovascular', 'debilidad facial']
}

// Calcula severidad basada en síntomas y puntajes
const severity = evaluateEscalation(symptoms, scores)

// Genera recomendaciones personalizadas
const recommendations = getEscalationActions(severity)

// Proporciona números de emergencia por país
const resources = getEscalationResources(severity, pais)
```

---

## 📋 Sistema de Disclaimers

### Los 5 Disclaimers Requeridos

**1. Medical Principal** 
- Tema: "No Diagnóstico Médico"
- Mensaje: HormonEquity NO diagnostica, solo orienta
- Mostrado en: Onboarding, Chat, Resultados

**2. Emergencia Crítica**
- Tema: "Situación de Emergencia Detectada"
- Mensaje: Números de emergencia por país
- Mostrado en: Chat (si se detectan síntomas)

**3. Consentimiento Informado**
- Tema: Aceptación de responsabilidades
- Mensaje: Usuario entiende limitaciones
- Mostrado en: Onboarding (CRÍTICO)

**4. Responsabilidad Legal**
- Tema: Limitaciones de garantías
- Mensaje: HormonEquity no es responsable por decisiones
- Mostrado en: Onboarding, Resultados

**5. Privacidad y Datos**
- Tema: Protección de información personal
- Mensaje: Cómo guardamos y protegemos datos
- Mostrado en: Onboarding

### Páginas de Disclaimers

**Onboarding (`/protegido/orientacion`)**
- 5 pasos progresivos
- El usuario DEBE aceptar cada uno
- Barra de progreso visual
- Resumen final de aceptaciones

**Modal de Emergencia**
- Se muestra si triage detecta emergencia
- Números de emergencia clickeables
- No se puede cerrar sin aceptar

**Chat**
- Disclaimer de no-diagnóstico antes de evaluar
- Advertencia de emergencia si es necesario

---

## 🆘 Sistema de Escalamiento

### Flujo de Escalamiento

```
Usuario reporta síntoma grave
         ↓
Triage detecta red flag
         ↓
¿Es emergencia?
  ├─→ SÍ: Mostrar números, recomendar 911
  └─→ NO: Evaluar severidad numérica
         ↓
    ¿Promedio 7+?
     ├─→ SÍ: Urgencia, contactar médico hoy
     └─→ NO: Recomendación normal
```

### Recursos de Emergencia por País

```
México: 911 (Emergencias)
Argentina: 107 (SAME)
Colombia: 123 (Emergencias)
Chile: 133 (Carabineros)
Perú: 105 (PNP)
Brasil: 192 (SAMU)
```

### Component: `<EmergencyWarning />`

Se muestra cuando triage.severity ∈ ['emergencia', 'prioritario']

Incluye:
- Icono y color apropiado
- Lista de recomendaciones
- Números de emergencia por país
- Botón "Contactar Médico Ahora"

---

## 🔍 Red Flags Específicas

### Sangrado Severo (Emergencia)
- Sangrado vaginal abundante
- Empapando más de 1 toalla/hora
- Sangrado por más de 7 días
- Acompañado de mareo/fatiga

### Síntomas Cardíacos (Emergencia)
- Dolor en pecho
- Presión en pecho
- Dificultad para respirar
- Taquicardia severa (>120 bpm)
- Palpitaciones fuertes

### Salud Mental Crítica (Emergencia)
- "Quiero morirme" o similar
- Pensamiento de autolesión
- Crisis de pánico severa
- Episodio psicótico

### Neurología Crítica (Emergencia)
- Debilidad facial
- Parálisis
- Pérdida de visión
- Accidente cerebrovascular (FAST)
- Rigidez de nuca + fiebre

---

## ✅ Flujo Completo de Usuaria

```
1. ONBOARDING
   ├─ Ingresa a /protegido/orientacion
   ├─ Lee 5 disclaimers progresivamente
   ├─ DEBE aceptar cada uno
   └─ Redirige a /protegido/inicio

2. DASHBOARD
   ├─ Opción "Comenzar Evaluación"
   ├─ Disclaimer médico
   └─ Redirige a chat

3. CHAT (14 etapas)
   ├─ Recopila síntomas (severidad 0-10)
   ├─ Durante chat: Triage en tiempo real
   ├─ Si hay emergencia: Mostrar warning
   └─ Submit → API calcula triage completo

4. API /api/evaluacion/completar
   ├─ Recibe síntomas y severidades
   ├─ Ejecuta triageSymptoms()
   ├─ Genera recomendaciones
   ├─ Guarda todo en BD
   └─ Devuelve datos para resultados

5. RESULTADOS (/protegido/resultados)
   ├─ Si emergencia: Mostrar <EmergencyWarning />
   ├─ Si prioritario: Advertencia en amarillo
   ├─ Mostrar 5 rutas de cuidado
   ├─ Explicar recomendaciones
   └─ CTA: "Contactar Especialista"
```

---

## 🔐 Base de Datos

### Campos Agregados a `chat_sessions`

```sql
-- chat_sessions actualizada con:
- triage_severity VARCHAR (emergencia | prioritario | recomendado | opcional)
- triage_red_flags JSONB (array de banderas encontradas)
- triage_recommendations TEXT (recomendaciones generadas)
- escalation_level VARCHAR (normal | urgent | emergency)
- emergency_resources JSONB (números y recursos)
```

### RLS Policies

```sql
-- Solo el usuario puede ver su propia triaje
CREATE POLICY "chat_sessions_select_own" 
  ON public.chat_sessions 
  FOR SELECT 
  USING (auth.uid() = user_id);
```

---

## 🚀 Cómo Probar la Seguridad Médica

### Escenario 1: Emergencia
```
Etapa 3 (Sofocos): 8
Etapa 4 (Menstruación): 9
Etapa 6 (Insomnio): 7
+ Escribir "sangrado abundante" en medical history
↓
RESULTADO: Triage muestra 🚨 EMERGENCIA
           Números de emergencia clickeables
           Aviso "CUELGA Y LLAMA AHORA"
```

### Escenario 2: Prioritario
```
Todas las severidades: 7-8
↓
RESULTADO: Advertencia en amarillo
           Recomendar atención presencial hoy
           Sin números de emergencia
```

### Escenario 3: Normal
```
Severidades: 3-4
↓
RESULTADO: Sin warnings
           Opciones de cuidado normales
```

---

## 📝 Compliance y Legal

### Estándares Cumplidos

- ✅ **No Diagnóstico**: Explícitamente indicado en todos los puntos
- ✅ **Consentimiento Informado**: Usuario acepta antes de usar
- ✅ **Responsabilidad Legal**: Disclaimers en múltiples puntos
- ✅ **Escalamiento Médico**: Redirige a emergencias si necesario
- ✅ **Privacidad GDPR**: Datos encriptados, RLS habilitado
- ✅ **Accesibilidad**: Texto de alto contraste, clickeable

### Disclaimers Mostrados en:

| Punto | Disclaimers Mostrados |
|-------|----------------------|
| Onboarding | Medical, Legal, Consent, Privacy |
| Chat | Medical, Emergency (si aplica) |
| Resultados | Medical, Legal, Recommendations |

---

## 🔧 Archivos Relacionados

**Core Logic:**
- `lib/triage-engine.ts` (197 líneas)
- `lib/disclaimers.ts` (192 líneas)
- `lib/escalation.ts` (201 líneas)

**Components:**
- `components/disclaimer-modal.tsx` (71 líneas)
- `components/emergency-warning.tsx` (94 líneas)

**Pages:**
- `app/protegido/orientacion/page.tsx` (187 líneas)
- Actualizado: `components/enhanced-chat-es.tsx`

**API:**
- `app/api/evaluacion/completar/route.ts` (con triage)

---

Este sistema de seguridad médica está diseñado para cumplir con estándares legales y proteger a las usuarias mientras se mantiene la misión de HormonEquity: orientación compasiva y acceso equitativo a cuidado hormonal.
