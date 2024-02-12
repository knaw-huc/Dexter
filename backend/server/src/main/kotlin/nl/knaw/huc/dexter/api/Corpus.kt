package nl.knaw.huc.dexter.api

import ResultMetadataValueWithResources
import java.time.LocalDate
import java.time.LocalDateTime
import java.util.*

data class FormCorpus(
    val title: String,
    val description: String? = null,
    val rights: String? = null,
    val access: AccessType? = null,
    val parentId: UUID? = null,
    val location: String? = null,
    val earliest: LocalDate? = null,
    val latest: LocalDate? = null,
    val contributor: String? = null,
    val notes: String? = null,
    val ethics: String? = null
)

data class ResultCorpus(
    val id: UUID,
    val parentId: UUID?,
    val title: String,
    val description: String? = null,
    val rights: String? = null,
    val access: AccessType? = null,
    val location: String? = null,
    val earliest: LocalDate? = null,
    val latest: LocalDate? = null,
    val contributor: String? = null,
    val notes: String? = null,
    val ethics: String? = null,
    val createdBy: UUID,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)

/**
 * With associated child resources
 */
data class ResultCorpusWithResources (
    val id: UUID,
    // val parentId: UUID?,
    val title: String,
    val description: String? = null,
    val rights: String? = null,
    val access: AccessType? = null,
    val location: String? = null,
    val earliest: LocalDate? = null,
    val latest: LocalDate? = null,
    val contributor: String? = null,
    val notes: String? = null,
    val ethics: String? = null,
    val createdBy: UUID,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime,

    val parent: ResultCorpus? = null,
    val tags: List<ResultTag>,
    val languages: List<ResultLanguage>,
    val sources: List<ResultSourceWithResources>,
    val metadataValues: List<ResultMetadataValueWithResources>
)

fun ResultCorpus.toResultCorpusWithResources(
    parent: ResultCorpus? = null,
    tags: List<ResultTag>,
    languages: List<ResultLanguage>,
    sources: List<ResultSourceWithResources>,
    metadataValues: List<ResultMetadataValueWithResources>
) = ResultCorpusWithResources(
    id = id,
    title = title,
    description = description,
    rights = rights,
    access = access,
    location = location,
    earliest = earliest,
    latest = latest,
    contributor = contributor,
    notes = notes,
    ethics = ethics,
    createdBy = createdBy,
    createdAt = createdAt,
    updatedAt = updatedAt,

    parent = parent,
    tags = tags,
    languages = languages,
    sources = sources,
    metadataValues = metadataValues
)
