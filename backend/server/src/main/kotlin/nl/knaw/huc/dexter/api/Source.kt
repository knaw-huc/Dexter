package nl.knaw.huc.dexter.api

import java.time.LocalDate
import java.time.LocalDateTime
import java.util.*

data class FormSource(
    val externalRef: String? = null,
    val externalId: String? = null,
    val title: String,
    val description: String? = null,
    val rights: String? = null,
    val access: AccessType? = null,
    val creator: String? = null,
    val location: String? = null,
    val earliest: LocalDate? = null,
    val latest: LocalDate? = null,
    val notes: String? = null,
    val ethics: String? = null,
)

data class ResultSource(
    val id: UUID,
    val externalRef: String? = null,
    val externalId: String? = null,
    val title: String,
    val description: String? = null,
    val rights: String? = null,
    val access: AccessType? = null,
    val creator: String? = null,
    val location: String? = null,
    val earliest: LocalDate? = null,
    val latest: LocalDate? = null,
    val notes: String? = null,
    val ethics: String? = null,
    val createdBy: UUID,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)

/**
 * With associated child resources
 */
data class ResultSourceWithChildIds (
    val id: UUID,
    val externalRef: String? = null,
    val externalId: String? = null,
    val title: String,
    val description: String? = null,
    val rights: String? = null,
    val access: AccessType? = null,
    val creator: String? = null,
    val location: String? = null,
    val earliest: LocalDate? = null,
    val latest: LocalDate? = null,
    val notes: String? = null,
    val ethics: String? = null,
    val createdBy: UUID,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime,

    val references: List<UUID>,
    val corpora: List<UUID>,
    val languages: List<String>,
    val media: List<UUID>,
    val metadataValues: List<UUID>,
    val tags: List<Int>
)

fun ResultSource.toResultSourceWithChildIds(
    references: List<UUID>,
    corpora: List<UUID>,
    languages: List<String>,
    media: List<UUID>,
    metadataValues: List<UUID>,
    tags: List<Int>
) = ResultSourceWithChildIds(
    id = id,
    externalRef = externalRef,
    externalId = externalId,
    title = title,
    description = description,
    rights = rights,
    access = access,
    creator = creator,
    location = location,
    earliest = earliest,
    latest = latest,
    notes = notes,
    ethics = ethics,
    createdBy = createdBy,
    createdAt = createdAt,
    updatedAt = updatedAt,

    references = references,
    corpora = corpora,
    languages = languages,
    media = media,
    metadataValues = metadataValues,
    tags = tags
)