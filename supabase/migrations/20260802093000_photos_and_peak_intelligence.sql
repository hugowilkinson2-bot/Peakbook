-- PeakBook v0.9 · Private photography and intelligent peak catalogue

create extension if not exists pg_trgm with schema extensions;

alter table public.peaks
  add column if not exists canonical_slug text,
  add column if not exists source text not null default 'peakbook',
  add column if not exists source_id text;

update public.peaks
set canonical_slug = lower(regexp_replace(regexp_replace(nombre, '[^[:alnum:]]+', '-', 'g'), '(^-|-$)', '', 'g'))
where canonical_slug is null;

alter table public.peaks alter column canonical_slug set not null;

create unique index if not exists peaks_canonical_slug_unique on public.peaks (canonical_slug);
create unique index if not exists peaks_source_identity_unique on public.peaks (source, source_id) where source_id is not null;
create index if not exists peaks_name_trgm_idx on public.peaks using gin (nombre extensions.gin_trgm_ops);

insert into public.peaks (
  id, nombre, altitud, latitud, longitud, provincia, pais, descripcion,
  foto_principal_url, dificultad, canonical_slug, source, source_id
) values
  ('01000000-0000-4000-8000-000000000001', 'Aneto', 3404, 42.631111, 0.656667, 'Huesca', 'España', 'El techo de los Pirineos.', '/peak-aneto.png', 'experta', 'aneto', 'peakbook', 'es-aneto'),
  ('01000000-0000-4000-8000-000000000002', 'Mulhacén', 3479, 37.053333, -3.311389, 'Granada', 'España', 'La gran atalaya de Sierra Nevada.', '/peak-mulhacen.png', 'dificil', 'mulhacen', 'peakbook', 'es-mulhacen'),
  ('01000000-0000-4000-8000-000000000003', 'Teide', 3715, 28.272639, -16.643611, 'Santa Cruz de Tenerife', 'España', 'Un volcán sobre el Atlántico.', '/peak-teide.png', 'moderada', 'teide', 'peakbook', 'es-teide'),
  ('01000000-0000-4000-8000-000000000004', 'Pic du Midi d’Ossau', 2884, 42.843056, -0.438056, 'Pyrénées-Atlantiques', 'Francia', 'Una pirámide volcánica sobre los lagos de Ossau.', '/peak-midi-ossau.png', 'experta', 'pic-du-midi-d-ossau', 'peakbook', 'fr-midi-ossau'),
  ('01000000-0000-4000-8000-000000000005', 'Rocacorba', 991, 42.069444, 2.704167, 'Girona', 'España', 'Mirador natural entre el Gironès y el Pla de l’Estany.', '/memories-lake.png', 'moderada', 'rocacorba', 'peakbook', 'es-rocacorba'),
  ('01000000-0000-4000-8000-000000000006', 'Roca Corbatera', 1163, 41.286111, 0.845556, 'Tarragona', 'España', 'El punto más alto de la Serra de Montsant.', '/memories-dawn.png', 'moderada', 'roca-corbatera', 'peakbook', 'es-roca-corbatera'),
  ('01000000-0000-4000-8000-000000000007', 'Roque Nublo', 1813, 27.970833, -15.612778, 'Las Palmas', 'España', 'Monolito volcánico y símbolo natural de Gran Canaria.', '/memories-summit.png', 'facil', 'roque-nublo', 'peakbook', 'es-roque-nublo')
on conflict (id) do update set
  nombre = excluded.nombre,
  altitud = excluded.altitud,
  latitud = excluded.latitud,
  longitud = excluded.longitud,
  provincia = excluded.provincia,
  pais = excluded.pais,
  descripcion = excluded.descripcion,
  foto_principal_url = excluded.foto_principal_url,
  dificultad = excluded.dificultad,
  canonical_slug = excluded.canonical_slug,
  source = excluded.source,
  source_id = excluded.source_id;

grant select on table public.peaks to authenticated;

drop policy if exists "peaks_select_v09" on public.peaks;
create policy "peaks_select_v09"
  on public.peaks for select
  to authenticated
  using (true);

create or replace function public.search_peaks(p_query text default '', p_limit integer default 8)
returns setof public.peaks
language sql
stable
security invoker
set search_path = ''
as $$
  select peak.*
  from public.peaks peak
  where trim(coalesce(p_query, '')) = ''
     or peak.nombre ilike '%' || trim(p_query) || '%'
     or peak.provincia ilike '%' || trim(p_query) || '%'
     or peak.pais ilike '%' || trim(p_query) || '%'
     or extensions.similarity(peak.nombre, trim(p_query)) > 0.18
  order by
    case when lower(peak.nombre) like lower(trim(p_query)) || '%' then 0 else 1 end,
    extensions.similarity(peak.nombre, trim(p_query)) desc,
    peak.altitud desc
  limit least(greatest(p_limit, 1), 20);
$$;

grant execute on function public.search_peaks(text, integer) to authenticated;

alter table public.photos add column if not exists orden smallint;

with ranked as (
  select id, row_number() over (partition by adventure_id order by portada desc, id)::smallint as position
  from public.photos
)
update public.photos photo set orden = ranked.position
from ranked where photo.id = ranked.id and photo.orden is null;

alter table public.photos
  alter column orden set default 1,
  alter column orden set not null,
  add column if not exists width integer,
  add column if not exists height integer,
  add column if not exists bytes integer,
  add column if not exists mime_type text,
  add column if not exists created_at timestamptz not null default timezone('utc'::text, now());

create unique index if not exists photos_adventure_order_unique on public.photos (adventure_id, orden);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('adventure-photos', 'adventure-photos', false, 6291456, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "adventure_photos_select_owner_v09" on storage.objects;
drop policy if exists "adventure_photos_insert_owner_v09" on storage.objects;
drop policy if exists "adventure_photos_update_owner_v09" on storage.objects;
drop policy if exists "adventure_photos_delete_owner_v09" on storage.objects;

create policy "adventure_photos_select_owner_v09"
  on storage.objects for select to authenticated
  using (bucket_id = 'adventure-photos' and (storage.foldername(name))[1] = (select auth.uid()::text));

create policy "adventure_photos_insert_owner_v09"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'adventure-photos' and (storage.foldername(name))[1] = (select auth.uid()::text));

create policy "adventure_photos_update_owner_v09"
  on storage.objects for update to authenticated
  using (bucket_id = 'adventure-photos' and (storage.foldername(name))[1] = (select auth.uid()::text))
  with check (bucket_id = 'adventure-photos' and (storage.foldername(name))[1] = (select auth.uid()::text));

create policy "adventure_photos_delete_owner_v09"
  on storage.objects for delete to authenticated
  using (bucket_id = 'adventure-photos' and (storage.foldername(name))[1] = (select auth.uid()::text));

comment on column public.peaks.source_id is 'Stable provider identity for importing a future worldwide mountain catalogue without duplicates.';
comment on column public.photos.url is 'Private object path inside the adventure-photos bucket. Never a permanent public URL.';
comment on table public.photos is 'Ordered, private adventure photography metadata. Images are stored in Supabase Storage.';
