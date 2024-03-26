alter table users add column settings text;
update users set settings = '{}';
alter table users alter column settings set not null;
