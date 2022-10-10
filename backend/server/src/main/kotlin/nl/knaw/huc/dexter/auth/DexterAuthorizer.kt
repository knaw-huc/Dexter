package nl.knaw.huc.dexter.auth

import io.dropwizard.auth.Authorizer
import nl.knaw.huc.dexter.auth.RoleNames.ROOT
import org.slf4j.LoggerFactory
import javax.ws.rs.NotAuthorizedException

class DexterAuthorizer : Authorizer<DexterUser> {
    private val log = LoggerFactory.getLogger(javaClass)

    override fun authorize(principal: DexterUser?, role: String?): Boolean {
        if (role == ROOT && principal !is RootUser) {
            log.warn("Denied ROOT access to: $principal")
            throw NotAuthorizedException("This endpoint is for the root user only")
        }

        log.debug("Authorizing principal=[$principal] for role=[$role]")
        return principal is RootUser || role == ""
    }

}
