-- Cleanup existing database, dropping all tables and indexes

-- Note Drop in reverse order of creation to ensure constraints are dropped
-- before the tables that those constraints depend on, are removed.

drop table if exists corpora cascade;
drop table if exists sources cascade;
drop table if exists users cascade;
drop function if exists trigger_set_updated_at cascade;
drop type if exists access_type cascade;
