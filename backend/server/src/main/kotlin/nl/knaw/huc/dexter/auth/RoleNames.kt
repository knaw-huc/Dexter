package nl.knaw.huc.dexter.auth

// names as constants here to have them compile-time resolvable in @RolesAllowed(…)
object RoleNames {
    const val GUEST = "guest"
    const val USER = "user"
    const val ADMIN = "admin"
    const val ROOT = "root"
}
