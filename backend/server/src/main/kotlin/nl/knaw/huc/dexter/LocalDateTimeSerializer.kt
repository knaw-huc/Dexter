package nl.knaw.huc.dexter

import com.fasterxml.jackson.core.JsonGenerator
import com.fasterxml.jackson.databind.JsonSerializer
import com.fasterxml.jackson.databind.SerializerProvider
import java.io.IOException
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.time.format.DateTimeParseException

/**
 * Converts LocalDateTime result to json datetime format
 */
class LocalDateTimeSerializer(dateFormat: String) : JsonSerializer<LocalDateTime>() {
    private val formatter = DateTimeFormatter.ofPattern(dateFormat)

    @Throws(IOException::class)
    override fun serialize(dateTime: LocalDateTime, serializer: JsonGenerator, serializerProvider: SerializerProvider) {
        try {
            serializer.writeString(dateTime.format(formatter))
        } catch (ex: DateTimeParseException) {
            throw RuntimeException(String.format("Could not serialize date [%s]", dateTime), ex)
        }
    }
}
