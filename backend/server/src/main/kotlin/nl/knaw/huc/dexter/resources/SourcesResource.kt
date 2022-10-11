package nl.knaw.huc.dexter.resources

import io.dropwizard.auth.Auth
import nl.knaw.huc.dexter.api.FormSource
import nl.knaw.huc.dexter.api.ResultSource
import nl.knaw.huc.dexter.auth.DexterUser
import nl.knaw.huc.dexter.db.SourcesDao
import nl.knaw.huc.dexter.db.UsersDao
import org.jdbi.v3.core.Jdbi
import org.jdbi.v3.core.JdbiException
import org.postgresql.util.PSQLException
import org.slf4j.LoggerFactory
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
        log.info("createSource[${user.name}]: formSource=[{$formSource}]")
        val createdBy = users().findByName(user.name) ?: throw NotFoundException("Unknown user: $user")
        try {
            return sources().insert(formSource, createdBy.id)
        } catch (ex: JdbiException) {
            log.info("failed to insert source: $ex")
            if (ex.cause is PSQLException) {
                val cause = ex.cause as PSQLException
                log.debug("psql server error msg: ${cause.serverErrorMessage}")
                cause.serverErrorMessage?.let {
                    throw BadRequestException("Request violates: ${it.constraint}")
                }
            }
            throw BadRequestException("unknown database error while processing request")
        }
    }

    private fun sources(): SourcesDao = jdbi.onDemand(SourcesDao::class.java)
    private fun users(): UsersDao = jdbi.onDemand(UsersDao::class.java)
}