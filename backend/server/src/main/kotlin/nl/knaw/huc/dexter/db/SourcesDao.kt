package nl.knaw.huc.dexter.db

import ResultMedia
import ResultMetadataValue
import nl.knaw.huc.dexter.api.*
import org.jdbi.v3.sqlobject.kotlin.BindKotlin
import org.jdbi.v3.sqlobject.kotlin.RegisterKotlinMapper
import org.jdbi.v3.sqlobject.statement.SqlQuery
import org.jdbi.v3.sqlobject.statement.SqlUpdate
import java.util.*
import javax.ws.rs.NotFoundException

interface SourcesDao {
    // Postgres sets uuid, created_at, updated_at
    @SqlQuery(
        "insert into sources " +
                "(external_ref,external_id,title,description,rights,access,creator,location,earliest,latest,notes,created_by,ethics) " +
                "values " +
                "(:externalRef,:externalId,:title,:description,:rights,:access,:creator,:location,:earliest,:latest,:notes,:createdBy,:ethics) " +
                "returning *"
    )
    @RegisterKotlinMapper(User::class)
    fun insert(@BindKotlin formSource: FormSource, createdBy: UUID): ResultSource


    @SqlQuery("select * from sources where id = :id")
    fun find(id: UUID): ResultSource?

    @SqlQuery("select * from sources where id = :id and created_by = :createdBy")
    fun findByUser(id: UUID, createdBy: UUID): ResultSource?

    @SqlQuery("select * from sources where created_by = :createdBy")
    fun findAllByUser(createdBy: UUID): List<ResultSource>

    @SqlQuery(
        "update sources " +
                "set (external_ref,external_id,title,description,rights,access,creator,location,earliest,latest,notes,ethics) " +
                "= (:externalRef,:externalId,:title,:description,:rights,:access,:creator,:location,:earliest,:latest,:notes,:ethics) " +
                "where id = :id " +
                "returning *"
    )
    fun update(id: UUID, @BindKotlin formSource: FormSource): ResultSource

    @SqlQuery("select * from sources where created_by = :userId")
    fun listByUser(userId: UUID): List<ResultSource>

    @SqlUpdate("delete from sources where id = :id")
    fun delete(id: UUID)

    @SqlQuery("select k.* from sources_tags sk join tags k on sk.tag_id = k.id where source_id = :sourceId")
    @RegisterKotlinMapper(ResultTag::class)
    fun getTags(sourceId: UUID): List<ResultTag>

    @SqlQuery("select tag_id from sources_tags where source_id = :sourceId")
    fun getTagIds(sourceId: UUID): List<Int>

    @SqlUpdate("insert into sources_tags (source_id,tag_id) values (:sourceId,:tagId) on conflict do nothing")
    fun addTag(sourceId: UUID, tagId: Int)

    @SqlUpdate("delete from sources_tags where source_id = :sourceId and tag_id = :tagId")
    fun deleteTag(sourceId: UUID, tagId: Int)


    @SqlQuery("select r.* from sources_references sc join \"references\" r on sc.reference_id = r.id where source_id = :sourceId")
    @RegisterKotlinMapper(ResultReference::class)
    fun getReferences(sourceId: UUID): List<ResultReference>

    @SqlQuery("select reference_id from sources_references where source_id = :sourceId")
    fun getReferenceIds(sourceId: UUID): List<UUID>

    @SqlUpdate("insert into sources_references (source_id,reference_id) values (:sourceId,:referenceId) on conflict do nothing")
    fun addReference(sourceId: UUID, referenceId: UUID)

    @SqlUpdate("delete from sources_references where source_id = :sourceId and reference_id = :referenceId")
    fun deleteReference(sourceId: UUID, referenceId: UUID)

    @SqlQuery("select l.* from sources_languages sl join iso_639_3 l on sl.lang_id = l.id where source_id = :sourceId")
    fun getLanguages(sourceId: UUID): List<ResultLanguage>

    @SqlQuery("select lang_id from sources_languages where source_id = :sourceId")
    fun getLanguageIds(sourceId: UUID): List<String>

    @SqlUpdate("insert into sources_languages (source_id,lang_id) values (:sourceId,:languageId) on conflict do nothing")
    fun addLanguage(sourceId: UUID, languageId: String)

    @SqlUpdate("delete from sources_languages where source_id = :sourceId and lang_id = :languageId")
    fun deleteLanguage(sourceId: UUID, languageId: String)

    @SqlQuery("select mv.id as id, mv.key_id, mv.value, mv.created_by " +
            "from metadata_values as mv " +
            "join metadata_values_sources_corpora smv on mv.id = smv.metadata_value_id " +
            "where smv.source_id=:sourceId")
    fun getMetadataValues(sourceId: UUID): List<ResultMetadataValue>

    @SqlQuery("select metadata_value_id from metadata_values_sources_corpora mvsc where mvsc.source_id=:sourceId")
    fun getMetadataValueIds(sourceId: UUID): List<UUID>

    @SqlUpdate("insert into metadata_values_sources_corpora (source_id, metadata_value_id) values (:sourceId, :valueId) on conflict do nothing")
    fun addMetadataValue(sourceId: UUID, valueId: UUID)

    @SqlQuery("select * from media m " +
            "join sources_media sm on m.id = sm.media_id " +
            "where source_id = :sourceId")
    @RegisterKotlinMapper(ResultMedia::class)
    fun getMedia(sourceId: UUID): List<ResultMedia>

    @SqlQuery("select media_id from sources_media where source_id = :sourceId")
    fun getMediaIds(sourceId: UUID): List<UUID>

    @SqlUpdate("insert into sources_media (source_id, media_id) values (:sourceId,:mediaId) on conflict do nothing")
    fun addMedia(sourceId: UUID, mediaId: UUID)

    @SqlUpdate("delete from sources_media where source_id = :sourceId and media_id = :mediaId")
    fun deleteMedia(sourceId: UUID, mediaId: UUID)

    @SqlQuery("select * from corpora c " +
            "join corpora_sources cs on c.id = cs.corpus_id " +
            "where cs.source_id = :sourceId")
    @RegisterKotlinMapper(ResultCorpus::class)
    fun getCorpora(sourceId: UUID): List<ResultCorpus>

    @SqlQuery("select corpus_id from corpora_sources where source_id = :sourceId")
    fun getCorpusIds(sourceId: UUID): List<UUID>

    companion object {
        fun sourceNotFound(sourceId: UUID): Nothing = throw NotFoundException("Source not found: $sourceId")
    }

}