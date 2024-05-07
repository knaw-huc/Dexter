package nl.knaw.huc.dexter.db

import Media
import ResultMedia
import SupportedMediaType
import org.jdbi.v3.sqlobject.customizer.BindList
import org.jdbi.v3.sqlobject.kotlin.BindKotlin
import org.jdbi.v3.sqlobject.statement.SqlQuery
import org.jdbi.v3.sqlobject.statement.SqlUpdate
import java.util.*
import javax.ws.rs.BadRequestException
import javax.ws.rs.NotFoundException

interface MediaDao {
    @SqlQuery("select * from media where created_by = :userId")
    fun listByUser(userId: UUID): List<ResultMedia>

    @SqlQuery("select * from media where created_by = :userId and media_type in (<mediaTypes>)")
    fun listByUserAndTypes(
        userId: UUID,
        @BindList("mediaTypes") mediaTypes: List<SupportedMediaType>
    ): List<ResultMedia>


    @SqlQuery("select * from media where id = :id")
    fun find(id: UUID): ResultMedia?

    @SqlQuery("insert into media (title, url, media_type, created_by) values (:title, :url, :mediaType, :createdBy) returning *")
    fun insert(
        @BindKotlin metadataValue: Media,
        createdBy: UUID
    ): ResultMedia

    @SqlQuery(
        "update media set " +
                "title = :title, " +
                "url = :url, " +
                "media_type = :mediaType " +
                "where id = :id returning *"
    )
    fun update(id: UUID, @BindKotlin media: Media): ResultMedia

    @SqlQuery("select * " +
            "from media " +
            "where created_by = :userId " +
            "and (" +
            "  lower(url) like lower(:needle) " +
            "  or " +
            "  lower(title) like lower(:needle)" +
            ") limit 10")
    fun like(needle: String, userId: UUID): List<ResultMedia>

    /**
     * Cascaded delete also deletes link table entries
     */
    @SqlUpdate("delete from media where id = :id")
    fun delete(id: UUID)

    companion object {

        fun mediaNotFound(mediaId: UUID): Nothing =
            throw NotFoundException("Media not found: $mediaId")

        fun mediaTypeNotSupported(found: String): Nothing =
            throw BadRequestException(
                "Media type found: $found, but should be one of: ${
                    SupportedMediaType
                        .values()
                        .map { it -> it.mediaType }
                        .joinToString(", ")
                }"
            )
    }

}