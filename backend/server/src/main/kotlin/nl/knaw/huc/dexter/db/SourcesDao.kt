package nl.knaw.huc.dexter.db

import nl.knaw.huc.dexter.api.FormSource
import nl.knaw.huc.dexter.api.ResultKeyword
import nl.knaw.huc.dexter.api.ResultSource
import nl.knaw.huc.dexter.api.User
import org.jdbi.v3.sqlobject.kotlin.BindKotlin
import org.jdbi.v3.sqlobject.kotlin.RegisterKotlinMapper
import org.jdbi.v3.sqlobject.statement.SqlQuery
import org.jdbi.v3.sqlobject.statement.SqlUpdate
import java.util.*

interface SourcesDao {
    // Postgres sets uuid, created_at, updated_at
    @SqlQuery(
        "insert into sources " +
                "(external_ref,title,description,rights,access,location,earliest,latest,notes,created_by) " +
                "values " +
                "(:externalRef,:title,:description,:rights,:access,:location,:earliest,:latest,:notes,:createdBy) " +
                "returning *"
    )
    @RegisterKotlinMapper(User::class)
    fun insert(@BindKotlin formSource: FormSource, createdBy: UUID): ResultSource


    @SqlQuery("select * from sources where id = :id")
    fun find(id: UUID): ResultSource?

    @SqlQuery(
        "update sources " +
                "set (external_ref,title,description,rights,access,location,earliest,latest,notes) " +
                "= (:externalRef,:title,:description,:rights,:access,:location,:earliest,:latest,:notes) " +
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

    @SqlQuery("select lang_id from sources_languages where source_id = :sourceId")
    fun getLanguages(sourceId: UUID): List<String>

    @SqlUpdate("insert into sources_languages (source_id,lang_id) values (:sourceId,:languageId) on conflict do nothing")
    fun addLanguage(sourceId: UUID, languageId: String)

    @SqlUpdate("delete from sources_languages where source_id = :sourceId and lang_id = :languageId")
    fun deleteLanguage(sourceId: UUID, languageId: String)
}