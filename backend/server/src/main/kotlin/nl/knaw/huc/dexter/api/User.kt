package nl.knaw.huc.dexter.api

import java.util.*

data class User(val id: UUID, val name: String)

data class UserResult(val name: String, val settings: ResultUserSettings)

data class FormUserSettings(
        val referenceStyle: ReferenceStyle?
)

data class ResultUserSettings(
        val referenceStyle: ReferenceStyle?
)

enum class ReferenceStyle {
    apa, vancouver, harvard1, chicago
}
