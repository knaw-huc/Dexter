package nl.knaw.huc.dexter

import `in`.vectorpro.dropwizard.swagger.SwaggerBundle
import `in`.vectorpro.dropwizard.swagger.SwaggerBundleConfiguration
import io.dropwizard.Application
import io.dropwizard.configuration.EnvironmentVariableSubstitutor
import io.dropwizard.configuration.SubstitutingSourceProvider
import io.dropwizard.jdbi3.bundles.JdbiExceptionsBundle
import io.dropwizard.setup.Bootstrap
import io.dropwizard.setup.Environment
import nl.knaw.huc.dexter.api.Constants
import nl.knaw.huc.dexter.api.Constants.APP_NAME
import nl.knaw.huc.dexter.config.DexterConfiguration
import nl.knaw.huc.dexter.resources.AboutResource
import org.slf4j.LoggerFactory

class DexterApplication : Application<DexterConfiguration?>() {
    private val log = LoggerFactory.getLogger(javaClass)

    override fun getName(): String = APP_NAME

    override fun initialize(bootstrap: Bootstrap<DexterConfiguration?>) {
        bootstrap.configurationSourceProvider = SubstitutingSourceProvider(
                bootstrap.configurationSourceProvider, EnvironmentVariableSubstitutor()
        )
        bootstrap.addBundle(getSwaggerBundle())
        bootstrap.addBundle(JdbiExceptionsBundle())
    }

    private fun getSwaggerBundle() = object : SwaggerBundle<DexterConfiguration>() {
        override fun getSwaggerBundleConfiguration(configuration: DexterConfiguration): SwaggerBundleConfiguration =
                configuration.swaggerBundleConfiguration
    }

    override fun run(configuration: DexterConfiguration?, environment: Environment) {
        log.info(
                "DEX_ environment variables:\n\n" +
                        Constants.EnvironmentVariable.values()
                                .joinToString("\n") { ev ->
                                    "  ${ev.name}:\t${System.getenv(ev.name) ?: "(not set, using default)"}"
                                } +
                        "\n"
        )

        val appVersion = javaClass.getPackage().implementationVersion
        environment.jersey().apply {
            register(AboutResource(configuration!!, name, appVersion))
        }
    }

    companion object {
        @Throws(Exception::class)
        @JvmStatic
        fun main(args: Array<String>) {
            DexterApplication().run(*args)
        }
    }
}