package nl.knaw.huc.dexter.resources

import io.dropwizard.auth.Auth
import nl.knaw.huc.dexter.api.FormKeyword
import nl.knaw.huc.dexter.api.ResourcePaths
import nl.knaw.huc.dexter.api.ResourcePaths.ID_PARAM
import nl.knaw.huc.dexter.api.ResourcePaths.ID_PATH
import nl.knaw.huc.dexter.api.ResultKeyword
import nl.knaw.huc.dexter.auth.DexterUser
import nl.knaw.huc.dexter.db.DaoBlock
import nl.knaw.huc.dexter.db.KeywordsDao
import nl.knaw.huc.dexter.helpers.PsqlDiagnosticsHelper.Companion.diagnoseViolations
import org.jdbi.v3.core.Jdbi
import org.jdbi.v3.core.transaction.TransactionIsolationLevel.REPEATABLE_READ
import org.slf4j.LoggerFactory
import javax.ws.rs.*
import javax.ws.rs.core.MediaType.APPLICATION_JSON
import javax.ws.rs.core.MediaType.TEXT_PLAIN
import javax.ws.rs.core.Response

@Path(ResourcePaths.KEYWORDS)
@Produces(APPLICATION_JSON)
class KeywordsResource(private val jdbi: Jdbi) {
    private val log = LoggerFactory.getLogger(javaClass)

    @GET
    fun list() = keywords().list()

    @GET
    @Path(ID_PATH)
    fun getKeyword(@PathParam(ID_PARAM) keywordId: Int) =
        keywords().find(keywordId) ?: keywordNotFound(keywordId)

    @POST
    @Consumes(APPLICATION_JSON, TEXT_PLAIN)
    fun createKeyword(keyword: FormKeyword): ResultKeyword =
        keyword.run {
            log.info("createKeyword: [$this]")
            keywords().insert(this)
        }

    @PUT
    @Path(ID_PATH)
    fun updateKeyword(@PathParam(ID_PARAM) id: Int, value: FormKeyword): ResultKeyword =
        onExistingKeyword(id) { dao, kw ->
            log.info("updateKeyword: id=$id, val=$value")
            dao.update(kw.id, value)
        }

    @DELETE
    @Path(ID_PATH)
    fun deleteKeyword(@PathParam(ID_PARAM) id: Int, @Auth user: DexterUser): Response =
        onExistingKeyword(id) { dao, kw ->
            log.warn("deleteKeyword[${user.name}] keyword=$kw")
            dao.delete(kw.id)
            Response.noContent().build()
        }

    private fun <R> onExistingKeyword(keywordId: Int, block: DaoBlock<KeywordsDao, ResultKeyword, R>): R =
        jdbi.inTransaction<R, Exception>(REPEATABLE_READ) { handle ->
            handle.attach(KeywordsDao::class.java).let { dao ->
                dao.find(keywordId)?.let { keyword ->
                    diagnoseViolations { block.execute(dao, keyword) }
                } ?: keywordNotFound(keywordId)
            }
        }

    private fun keywords() = jdbi.onDemand(KeywordsDao::class.java)

    private fun keywordNotFound(keywordId: Int): Nothing = throw NotFoundException("Keyword not found: $keywordId")
}