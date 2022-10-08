create type access_type as enum (
    'open',
    'restricted',
    'closed'
);

create or replace function trigger_set_updated_at()
    returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create table if not exists users (
    id uuid primary key,
    login text not null unique,
    name text not null
);

create table if not exists sources (
  id uuid primary key,
  external_id text,
  title text not null,
  description text not null,
  rights text not null,
  access access_type not null,
  notes text,
  created_by uuid not null,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now()
);

create trigger set_sources_updated_at
    before update on sources
    for each row
    execute procedure trigger_set_updated_at();

create table if not exists corpora (
    id uuid primary key,
    parent_id uuid unique,
    title text not null,
    description text not null,
    rights text not null,
    access access_type not null,
    location text,
    earliest date,
    latest date,
    language text,
    contributor text,
    notes text,
    created_by uuid not null,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now(),
    constraint corpora_parent_id_fkey foreign key (parent_id) references corpora (parent_id)
);

create trigger set_corpora_updated_at
    before update on corpora
    for each row
    execute procedure trigger_set_updated_at()
