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

## PeakBook v0.8

La aplicación inicia una sesión anónima persistente de Supabase Auth. En el proyecto remoto debe estar activa la opción **Authentication > Providers > Anonymous Sign-Ins**.

Las aventuras pertenecen a `auth.uid()` y RLS limita lectura y escritura a su propietario. La clave publicable nunca sustituye estas políticas y no debe utilizarse una clave secreta en el navegador.

Después de aplicar las migraciones y completar `.env.local`, ejecuta `npm run verify:supabase`. El comando solo termina correctamente si crear, listar, consultar, editar y eliminar funcionan contra el proyecto configurado.

La migración v0.4 habilita acceso CRUD para `anon` y `authenticated` porque esta entrega aún es de usuario único y no incluye autenticación. Antes de exponer PeakBook públicamente, añade propiedad por usuario y sustituye estas políticas por reglas basadas en `auth.uid()`.
