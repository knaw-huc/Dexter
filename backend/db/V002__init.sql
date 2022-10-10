create type access_type as enum (
    'open',
    'restricted',
    'closed'
);

create function trigger_set_updated_at()
    returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create table users (
    id uuid primary key,
    login text not null unique,
    name text not null
);

create table sources (
  id uuid primary key,
  external_id text,
  title text not null,
  description text not null,
  rights text not null,
  access access_type not null,
  location text,
  earliest date,
  latest date,
  language text, -- multiple languages
  notes text,
  created_by uuid not null,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now()
);

create trigger set_sources_updated_at
    before update on sources
    for each row
    execute procedure trigger_set_updated_at();

create table corpora (
    id uuid primary key,
    parent_id uuid,
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
    constraint corpora_parent_id_fkey foreign key (parent_id) references corpora (id)
);

create trigger set_corpora_updated_at
    before update on corpora
    for each row
    execute procedure trigger_set_updated_at()
