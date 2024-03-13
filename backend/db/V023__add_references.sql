create table "references"
(
    id uuid primary key default gen_random_uuid(),
    input text not null unique,
    terms text not null unique,
    formatted text not null unique,
    created_by uuid not null references users (id)
);
create index on "references"(terms);

create table sources_references
(
    reference_id uuid references "references" (id) on delete cascade,
    source_id uuid references sources (id)
);
create index on sources_references(reference_id, source_id);

create table corpora_references
(
    reference_id uuid references "references" (id) on delete cascade,
    corpus_id uuid references corpora (id)
);
create index on corpora_references(reference_id, corpus_id);
