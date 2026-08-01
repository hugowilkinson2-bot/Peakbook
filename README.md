# PeakBook

Aplicación móvil-first para registrar aventuras de montaña, trails y cimas.

## Desarrollo

1. Copia `.env.example` a `.env.local` y añade las credenciales de Supabase y Mapbox.
2. Instala dependencias con `npm install`.
3. Inicia el entorno con `npm run dev`.

## Arquitectura

- `src/features/adventures/domain`: entidades y contratos del dominio.
- `src/features/adventures/data`: adaptadores y datos temporales de presentación.
- `src/types/database.types.ts`: contrato tipado del esquema Supabase.
- `src/lib/supabase`: clientes tipados para navegador y servidor.
- `supabase/migrations`: fuente de verdad versionada de la base de datos.

El esquema usa nombres `snake_case` en PostgreSQL y entidades PascalCase en TypeScript. Row Level Security está activado y cerrado por defecto hasta definir usuarios y propiedad de las aventuras.

## Stack

Next.js 15, React 19, TypeScript, Tailwind CSS, Supabase, Mapbox GL y PWA.
