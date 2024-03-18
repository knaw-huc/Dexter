alter table corpora_references
    drop constraint corpora_references_corpus_id_fkey,
    add constraint corpora_references_corpus_id_fkey foreign key (corpus_id) references corpora (id) on delete cascade;

alter table sources_references
    drop constraint sources_references_source_id_fkey,
    add constraint sources_references_source_id_fkey foreign key (source_id) references sources (id) on delete cascade;
