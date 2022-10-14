package nl.knaw.huc.dexter.db

import nl.knaw.huc.dexter.api.FormCorpus
import nl.knaw.huc.dexter.api.ResultCorpus
import nl.knaw.huc.dexter.api.ResultKeyword
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

    @SqlUpdate("insert into corpora_keywords (corpus_id,key_id) values (:corpusId,:keywordId)")
    fun addKeyword(corpusId: UUID, keywordId: Int)

    @SqlUpdate("delete from corpora_keywords where corpus_id = :corpusId and key_id = :keywordId")
    fun deleteKeyword(corpusId: UUID, keywordId: Int)
}