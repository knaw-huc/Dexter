package nl.knaw.huc.dexter.auth

import nl.knaw.huc.dexter.auth.RoleNames.ROOT
import nl.knaw.huc.dexter.auth.RoleNames.USER

enum class DexterRole(val roleName: String) {
    USER_ROLE(roleName = USER),
    ROOT_ROLE(roleName = ROOT);
}
