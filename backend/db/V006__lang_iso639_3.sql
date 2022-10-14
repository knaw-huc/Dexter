create table iso_639_3 (
    id char(3) primary key,
    part_2b char(3),
    part_2t char(3),
    part_1 char(2),
    scope char(1) not null,
    type char(1) not null,
    ref_name varchar(150) not null,
    comment varchar(150)
);
create index on iso_639_3 (part_2b);
create index on iso_639_3 (part_2t);
create index on iso_639_3 (part_1);