package nl.knaw.huc.dexter.resources

import FormTmsExport
import ResultDublinCoreMetadata
import WereldCulturenDublinCoreImporter
import io.dropwizard.auth.Auth
import nl.knaw.huc.dexter.api.ResourcePaths
import nl.knaw.huc.dexter.auth.DexterUser
import org.slf4j.LoggerFactory
import javax.ws.rs.*
import javax.ws.rs.core.MediaType.APPLICATION_JSON

/**
 * Convert tms linked art export of wereldculturen AAMU collection into a subset of dublin core fields
 */
@Path(ResourcePaths.WERELDCULTUREN)
@Produces(APPLICATION_JSON)
class WereldCulturenResource(
    private val mapper: WereldCulturenDublinCoreImporter
) {
    private val log = LoggerFactory.getLogger(javaClass)

    @POST
    @Path("/${ResourcePaths.CONVERT}")
    @Consumes(APPLICATION_JSON)
    fun convertTmsLinkedArtExportIntoDublinCoreFields(
        form: FormTmsExport,
        @Auth user: DexterUser
    ): ResultDublinCoreMetadata {
        log.info("user=[${user.name}]: formCorpus=[$form]")
        return mapper.import(form)
    }

}