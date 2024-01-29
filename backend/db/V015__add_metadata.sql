create table metadata_keys
(
    id  uuid primary key,
    key text not null,
    created_by uuid not null references users (id)
);

create table metadata_values
(
    id  uuid primary key,
    key uuid not null references metadata_keys (id),
    value text not null
);

create table sources_metadata_values
(
    value uuid references metadata_values (id),
    source  uuid references sources (id),
    unique (value, source)
);
create index on sources_metadata_values (source, value);

create table corpora_metadata_values
(
    value uuid references metadata_values (id),
    corpus  uuid references corpora (id),
    unique (value, corpus)
);
create index on corpora_metadata_values (corpus, value);
