import io.dropwizard.auth.Auth
import nl.knaw.huc.dexter.api.ResourcePaths
import nl.knaw.huc.dexter.api.UserResult
import nl.knaw.huc.dexter.auth.DexterUser
import org.jdbi.v3.core.Jdbi
import org.slf4j.LoggerFactory
import javax.ws.rs.*
import javax.ws.rs.core.MediaType

@Path(ResourcePaths.USER)
@Produces(MediaType.APPLICATION_JSON)
class UserResource() {
    private val log = LoggerFactory.getLogger(javaClass)

    @POST
    @Path(ResourcePaths.LOGIN)
    @Consumes(MediaType.APPLICATION_JSON)
    fun login(@Auth user: DexterUser): UserResult {
        log.info("login [${user.name}]")
        return UserResult(user.name)
    }
}