package nl.knaw.huc.dexter.resources

import io.dropwizard.auth.Auth
import nl.knaw.huc.dexter.api.FormKeyword
import nl.knaw.huc.dexter.api.ResourcePaths
import nl.knaw.huc.dexter.api.ResourcePaths.ID_PARAM
import nl.knaw.huc.dexter.api.ResourcePaths.ID_PATH
import nl.knaw.huc.dexter.api.ResultKeyword
import nl.knaw.huc.dexter.auth.DexterUser
import nl.knaw.huc.dexter.db.KeywordsDao
import nl.knaw.huc.dexter.helpers.PsqlDiagnosticsHelper.Companion.diagnoseViolations
import org.jdbi.v3.core.Jdbi
import org.slf4j.LoggerFactory
import javax.ws.rs.*
import javax.ws.rs.core.MediaType
import javax.ws.rs.core.Response

@Path(ResourcePaths.KEYWORDS)
@Produces(MediaType.APPLICATION_JSON)
class KeywordResource(private val jdbi: Jdbi) {
    private val log = LoggerFactory.getLogger(javaClass)

    @GET
    fun list() = keywords().list()

    @GET
    @Path(ID_PATH)
    fun getKeyword(@PathParam(ID_PARAM) keywordId: Int) =
        keywords().find(keywordId) ?: keywordNotFound(keywordId)

    @POST
    fun createKeyword(keyword: FormKeyword): ResultKeyword {
        log.info("createKeyword: [$keyword]")
        return keywords().insert(keyword)
    }

    @PUT
    @Path(ID_PATH)
    fun updateKeyword(@PathParam(ID_PARAM) keywordId: Int, keyword: FormKeyword): ResultKeyword {
        log.info("updateKeyword: id=$keywordId, val=$keyword")
        keywords().find(keywordId)?.let {
            return keywords().update(keywordId, keyword)
        }
        keywordNotFound(keywordId)
    }

    @DELETE
    @Path(ID_PATH)
    fun deleteKeyword(@PathParam(ID_PARAM) keywordId: Int, @Auth user: DexterUser): Response {
        keywords().find(keywordId)?.let {
            log.warn("$user deleting: $it")
            diagnoseViolations { keywords().delete(keywordId) }
            return Response.noContent().build()
        }
        keywordNotFound(keywordId)
    }

    private fun keywords() = jdbi.onDemand(KeywordsDao::class.java)

    private fun keywordNotFound(keywordId: Int): Nothing = throw NotFoundException("Keyword not found: $keywordId")
}