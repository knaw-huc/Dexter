package nl.knaw.huc.dexter.resources

import com.codahale.metrics.annotation.Timed
import io.dropwizard.auth.Auth
import io.swagger.v3.oas.annotations.Operation
import nl.knaw.huc.dexter.api.AboutInfo
import nl.knaw.huc.dexter.api.ResourcePaths
import nl.knaw.huc.dexter.auth.DexterUser
import nl.knaw.huc.dexter.auth.RootUser
import nl.knaw.huc.dexter.config.DexterConfiguration
import org.slf4j.LoggerFactory
import java.time.Instant
import javax.ws.rs.GET
import javax.ws.rs.HeaderParam
import javax.ws.rs.Path
import javax.ws.rs.Produces
import javax.ws.rs.core.MediaType

@Path(ResourcePaths.ABOUT)
@Produces(MediaType.APPLICATION_JSON)
class AboutResource(
    configuration: DexterConfiguration,
    appName: String,
    version: String
) {
    val log = LoggerFactory.getLogger(AboutResource::class.java)

    private val about = AboutInfo(
        appName = appName,
        version = version,
        startedAt = Instant.now().toString(),
        baseURI = configuration.externalBaseUrl
    )

    @Operation(description = "Get server info")
//    @RolesAllowed("admin")
    @Timed
    @GET
    fun getAboutInfo(
        @HeaderParam("Authorization") auth: String?,
        @Auth user: DexterUser?
    ): AboutInfo {
        log.info("auth: $auth, user: $user, root: ${user is RootUser}")
        return about
    }
}