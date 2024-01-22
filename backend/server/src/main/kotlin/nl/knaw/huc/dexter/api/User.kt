package nl.knaw.huc.dexter.api

import java.util.UUID

data class User(val id: UUID, val name: String)

data class UserResult(val name: String)