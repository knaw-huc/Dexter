package nl.knaw.huc.dexter.resources

import io.dropwizard.auth.Auth
import nl.knaw.huc.dexter.api.FormSource
import nl.knaw.huc.dexter.api.ResourcePaths
import nl.knaw.huc.dexter.api.ResourcePaths.ID_PARAM
import nl.knaw.huc.dexter.api.ResourcePaths.ID_PATH
import nl.knaw.huc.dexter.api.ResourcePaths.KEYWORDS
import nl.knaw.huc.dexter.api.ResultKeyword
import nl.knaw.huc.dexter.api.ResultSource
import nl.knaw.huc.dexter.auth.DexterUser
import nl.knaw.huc.dexter.db.SourcesDao
import nl.knaw.huc.dexter.db.UsersDao
import nl.knaw.huc.dexter.helpers.PsqlDiagnosticsHelper.Companion.diagnoseViolations
import org.jdbi.v3.core.Jdbi
import org.slf4j.LoggerFactory
import java.util.*
import javax.ws.rs.*
import javax.ws.rs.core.MediaType.APPLICATION_JSON
import javax.ws.rs.core.Response

@Path(ResourcePaths.SOURCES)
@Produces(APPLICATION_JSON)
class SourcesResource(private val jdbi: Jdbi) {
    private val log = LoggerFactory.getLogger(javaClass)

    @GET
    fun getSourceList() = sources().list()

    @GET
    @Path(ID_PATH)
    fun getSource(@PathParam(ID_PARAM) sourceId: UUID) =
        sources().find(sourceId) ?: sourceNotFound(sourceId)

    @POST
    @Consumes(APPLICATION_JSON)
    fun createSource(formSource: FormSource, @Auth user: DexterUser): ResultSource {
        log.info("createSource[${user.name}]: formSource=[$formSource]")
        val createdBy = users().findByName(user.name) ?: throw NotFoundException("Unknown user: $user")
        return diagnoseViolations { sources().insert(formSource, createdBy.id) }
    }

    @PUT
    @Consumes(APPLICATION_JSON)
    @Path(ID_PATH)
    fun updateSource(
        @PathParam(ID_PARAM) sourceId: UUID,
        formSource: FormSource,
        @Auth user: DexterUser
    ): ResultSource {
        log.info("updateSource[${user.name}: sourceId=[$sourceId], formSource=[$formSource]")
        sources().find(sourceId)?.let {
            // TODO: could check for changes and not do anything if already equals here
            // TODO: or ... upsert instead?
            return diagnoseViolations { sources().update(sourceId, formSource) }
        }
        sourceNotFound(sourceId)
    }

    @DELETE
    @Path(ID_PATH)
    fun deleteSource(@PathParam(ID_PARAM) sourceId: UUID, @Auth user: DexterUser): Response {
        log.info("deleteSource[${user.name}]: sourceId=$sourceId")
        sources().find(sourceId)?.let {
            log.warn("$user deleting: $it")
            diagnoseViolations { sources().delete(sourceId) }
            return Response.noContent().build()
        } ?: sourceNotFound(sourceId)
    }

    @GET
    @Path("$ID_PATH/$KEYWORDS/v1")
    fun getKeywordsV1(@PathParam(ID_PARAM) sourceId: UUID) =
        sources().find(sourceId)?.let {
            sources().getKeywords(sourceId)
        } ?: sourceNotFound(sourceId)

    @GET
    @Path("$ID_PATH/$KEYWORDS/v2a")
    fun getKeywordsV2a(@PathParam(ID_PARAM) sourceId: UUID) =
        sources().find(sourceId)?.let {
            sources().getKeywords(sourceId).map { it.id }
        } ?: sourceNotFound(sourceId)

    @GET
    @Path("$ID_PATH/$KEYWORDS/v2b")
    fun getKeywordsV2b(@PathParam(ID_PARAM) sourceId: UUID) =
        sources().find(sourceId)?.let {
            sources().getKeywords(sourceId).map { it.`val` }
        } ?: sourceNotFound(sourceId)

    @GET
    @Path("$ID_PATH/$KEYWORDS/v2c")
    fun getKeywordsV2c(@PathParam(ID_PARAM) sourceId: UUID) =
        sources().find(sourceId)?.let {
            sources().getKeywords(sourceId).map { mapOf(it.id to it.`val`) }
        } ?: sourceNotFound(sourceId)

    @GET
    @Path("$ID_PATH/$KEYWORDS/v2d")
    fun getKeywordsV2d(@PathParam(ID_PARAM) sourceId: UUID) =
        sources().find(sourceId)?.let {
            sources().getKeywords(sourceId)
                .fold(HashMap<Int,String>()) { all, kw -> all[kw.id] = kw.`val`; all}
        } ?: sourceNotFound(sourceId)

    @POST
    @Path("$ID_PATH/$KEYWORDS")
    fun addKeyword(@PathParam(ID_PARAM) sourceId: UUID, keywordId: String): List<ResultKeyword> {
        log.info("addKeyword: sourceId=$sourceId, keywordId=$keywordId")
        sources().find(sourceId)?.let {
            sources().addKeyword(sourceId, keywordId.toInt())
            return sources().getKeywords(sourceId)
        } ?: sourceNotFound(sourceId)
    }

    @DELETE
    @Path("$ID_PATH/$KEYWORDS/{keywordId}")
    fun deleteKeyword(
        @PathParam(ID_PARAM) sourceId: UUID,
        @PathParam("keywordId") keywordId: Int
    ): List<ResultKeyword> {
        log.info("deleteKeyword: sourceId=$sourceId, keywordId=$keywordId")
        sources().find(sourceId)?.let {
            sources().deleteKeyword(sourceId, keywordId)
            return sources().getKeywords(sourceId)
        } ?: sourceNotFound(sourceId)
    }

    private fun sourceNotFound(sourceId: UUID): Nothing = throw NotFoundException("Source not found: $sourceId")

    private fun sources(): SourcesDao = jdbi.onDemand(SourcesDao::class.java)
    private fun users(): UsersDao = jdbi.onDemand(UsersDao::class.java)
}