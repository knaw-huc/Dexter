alter table corpora_languages
    drop constraint corpora_languages_corpus_id_fkey,
    add constraint corpora_languages_corpus_id_fkey foreign key (corpus_id) references corpora (id) on delete cascade;

alter table corpora_languages
    drop constraint corpora_languages_lang_id_fkey,
    add constraint corpora_languages_lang_id_fkey foreign key (lang_id) references iso_639_3 (id) on delete cascade;

alter table corpora_media
    drop constraint corpora_media_corpus_id_fkey,
    add constraint corpora_media_corpus_id_fkey foreign key (corpus_id) references corpora (id) on delete cascade;

alter table corpora_media
    drop constraint corpora_media_media_id_fkey,
    add constraint corpora_media_media_id_fkey foreign key (media_id) references media (id) on delete cascade;

alter table corpora_sources
    drop constraint corpora_sources_corpus_id_fkey,
    add constraint corpora_sources_corpus_id_fkey foreign key (corpus_id) references corpora (id) on delete cascade;

alter table corpora_sources
    drop constraint corpora_sources_source_id_fkey,
    add constraint corpora_sources_source_id_fkey foreign key (source_id) references sources (id) on delete cascade;

alter table corpora_tags
    drop constraint corpora_tags_corpus_id_fkey,
    add constraint corpora_tags_corpus_id_fkey foreign key (corpus_id) references corpora (id) on delete cascade;

alter table corpora_tags
    drop constraint corpora_tags_tag_id_fkey,
    add constraint corpora_tags_tag_id_fkey foreign key (tag_id) references tags (id) on delete cascade;

alter table sources_languages
    drop constraint sources_languages_lang_id_fkey,
    add constraint sources_languages_lang_id_fkey foreign key (lang_id) references iso_639_3 (id) on delete cascade;

alter table sources_languages
    drop constraint sources_languages_source_id_fkey,
    add constraint sources_languages_source_id_fkey foreign key (source_id) references sources (id) on delete cascade;

alter table sources_media
    drop constraint sources_media_media_id_fkey,
    add constraint sources_media_media_id_fkey foreign key (media_id) references media (id) on delete cascade;

alter table sources_media
    drop constraint sources_media_source_id_fkey,
    add constraint sources_media_source_id_fkey foreign key (source_id) references sources (id) on delete cascade;

alter table sources_tags
    drop constraint sources_tags_source_id_fkey,
    add constraint sources_tags_source_id_fkey foreign key (source_id) references sources (id) on delete cascade;

alter table sources_tags
    drop constraint sources_tags_tag_id_fkey,
    add constraint sources_tags_tag_id_fkey foreign key (tag_id) references tags (id) on delete cascade;
