package nl.knaw.huc.dexter.auth

import io.dropwizard.auth.Authenticator
import io.dropwizard.auth.basic.BasicCredentials
import nl.knaw.huc.dexter.config.RootConfig
import org.slf4j.LoggerFactory
import java.util.*

class DexterAuthenticator(private val root: RootConfig) : Authenticator<BasicCredentials, DexterUser> {
    private val log = LoggerFactory.getLogger(javaClass)

    override fun authenticate(credentials: BasicCredentials?): Optional<DexterUser> {
        log.debug("authenticating: $credentials")

        val authenticatedUser = credentials?.let {
            val user = when {
                isRoot(it) -> RootUser()
                else -> BasicUser(it.username)
            }

            // peek to log, then re-yield user
            log.debug(" -> authenticated as: $user")
            user
        }

        // shoehorn back into Java Optional as per authenticate() contract
        return Optional.ofNullable(authenticatedUser)
    }

    private fun isRoot(who: BasicCredentials) = who.username == root.user && who.password == root.pass
}
