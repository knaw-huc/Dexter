package nl.knaw.huc.dexter.config

import javax.validation.Valid
import javax.validation.constraints.NotNull

class FlywayConfiguration {
    @Valid
    @NotNull
    var baselineOnMigrate: Boolean = false

    @Valid
    @NotNull
    var baselineVersion: String = "1"

    @Valid
    @NotNull
    var cleanDisabled: Boolean = true

    @Valid
    @NotNull
    var locations: Array<String> = emptyArray()

}