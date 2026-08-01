-- PeakBook v0.7 · Mountain-first identity

alter table public.peaks
  add column if not exists descripcion text,
  add column if not exists foto_principal_url text,
  add column if not exists dificultad public.adventure_difficulty not null default 'moderada';

alter table public.peaks
  add column if not exists globe_id text generated always as ('peak:' || id::text) stored;

create unique index if not exists peaks_globe_id_unique on public.peaks (globe_id);
create index if not exists peaks_location_idx on public.peaks (pais, provincia);
create index if not exists peaks_altitude_idx on public.peaks (altitud desc);

comment on column public.peaks.globe_id is
  'Identificador estable para representar la cima en futuras experiencias geoespaciales y globo 3D.';

comment on column public.peaks.foto_principal_url is
  'Fotografía editorial principal de la identidad visual de la cima.';

