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

create table metadata_values_sources_corpora
(
    metadata_value_id
        uuid references metadata_values (id)
        on delete cascade
        constraint one_source_or_corpus_per_value unique,
    source_id uuid references sources (id),
    corpus_id uuid references corpora (id)
);
