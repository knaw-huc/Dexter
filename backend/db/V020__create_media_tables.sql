create table media
(
    id uuid primary key default gen_random_uuid(),
    url text not null,
    media_type text not null,
    title text not null,
    created_by uuid not null references users (id),
    constraint media_unique_url_created_by unique (url, created_by)
);

create index on media (media_type);

create table corpora_media
(
    corpus_id uuid
        references corpora(id),
    media_id uuid
        references media(id)
);

create unique index corpora_media_corpus_id_media_id_idx
    on corpora_media (corpus_id, media_id);

create table sources_media
(
    source_id uuid
        references sources(id),
    media_id uuid
        references media(id)
);

create unique index sources_media_source_id_media_id_idx
    on sources_media (source_id, media_id);
