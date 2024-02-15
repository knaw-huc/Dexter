create table media
(
    id uuid primary key default gen_random_uuid(),
    title text not null,
    url text not null,
    media_type text not null,
    source_id uuid references sources (id),
    created_by uuid not null references users (id)
);

create index on media (media_type);
