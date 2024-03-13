package nl.knaw.huc.dexter.resources

import UnauthorizedException
import io.dropwizard.auth.Auth
import nl.knaw.huc.dexter.api.FormReference
import nl.knaw.huc.dexter.api.ResourcePaths
import nl.knaw.huc.dexter.api.ResourcePaths.AUTOCOMPLETE
import nl.knaw.huc.dexter.api.ResourcePaths.ID_PARAM
import nl.knaw.huc.dexter.api.ResourcePaths.ID_PATH
import nl.knaw.huc.dexter.api.ResultReference
import nl.knaw.huc.dexter.api.ResultTag
import nl.knaw.huc.dexter.auth.DexterUser
import nl.knaw.huc.dexter.auth.RoleNames
import nl.knaw.huc.dexter.db.DaoBlock
import nl.knaw.huc.dexter.db.ReferencesDao
import nl.knaw.huc.dexter.helpers.PsqlDiagnosticsHelper.Companion.diagnoseViolations
import org.jdbi.v3.core.Jdbi
import org.jdbi.v3.core.transaction.TransactionIsolationLevel.REPEATABLE_READ
import org.slf4j.LoggerFactory
import java.util.*
import javax.annotation.security.RolesAllowed
import javax.ws.rs.*
import javax.ws.rs.core.MediaType.APPLICATION_JSON
import javax.ws.rs.core.Response

@Path(ResourcePaths.REFERENCES)
@RolesAllowed(RoleNames.USER)
@Produces(APPLICATION_JSON)
class ReferencesResource(private val jdbi: Jdbi) {
    private val log = LoggerFactory.getLogger(javaClass)
    private val onlyLowercaseAndNumbers = Regex("[a-z0-9 ]*")

    @GET
    fun list(@Auth user: DexterUser) = references().listByUser(user.id)

    @GET
    @Path(ID_PATH)
    fun getReference(
        @PathParam(ID_PARAM) referenceId: UUID,
        @Auth user: DexterUser
    ) = onAccessibleReference(referenceId, user.id) { _, t -> t }

    @POST
    @Consumes(APPLICATION_JSON)
    fun createReference(
        reference: FormReference,
        @Auth user: DexterUser
    ): ResultReference =
        reference.run {
            log.info("createReference: [$this]")
            diagnoseViolations { references().insert(this, user.id) }
        }

    @PUT
    @Path(ID_PATH)
    fun updateReference(
        @PathParam(ID_PARAM) id: UUID,
        formReference: FormReference,
        @Auth user: DexterUser
    ): ResultReference =
        onAccessibleReference(id, user.id) { dao, t ->
            log.info("updateReference: referenceId=${t.id}, formReference=$formReference")
            dao.update(t.id, formReference)
        }

    @DELETE
    @Path(ID_PATH)
    fun deleteReference(
        @PathParam(ID_PARAM) id: UUID,
        @Auth user: DexterUser
    ): Response =
        onAccessibleReference(id, user.id) { dao, t ->
            log.warn("deleteReference[${user.name}] reference=$t")
            dao.delete(t.id)
            Response.noContent().build()
        }

    @POST
    @Path(AUTOCOMPLETE)
    fun getReferencesLike(
        terms: String,
        @Auth user: DexterUser
    ): List<ResultReference> {
        if(terms.isEmpty()) {
            throw BadRequestException("terms length MUST be > 0 (but was ${terms.length}: '$terms')")
        }
        if(!onlyLowercaseAndNumbers.matches(terms)) {
            throw BadRequestException("No special characters or punctuation allowed")
        }
        val termsToMatch = terms.split(" ").map { t -> "%$t%" }
        println("terms: $terms; termsToMatch: $termsToMatch")
        return references().like(termsToMatch, user.id)
    }


    private fun <R> onAccessibleReference(
        referenceId: UUID,
        userId: UUID,
        block: DaoBlock<ReferencesDao, ResultReference, R>
    ): R =
        jdbi.inTransaction<R, Exception>(REPEATABLE_READ) { handle ->
            handle.attach(ReferencesDao::class.java).let { dao ->
                dao.find(referenceId)?.let { reference ->
                    if (reference.createdBy != userId) {
                        throw UnauthorizedException()
                    }
                    diagnoseViolations { block.execute(dao, reference) }
                } ?: referenceNotFound(referenceId)
            }
        }

    private fun references() = jdbi.onDemand(ReferencesDao::class.java)

    private fun referenceNotFound(referenceId: UUID): Nothing = throw NotFoundException("Reference not found: $referenceId")
}