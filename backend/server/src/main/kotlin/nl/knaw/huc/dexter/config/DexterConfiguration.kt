package nl.knaw.huc.dexter.config

import com.fasterxml.jackson.annotation.JsonProperty
import `in`.vectorpro.dropwizard.swagger.SwaggerBundleConfiguration
import io.dropwizard.Configuration
import io.dropwizard.db.DataSourceFactory
import nl.knaw.huc.dexter.api.Constants
import nl.knaw.huc.dexter.resources.AboutResource
import javax.validation.Valid
import javax.validation.constraints.NotNull

class DexterConfiguration : Configuration() {

    @Valid
    @NotNull
    @JsonProperty("database")
    var datasourceFactory = DataSourceFactory()

    @Valid
    @NotNull
    @JsonProperty
    var externalBaseUrl = ""

    @Valid
    @NotNull
    @JsonProperty("flyway")
    var flyway = FlywayConfiguration()

    @Valid
    @NotNull
    @JsonProperty("swagger")
    val swaggerBundleConfiguration = SwaggerBundleConfiguration().apply {
        contextRoot = "${externalBaseUrl}/backend"
        resourcePackage = AboutResource::class.java.getPackage().name
        version = javaClass.getPackage().implementationVersion
        title = Constants.APP_NAME
        license = "Apache 2.0"
        licenseUrl = "http://www.apache.org/licenses/"
        contactUrl = "https://github.com/knaw-huc/annorepo"
        contact = Constants.APP_NAME
    }
}
