package nl.knaw.huc.dexter.resources

import com.codahale.metrics.annotation.Timed
import io.swagger.v3.oas.annotations.Operation
import nl.knaw.huc.dexter.api.AboutInfo
import nl.knaw.huc.dexter.api.ResourcePaths
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
    @Timed
    @GET
    fun getAboutInfo(@HeaderParam("Authorization") auth: String): AboutInfo {
        log.info("auth: $auth")
        return about
    }
}