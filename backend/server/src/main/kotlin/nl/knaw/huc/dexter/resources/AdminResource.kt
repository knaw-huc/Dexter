package nl.knaw.huc.dexter.resources

import com.codahale.metrics.annotation.Timed
import io.swagger.v3.oas.annotations.Operation
import nl.knaw.huc.dexter.api.ResourcePaths
import nl.knaw.huc.dexter.api.ResourcePaths.USERS
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

@Path(ResourcePaths.ADMIN)
@RolesAllowed(ROOT)
@Produces(APPLICATION_JSON)
class AdminResource(private val jdbi: Jdbi) {
    private val log = LoggerFactory.getLogger(javaClass)

    @GET
    @Path(USERS)
    fun listUsers() = users().list()

    @Operation(description = "Add users")
    @Timed
    @POST
    @Path(USERS)
    @Consumes(APPLICATION_JSON)
    fun addUsers(@NotNull userNames: Set<String>): List<User> {
        log.info("addUsers: $userNames")
        return jdbi.inTransaction<List<User>, Exception> { handle ->
            handle.attach(UsersDao::class.java).let { userDao ->
                userDao.insertMany(userNames)
                userNames.mapNotNull { userDao.findByName(it) }
            }
        }
    }

    @GET
    @Path("$USERS/{str}")
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

    @DELETE
    @Path("$USERS/{str}")
    fun deleteUser(@PathParam("str") nameOrUuid: String): Response {
        log.info("deleteUser: [$nameOrUuid]")

        try {
            UUID.fromString(nameOrUuid).let {
                users().deleteById(it)
            }
        } catch (ex: IllegalArgumentException) {
            users().deleteByName(nameOrUuid)
        }

        return Response.accepted().build()
    }

    private fun users() = jdbi.onDemand(UsersDao::class.java)
}