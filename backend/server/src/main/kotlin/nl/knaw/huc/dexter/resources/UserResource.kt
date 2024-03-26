import io.dropwizard.auth.Auth
import nl.knaw.huc.dexter.api.*
import nl.knaw.huc.dexter.auth.DexterUser
import nl.knaw.huc.dexter.auth.RoleNames
import nl.knaw.huc.dexter.db.UsersDao
import org.jdbi.v3.core.Jdbi
import org.slf4j.LoggerFactory
import javax.annotation.security.RolesAllowed
import javax.ws.rs.*
import javax.ws.rs.core.MediaType

@Path(ResourcePaths.USER)
@Produces(MediaType.APPLICATION_JSON)
@RolesAllowed(RoleNames.ROOT, RoleNames.USER)
class UserResource(private val jdbi: Jdbi, private val helper: UserSettingsHelper) {

    private val log = LoggerFactory.getLogger(javaClass)

    @POST
    @Path(ResourcePaths.LOGIN)
    @Consumes(MediaType.APPLICATION_JSON)
    fun login(@Auth user: DexterUser): UserResult {
        log.info("login [${user.name}]")
        return UserResult(user.name, this.helper.getSettings(user.id))
    }

    @PUT
    @Path(ResourcePaths.SETTINGS)
    @Consumes(MediaType.APPLICATION_JSON)
    fun updateSettings(
            settings: FormUserSettings,
            @Auth user: DexterUser
    ): UserResult {
        log.info("updateSettings[${user.name}: formSettings=$settings")
        return UserResult(user.name, this.helper.updateSettings(user.id, settings))
    }

}