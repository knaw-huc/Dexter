package nl.knaw.huc.dexter

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
import nl.knaw.huc.dexter.resources.AboutResource
import nl.knaw.huc.dexter.resources.AdminResource
import org.flywaydb.core.Flyway
import org.glassfish.jersey.server.filter.RolesAllowedDynamicFeature
import org.jdbi.v3.core.Jdbi
import org.jdbi.v3.postgres.PostgresPlugin
import org.jdbi.v3.sqlobject.SqlObjectPlugin
import org.slf4j.LoggerFactory

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

        val jdbi = createJdbi(environment, configuration.dataSourceFactory)
//        val uuid = UUID.randomUUID()
//        jdbi.useHandle<Exception> { it.execute("insert into users (id,name) values ('$uuid', 'bolke')") }
//        jdbi.useHandle<Exception> { log.info("${it.execute("select * from users")}") }

        val appVersion = javaClass.getPackage().implementationVersion
        environment.jersey().apply {
            register(AuthDynamicFeature(
                BasicCredentialAuthFilter.Builder<DexterUser>()
                    .setAuthenticator(DexterAuthenticator(configuration.root))
                    .setAuthorizer(DexterAuthorizer())
                    .setRealm("Dexter's Lab")
                    .buildAuthFilter()

            ))
            register(RolesAllowedDynamicFeature::class.java)
            register(AuthValueFactoryProvider.Binder(DexterUser::class.java))
            register(AboutResource(configuration, name, appVersion))
            register(AdminResource())
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

    private fun createJdbi(environment: Environment, datasourceFactory: DataSourceFactory): Jdbi {
        val jdbi = JdbiFactory().build(environment, datasourceFactory, "postgresql")
        jdbi.installPlugin(SqlObjectPlugin())
        jdbi.installPlugin(PostgresPlugin())
        return jdbi
    }

    companion object {
        @Throws(Exception::class)
        @JvmStatic
        fun main(args: Array<String>) {
            DexterApplication().run(*args)
        }
    }
}