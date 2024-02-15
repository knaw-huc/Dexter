truncate tags cascade;

alter table tags
    add column created_by uuid not null
        references users (id);
