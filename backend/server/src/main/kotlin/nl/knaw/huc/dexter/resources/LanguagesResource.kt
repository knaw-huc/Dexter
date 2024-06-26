package nl.knaw.huc.dexter.resources

import io.swagger.v3.oas.annotations.Operation
import nl.knaw.huc.dexter.api.ResultListLanguage
import nl.knaw.huc.dexter.api.ResourcePaths.AUTOCOMPLETE
import nl.knaw.huc.dexter.api.ResourcePaths.ID_PARAM
import nl.knaw.huc.dexter.api.ResourcePaths.ID_PATH
import nl.knaw.huc.dexter.api.ResourcePaths.LANGUAGES
import nl.knaw.huc.dexter.api.ResultLanguage
import nl.knaw.huc.dexter.auth.RoleNames
import nl.knaw.huc.dexter.db.LanguagesDao
import org.jdbi.v3.core.Jdbi
import org.slf4j.LoggerFactory
import javax.annotation.security.RolesAllowed
import javax.validation.constraints.NotNull
import javax.ws.rs.*
import javax.ws.rs.core.MediaType.APPLICATION_JSON
import javax.ws.rs.core.MediaType.TEXT_PLAIN

private const val ISO_639_URL = "https://iso639-3.sil.org/code_tables/download_tables"

private const val LANGUAGE_SEED_DESCRIPTION = "You can seed the languages table with the ISO 639-3 Code Set (UTF-8), " +
        "a tab separated file that you can download (zipped) at $ISO_639_URL. " +
        "E.g: curl --upload-file iso-639-3.tab <base_uri>/languages"

@Path(LANGUAGES)
@RolesAllowed(RoleNames.USER)
@Produces(APPLICATION_JSON)
class LanguagesResource(private val jdbi: Jdbi) {
    private val log = LoggerFactory.getLogger(javaClass)

    @GET
    fun list() = mapOf(
        "source" to "ISO 639-3 Downloads from: $ISO_639_URL",
        "termsOfUse" to "$ISO_639_URL#termsofuse",
        "languages" to languages().list()
            .map { ResultListLanguage(it.id, it.refName) }
            .ifEmpty {
                throw NotFoundException(LANGUAGE_SEED_DESCRIPTION)
            })

    @PUT
    @Operation(description = LANGUAGE_SEED_DESCRIPTION)
    @RolesAllowed(RoleNames.ROOT)
    @Consumes(TEXT_PLAIN)
    fun seed(@NotNull contents: String) =
        contents
            .lineSequence()
            .also { validateHeaderLine(it.first()) }
            .drop(1) // Ignore CSV header line
            .filter { line -> !line.isEmpty() }
            .map { line ->
                languageFromTabSeparated(line).also { log.trace("Adding [${it.id}] -> [${it.refName}]") }
            }
            .let {
                languages().seed(it.asIterable())
                mapOf("count" to languages().count())
            }

    private fun validateHeaderLine(headerLine: String) {
        if (headerLine.lowercase() != "Id\tPart2B\tPart2T\tPart1\tScope\tLanguage_Type\tRef_Name\tComment".lowercase()) {
            log.warn("Invalid iso-639-3 code file, header was [$headerLine].")
            throw BadRequestException(
                "Invalid iso-639-3 Code Set file, please get it from: $ISO_639_URL"
            )
        }
    }

    private fun languageFromTabSeparated(line: String) =
        line.split('\t').let { cols ->
            ResultLanguage(
                id = cols[0],
                part2b = cols[1].ifBlank { null },
                part2t = cols[2].ifBlank { null  },
                part1 = cols[3].ifBlank { null },
                scope = cols[4][0],
                type = cols[5][0],
                refName = cols[6],
                comment = cols[7].ifBlank { null }
            )
        }

    @GET
    @Path(ID_PATH)
    fun getById(@PathParam(ID_PARAM) id: String) = languages().findById(id)

    @POST
    @Path(AUTOCOMPLETE)
    fun find(key: String): List<ResultLanguage> {
        val dao = languages()

        return when (key.length) {
            1 -> dao.findByLength1(key)
            2 -> dao.findByLength2(key)
            3 -> dao.findByLength3(key)
            else -> emptyList()
        }.ifEmpty {
            if (key.length > 2) dao.findByRefName("%$key%")
            else emptyList()
        }.sortedWith { o1, o2 ->
            when (o1.type) {
                o2.type -> o1.refName.compareTo(o2.refName)
                'E' -> 1
                else -> -1
            }
        }.sortedByDescending {
            listOfNotNull(it.part1, it.part2b, it.part2t).count()
        }
    }

    private fun languages() = jdbi.onDemand(LanguagesDao::class.java)
}