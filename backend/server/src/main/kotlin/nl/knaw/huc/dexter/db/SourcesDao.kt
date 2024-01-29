package nl.knaw.huc.dexter.db

import ResultMetadataKeyValue
import nl.knaw.huc.dexter.api.*
import org.jdbi.v3.sqlobject.kotlin.BindKotlin
import org.jdbi.v3.sqlobject.kotlin.RegisterKotlinMapper
import org.jdbi.v3.sqlobject.statement.SqlQuery
import org.jdbi.v3.sqlobject.statement.SqlUpdate
import java.util.*

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

    @SqlQuery(
        "update sources " +
                "set (external_ref,title,description,rights,access,creator,location,earliest,latest,notes) " +
                "= (:externalRef,:title,:description,:rights,:access,:creator,:location,:earliest,:latest,:notes) " +
                "where id = :id " +
                "returning *"
    )
    fun update(id: UUID, @BindKotlin formSource: FormSource): ResultSource

    @SqlQuery("select * from sources")
    fun list(): List<ResultSource>

    @SqlUpdate("delete from sources where id = :id")
    fun delete(id: UUID)

    @SqlQuery("select k.* from sources_keywords sk join keywords k on sk.key_id = k.id where source_id = :sourceId")
    @RegisterKotlinMapper(ResultKeyword::class)
    fun getKeywords(sourceId: UUID): List<ResultKeyword>

    @SqlUpdate("insert into sources_keywords (source_id,key_id) values (:sourceId,:keywordId) on conflict do nothing")
    fun addKeyword(sourceId: UUID, keywordId: Int)

    @SqlUpdate("delete from sources_keywords where source_id = :sourceId and key_id = :keywordId")
    fun deleteKeyword(sourceId: UUID, keywordId: Int)

    @SqlQuery("select l.* from sources_languages sl join iso_639_3 l on sl.lang_id = l.id where source_id = :sourceId")
    fun getLanguages(sourceId: UUID): List<ResultLanguage>

    @SqlUpdate("insert into sources_languages (source_id,lang_id) values (:sourceId,:languageId) on conflict do nothing")
    fun addLanguage(sourceId: UUID, languageId: String)

    @SqlUpdate("delete from sources_languages where source_id = :sourceId and lang_id = :languageId")
    fun deleteLanguage(sourceId: UUID, languageId: String)

    @SqlQuery("select mk.key as key, mv.value as value, mv.key_id as key_id, mv.id as value_id " +
            "from metadata_values as mv " +
            "join metadata_keys mk on mk.id = mv.key_id " +
            "join sources_metadata_values smv on mv.id = smv.metadata_value_id " +
            "where smv.source_id=:sourceId")
    fun getMetadata(sourceId: UUID): List<ResultMetadataKeyValue>

    @SqlUpdate("insert into sources_metadata_values (source_id, metadata_value_id) values (:sourceId, :valueId) on conflict do nothing")
    fun addMetadataValue(sourceId: UUID, valueId: UUID)

    @SqlUpdate("delete from sources_metadata_values where source_id = :sourceId and metadata_value_id = :valueId")
    fun deleteMetadataValue(sourceId: UUID, valueId: UUID)
}