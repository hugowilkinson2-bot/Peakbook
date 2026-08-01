-- PeakBook v0.8 · Private adventure ownership
-- Anonymous Supabase Auth users receive a stable auth.uid() stored by the browser.

alter table public.adventures
  add column if not exists owner_id uuid references auth.users(id) on delete cascade;

alter table public.adventures
  alter column owner_id set default auth.uid();

create index if not exists adventures_owner_fecha_idx
  on public.adventures (owner_id, fecha desc);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'adventures_owner_required'
      and conrelid = 'public.adventures'::regclass
  ) then
    alter table public.adventures
      add constraint adventures_owner_required
      check (owner_id is not null) not valid;
  end if;
end
$$;

drop policy if exists "adventures_select_v04" on public.adventures;
drop policy if exists "adventures_insert_v04" on public.adventures;
drop policy if exists "adventures_update_v04" on public.adventures;
drop policy if exists "adventures_delete_v04" on public.adventures;

revoke all on table public.adventures from anon;
grant select, insert, update, delete on table public.adventures to authenticated;

create policy "adventures_select_owner_v08"
  on public.adventures for select
  to authenticated
  using ((select auth.uid()) = owner_id);

create policy "adventures_insert_owner_v08"
  on public.adventures for insert
  to authenticated
  with check ((select auth.uid()) = owner_id);

create policy "adventures_update_owner_v08"
  on public.adventures for update
  to authenticated
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);

create policy "adventures_delete_owner_v08"
  on public.adventures for delete
  to authenticated
  using ((select auth.uid()) = owner_id);

drop policy if exists "adventure_peaks_select_v06" on public.adventure_peaks;
drop policy if exists "photos_select_v06" on public.photos;

revoke all on table public.adventure_peaks, public.photos from anon;
grant select, insert, update, delete on table public.adventure_peaks, public.photos to authenticated;

create policy "adventure_peaks_owner_v08"
  on public.adventure_peaks for all
  to authenticated
  using (
    exists (
      select 1 from public.adventures
      where adventures.id = adventure_peaks.adventure_id
        and adventures.owner_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.adventures
      where adventures.id = adventure_peaks.adventure_id
        and adventures.owner_id = (select auth.uid())
    )
  );

create policy "photos_owner_v08"
  on public.photos for all
  to authenticated
  using (
    exists (
      select 1 from public.adventures
      where adventures.id = photos.adventure_id
        and adventures.owner_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.adventures
      where adventures.id = photos.adventure_id
        and adventures.owner_id = (select auth.uid())
    )
  );

comment on column public.adventures.owner_id is
  'Supabase Auth owner. PeakBook v0.8 uses a persistent anonymous user until account login is introduced.';

comment on table public.adventures is
  'Private PeakBook adventures protected by owner-scoped row level security.';
