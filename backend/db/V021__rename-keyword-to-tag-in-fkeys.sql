-- corpora_tags:
alter table corpora_tags
    rename constraint corpora_keywords_corpus_id_key_id_key to corpora_tags_corpus_id_tag_id_key;
alter table corpora_tags
    rename constraint corpora_keywords_key_id_fkey to corpora_tags_tag_id_fkey;
alter index corpora_keywords_key_id_corpus_id_idx
    rename to corpora_tags_tag_id_corpus_id_idx;

-- source_tags:
alter table sources_tags
    rename constraint sources_keywords_source_id_key_id_key to sources_tags_source_id_tag_id_key;
alter table sources_tags
    rename constraint sources_keywords_key_id_fkey to sources_tags_tag_id_fkey;
alter table sources_tags
    rename constraint sources_tags_source_id_fkey to sources_keys_source_id_fkey;
alter index sources_keywords_key_id_source_id_idx
    rename to sources_tags_tag_id_source_id_idx;

-- tags:
alter table tags
    rename constraint keywords_pkey to tags_pkey;
alter table tags
    rename constraint keywords_val_key to tags_val_key;

