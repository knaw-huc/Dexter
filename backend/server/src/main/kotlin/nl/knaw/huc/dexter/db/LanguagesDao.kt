package nl.knaw.huc.dexter.db

import nl.knaw.huc.dexter.api.ResultLanguage
import org.jdbi.v3.sqlobject.kotlin.BindKotlin
import org.jdbi.v3.sqlobject.statement.SqlBatch
import org.jdbi.v3.sqlobject.statement.SqlQuery

interface LanguagesDao {
    /*
     To fill, use something like:
       copy iso_639_3 from '/data/lang.tab' delimiter e'\t' csv header;
     where lang.tab comes from:
       https://iso639-3.sil.org/sites/iso639-3/files/downloads/iso-639-3.tab
     */

    @SqlQuery("select count(*) from iso_639_3")
    fun count(): Long

    @SqlQuery("select * from iso_639_3")
    fun list(): List<ResultLanguage>

    @SqlQuery("select * from iso_639_3 where id = :id")
    fun findById(id: String): ResultLanguage?

    @SqlQuery("select * from iso_639_3 where lower(ref_name) = lower(:key) limit 10")
    fun findByLength1(key: String): List<ResultLanguage>

    @SqlQuery("select * from iso_639_3 where lower(part_1) = lower(:key) or lower(ref_name) = lower(:key) limit 10")
    fun findByLength2(key: String): List<ResultLanguage>

    @SqlQuery(
        "select * from iso_639_3 where " +
                "lower(id) = lower(:key) " +
                "or lower(part_2b) = lower(:key) " +
                "or lower(part_2t) = lower(:key) " +
                "or lower(ref_name) = lower(:key) " +
                "limit 10"
    )
    fun findByLength3(key: String): List<ResultLanguage>

    @SqlQuery("select * from iso_639_3 where lower(ref_name) like lower(:refName) limit 10")
    fun findByRefName(refName: String): List<ResultLanguage>

    @SqlBatch(
        "insert into iso_639_3 (id,part_2b,part_2t,part_1,scope,type,ref_name,comment) " +
                "values (:l.id,:l.part2b,:l.part2t,:l.part1,:l.scope,:l.type,:l.refName,:l.comment) " +
                "on conflict do nothing"
    )
    fun seed(@BindKotlin("l") languages: Iterable<ResultLanguage>)
}