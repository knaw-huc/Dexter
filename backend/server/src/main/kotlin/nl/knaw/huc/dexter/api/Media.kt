import java.util.*

data class FormMedia(
    val title: String,
    val url: String
)

data class Media(
    val title: String,
    val url: String,
    val mediaType: SupportedMediaType,
)

data class ResultMedia(
    val id: UUID,
    val title: String,
    val url: String,
    val mediaType: SupportedMediaType,
    val createdBy: UUID
)

fun FormMedia.toMedia(
    mediaType: SupportedMediaType
) = Media(
    title = title,
    url = url,

    mediaType = mediaType,
)