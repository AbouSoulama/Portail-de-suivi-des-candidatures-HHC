-- À coller dans Supabase → SQL Editor → Run

create table if not exists users (
  id uuid primary key,
  identifiant text unique not null,
  password_hash text not null,
  role text not null check (role in ('admin', 'candidat')),
  prenom text not null default '',
  nom text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists candidats (
  id uuid primary key,
  user_id uuid not null references users(id) on delete cascade,
  telephone text not null default '',
  destination text not null default '',
  programme text not null default '',
  niveau text not null default '',
  conseiller text not null default '',
  note_interne text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists steps (
  id uuid primary key,
  candidat_id uuid not null references candidats(id) on delete cascade,
  code text not null,
  label text not null,
  status text not null,
  commentaire text not null default '',
  updated_at timestamptz not null default now(),
  position int not null default 0
);

alter table users enable row level security;
alter table candidats enable row level security;
alter table steps enable row level security;
