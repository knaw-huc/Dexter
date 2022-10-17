alter table corpora_languages
    drop constraint corpora_languages_corpus_id_fkey,
    add constraint corpora_languages_corpus_id_fkey
        foreign key (corpus_id)
            references corpora (id)
            on delete cascade;

alter table corpora_keywords
    drop constraint corpora_keywords_corpus_id_fkey,
    add constraint corpora_keywords_corpus_id_fkey
        foreign key (corpus_id)
        references corpora (id)
        on delete cascade;