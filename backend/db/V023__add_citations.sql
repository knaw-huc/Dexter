create table citations
(
    id uuid primary key default gen_random_uuid(),
    input text not null unique,
    terms text not null unique,
    created_by uuid not null references users (id)
);
create index on citations(terms);

create table citations_sources
(
    citations_id uuid references metadata_values (id) on delete cascade,
    source_id uuid references sources (id)
);
create index on citations_sources(citations_id, source_id);

create table citations_corpora
(
    citations_id uuid references metadata_values (id) on delete cascade,
    corpora_id uuid references corpora (id)
);
create index on citations_corpora(citations_id, corpora_id);
