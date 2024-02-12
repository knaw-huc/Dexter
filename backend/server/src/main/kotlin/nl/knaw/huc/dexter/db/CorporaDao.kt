package nl.knaw.huc.dexter.db

import ResultMetadataValue
import nl.knaw.huc.dexter.api.*
import org.jdbi.v3.sqlobject.customizer.BindList
import org.jdbi.v3.sqlobject.kotlin.BindKotlin
import org.jdbi.v3.sqlobject.kotlin.RegisterKotlinMapper
import org.jdbi.v3.sqlobject.statement.SqlQuery
import org.jdbi.v3.sqlobject.statement.SqlUpdate
import java.util.*
import javax.ws.rs.NotFoundException

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

    @SqlQuery("select * from corpora where id = :id and created_by = :createdBy")
    fun findByUser(id: UUID, createdBy: UUID): ResultCorpus?

    @SqlQuery(
        "update corpora " +
                "set (parent_id,title,description,rights,access,location,earliest,latest,contributor,notes) " +
                "= (:parentId,:title,:description,:rights,:access,:location,:earliest,:latest,:contributor,:notes) " +
                "where id = :id " +
                "returning *"
    )
    fun update(id: UUID, @BindKotlin formCorpus: FormCorpus): ResultCorpus

    @SqlQuery("select * from corpora where created_by = :createdBy")
    fun listByUser(createdBy: UUID): List<ResultCorpus>

    @SqlUpdate("delete from corpora where id = :id")
    fun delete(id: UUID)

    @SqlQuery("select k.* from corpora_tags ck join tags k on ck.tag_id = k.id where corpus_id = :corpusId")
    @RegisterKotlinMapper(ResultTag::class)
    fun getTags(corpusId: UUID): List<ResultTag>

    @SqlUpdate("insert into corpora_tags (corpus_id,tag_id) values (:corpusId,:tagId) on conflict do nothing")
    fun addTag(corpusId: UUID, tagId: Int)

    @SqlUpdate("delete from corpora_tags where corpus_id = :corpusId and tag_id = :tagId")
    fun deleteTag(corpusId: UUID, tagId: Int)

    @SqlQuery("select l.* from corpora_languages cl join iso_639_3 l on cl.lang_id = l.id where corpus_id = :corpusId")
    fun getLanguages(corpusId: UUID): List<ResultLanguage>

    @SqlUpdate("insert into corpora_languages (corpus_id,lang_id) values (:corpusId,:languageId) on conflict do nothing")
    fun addLanguage(corpusId: UUID, languageId: String)

    @SqlUpdate("delete from corpora_languages where corpus_id = :corpusId and lang_id = :languageId")
    fun deleteLanguage(corpusId: UUID, languageId: String)

    @SqlQuery("select s.* from corpora_sources cs join sources s on cs.source_id = s.id where corpus_id = :corpusId")
    fun getSources(corpusId: UUID): List<ResultSource>

    @SqlQuery(
        "select distinct on (s.id) s.* " +
                "from corpora_sources cs " +
                "  join sources s on cs.source_id = s.id " +
                "  join sources_tags sk on s.id = sk.source_id " +
                "where corpus_id = :corpusId " +
                "and sk.tag_id in (<tags>)"
    )
    fun getSourcesByTags(
        corpusId: UUID,
        @BindList("tags") tags: List<Int>
    ): List<ResultSource>

    @SqlUpdate("insert into corpora_sources (corpus_id,source_id) values (:corpusId, :sourceId) on conflict do nothing")
    fun addSource(corpusId: UUID, sourceId: UUID)

    @SqlUpdate("delete from corpora_sources where corpus_id = :corpusId and source_id = :sourceId")
    fun deleteSource(corpusId: UUID, sourceId: UUID)

    @SqlQuery("select mv.id as id, mv.key_id, mv.value, mv.created_by " +
            "from metadata_values as mv " +
            "join metadata_values_sources_corpora cmv on mv.id = cmv.metadata_value_id " +
            "where cmv.corpus_id=:corpusId")
    fun getMetadataValues(corpusId: UUID): List<ResultMetadataValue>

    @SqlUpdate("insert into metadata_values_sources_corpora (corpus_id, metadata_value_id) values (:corpusId, :valueId) on conflict do nothing")
    fun addMetadataValue(corpusId: UUID, valueId: UUID)

    companion object {
        fun corpusNotFound(corpusId: UUID): Nothing = throw NotFoundException("Corpus not found: $corpusId")
    }

}