create table metadata_keys
(
    id uuid primary key default gen_random_uuid(),
    key text not null unique,
    created_by uuid not null references users (id)
);

create table metadata_values
(
    id uuid primary key default gen_random_uuid(),
    key_id uuid not null references metadata_keys (id),
    value text not null,
    created_by uuid not null references users (id)
);

create table sources_metadata_values
(
    metadata_value_id uuid references metadata_values (id),
    source_id uuid references sources (id),
    unique (metadata_value_id, source_id)
);
create index on sources_metadata_values (source_id, metadata_value_id);

create table corpora_metadata_values
(
    metadata_value_id uuid references metadata_values (id),
    corpus_id uuid references corpora (id),
    unique (metadata_value_id, corpus_id)
);
create index on corpora_metadata_values (corpus_id, metadata_value_id);
