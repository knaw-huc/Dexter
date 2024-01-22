package nl.knaw.huc.dexter.resources

import FormTmsImport
import ResultTmsImport
import WereldCulturenDublinCoreImporter
import io.dropwizard.auth.Auth
import nl.knaw.huc.dexter.api.ResourcePaths
import nl.knaw.huc.dexter.auth.DexterUser
import org.slf4j.LoggerFactory
import java.text.MessageFormat
import javax.ws.rs.*
import javax.ws.rs.core.MediaType.APPLICATION_JSON

/**
 * Convert tms linked art export of wereldculturen AAMU collection into a subset of dublin core fields
 */
@Path(ResourcePaths.IMPORT)
@Produces(APPLICATION_JSON)
class ImportResource(
    private val mapper: WereldCulturenDublinCoreImporter
) {
    private val log = LoggerFactory.getLogger(javaClass)
    private val importableUrlMatcher = Regex("https://hdl\\.handle\\.net/20\\.500\\.11840/([0-9]*)")
    private val resourceUrl = "https://collectie.wereldculturen.nl/ccrdf/ccrdf.py?command=search&query="

    @POST
    @Path("/${ResourcePaths.WERELDCULTUREN}")
    @Consumes(APPLICATION_JSON)
    fun convertTmsLinkedArtExportIntoDublinCoreFields(
        form: FormTmsImport,
        @Auth user: DexterUser
    ): ResultTmsImport {
        log.info("user=[${user.name}]: formCorpus=[$form]")
        val found = this.importableUrlMatcher.find(form.url)
        return if (found == null || found.groups.isEmpty()) {
            ResultTmsImport(false)
        } else {
            val sourceId = found.groups[1]?.value
            val url = resourceUrl + sourceId
            ResultTmsImport(true, mapper.import(url))
        }
    }

}