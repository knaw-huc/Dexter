package nl.knaw.huc.dexter.resources

import io.dropwizard.auth.Auth
import nl.knaw.huc.dexter.api.FormCorpus
import nl.knaw.huc.dexter.api.ResourcePaths
import nl.knaw.huc.dexter.api.ResultCorpus
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
    @Path("{id}")
    fun getCorpus(@PathParam("id") corpusId: UUID): ResultCorpus =
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
    @Path("{id}")
    fun updateCorpus(@PathParam("id") corpusId: UUID, formCorpus: FormCorpus, @Auth user: DexterUser): ResultCorpus {
        log.info("updateCorpus[${user.name}]: corpusId=$corpusId, formCorpus=$formCorpus")
        corpora().find(corpusId)?.let {
            return checkConstraintViolations { corpora().update(corpusId, formCorpus) }
        }
        corpusNotFound(corpusId)
    }

    @DELETE
    @Path("{id}")
    fun deleteCorpus(@PathParam("id") corpusId: UUID, @Auth user: DexterUser): Response {
        log.info("deleteCorpus[${user.name}]: corpusId=$corpusId")
        corpora().find(corpusId)?.let {
            log.warn("$user deleting: $it")
            checkConstraintViolations{ corpora().delete(corpusId) }
            return Response.noContent().build()
        }
        corpusNotFound(corpusId)
    }

    private fun corpusNotFound(corpusId: UUID): Nothing = throw NotFoundException("Corpus not found: $corpusId")

    private fun corpora(): CorporaDao = jdbi.onDemand(CorporaDao::class.java)

    private fun users(): UsersDao = jdbi.onDemand(UsersDao::class.java)
}