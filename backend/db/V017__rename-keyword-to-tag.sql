-- rename triggers:
alter trigger trigger_set_corpora_updated_at_on_keyword_change on corpora_keywords
    rename to trigger_set_corpora_updated_at_on_tag_change;
alter trigger trigger_set_corpora_updated_at_on_keyword_gone on corpora_keywords
    rename to trigger_set_corpora_updated_at_on_tag_gone;
alter trigger trigger_set_sources_updated_at_on_keyword_change on sources_keywords
    rename to trigger_set_sources_updated_at_on_tag_change;
alter trigger trigger_set_sources_updated_at_on_keyword_gone on sources_keywords
    rename to trigger_set_sources_updated_at_on_tag_gone;

-- rename constraints:
alter table corpora_keywords
    rename constraint corpora_keywords_corpus_id_fkey to corpora_tags_corpus_id_fkey;
alter table sources_keywords
    rename constraint sources_keywords_source_id_fkey to sources_tags_source_id_fkey;

-- rename foreign keys:
alter table sources_keywords
    rename column key_id to tag_id;
alter table corpora_keywords
    rename column key_id to tag_id;

-- rename tables:
alter table keywords
    rename to tags;
alter table sources_keywords
    rename to sources_tags;
alter table corpora_keywords
    rename to corpora_tags;
