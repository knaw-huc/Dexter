import java.util.*

data class FormMetadataKey(
    val key: String
)

data class ResultMetadataKey(
    val id: UUID,
    val key: String,
    val createdBy: UUID
)
