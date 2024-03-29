package nl.knaw.huc.dexter.auth

import java.security.Principal
import java.util.*

abstract class DexterUser : Principal {
    internal abstract val name: String
    override fun getName(): String = name

    internal abstract val id: UUID
    fun getId(): UUID = id

    internal abstract val role: DexterRole
}

data class BasicUser(
    override val name: String,
    override val id: UUID
) : DexterUser() {
    override val role: DexterRole
        get() = DexterRole.USER_ROLE
}

data class RootUser(
    override val name: String,
    // Root user ID is configured in {@link RootConfig}
    // TODO: Insert root user as regular user in database
    override val id: UUID
) : DexterUser() {
    override val role: DexterRole
        get() = DexterRole.ROOT_ROLE
}
