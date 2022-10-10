package nl.knaw.huc.dexter.resources

import com.codahale.metrics.annotation.Timed
import io.swagger.v3.oas.annotations.Operation
import nl.knaw.huc.dexter.auth.RoleNames.ROOT
import org.slf4j.LoggerFactory
import javax.annotation.security.RolesAllowed
import javax.validation.constraints.NotNull
import javax.ws.rs.Consumes
import javax.ws.rs.POST
import javax.ws.rs.Path
import javax.ws.rs.core.MediaType.APPLICATION_JSON
import javax.ws.rs.core.Response

@Path("admin")
@RolesAllowed(ROOT)
class AdminResource {
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
}