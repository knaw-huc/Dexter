alter table sources_keywords
    drop constraint sources_keywords_source_id_fkey,
    add constraint sources_keywords_source_id_fkey
        foreign key (source_id)
            references sources (id)
            on delete cascade;

alter table sources_languages
    drop constraint sources_languages_source_id_fkey,
    add constraint sources_languages_source_id_fkey
        foreign key (source_id)
            references sources (id)
            on delete cascade;