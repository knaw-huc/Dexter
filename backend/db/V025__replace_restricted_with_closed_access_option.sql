update sources set access = 'Closed' where access = 'Restricted';
update corpora set access = 'Closed' where access = 'Restricted';
alter type access_type rename to acces_type_to_drop;
create type access_type as enum('Open', 'Closed');
alter table sources alter column access type access_type using access::text::access_type;
alter table corpora alter column access type access_type using access::text::access_type;
drop type acces_type_to_drop;