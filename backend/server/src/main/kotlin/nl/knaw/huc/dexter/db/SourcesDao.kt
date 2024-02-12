package nl.knaw.huc.dexter.db

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
                "(external_ref,title,description,rights,access,creator,location,earliest,latest,notes,created_by) " +
                "values " +
                "(:externalRef,:title,:description,:rights,:access,:creator,:location,:earliest,:latest,:notes,:createdBy) " +
                "returning *"
    )
    @RegisterKotlinMapper(User::class)
    fun insert(@BindKotlin formSource: FormSource, createdBy: UUID): ResultSource


    @SqlQuery("select * from sources where id = :id")
    fun find(id: UUID): ResultSource?

    @SqlQuery("select * from sources where id = :id and created_by = :createdBy")
    fun findByUser(id: UUID, createdBy: UUID): ResultSource??

    @SqlQuery(
        "update sources " +
                "set (external_ref,title,description,rights,access,creator,location,earliest,latest,notes) " +
                "= (:externalRef,:title,:description,:rights,:access,:creator,:location,:earliest,:latest,:notes) " +
                "where id = :id " +
                "returning *"
    )
    fun update(id: UUID, @BindKotlin formSource: FormSource): ResultSource

    @SqlQuery("select * from sources where created_by = :userId")
    fun listByUser(userId: UUID): List<ResultSource>

    @SqlUpdate("delete from sources where id = :id")
    fun delete(id: UUID)

    @SqlQuery("select k.* from sources_tags sk join tags k on sk.key_id = k.id where source_id = :sourceId")
    @RegisterKotlinMapper(ResultTag::class)
    fun getTags(sourceId: UUID): List<ResultTag>

    @SqlUpdate("insert into sources_tags (source_id,key_id) values (:sourceId,:tagId) on conflict do nothing")
    fun addTag(sourceId: UUID, tagId: Int)

    @SqlUpdate("delete from sources_tags where source_id = :sourceId and key_id = :tagId")
    fun deleteTag(sourceId: UUID, tagId: Int)

    @SqlQuery("select l.* from sources_languages sl join iso_639_3 l on sl.lang_id = l.id where source_id = :sourceId")
    fun getLanguages(sourceId: UUID): List<ResultLanguage>

    @SqlUpdate("insert into sources_languages (source_id,lang_id) values (:sourceId,:languageId) on conflict do nothing")
    fun addLanguage(sourceId: UUID, languageId: String)

    @SqlUpdate("delete from sources_languages where source_id = :sourceId and lang_id = :languageId")
    fun deleteLanguage(sourceId: UUID, languageId: String)

    @SqlQuery("select mv.id as id, mv.key_id, mv.value, mv.created_by " +
            "from metadata_values as mv " +
            "join metadata_values_sources_corpora smv on mv.id = smv.metadata_value_id " +
            "where smv.source_id=:sourceId")
    fun getMetadataValues(sourceId: UUID): List<ResultMetadataValue>

    @SqlUpdate("insert into metadata_values_sources_corpora (source_id, metadata_value_id) values (:sourceId, :valueId) on conflict do nothing")
    fun addMetadataValue(sourceId: UUID, valueId: UUID)

    companion object {
        fun sourceNotFound(sourceId: UUID): Nothing = throw NotFoundException("Source not found: $sourceId")
    }

}