package nl.knaw.huc.dexter.resources

import com.codahale.metrics.annotation.Timed
import io.swagger.v3.oas.annotations.Operation
import nl.knaw.huc.dexter.api.User
import nl.knaw.huc.dexter.auth.RoleNames.ROOT
import nl.knaw.huc.dexter.db.UsersDao
import org.jdbi.v3.core.Jdbi
import org.slf4j.LoggerFactory
import java.util.*
import javax.annotation.security.RolesAllowed
import javax.validation.constraints.NotNull
import javax.ws.rs.*
import javax.ws.rs.core.MediaType.APPLICATION_JSON
import javax.ws.rs.core.Response

@Path("admin")
@RolesAllowed(ROOT)
class AdminResource(private val jdbi: Jdbi) {
    private val log = LoggerFactory.getLogger(javaClass)

    @Operation(description = "Add user")
    @Timed
    @POST
    @Path("users")
    @Consumes(APPLICATION_JSON)
    fun addUsers(@NotNull users: List<Map<String, String>>): Response {
        log.info("Adding users: $users")
        return Response.accepted().build()
    }

    @GET
    @Path("/users/{str}")
    @Produces(APPLICATION_JSON)
    fun getUser(@PathParam("str") nameOrUuid: String): User {
        log.info("getUser: [$nameOrUuid]")

        return try {
            UUID.fromString(nameOrUuid).let { users().findById(it) }
                ?: throw NotFoundException("No such user id: $nameOrUuid")
        } catch (ex: IllegalArgumentException) {
            users().findByName(nameOrUuid)
                ?: throw NotFoundException("No such user name: $nameOrUuid")
        }
    }

    private fun users() = jdbi.onDemand(UsersDao::class.java)
}