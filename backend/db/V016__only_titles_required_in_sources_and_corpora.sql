alter table corpora
    alter column title drop not null,
    alter column description drop not null,
    alter column rights drop not null,
    alter column access drop not null
;

alter table sources
    alter column description drop not null,
    alter column rights drop not null,
    alter column access drop not null,
    alter column creator drop not null
;
