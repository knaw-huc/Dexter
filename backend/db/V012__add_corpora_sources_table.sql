create table corpora_sources (
    corpus_id UUID references corpora (id),
    source_id UUID references sources (id)
);
create unique index on corpora_sources (corpus_id, source_id);
create unique index on corpora_sources (source_id, corpus_id);