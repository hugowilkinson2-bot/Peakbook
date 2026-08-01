-- PeakBook v0.3 · Adventure domain
-- SQL uses PostgreSQL snake_case while the application exposes PascalCase entities.

create extension if not exists pgcrypto with schema extensions;

create type public.adventure_difficulty as enum (
  'facil',
  'moderada',
  'dificil',
  'experta'
);

create table public.adventures (
  id uuid primary key default extensions.gen_random_uuid(),
  titulo text not null check (char_length(titulo) between 1 and 160),
  fecha date not null,
  descripcion text,
  distancia numeric(10, 2) not null default 0 check (distancia >= 0),
  desnivel_positivo integer not null default 0 check (desnivel_positivo >= 0),
  desnivel_negativo integer not null default 0 check (desnivel_negativo >= 0),
  tiempo integer not null default 0 check (tiempo >= 0),
  dificultad public.adventure_difficulty not null,
  sensaciones text,
  meteorologia jsonb not null default '{}'::jsonb check (jsonb_typeof(meteorologia) = 'object'),
  created_at timestamptz not null default timezone('utc'::text, now())
);

comment on column public.adventures.distancia is 'Distancia total en kilómetros.';
comment on column public.adventures.desnivel_positivo is 'Desnivel positivo acumulado en metros.';
comment on column public.adventures.desnivel_negativo is 'Desnivel negativo acumulado en metros.';
comment on column public.adventures.tiempo is 'Duración total en segundos.';
comment on column public.adventures.meteorologia is 'Datos meteorológicos estructurados y extensibles en formato JSON.';

create table public.peaks (
  id uuid primary key default extensions.gen_random_uuid(),
  nombre text not null check (char_length(nombre) between 1 and 160),
  altitud integer not null check (altitud between -500 and 9000),
  latitud numeric(9, 6) not null check (latitud between -90 and 90),
  longitud numeric(9, 6) not null check (longitud between -180 and 180),
  provincia text,
  pais text not null check (char_length(pais) between 2 and 100),
  constraint peaks_coordinates_unique unique (latitud, longitud)
);

create table public.adventure_peaks (
  adventure_id uuid not null references public.adventures(id) on delete cascade,
  peak_id uuid not null references public.peaks(id) on delete restrict,
  orden smallint not null check (orden > 0),
  primary key (adventure_id, peak_id),
  constraint adventure_peaks_order_unique unique (adventure_id, orden)
);

create table public.photos (
  id uuid primary key default extensions.gen_random_uuid(),
  adventure_id uuid not null references public.adventures(id) on delete cascade,
  url text not null check (char_length(url) > 0),
  portada boolean not null default false,
  descripcion text
);

create table public.equipment (
  id uuid primary key default extensions.gen_random_uuid(),
  nombre text not null check (char_length(nombre) between 1 and 160),
  categoria text not null check (char_length(categoria) between 1 and 100),
  marca text,
  modelo text
);

create table public.adventure_equipment (
  adventure_id uuid not null references public.adventures(id) on delete cascade,
  equipment_id uuid not null references public.equipment(id) on delete restrict,
  primary key (adventure_id, equipment_id)
);

create table public.people (
  id uuid primary key default extensions.gen_random_uuid(),
  nombre text not null check (char_length(nombre) between 1 and 160)
);

create table public.adventure_people (
  adventure_id uuid not null references public.adventures(id) on delete cascade,
  person_id uuid not null references public.people(id) on delete restrict,
  primary key (adventure_id, person_id)
);

create index adventures_fecha_idx on public.adventures (fecha desc);
create index adventure_peaks_peak_id_idx on public.adventure_peaks (peak_id);
create index photos_adventure_id_idx on public.photos (adventure_id);
create unique index photos_single_cover_idx on public.photos (adventure_id) where portada = true;
create index adventure_equipment_equipment_id_idx on public.adventure_equipment (equipment_id);
create index adventure_people_person_id_idx on public.adventure_people (person_id);

alter table public.adventures enable row level security;
alter table public.peaks enable row level security;
alter table public.adventure_peaks enable row level security;
alter table public.photos enable row level security;
alter table public.equipment enable row level security;
alter table public.adventure_equipment enable row level security;
alter table public.people enable row level security;
alter table public.adventure_people enable row level security;

comment on table public.adventures is 'Entidad principal Adventure de PeakBook.';
comment on table public.adventure_peaks is 'Relación ordenada entre aventuras y cimas.';
comment on table public.photos is 'Metadatos de fotografías asociadas a una aventura.';
comment on table public.adventure_equipment is 'Material utilizado en cada aventura.';
comment on table public.adventure_people is 'Personas que participaron en cada aventura.';
