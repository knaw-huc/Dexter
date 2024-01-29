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
