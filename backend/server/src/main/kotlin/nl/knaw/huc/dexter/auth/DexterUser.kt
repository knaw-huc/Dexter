package nl.knaw.huc.dexter.auth

import nl.knaw.huc.dexter.auth.RoleNames.GUEST
import java.security.Principal

abstract class DexterUser : Principal {
    internal abstract val name: String
    override fun getName(): String = name

    internal abstract val role: DexterRole
}

data class BasicUser(
    override val name: String
) : DexterUser() {
    override val role: DexterRole
        get() = DexterRole.USER_ROLE
}

data class RootUser(
    override val name: String = ":root:"
) : DexterUser() {
    override val role: DexterRole
        get() = DexterRole.ROOT_ROLE
}

data class GuestUser(
    override val name: String = GUEST
) : DexterUser() {
    override val role: DexterRole
        get() = DexterRole.GUEST_ROLE
}