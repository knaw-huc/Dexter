package nl.knaw.huc.dexter.api

import java.util.*

data class  FormTag(
    val `val`: String
)

data class ResultTag(
    val id: Int,
    val `val`: String,
    val createdBy: UUID
)
