alter table "references"
    drop constraint references_csl_key,
    drop constraint references_terms_key,
    drop constraint references_input_key;

alter table "references"
    add unique (created_by, input)
