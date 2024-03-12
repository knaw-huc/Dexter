package nl.knaw.huc.dexter.resources

import UnauthorizedException
import io.dropwizard.auth.Auth
import nl.knaw.huc.dexter.api.FormCitation
import nl.knaw.huc.dexter.api.ResourcePaths
import nl.knaw.huc.dexter.api.ResourcePaths.AUTOCOMPLETE
import nl.knaw.huc.dexter.api.ResourcePaths.ID_PARAM
import nl.knaw.huc.dexter.api.ResourcePaths.ID_PATH
import nl.knaw.huc.dexter.api.ResultCitation
import nl.knaw.huc.dexter.api.ResultTag
import nl.knaw.huc.dexter.auth.DexterUser
import nl.knaw.huc.dexter.auth.RoleNames
import nl.knaw.huc.dexter.db.DaoBlock
import nl.knaw.huc.dexter.db.CitationsDao
import nl.knaw.huc.dexter.helpers.PsqlDiagnosticsHelper.Companion.diagnoseViolations
import org.jdbi.v3.core.Jdbi
import org.jdbi.v3.core.transaction.TransactionIsolationLevel.REPEATABLE_READ
import org.slf4j.LoggerFactory
import java.util.*
import javax.annotation.security.RolesAllowed
import javax.ws.rs.*
import javax.ws.rs.core.MediaType.APPLICATION_JSON
import javax.ws.rs.core.Response

@Path(ResourcePaths.CITATIONS)
@RolesAllowed(RoleNames.USER)
@Produces(APPLICATION_JSON)
class CitationsResource(private val jdbi: Jdbi) {
    private val log = LoggerFactory.getLogger(javaClass)
    private val onlyLowercaseAndNumbers = Regex("[a-z0-9 ]*")

    @GET
    fun list(@Auth user: DexterUser) = citations().listByUser(user.id)

    @GET
    @Path(ID_PATH)
    fun getCitation(
        @PathParam(ID_PARAM) citationId: UUID,
        @Auth user: DexterUser
    ) = onAccessibleCitation(citationId, user.id) { _, t -> t }

    @POST
    @Consumes(APPLICATION_JSON)
    fun createCitation(
        citation: FormCitation,
        @Auth user: DexterUser
    ): ResultCitation =
        citation.run {
            log.info("createCitation: [$this]")
            diagnoseViolations { citations().insert(this, user.id) }
        }

    @PUT
    @Path(ID_PATH)
    fun updateCitation(
        @PathParam(ID_PARAM) id: UUID,
        formCitation: FormCitation,
        @Auth user: DexterUser
    ): ResultCitation =
        onAccessibleCitation(id, user.id) { dao, t ->
            log.info("updateCitation: citationId=${t.id}, formCitation=$formCitation")
            dao.update(t.id, formCitation)
        }

    @DELETE
    @Path(ID_PATH)
    fun deleteCitation(
        @PathParam(ID_PARAM) id: UUID,
        @Auth user: DexterUser
    ): Response =
        onAccessibleCitation(id, user.id) { dao, t ->
            log.warn("deleteCitation[${user.name}] citation=$t")
            dao.delete(t.id)
            Response.noContent().build()
        }

    @POST
    @Path(AUTOCOMPLETE)
    fun getCitationsLike(
        terms: String,
        @Auth user: DexterUser
    ): List<ResultCitation> {
        if(terms.isEmpty()) {
            throw BadRequestException("terms length MUST be > 0 (but was ${terms.length}: '$terms')")
        }
        if(!onlyLowercaseAndNumbers.matches(terms)) {
            throw BadRequestException("No special characters or punctuation allowed")
        }
        val termsToMatch = terms.split(" ").map { t -> "%$t%" }
        println("terms: $terms; termsToMatch: $termsToMatch")
        return citations().like(termsToMatch, user.id)
    }


    private fun <R> onAccessibleCitation(
        citationId: UUID,
        userId: UUID,
        block: DaoBlock<CitationsDao, ResultCitation, R>
    ): R =
        jdbi.inTransaction<R, Exception>(REPEATABLE_READ) { handle ->
            handle.attach(CitationsDao::class.java).let { dao ->
                dao.find(citationId)?.let { citation ->
                    if (citation.createdBy != userId) {
                        throw UnauthorizedException()
                    }
                    diagnoseViolations { block.execute(dao, citation) }
                } ?: citationNotFound(citationId)
            }
        }

    private fun citations() = jdbi.onDemand(CitationsDao::class.java)

    private fun citationNotFound(citationId: UUID): Nothing = throw NotFoundException("Citation not found: $citationId")
}