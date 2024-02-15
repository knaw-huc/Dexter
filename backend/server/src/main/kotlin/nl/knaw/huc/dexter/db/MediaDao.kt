package nl.knaw.huc.dexter.db

import FormMedia
import ResultMedia
import org.jdbi.v3.sqlobject.kotlin.BindKotlin
import org.jdbi.v3.sqlobject.statement.SqlQuery
import org.jdbi.v3.sqlobject.statement.SqlUpdate
import java.util.*

interface MediaDao {
    @SqlQuery("select * from media where created_by = :userId")
    fun listByUser(userId: UUID): List<ResultMedia>

    @SqlQuery("select * from media where id = :id")
    fun find(id: UUID): ResultMedia?

    @SqlQuery("insert into media (title, url, media_type, source_id, created_by) values (:title, :url, :mediaType, :sourceId, :createdBy) returning *")
    fun insert(
        @BindKotlin metadataValue: FormMedia,
        createdBy: UUID
    ): ResultMedia

    @SqlQuery("update media set " +
            "title = :title, " +
            "url = :url, " +
            "media_type = :mediaType, " +
            "source_id = :sourceId, " +
            "created_by = :createdBy " +
            "where id = :id returning *")
    fun update(id: UUID, @BindKotlin metadataValue: FormMedia): ResultMedia

    /**
     * Cascaded delete also deletes link table entries
     */
    @SqlUpdate("delete from media where id = :id")
    fun delete(id: UUID)

}