package nl.knaw.huc.dexter.config

import com.fasterxml.jackson.annotation.JsonProperty
import `in`.vectorpro.dropwizard.swagger.SwaggerBundleConfiguration
import io.dropwizard.Configuration
import io.dropwizard.db.DataSourceFactory
import nl.knaw.huc.dexter.api.Constants
import nl.knaw.huc.dexter.resources.AboutResource
import java.util.*
import javax.validation.Valid
import javax.validation.constraints.NotNull

class DexterConfiguration : Configuration() {

    @Valid
    @NotNull
    @JsonProperty("database")
    val dataSourceFactory = DataSourceFactory()

    @Valid
    @NotNull
    @JsonProperty
    val externalBaseUrl = ""

    @Valid
    @NotNull
    @JsonProperty
    val flyway = FlywayConfiguration()

    @Valid
    @NotNull
    @JsonProperty
    val root: RootConfig = RootConfig()

    @Valid
    @NotNull
    @JsonProperty("swagger")
    val swaggerBundleConfiguration = SwaggerBundleConfiguration().apply {
        contextRoot = externalBaseUrl
        resourcePackage = AboutResource::class.java.getPackage().name
        version = javaClass.getPackage().implementationVersion
        title = Constants.APP_NAME
        license = "Apache 2.0"
        licenseUrl = "http://www.apache.org/licenses/"
        contactUrl = "https://github.com/knaw-huc/Dexter"
        contact = Constants.APP_NAME
    }
}

data class RootConfig(
    val user: String = "",
    val pass: String = "",
    val id: UUID = UUID.fromString("00000000-0000-0000-0000-000000000000")
)