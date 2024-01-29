import java.util.*

data class ResultMetadataKeyValue(
    val key: String,
    val value: String,
    val keyId: UUID,
    val valueId: UUID,
)
