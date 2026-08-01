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

Las tablas tienen Row Level Security activado y no incluyen políticas públicas. Las políticas se añadirán cuando se defina el modelo de usuarios y propiedad de aventuras.
