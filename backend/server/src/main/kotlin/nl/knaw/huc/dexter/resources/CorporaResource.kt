package nl.knaw.huc.dexter.resources

import io.dropwizard.auth.Auth
import nl.knaw.huc.dexter.api.FormCorpus
import nl.knaw.huc.dexter.api.ResourcePaths
import nl.knaw.huc.dexter.api.ResourcePaths.ID_PARAM
import nl.knaw.huc.dexter.api.ResourcePaths.ID_PATH
import nl.knaw.huc.dexter.api.ResourcePaths.KEYWORDS
import nl.knaw.huc.dexter.api.ResultCorpus
import nl.knaw.huc.dexter.api.ResultKeyword
import nl.knaw.huc.dexter.auth.DexterUser
import nl.knaw.huc.dexter.db.CorporaDao
import nl.knaw.huc.dexter.db.UsersDao
import nl.knaw.huc.dexter.helpers.PsqlConstraintChecker.Companion.checkConstraintViolations
import org.jdbi.v3.core.Jdbi
import org.slf4j.LoggerFactory
import java.util.*
import javax.ws.rs.*
import javax.ws.rs.core.MediaType.APPLICATION_JSON
import javax.ws.rs.core.Response

@Path(ResourcePaths.CORPORA)
@Produces(APPLICATION_JSON)
class CorporaResource(private val jdbi: Jdbi) {
    private val log = LoggerFactory.getLogger(javaClass)

    @GET
    fun getCorporaList() = corpora().list()

    @GET
    @Path(ID_PATH)
    fun getCorpus(@PathParam(ID_PARAM) corpusId: UUID): ResultCorpus =
        corpora().find(corpusId) ?: corpusNotFound(corpusId)

    @POST
    @Consumes(APPLICATION_JSON)
    fun createCorpus(formCorpus: FormCorpus, @Auth user: DexterUser): ResultCorpus {
        log.info("createCorpus[${user.name}]: formCorpus=[$formCorpus]")
        val createdBy = users().findByName(user.name) ?: throw NotFoundException("Unknown user: $user")
        return checkConstraintViolations { corpora().insert(formCorpus, createdBy.id) }
    }

    @PUT
    @Consumes(APPLICATION_JSON)
    @Path(ID_PATH)
    fun updateCorpus(
        @PathParam(ID_PARAM) corpusId: UUID,
        formCorpus: FormCorpus,
        @Auth user: DexterUser
    ): ResultCorpus {
        log.info("updateCorpus[${user.name}]: corpusId=$corpusId, formCorpus=$formCorpus")
        corpora().find(corpusId)?.let {
            return checkConstraintViolations { corpora().update(corpusId, formCorpus) }
        }
        corpusNotFound(corpusId)
    }

    @DELETE
    @Path(ID_PATH)
    fun deleteCorpus(@PathParam(ID_PARAM) corpusId: UUID, @Auth user: DexterUser): Response {
        log.info("deleteCorpus[${user.name}]: corpusId=$corpusId")
        corpora().find(corpusId)?.let {
            log.warn("$user deleting: $it")
            checkConstraintViolations { corpora().delete(corpusId) }
            return Response.noContent().build()
        }
        corpusNotFound(corpusId)
    }

    @GET
    @Path("$ID_PATH/$KEYWORDS/v1")
    fun getKeywordsV1(@PathParam(ID_PARAM) corpusId: UUID) =
        corpora().find(corpusId)?.let {
            corpora().getKeywords(corpusId)
        } ?: corpusNotFound(corpusId)

    @POST
    @Path("$ID_PATH/$KEYWORDS")
    fun addKeyword(@PathParam(ID_PARAM) corpusId: UUID, keywordId: String): List<ResultKeyword> {
        log.info("addKeyword: corpusId=$corpusId, keywordId=$keywordId")
        corpora().find(corpusId)?.let {
            corpora().addKeyword(corpusId, keywordId.toInt())
            return corpora().getKeywords(corpusId)
        } ?: corpusNotFound(corpusId)
    }

    @DELETE
    @Path("$ID_PATH/$KEYWORDS/{keywordId}")
    fun deleteKeyword(
        @PathParam(ID_PARAM) corpusId: UUID,
        @PathParam("keywordId") keywordId: Int
    ) : List<ResultKeyword> {
        log.info("deleteKeyword: corpusId=$corpusId, keywordId=$keywordId")
        corpora().find(corpusId)?.let {
            corpora().deleteKeyword(corpusId, keywordId)
            return corpora().getKeywords(corpusId)
        }?: corpusNotFound(corpusId)
    }

    private fun corpusNotFound(corpusId: UUID): Nothing = throw NotFoundException("Corpus not found: $corpusId")

    private fun corpora(): CorporaDao = jdbi.onDemand(CorporaDao::class.java)
    private fun users(): UsersDao = jdbi.onDemand(UsersDao::class.java)
}