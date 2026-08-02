-- PeakBook v0.9.1 · Durable, recoverable photo uploads

alter table public.photos
  add column if not exists upload_status text not null default 'ready';

alter table public.photos
  drop constraint if exists photos_upload_status_check;

alter table public.photos
  add constraint photos_upload_status_check
  check (upload_status in ('pending', 'ready', 'cleanup_required'));

drop index if exists public.photos_adventure_order_unique;
create unique index photos_adventure_ready_order_unique
  on public.photos (adventure_id, orden)
  where upload_status = 'ready';

create index if not exists photos_cleanup_status_idx
  on public.photos (upload_status, created_at)
  where upload_status <> 'ready';

comment on column public.photos.upload_status is
  'Upload intent state. Non-ready rows keep Storage objects traceable until cleanup succeeds.';
