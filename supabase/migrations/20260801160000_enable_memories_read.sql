-- PeakBook v0.6 · Recuerdos read model

grant select on table public.peaks, public.adventure_peaks, public.photos to anon, authenticated;

create policy "peaks_select_v06"
  on public.peaks for select
  to anon, authenticated
  using (true);

create policy "adventure_peaks_select_v06"
  on public.adventure_peaks for select
  to anon, authenticated
  using (true);

create policy "photos_select_v06"
  on public.photos for select
  to anon, authenticated
  using (true);

comment on table public.photos is
  'Fotografías de aventuras. v0.6 habilita lectura para construir el álbum Recuerdos.';

