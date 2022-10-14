package nl.knaw.huc.dexter.db

import nl.knaw.huc.dexter.api.ResultLanguage
import org.jdbi.v3.sqlobject.statement.SqlQuery

interface LanguagesDao {
    /*
     To fill, use something like:
       copy iso_639_3 from '/data/lang.tab' delimiter e'\t' csv header;
     where lang.tab comes from:
       https://iso639-3.sil.org/sites/iso639-3/files/downloads/iso-639-3.tab
     */
    @SqlQuery("select * from iso_639_3")
    fun list(): List<ResultLanguage>

    @SqlQuery("select * from iso_639_3 where lower(ref_name) = lower(:key)")
    fun findByLength1 (key: String): List<ResultLanguage>

    @SqlQuery("select * from iso_639_3 where lower(part_1) = lower(:key) or lower(ref_name) = lower(:key)")
    fun findByLength2(key: String): List<ResultLanguage>

    @SqlQuery("select * from iso_639_3 where " +
            "lower(id) = lower(:key) " +
            "or lower(part_2b) = lower(:key) " +
            "or lower(part_2t) = lower(:key) " +
            "or lower(ref_name) = lower(:key)")
    fun findByLength3(key: String): List<ResultLanguage>

    @SqlQuery("select * from iso_639_3 where lower(ref_name) like lower(:refName)")
    fun findByRefName(refName: String): List<ResultLanguage>
}