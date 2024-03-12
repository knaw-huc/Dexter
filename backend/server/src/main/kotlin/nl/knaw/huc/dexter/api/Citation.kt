package nl.knaw.huc.dexter.api

import java.util.*

data class  FormCitation(
    val input: String,
    val terms: String
)

data class ResultCitation(
    val id: UUID,
    val input: String,
    val createdBy: UUID
)
