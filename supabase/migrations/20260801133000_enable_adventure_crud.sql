-- PeakBook v0.4 · First usable single-user CRUD

alter table public.adventures rename column descripcion to notas;

grant select, insert, update, delete on table public.adventures to anon, authenticated;

create policy "adventures_select_v04"
  on public.adventures for select
  to anon, authenticated
  using (true);

create policy "adventures_insert_v04"
  on public.adventures for insert
  to anon, authenticated
  with check (true);

create policy "adventures_update_v04"
  on public.adventures for update
  to anon, authenticated
  using (true)
  with check (true);

create policy "adventures_delete_v04"
  on public.adventures for delete
  to anon, authenticated
  using (true);

comment on table public.adventures is
  'PeakBook adventures. v0.4 uses temporary single-user public CRUD policies; replace with owner-scoped policies when authentication is introduced.';
