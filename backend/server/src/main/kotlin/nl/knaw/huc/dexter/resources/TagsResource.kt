package nl.knaw.huc.dexter.resources

import UnauthorizedException
import io.dropwizard.auth.Auth
import nl.knaw.huc.dexter.api.FormTag
import nl.knaw.huc.dexter.api.ResourcePaths
import nl.knaw.huc.dexter.api.ResourcePaths.AUTOCOMPLETE
import nl.knaw.huc.dexter.api.ResourcePaths.ID_PARAM
import nl.knaw.huc.dexter.api.ResourcePaths.ID_PATH
import nl.knaw.huc.dexter.api.ResultTag
import nl.knaw.huc.dexter.auth.DexterUser
import nl.knaw.huc.dexter.auth.RoleNames
import nl.knaw.huc.dexter.db.DaoBlock
import nl.knaw.huc.dexter.db.TagsDao
import nl.knaw.huc.dexter.helpers.PsqlDiagnosticsHelper.Companion.diagnoseViolations
import org.jdbi.v3.core.Jdbi
import org.jdbi.v3.core.transaction.TransactionIsolationLevel.REPEATABLE_READ
import org.slf4j.LoggerFactory
import java.util.*
import javax.annotation.security.RolesAllowed
import javax.ws.rs.*
import javax.ws.rs.core.MediaType.APPLICATION_JSON
import javax.ws.rs.core.Response

@Path(ResourcePaths.TAGS)
@RolesAllowed(RoleNames.USER)
@Produces(APPLICATION_JSON)
class TagsResource(private val jdbi: Jdbi) {
    private val log = LoggerFactory.getLogger(javaClass)

    @GET
    fun list(@Auth user: DexterUser) = tags().listByUser(user.id)

    @GET
    @Path(ID_PATH)
    fun getTag(
        @PathParam(ID_PARAM) tagId: Int,
        @Auth user: DexterUser
    ) = onAccessibleTag(tagId, user.id) { _, t -> t }

    @POST
    @Path(AUTOCOMPLETE)
    fun getTagLike(
        key: String,
        @Auth user: DexterUser
    ): List<ResultTag> =
        key.takeIf { it.isNotEmpty() }
            ?.let { tags().like("%$it%", user.id) }
            ?: throw BadRequestException("key length MUST be > 0 (but was ${key.length}: '$key')")

    @POST
    @Consumes(APPLICATION_JSON)
    fun createTag(
        tag: FormTag,
        @Auth user: DexterUser
    ): ResultTag =
        tag.run {
            log.info("createTag: [$this]")
            diagnoseViolations { tags().insert(this, user.id) }
        }

    @PUT
    @Path(ID_PATH)
    fun updateTag(
        @PathParam(ID_PARAM) id: Int,
        formTag: FormTag,
        @Auth user: DexterUser
    ): ResultTag =
        onAccessibleTag(id, user.id) { dao, t ->
            log.info("updateTag: tagId=${t.id}, formTag=$formTag")
            dao.update(t.id, formTag)
        }


    @DELETE
    @Path(ID_PATH)
    fun deleteTag(
        @PathParam(ID_PARAM) id: Int,
        @Auth user: DexterUser
    ): Response =
        onAccessibleTag(id, user.id) { dao, t ->
            log.warn("deleteTag[${user.name}] tag=$t")
            dao.delete(t.id)
            Response.noContent().build()
        }

    private fun <R> onAccessibleTag(
        tagId: Int,
        userId: UUID,
        block: DaoBlock<TagsDao, ResultTag, R>
    ): R =
        jdbi.inTransaction<R, Exception>(REPEATABLE_READ) { handle ->
            handle.attach(TagsDao::class.java).let { dao ->
                dao.find(tagId)?.let { tag ->
                    if (tag.createdBy != userId) {
                        throw UnauthorizedException()
                    }
                    diagnoseViolations { block.execute(dao, tag) }
                } ?: tagNotFound(tagId)
            }
        }

    private fun tags() = jdbi.onDemand(TagsDao::class.java)

    private fun tagNotFound(tagId: Int): Nothing = throw NotFoundException("Tag not found: $tagId")
}