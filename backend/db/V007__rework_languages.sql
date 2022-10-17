-- create proper type for iso_639_3 id, instead of 'char(3)'
create domain iso_639_3_lang_id as char(3);
alter table iso_639_3 alter column id type iso_639_3_lang_id;

drop table if exists corpora_languages;
create table corpora_languages (
  corpus_id UUID not null references corpora (id),
  lang_id iso_639_3_lang_id not null references iso_639_3 (id),
  unique (corpus_id, lang_id)
);
create index on corpora_languages(lang_id, corpus_id);

drop table if exists sources_languages;
create table sources_languages (
    source_id UUID not null references sources (id),
    lang_id iso_639_3_lang_id not null references iso_639_3 (id),
    unique (source_id, lang_id)
);
create index on sources_languages (lang_id, source_id);

-- not used anymore, superseded by iso_6393_3
drop table if exists languages;
