package nl.knaw.huc.dexter.db

import nl.knaw.huc.dexter.api.*
import org.jdbi.v3.sqlobject.kotlin.BindKotlin
import org.jdbi.v3.sqlobject.kotlin.RegisterKotlinMapper
import org.jdbi.v3.sqlobject.statement.SqlQuery
import org.jdbi.v3.sqlobject.statement.SqlUpdate
import java.util.*

interface CorporaDao {
    @SqlQuery(
        "insert into corpora " +
                "(parent_id,title,description,rights,access,location,earliest,latest,contributor,notes,created_by) " +
                "values " +
                "(:parentId,:title,:description,:rights,:access,:location,:earliest,:latest,:contributor,:notes,:createdBy) " +
                "returning *"
    )
    fun insert(@BindKotlin formCorpus: FormCorpus, createdBy: UUID): ResultCorpus

    @SqlQuery("select * from corpora where id = :id")
    fun find(id: UUID): ResultCorpus?

    @SqlQuery(
        "update corpora " +
                "set (parent_id,title,description,rights,access,location,earliest,latest,contributor,notes) " +
                "= (:parentId,:title,:description,:rights,:access,:location,:earliest,:latest,:contributor,:notes) " +
                "where id = :id " +
                "returning *"
    )
    fun update(id: UUID, @BindKotlin formCorpus: FormCorpus): ResultCorpus

    @SqlQuery("select * from corpora")
    fun list(): List<ResultCorpus>

    @SqlUpdate("delete from corpora where id = :id")
    fun delete(id: UUID)

    @SqlQuery("select k.* from corpora_keywords ck join keywords k on ck.key_id = k.id where corpus_id = :corpusId")
    @RegisterKotlinMapper(ResultKeyword::class)
    fun getKeywords(corpusId: UUID): List<ResultKeyword>

    @SqlUpdate("insert into corpora_keywords (corpus_id,key_id) values (:corpusId,:keywordId) on conflict do nothing")
    fun addKeyword(corpusId: UUID, keywordId: Int)

    @SqlUpdate("delete from corpora_keywords where corpus_id = :corpusId and key_id = :keywordId")
    fun deleteKeyword(corpusId: UUID, keywordId: Int)

    @SqlQuery("select l.* from corpora_languages cl join iso_639_3 l on cl.lang_id = l.id where corpus_id = :corpusId")
    fun getLanguages(corpusId: UUID): List<ResultLanguage>

    @SqlUpdate("insert into corpora_languages (corpus_id,lang_id) values (:corpusId,:languageId) on conflict do nothing")
    fun addLanguage(corpusId: UUID, languageId: String)

    @SqlUpdate("delete from corpora_languages where corpus_id = :corpusId and lang_id = :languageId")
    fun deleteLanguage(corpusId: UUID, languageId: String)

    @SqlQuery("select s.* from corpora_sources cs join sources s on cs.source_id = s.id where corpus_id = :corpusId")
    fun getSources(corpusId: UUID): List<ResultSource>

    @SqlUpdate("insert into corpora_sources (corpus_id,source_id) values (:corpusId, :sourceId) on conflict do nothing")
    fun addSource(corpusId: UUID, sourceId: UUID)

    @SqlUpdate("delete from corpora_sources where corpus_id = :corpusId and source_id = :sourceId")
    fun deleteSource(corpusId: UUID, sourceId: UUID)

    @SqlQuery(
        "with recursive sub as (" +
                "select id,parent_id,title from corpora where id = :corpusId " +
                "union " +
                "select c.id,c.parent_id,c.title from corpora c inner join sub s on s.parent_id = c.id) " +
                "select id,title from sub"
    )
    @RegisterKotlinMapper(IdTitle::class)
    fun reachable(corpusId: UUID): List<IdTitle>
    data class IdTitle(val id: UUID, val title: String)
}