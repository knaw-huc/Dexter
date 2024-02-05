package nl.knaw.huc.dexter.auth

import UnauthorizedException
import io.dropwizard.auth.Authenticator
import io.dropwizard.auth.basic.BasicCredentials
import nl.knaw.huc.dexter.config.RootConfig
import nl.knaw.huc.dexter.db.UsersDao
import org.apache.commons.lang3.StringUtils.isBlank
import org.jdbi.v3.core.Jdbi
import org.slf4j.LoggerFactory
import java.util.*

/**
 * TODO: nginx should manage and check basic auth passwords
 */
class DexterAuthenticator(
    private val root: RootConfig,
    private val jdbi: Jdbi
) : Authenticator<BasicCredentials, DexterUser> {
    private val log = LoggerFactory.getLogger(javaClass)

    override fun authenticate(
        credentials: BasicCredentials?
    ): Optional<DexterUser> {
        log.debug("authenticating: $credentials")
        val user = credentials?.let {
            val user = when {
                isRoot(it) -> RootUser()
                isUser(it) -> BasicUser(it.username)
                else -> throw UnauthorizedException()
            }

            // peek to log, then re-yield user
            log.debug(" -> authenticated as: $user")
            user
        }

        // shoehorn back into Java Optional as per authenticate() contract
        return Optional.ofNullable(user)
    }

    private fun isRoot(who: BasicCredentials) = who.username == root.user

    private fun isUser(who: BasicCredentials): Boolean {
        return users()
            .findByName(who.username)
            ?.name
            .equals(who.username)
    }

    private fun users(): UsersDao = jdbi.onDemand(UsersDao::class.java)

}
