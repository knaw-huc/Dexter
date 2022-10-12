package nl.knaw.huc.dexter.api

import java.time.LocalDate
import java.time.LocalDateTime
import java.util.*

data class FormSource(
    val title: String,
    val description: String,
    val rights: String,
    val access: AccessType,
    val externalRef: String? = null,
    val location: String? = null,
    val earliest: LocalDate? = null,
    val latest: LocalDate? = null,
    val notes: String? = null,
)

data class ResultSource(
    val id: UUID,
    val externalRef: String? = null,
    val title: String,
    val description: String,
    val rights: String,
    val access: AccessType,
    val location: String? = null,
    val earliest: LocalDate? = null,
    val latest: LocalDate? = null,
    val notes: String? = null,
    val createdBy: UUID,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)
