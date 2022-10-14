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
import nl.knaw.huc.dexter.helpers.PsqlDiagnosticsHelper.Companion.diagnoseViolations
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
        return diagnoseViolations { corpora().insert(formCorpus, createdBy.id) }
    }

    @PUT
    @Consumes(APPLICATION_JSON)
    @Path(ID_PATH)
    fun updateCorpus(
        @PathParam(ID_PARAM) id: UUID,
        formCorpus: FormCorpus,
        @Auth user: DexterUser
    ): ResultCorpus =
        onExistingCorpus(id) { dao, corpus ->
            log.info("updateCorpus[${user.name}]: corpusId=$corpus.id, formCorpus=$formCorpus")
            dao.update(id, formCorpus)
        }

    @DELETE
    @Path(ID_PATH)
    fun deleteCorpus(@PathParam(ID_PARAM) id: UUID, @Auth user: DexterUser): Response =
        onExistingCorpus(id) { dao, corpus ->
            log.warn("deleteCorpus[${user.name}] deleting: $corpus")
            dao.delete(id)
            Response.noContent().build()
        }

    @GET
    @Path("$ID_PATH/$KEYWORDS/v1")
    fun getKeywordsV1(@PathParam(ID_PARAM) id: UUID) =
        onExistingCorpus(id) { dao, corpus ->
            dao.getKeywords(corpus.id)
        }

    @POST
    @Path("$ID_PATH/$KEYWORDS")
    fun addKeyword(@PathParam(ID_PARAM) id: UUID, keywordId: String): List<ResultKeyword> =
        onExistingCorpus(id) { dao, corpus ->
            log.info("addKeyword: corpusId=$corpus.id, keywordId=$keywordId")
            dao.addKeyword(corpus.id, keywordId.toInt())
            dao.getKeywords(corpus.id)
        }

    @DELETE
    @Path("$ID_PATH/$KEYWORDS/{keywordId}")
    fun deleteKeyword(
        @PathParam(ID_PARAM) id: UUID,
        @PathParam("keywordId") keywordId: Int
    ): List<ResultKeyword> =
        onExistingCorpus(id) { dao, corpus ->
            log.info("deleteKeyword: corpusId=$corpus.id, keywordId=$keywordId")
            dao.deleteKeyword(corpus.id, keywordId)
            dao.getKeywords(corpus.id)
        }

    private fun <R> onExistingCorpus(corpusId: UUID, block: DaoBlock<CorporaDao, ResultCorpus, R>): R =
        jdbi.inTransaction<R, Exception> { handle ->
            handle.attach(CorporaDao::class.java).let { dao ->
                dao.find(corpusId)?.let { corpus ->
                    diagnoseViolations{ block.execute(dao, corpus) }
                } ?: corpusNotFound(corpusId)
            }
        }

    private fun interface DaoBlock<D, I, R> {
        fun execute(dao: D, it: I): R
    }

    private fun corpusNotFound(corpusId: UUID): Nothing = throw NotFoundException("Corpus not found: $corpusId")

    private fun corpora(): CorporaDao = jdbi.onDemand(CorporaDao::class.java)
    private fun users(): UsersDao = jdbi.onDemand(UsersDao::class.java)
}