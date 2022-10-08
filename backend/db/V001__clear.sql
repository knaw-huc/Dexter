-- Cleanup existing database, dropping all tables and indexes

-- Note Drop in reverse order of creation to ensure constraints are dropped
-- before the tables that those constraints depend on, are removed.

drop table if exists users;
