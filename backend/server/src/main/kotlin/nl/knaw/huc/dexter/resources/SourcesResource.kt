package nl.knaw.huc.dexter.resources

import io.dropwizard.auth.Auth
import nl.knaw.huc.dexter.api.FormSource
import nl.knaw.huc.dexter.api.ResultSource
import nl.knaw.huc.dexter.auth.DexterUser
import nl.knaw.huc.dexter.db.SourcesDao
import nl.knaw.huc.dexter.db.UsersDao
import nl.knaw.huc.dexter.helpers.PsqlConstraintChecker.Companion.checkConstraintViolations
import org.jdbi.v3.core.Jdbi
import org.slf4j.LoggerFactory
import java.util.*
import javax.ws.rs.*
import javax.ws.rs.core.MediaType.APPLICATION_JSON

@Path("sources")
class SourcesResource(private val jdbi: Jdbi) {
    private val log = LoggerFactory.getLogger(javaClass)

    @GET
    @Produces(APPLICATION_JSON)
    fun getSourceList() = sources().list()

    @POST
    @Consumes(APPLICATION_JSON)
    @Produces(APPLICATION_JSON)
    fun createSource(formSource: FormSource, @Auth user: DexterUser): ResultSource {
        log.info("createSource[${user.name}]: formSource=[$formSource]")
        val createdBy = users().findByName(user.name) ?: throw NotFoundException("Unknown user: $user")
        return checkConstraintViolations { sources().insert(formSource, createdBy.id) }
    }

    @PUT
    @Consumes(APPLICATION_JSON)
    @Produces(APPLICATION_JSON)
    @Path("/{id}")
    fun updateSource(@PathParam("id") sourceId: UUID, formSource: FormSource, @Auth user: DexterUser): ResultSource {
        log.info("updateSource[${user.name}: sourceId=[$sourceId], formSource=[$formSource]")
        return checkConstraintViolations { sources().update(sourceId, formSource) }
    }

    private fun sources(): SourcesDao = jdbi.onDemand(SourcesDao::class.java)
    private fun users(): UsersDao = jdbi.onDemand(UsersDao::class.java)
}