# Supabase

La migración de `migrations/` define el dominio de datos de PeakBook v0.3.

## Desarrollo local

```bash
supabase start
supabase db reset
supabase gen types typescript --local > src/types/database.types.ts
```

## Proyecto remoto

Vincula el proyecto una sola vez con `supabase link --project-ref <project-ref>` y aplica las migraciones con `supabase db push`.

La migración v0.4 habilita acceso CRUD para `anon` y `authenticated` porque esta entrega aún es de usuario único y no incluye autenticación. Antes de exponer PeakBook públicamente, añade propiedad por usuario y sustituye estas políticas por reglas basadas en `auth.uid()`.
