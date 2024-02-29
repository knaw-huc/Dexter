import com.fasterxml.jackson.core.JsonGenerationException
import com.fasterxml.jackson.core.JsonProcessingException
import com.fasterxml.jackson.databind.exc.InvalidDefinitionException
import io.dropwizard.jersey.errors.ErrorMessage
import io.dropwizard.jersey.errors.LoggingExceptionMapper
import nl.knaw.huc.dexter.resources.AboutResource
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.util.*
import javax.ws.rs.core.MediaType
import javax.ws.rs.core.Response
import javax.ws.rs.ext.Provider

/**
 * Adapted from
 * @see io.dropwizard.jersey.jackson.JsonProcessingExceptionMapper
 * - Replace debug with warn log
 * - Remove showDetails toggle
 * - Add ID to trace error in logs
 */
@Provider
class JsonProcessingExceptionWithIdMapper : LoggingExceptionMapper<JsonProcessingException>() {

    val log: Logger = LoggerFactory.getLogger(JsonProcessingExceptionWithIdMapper::class.java)

    override fun toResponse(exception: JsonProcessingException): Response {
        val errorId = UUID.randomUUID();
        return if (exception !is JsonGenerationException && exception !is InvalidDefinitionException) {
            log.warn("Unable to process JSON (ID $errorId)", exception)
            val errorMessage = ErrorMessage(
                Response.Status.BAD_REQUEST.statusCode,
                "Unable to process JSON (use ID $errorId to find error details in the logging)",
            )
            Response
                .status(Response.Status.BAD_REQUEST)
                .type(MediaType.APPLICATION_JSON_TYPE)
                .entity(errorMessage)
                .build()
        } else {
            super.toResponse(exception)
        }
    }
}
