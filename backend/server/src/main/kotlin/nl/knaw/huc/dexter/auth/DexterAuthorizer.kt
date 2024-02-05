package nl.knaw.huc.dexter.auth

import io.dropwizard.auth.Authorizer
import org.slf4j.LoggerFactory

class DexterAuthorizer : Authorizer<DexterUser> {
    private val log = LoggerFactory.getLogger(javaClass)

    override fun authorize(principal: DexterUser?, role: String?): Boolean {
        log.debug("Authorizing principal=[$principal] for role=[$role]")
        var authorized = false
        if(principal is RootUser) {
            authorized = true
        }
        if(principal?.role?.roleName == role) {
            authorized = true
        }
        log.debug("-> authorized=[$authorized]")
        return authorized
    }
}
