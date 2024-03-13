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

    val references: List<ResultReference>,
    val corpora: List<ResultCorpus>,
    val languages: List<ResultLanguage>,
    val media: List<ResultMedia>,
    val metadataValues: List<ResultMetadataValueWithResources>,
    val tags: List<ResultTag>
)

fun ResultSource.toResultSourceWithResources(
    references: List<ResultReference>,
    corpora: List<ResultCorpus>,
    languages: List<ResultLanguage>,
    media: List<ResultMedia>,
    metadataValues: List<ResultMetadataValueWithResources>,
    tags: List<ResultTag>
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

    references = references,
    corpora = corpora,
    languages = languages,
    media = media,
    metadataValues = metadataValues,
    tags = tags
)