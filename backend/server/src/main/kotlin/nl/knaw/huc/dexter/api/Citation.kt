package nl.knaw.huc.dexter.api

import java.util.*

data class  FormReference(
    val input: String,
    val formatted: String,
    val terms: String
)

data class ResultReference(
    val id: UUID,
    val input: String,
    val formatted: String,
    val createdBy: UUID
)
