package nl.knaw.huc.dexter.resources

import FormMedia
import ResultMedia
import UnauthorizedException
import io.dropwizard.auth.Auth
import nl.knaw.huc.dexter.api.ResourcePaths.ID_PARAM
import nl.knaw.huc.dexter.api.ResourcePaths.ID_PATH
import nl.knaw.huc.dexter.api.ResourcePaths.MEDIA
import nl.knaw.huc.dexter.auth.DexterUser
import nl.knaw.huc.dexter.auth.RoleNames
import nl.knaw.huc.dexter.db.DaoBlock
import nl.knaw.huc.dexter.db.MediaDao
import nl.knaw.huc.dexter.db.UsersDao
import nl.knaw.huc.dexter.helpers.PsqlDiagnosticsHelper.Companion.diagnoseViolations
import org.jdbi.v3.core.Jdbi
import org.jdbi.v3.core.transaction.TransactionIsolationLevel.REPEATABLE_READ
import org.slf4j.LoggerFactory
import java.util.*
import javax.annotation.security.RolesAllowed
import javax.ws.rs.*
import javax.ws.rs.core.MediaType.APPLICATION_JSON
import javax.ws.rs.core.Response

@Path(MEDIA)
@RolesAllowed(RoleNames.USER)
@Produces(APPLICATION_JSON)
class MediaResource(private val jdbi: Jdbi) {
    private val log = LoggerFactory.getLogger(javaClass)

    @GET
    fun list(@Auth user: DexterUser) = media()
        .listByUser(user.id)

    @GET
    @Path(ID_PATH)
    fun getMedia(
        @PathParam(ID_PARAM) mediaId: UUID,
        @Auth user: DexterUser
    ) =
        onAccessibleMedia(mediaId, user.id) { _, m -> m }

    @POST
    @Consumes(APPLICATION_JSON)
    fun createMedia(
        media: FormMedia,
        @Auth user: DexterUser
    ): ResultMedia {
        return jdbi.inTransaction<ResultMedia, Exception>(REPEATABLE_READ) { tx ->
            val userDao = tx.attach(UsersDao::class.java)
            val createdBy = userDao.findByName(user.name) ?: throw NotFoundException("Unknown user: $user")
            diagnoseViolations { media().insert(media, createdBy.id) }
        }
    }

    @PUT
    @Path(ID_PATH)
    fun updateMedia(
        @PathParam(ID_PARAM) id: UUID,
        formMedia: FormMedia,
        @Auth user: DexterUser
    ): ResultMedia =
        onAccessibleMedia(id, user.id) { dao, m ->
            log.info("updateMedia: mediaId=${m.id}, formMedia=$formMedia")
            dao.update(m.id, formMedia)
        }

    @DELETE
    @Path(ID_PATH)
    fun deleteMedia(@PathParam(ID_PARAM) id: UUID, @Auth user: DexterUser): Response =
        onAccessibleMedia(id, user.id) { dao, m ->
            log.warn("deleteMedia[${user.name}] media=$m")
            dao.delete(m.id)
            Response.noContent().build()
        }

    private fun <R> onAccessibleMedia(
        mediaId: UUID,
        userId: UUID,
        block: DaoBlock<MediaDao, ResultMedia, R>
    ): R =
        jdbi.inTransaction<R, Exception>(REPEATABLE_READ) { handle ->
            handle.attach(MediaDao::class.java).let { dao ->
                dao.find(mediaId)?.let { media ->
                    if (media.createdBy != userId) {
                        throw UnauthorizedException()
                    }
                    diagnoseViolations { block.execute(dao, media) }
                } ?: mediaNotFound(mediaId)
            }
        }

    private fun media() = jdbi.onDemand(MediaDao::class.java)

    private fun mediaNotFound(mediaId: UUID): Nothing =
        throw NotFoundException("Media not found: $mediaId")
}