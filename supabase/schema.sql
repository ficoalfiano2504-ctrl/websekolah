create table if not exists public.complaints (
  id text primary key,
  title text not null,
  category text not null,
  description text not null,
  location text not null default 'Belum ditentukan',
  student_name text not null,
  student_class text not null,
  photo text not null default '',
  status text not null default 'Diproses'
    check (status in ('Diajukan', 'Diproses', 'Selesai')),
  created_at timestamptz not null default now(),
  updates jsonb not null default '[]'::jsonb,
  messages jsonb not null default '[]'::jsonb
);

create index if not exists complaints_created_at_idx
  on public.complaints (created_at desc);

alter table public.complaints enable row level security;