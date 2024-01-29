package nl.knaw.huc.dexter

import UnauthorizedExceptionMapper
import UserResource
import WereldCulturenDublinCoreImporter
import com.fasterxml.jackson.databind.module.SimpleModule
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import `in`.vectorpro.dropwizard.swagger.SwaggerBundle
import `in`.vectorpro.dropwizard.swagger.SwaggerBundleConfiguration
import io.dropwizard.Application
import io.dropwizard.auth.AuthDynamicFeature
import io.dropwizard.auth.AuthValueFactoryProvider
import io.dropwizard.auth.basic.BasicCredentialAuthFilter
import io.dropwizard.configuration.EnvironmentVariableSubstitutor
import io.dropwizard.configuration.SubstitutingSourceProvider
import io.dropwizard.db.DataSourceFactory
import io.dropwizard.jdbi3.JdbiFactory
import io.dropwizard.jdbi3.bundles.JdbiExceptionsBundle
import io.dropwizard.setup.Bootstrap
import io.dropwizard.setup.Environment
import nl.knaw.huc.dexter.api.Constants
import nl.knaw.huc.dexter.api.Constants.APP_NAME
import nl.knaw.huc.dexter.auth.DexterAuthenticator
import nl.knaw.huc.dexter.auth.DexterAuthorizer
import nl.knaw.huc.dexter.auth.DexterUser
import nl.knaw.huc.dexter.config.DexterConfiguration
import nl.knaw.huc.dexter.config.FlywayConfiguration
import nl.knaw.huc.dexter.helpers.LocalDateTimeSerializer
import nl.knaw.huc.dexter.resources.*
import org.flywaydb.core.Flyway
import org.glassfish.jersey.server.filter.RolesAllowedDynamicFeature
import org.jdbi.v3.core.Jdbi
import org.jdbi.v3.core.kotlin.KotlinPlugin
import org.jdbi.v3.postgres.PostgresPlugin
import org.jdbi.v3.sqlobject.kotlin.KotlinSqlObjectPlugin
import org.slf4j.LoggerFactory
import java.text.SimpleDateFormat
import java.time.LocalDateTime
import java.util.*

class DexterApplication : Application<DexterConfiguration>() {
    private val log = LoggerFactory.getLogger(javaClass)

    override fun getName(): String = APP_NAME

    override fun initialize(bootstrap: Bootstrap<DexterConfiguration>) {
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

    override fun run(configuration: DexterConfiguration, environment: Environment) {
        log.info(
            "DEX_ environment variables:\n\n" +
                    Constants.EnvironmentVariable.values()
                        .joinToString("\n") { ev ->
                            "  ${ev.name}:\t${System.getenv(ev.name) ?: "(not set, using default)"}"
                        } +
                    "\n"
        )

        migrateDatabase(configuration.dataSourceFactory, configuration.flyway)
        customizeObjectMapper(environment)
        val jdbi = setupJdbi(environment, configuration.dataSourceFactory)
        val wereldCulturenDublinCoreMapper = WereldCulturenDublinCoreImporter()

        // TODO: why is implementationVersion null in dev mode?
        val appVersion = javaClass.getPackage().implementationVersion ?: "no-implementation-version-found";

        environment.jersey().apply {
            register(
                AuthDynamicFeature(
                    BasicCredentialAuthFilter.Builder<DexterUser>()
                        .setAuthenticator(DexterAuthenticator(configuration.root, jdbi))
                        .setAuthorizer(DexterAuthorizer())
                        .setRealm("Dexter's Lab")
                        .buildAuthFilter()

                )
            )
            register(RolesAllowedDynamicFeature::class.java)
            register(AuthValueFactoryProvider.Binder(DexterUser::class.java))
            register(AboutResource(configuration, name, appVersion))
            register(AdminResource(jdbi))
            register(CorporaResource(jdbi))
            register(KeywordsResource(jdbi))
            register(LanguagesResource(jdbi))
            register(MetadataKeysResource(jdbi))
            register(MetadataValuesResource(jdbi))
            register(SourcesResource(jdbi))
            register(ImportResource(wereldCulturenDublinCoreMapper))
            register(UserResource())

            register(UnauthorizedExceptionMapper())
        }
    }

    private fun migrateDatabase(dsf: DataSourceFactory, conf: FlywayConfiguration) {
        log.info("conf.baselineOnMigrate: ${conf.baselineOnMigrate}")
        log.info("conf.baselineVersion: ${conf.baselineVersion}")
        val flywayConfig = Flyway.configure()
            .dataSource(dsf.url, dsf.user, dsf.password)
            .baselineVersion(conf.baselineVersion)
            .baselineOnMigrate(conf.baselineOnMigrate)
            .cleanDisabled(conf.cleanDisabled)
            .locations(*conf.locations) // unpack primitive array using spread ('*') operator
        val flyway = Flyway(flywayConfig)
        val ms = flyway.migrate()
        if (ms.targetSchemaVersion != null || ms.migrationsExecuted > 0) {
            val from = ms.initialSchemaVersion
            val to = ms.targetSchemaVersion
            val result = if (ms.success) "OK" else "FAILED"
            log.info("Migration from: $from to $to -> $result")
            log.info("Number of migrations executed: ${ms.migrationsExecuted}")
            ms.migrations.forEachIndexed { i, m ->
                log.info("migration[$i]: desc=\"${m.description}\", cat: ${m.category}, type: ${m.type}, ver: ${m.version}")
                log.info(" + ${m.filepath} ran in ${m.executionTime}ms")
            }
        }
    }

    private fun setupJdbi(environment: Environment, datasourceFactory: DataSourceFactory): Jdbi {
        return JdbiFactory().build(environment, datasourceFactory, "postgresql").apply {
            installPlugin(PostgresPlugin())
            installPlugin(KotlinPlugin())
            installPlugin(KotlinSqlObjectPlugin())
        }
    }

    private val dateFormatString = "yyyy-MM-dd'T'HH:mm:ss"
    private fun customizeObjectMapper(environment: Environment) {
        val module = SimpleModule().apply {
            addSerializer(LocalDateTime::class.java, LocalDateTimeSerializer(dateFormatString))
        }
        environment.objectMapper.apply {
            dateFormat = SimpleDateFormat(dateFormatString)
            registerModule(module)
            registerKotlinModule()
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