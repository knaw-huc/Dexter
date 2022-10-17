-- for inserts and updates we access NEW
create function set_corpora_updated_at_using_new()
    returns trigger as
$$
begin
    update corpora
    set updated_at = now()
    where id = NEW.corpus_id;

    return NEW;
end;
$$ language plpgsql;

-- for deletes we access OLD
create function set_corpora_updated_at_using_old()
    returns trigger as
$$
begin
    update corpora
    set updated_at = now()
    where id = OLD.corpus_id;
    return OLD;
end;
$$ language plpgsql;

-- Handle keyword mutations
create trigger trigger_set_corpora_updated_at_on_keyword_change
    before insert or update
    on corpora_keywords
    for each row
execute procedure set_corpora_updated_at_using_new();

create trigger trigger_set_corpora_updated_at_on_keyword_gone
    before delete
    on corpora_keywords
    for each row
execute procedure set_corpora_updated_at_using_old();

-- Handle language mutations
create trigger trigger_set_corpora_updated_at_on_language_change
    before insert or update
    on corpora_languages
    for each row
execute procedure set_corpora_updated_at_using_new();

create trigger set_corpora_updated_at_on_language_gone
    before delete
    on corpora_languages
    for each row
execute procedure set_corpora_updated_at_using_old();