package nl.knaw.huc.dexter.auth

import nl.knaw.huc.dexter.auth.RoleNames.ADMIN
import nl.knaw.huc.dexter.auth.RoleNames.GUEST
import nl.knaw.huc.dexter.auth.RoleNames.ROOT
import nl.knaw.huc.dexter.auth.RoleNames.USER

enum class DexterRoles(val roleName: String) {
    GUEST_ROLE(roleName = GUEST),
    USER_ROLE(roleName = USER),
    ADMIN_ROLE(roleName = ADMIN),
    ROOT_ROLE(roleName = ROOT);
}
