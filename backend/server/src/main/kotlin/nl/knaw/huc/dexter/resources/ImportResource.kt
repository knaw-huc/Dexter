package nl.knaw.huc.dexter.resources

import FormTmsImport
import ResultImport
import WereldCulturenImporter
import io.dropwizard.auth.Auth
import nl.knaw.huc.dexter.api.ResourcePaths
import nl.knaw.huc.dexter.auth.DexterUser
import nl.knaw.huc.dexter.auth.RoleNames
import org.slf4j.LoggerFactory
import javax.annotation.security.RolesAllowed
import javax.ws.rs.*
import javax.ws.rs.core.MediaType.APPLICATION_JSON

/**
 * Convert tms linked art export of wereldculturen AAMU collection into a subset of dublin core fields
 */
@Path(ResourcePaths.IMPORT)
@RolesAllowed(RoleNames.USER)
@Produces(APPLICATION_JSON)
class ImportResource(
    private val importer: WereldCulturenImporter
) {
    private val log = LoggerFactory.getLogger(javaClass)
    private val wereldculturenHandleUrlMatcher = Regex("https://hdl\\.handle\\.net/20\\.500\\.11840/([0-9]*)")
    private val wereldculturenResourceUrl = "https://collectie.wereldculturen.nl/ccrdf/ccrdf.py?command=search&query="

    @POST
    @Path("/${ResourcePaths.WERELDCULTUREN}")
    @Consumes(APPLICATION_JSON)
    fun importWereldculturen(
        form: FormTmsImport,
        @Auth user: DexterUser
    ): ResultImport {
        log.info("user=[${user.name}]: formCorpus=[$form]")
        val found = this.wereldculturenHandleUrlMatcher.find(form.url)
        return if (found == null || found.groups.isEmpty()) {
            ResultImport(false)
        } else {
            val sourceId = found.groups[1]?.value
            val url = wereldculturenResourceUrl + sourceId
            ResultImport(true, importer.import(url))
        }
    }

}