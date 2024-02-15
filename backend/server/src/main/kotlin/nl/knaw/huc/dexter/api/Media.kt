import nl.knaw.huc.dexter.api.ResultTag
import nl.knaw.huc.dexter.api.ResultLanguage
import nl.knaw.huc.dexter.api.ResultSource
import nl.knaw.huc.dexter.api.ResultSourceWithResources
import java.net.URL
import java.util.*

data class FormMedia(
    val title: String,
    val url: URL,
    val mediaType: SupportedMediaType,
    val createdBy: UUID
)

data class ResultMedia(
    val id: UUID,
    val title: String,
    val url: URL,
    val mediaType: SupportedMediaType,
    val createdBy: UUID
)
