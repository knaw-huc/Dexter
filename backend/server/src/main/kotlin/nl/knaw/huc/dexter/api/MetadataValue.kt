import nl.knaw.huc.dexter.api.ResultTag
import nl.knaw.huc.dexter.api.ResultLanguage
import nl.knaw.huc.dexter.api.ResultSource
import nl.knaw.huc.dexter.api.ResultSourceWithResources
import java.util.*

data class FormMetadataValue(
    val keyId: UUID,
    val value: String
)

data class ResultMetadataValue(
    val id: UUID,
    val keyId: UUID,
    val value: String,
    val createdBy: UUID
)

data class ResultMetadataValueWithResources(
    val id: UUID,
    // val keyId: UUID,
    val value: String,
    val createdBy: UUID,

    val key: ResultMetadataKey
)

fun ResultMetadataValue.toResultMetadataValueWithResources(
    key: ResultMetadataKey
) = ResultMetadataValueWithResources(
    id = id,
    value = value,
    createdBy = createdBy,

    key = key
)