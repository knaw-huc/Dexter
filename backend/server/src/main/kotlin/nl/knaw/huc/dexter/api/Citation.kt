package nl.knaw.huc.dexter.api

import java.util.*

data class  FormCitation(
    val input: String
)

data class ResultCitation(
    val id: Int,
    val input: String,
    val createdBy: UUID
)
