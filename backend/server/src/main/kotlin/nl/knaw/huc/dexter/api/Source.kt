package nl.knaw.huc.dexter.api

import ResultMedia
import ResultMetadataValue
import ResultMetadataValueWithResources
import java.time.LocalDate
import java.time.LocalDateTime
import java.util.*

data class FormSource(
    val title: String,
    val description: String? = null,
    val rights: String? = null,
    val access: AccessType? = null,
    val creator: String? = null,
    val externalRef: String? = null,
    val location: String? = null,
    val earliest: LocalDate? = null,
    val latest: LocalDate? = null,
    val notes: String? = null,
    val ethics: String? = null,
)

data class ResultSource(
    val id: UUID,
    val externalRef: String? = null,
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
data class ResultSourceWithResources (
    val id: UUID,
    val externalRef: String? = null,
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

    val tags: List<ResultTag>,
    val languages: List<ResultLanguage>,
    val metadataValues: List<ResultMetadataValueWithResources>,
    val media: List<ResultMedia>,
    val corpora: List<ResultCorpus>
)

fun ResultSource.toResultSourceWithResources(
    tags: List<ResultTag>,
    languages: List<ResultLanguage>,
    metadataValues: List<ResultMetadataValueWithResources>,
    media: List<ResultMedia>,
    corpora: List<ResultCorpus>
) = ResultSourceWithResources(
    id = id,
    externalRef = externalRef,
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

    tags = tags,
    languages = languages,
    metadataValues = metadataValues,
    media = media,
    corpora = corpora
)