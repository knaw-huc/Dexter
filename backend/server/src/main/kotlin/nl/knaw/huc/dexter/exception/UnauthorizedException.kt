import io.dropwizard.jersey.errors.ErrorMessage
import javax.ws.rs.core.MediaType
import javax.ws.rs.core.Response
import javax.ws.rs.ext.ExceptionMapper

class UnauthorizedException() : Exception()

class UnauthorizedExceptionMapper() : ExceptionMapper<UnauthorizedException?> {
    override fun toResponse(e: UnauthorizedException?): Response {
        val unauthorized = Response.Status.UNAUTHORIZED
        return Response.status(unauthorized)
            .type(MediaType.APPLICATION_JSON_TYPE)
            .entity(
                ErrorMessage(
                    unauthorized.statusCode,
                    unauthorized.name
                )
            )
            .build()
    }
}

