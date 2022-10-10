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

create table keywords (
    id serial primary key,
    val text not null unique
);

create table languages (
  id smallserial primary key,
  name text not null unique
);

create table users (
    id uuid primary key,
    name text not null unique
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
  notes text,
  created_by uuid not null references users (id),
  created_at timestamp not null default now(),
  updated_at timestamp not null default now()
);

create trigger set_sources_updated_at
    before update on sources
    for each row
    execute procedure trigger_set_updated_at();

create table sources_keywords (
    source_id uuid references sources (id),
    key_id serial references keywords (id),
    unique (source_id, key_id)
);
create index on sources_keywords (key_id, source_id);

create table sources_languages (
    source_id uuid references sources (id),
    lang_id smallserial references languages (id),
    unique (source_id, lang_id)
);
create index on sources_languages (lang_id, source_id);

create table corpora (
    id uuid primary key,
    parent_id uuid references corpora (id),
    title text not null,
    description text not null,
    rights text not null,
    access access_type not null,
    location text,
    earliest date,
    latest date,
    contributor text,
    notes text,
    created_by uuid not null references users (id),
    created_at timestamp not null default now(),
    updated_at timestamp not null default now()
);

create trigger set_corpora_updated_at
    before update on corpora
    for each row
    execute procedure trigger_set_updated_at();

create table corpora_languages (
    corpus_id uuid references corpora (id),
    lang_id smallserial references languages (id),
    unique (corpus_id, lang_id)
);
create index on corpora_languages (lang_id, corpus_id);
