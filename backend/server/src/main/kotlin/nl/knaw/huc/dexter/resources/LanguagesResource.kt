package nl.knaw.huc.dexter.resources

import nl.knaw.huc.dexter.api.ResourcePaths.AUTOCOMPLETE
import nl.knaw.huc.dexter.api.ResourcePaths.ID_PARAM
import nl.knaw.huc.dexter.api.ResourcePaths.ID_PATH
import nl.knaw.huc.dexter.api.ResourcePaths.LANGUAGES
import nl.knaw.huc.dexter.api.ResultLanguage
import nl.knaw.huc.dexter.db.LanguagesDao
import org.jdbi.v3.core.Jdbi
import javax.ws.rs.*
import javax.ws.rs.core.MediaType.APPLICATION_JSON

@Path(LANGUAGES)
@Produces(APPLICATION_JSON)
class LanguageResource(private val jdbi: Jdbi) {
    @GET
    fun list() = languages().list()

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
            if (key.length > 2)
                dao.findByRefName("%$key%")
            else
                emptyList()
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