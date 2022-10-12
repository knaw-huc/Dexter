package nl.knaw.huc.dexter.api

import java.time.LocalDate
import java.time.LocalDateTime
import java.util.UUID

data class FormCorpus(
    val title: String,
    val description: String,
    val rights: String,
    val access: AccessType,
    val parentId: UUID? = null,
    val location: String? = null,
    val earliest: LocalDate? = null,
    val latest: LocalDate? = null,
    val contributor: String? = null,
    val notes: String? = null
)

data class ResultCorpus(
    val id: UUID,
    val parentId: UUID?,
    val title: String,
    val description: String,
    val rights: String,
    val access: AccessType,
    val location: String? = null,
    val earliest: LocalDate? = null,
    val latest: LocalDate? = null,
    val contributor: String? = null,
    val notes: String? = null,
    val createdBy: UUID,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)
