create table corpora_keywords (
    corpus_id uuid references corpora (id),
    key_id serial references keywords (id),
    unique (corpus_id, key_id)
);
create index on corpora_keywords (key_id, corpus_id);
