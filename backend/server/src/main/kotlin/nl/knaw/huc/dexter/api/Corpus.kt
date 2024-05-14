package nl.knaw.huc.dexter.api

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
data class ResultCorpusWithChildIds(
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
    val updatedAt: LocalDateTime,

    val tags: List<Int>,
    val languages: List<String>,
    val sources: List<UUID>,
    val metadataValues: List<UUID>,
    val media: List<UUID>,
    val subcorpora: List<UUID>
)

fun ResultCorpus.toResultCorpusWithChildIds(
    tags: List<Int>,
    languages: List<String>,
    sources: List<UUID>,
    metadataValues: List<UUID>,
    media: List<UUID>,
    subcorpora: List<UUID>
) = ResultCorpusWithChildIds(
    id = id,
    parentId = parentId,
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

    tags = tags,
    languages = languages,
    sources = sources,
    metadataValues = metadataValues,
    media = media,
    subcorpora = subcorpora
)
