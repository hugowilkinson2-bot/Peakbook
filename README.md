# PeakBook

Aplicación móvil-first para registrar aventuras de montaña, trails y cimas.

## Desarrollo

1. Copia `.env.example` a `.env.local` y añade las credenciales de Supabase y Mapbox.
2. Instala dependencias con `npm install`.
3. Inicia el entorno con `npm run dev`.

## Arquitectura

- `src/features/adventures/domain`: entidades y contratos del dominio.
- `src/features/adventures/data`: adaptadores y datos temporales de presentación.
- `src/features/memories`: modelo de lectura y componentes editoriales del álbum Recuerdos.
- `src/types/database.types.ts`: contrato tipado del esquema Supabase.
- `src/lib/supabase`: clientes tipados para navegador y servidor.
- `supabase/migrations`: fuente de verdad versionada de la base de datos.

El esquema usa nombres `snake_case` en PostgreSQL y entidades PascalCase en TypeScript. Row Level Security está activado; v0.4 incorpora políticas temporales de usuario único que se sustituirán al añadir autenticación.

## v0.4

La primera versión utilizable incluye CRUD completo de aventuras, persistencia Supabase, mutaciones optimistas con rollback, estados de carga/error, búsqueda, filtro por año y ordenación por fecha. GPX, fotos y mapas permanecen fuera de alcance.

Para conectarla, copia `.env.example` a `.env.local`, configura la URL y la clave publicable de Supabase y aplica las migraciones de `supabase/migrations`.

## v0.6 · The WOW Release

La pantalla **Recuerdos** transforma las aventuras en un álbum editorial responsive. Incluye timeline vertical, portadas y cimas leídas desde Supabase, recuerdo automático de hace un año, mejor fotografía y última cima conseguida. Si una aventura todavía no tiene portada, se utiliza una fotografía editorial local de forma determinista.

## Stack

Next.js 15, React 19, TypeScript, Tailwind CSS, Supabase, Mapbox GL y PWA.
