package nl.knaw.huc.dexter.config

import com.fasterxml.jackson.annotation.JsonProperty
import `in`.vectorpro.dropwizard.swagger.SwaggerBundleConfiguration
import io.dropwizard.Configuration
import nl.knaw.huc.dexter.api.DexConst
import nl.knaw.huc.dexter.resources.AboutResource
import javax.validation.Valid
import javax.validation.constraints.NotNull

class DexterConfiguration : Configuration() {

    @Valid
    @NotNull
    @JsonProperty
    var externalBaseUrl = ""

    @Valid
    @NotNull
    @JsonProperty("swagger")
    val swaggerBundleConfiguration = SwaggerBundleConfiguration().apply {
        resourcePackage = AboutResource::class.java.getPackage().name
        version = javaClass.getPackage().implementationVersion
        title = DexConst.APP_NAME
        license = "Apache 2.0"
        licenseUrl = "http://www.apache.org/licenses/"
        contactUrl = "https://github.com/knaw-huc/annorepo"
        contact = DexConst.APP_NAME
    }

}
