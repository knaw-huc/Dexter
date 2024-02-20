import nl.knaw.huc.dexter.db.MediaDao
import org.apache.commons.lang3.StringUtils
import org.slf4j.LoggerFactory
import java.net.URL
import javax.ws.rs.BadRequestException
import javax.ws.rs.client.Client
import javax.ws.rs.client.ClientBuilder
import javax.ws.rs.core.Response

class MediaTypeChecker {
    companion object {
        val log = LoggerFactory.getLogger(MediaTypeChecker::class.java.name)
        fun getMediaType(url: String): SupportedMediaType {
            val client: Client = ClientBuilder.newClient()
            val validUrl = URL(url)
            val response: Response = client
                .target(validUrl.toURI())
                .request()
                .method("HEAD")

            val contentType: String = response
                .headers["Content-Type"]
                ?.get(0).toString()
            log.debug("Media type found: {}, url checked: {}", contentType, url)
            if (StringUtils.isBlank(contentType)) {
                throw BadRequestException("No media type found for url $url")
            }
            return SupportedMediaType.fromMediaType(contentType)
        }
    }
}