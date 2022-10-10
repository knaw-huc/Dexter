package nl.knaw.huc.dexter.auth

import java.security.Principal

abstract class DexterUser : Principal {
    internal abstract val name: String
    override fun getName(): String = name
}

data class BasicUser(override val name: String) : DexterUser()

data class RootUser(override val name: String = ":root:") : DexterUser()