package nl.knaw.huc.dexter.resources

import FormMedia
import MediaTypeChecker.Companion.getMediaType
import ResultMedia
import SupportedMediaType
import SupportedMediaTypeType
import UnauthorizedException
import io.dropwizard.auth.Auth
import nl.knaw.huc.dexter.api.ResourcePaths
import nl.knaw.huc.dexter.api.ResourcePaths.ID_PARAM
import nl.knaw.huc.dexter.api.ResourcePaths.ID_PATH
import nl.knaw.huc.dexter.api.ResourcePaths.MEDIA
import nl.knaw.huc.dexter.api.ResultTag
import nl.knaw.huc.dexter.auth.DexterUser
import nl.knaw.huc.dexter.auth.RoleNames
import nl.knaw.huc.dexter.db.DaoBlock
import nl.knaw.huc.dexter.db.MediaDao
import nl.knaw.huc.dexter.db.MediaDao.Companion.mediaNotFound
import nl.knaw.huc.dexter.helpers.PsqlDiagnosticsHelper.Companion.diagnoseViolations
import org.jdbi.v3.core.Jdbi
import org.jdbi.v3.core.transaction.TransactionIsolationLevel.REPEATABLE_READ
import org.slf4j.LoggerFactory
import toMedia
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
    fun list(
        @QueryParam("type") type: SupportedMediaTypeType?,
        @Auth user: DexterUser
    ): List<ResultMedia> {
        if(type == null) {
            return media()
                .listByUser(user.id)
        }
        val mediaTypes = SupportedMediaType.byType(type)
        return media()
            .listByUserAndTypes(user.id, mediaTypes)
    }

    @GET
    @Path(ID_PATH)
    fun getMedia(
        @PathParam(ID_PARAM) mediaId: UUID,
        @Auth user: DexterUser
    ) =
        onAccessibleMedia(mediaId, user.id) { _, m -> m }

    @POST
    @Path(ResourcePaths.AUTOCOMPLETE)
    fun getMediaLike(
        needle: String,
        @Auth user: DexterUser
    ): List<ResultMedia> =
        needle.takeIf { it.isNotEmpty() }
            ?.let { media().like("%$it%", user.id) }
            ?: throw BadRequestException("autocomplete string MUST be > 0 (but was ${needle.length}: '$needle')")

    @POST
    @Consumes(APPLICATION_JSON)
    fun createMedia(
        mediaForm: FormMedia,
        @Auth user: DexterUser
    ): ResultMedia {
        val media = mediaForm.toMedia(getMediaType(mediaForm.url))
        return jdbi.inTransaction<ResultMedia, Exception>(REPEATABLE_READ) { tx ->
            diagnoseViolations { media().insert(media, user.id) }
        }
    }

    @PUT
    @Path(ID_PATH)
    fun updateMedia(
        @PathParam(ID_PARAM) id: UUID,
        mediaForm: FormMedia,
        @Auth user: DexterUser
    ): ResultMedia {
        val media = mediaForm.toMedia(getMediaType(mediaForm.url))
        return onAccessibleMedia(id, user.id) { dao, m ->
            log.info("updateMedia: mediaId=${m.id}, formMedia=$media")
            dao.update(m.id, media)
        }
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

    private fun media() = jdbi
        .onDemand(MediaDao::class.java)

}