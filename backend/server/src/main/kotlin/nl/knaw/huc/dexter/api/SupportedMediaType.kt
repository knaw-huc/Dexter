import com.fasterxml.jackson.core.JsonGenerator
import com.fasterxml.jackson.databind.JsonSerializer
import com.fasterxml.jackson.databind.SerializerProvider
import nl.knaw.huc.dexter.db.MediaDao
import org.jdbi.v3.core.mapper.ColumnMapper
import org.jdbi.v3.core.statement.StatementContext
import java.io.IOException
import java.sql.ResultSet
import java.sql.SQLException
import java.time.format.DateTimeParseException

/**
 * Supported media types, also exposing:
 * - type
 * - subtype
 *
 * As described in https://en.wikipedia.org/wiki/Media_type#Naming
 */
enum class SupportedMediaType(
    val mediaType: String
) {

    IMAGE_JPEG("image/jpeg"),
    IMAGE_PNG( "image/png");

    val type: String
    val subtype: String

    companion object {
        fun fromMediaType(mediaType: String): SupportedMediaType {
            for (b in SupportedMediaType.values()) {
                if (b.mediaType.equals(mediaType, ignoreCase = true)) {
                    return b
                }
            }
             MediaDao.mediaTypeNotSupported(mediaType)
        }

        /**
         * Find supported MediaTypes by their type
         * as in <type>/<subtype>
         * as described at https://en.wikipedia.org/wiki/Media_type#Naming
         */
        fun byType(type: SupportedMediaTypeType): List<SupportedMediaType> {
            return SupportedMediaType.values().filter { t -> t.type == type.name }
        }

    }

    init {
        val parts = mediaType.split("/")
        this.type = parts[0]
        this.subtype = parts[1]
    }
}

enum class SupportedMediaTypeType {
    image
}

class SupportedMediaTypeSerializer() : JsonSerializer<SupportedMediaType>() {

    @Throws(IOException::class)
    override fun serialize(
        supportedMediaType: SupportedMediaType,
        serializer: JsonGenerator,
        serializerProvider: SerializerProvider
    ) {
        try {
            serializer.writeString(supportedMediaType.mediaType)
        } catch (ex: DateTimeParseException) {
            throw RuntimeException(String.format("Could not serialize SupportedMediaType [%s]", supportedMediaType), ex)
        }
    }
}
