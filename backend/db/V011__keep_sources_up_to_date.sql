-- for inserts and updates we access NEW
create function set_sources_updated_at_using_new()
    returns trigger as
$$
begin
    update sources
    set updated_at = now()
    where id = NEW.source_id;

    return NEW;
end;
$$ language plpgsql;

-- for deletes we access OLD
create function set_sources_updated_at_using_old()
    returns trigger as
$$
begin
    update sources
    set updated_at = now()
    where id = OLD.source_id;
    return OLD;
end;
$$ language plpgsql;

-- Handle keyword mutations
create trigger trigger_set_sources_updated_at_on_keyword_change
    before insert or update
    on sources_keywords
    for each row
execute procedure set_sources_updated_at_using_new();

create trigger trigger_set_sources_updated_at_on_keyword_gone
    before delete
    on sources_keywords
    for each row
execute procedure set_sources_updated_at_using_old();

-- Handle language mutations
create trigger trigger_set_sources_updated_at_on_language_change
    before insert or update
    on sources_languages
    for each row
execute procedure set_sources_updated_at_using_new();

create trigger set_sources_updated_at_on_language_gone
    before delete
    on sources_languages
    for each row
execute procedure set_sources_updated_at_using_old();