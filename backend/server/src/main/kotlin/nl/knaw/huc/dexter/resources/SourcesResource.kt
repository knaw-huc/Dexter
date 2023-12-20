package nl.knaw.huc.dexter.resources

import io.dropwizard.auth.Auth
import nl.knaw.huc.dexter.api.FormSource
import nl.knaw.huc.dexter.api.ResourcePaths
import nl.knaw.huc.dexter.api.ResourcePaths.ID_PARAM
import nl.knaw.huc.dexter.api.ResourcePaths.ID_PATH
import nl.knaw.huc.dexter.api.ResourcePaths.KEYWORDS
import nl.knaw.huc.dexter.api.ResourcePaths.LANGUAGES
import nl.knaw.huc.dexter.api.ResultKeyword
import nl.knaw.huc.dexter.api.ResultSource
import nl.knaw.huc.dexter.auth.DexterUser
import nl.knaw.huc.dexter.auth.RoleNames
import nl.knaw.huc.dexter.db.DaoBlock
import nl.knaw.huc.dexter.db.SourcesDao
import nl.knaw.huc.dexter.db.UsersDao
import nl.knaw.huc.dexter.helpers.PsqlDiagnosticsHelper.Companion.diagnoseViolations
import org.jdbi.v3.core.Jdbi
import org.jdbi.v3.core.transaction.TransactionIsolationLevel.REPEATABLE_READ
import org.slf4j.LoggerFactory
import java.util.*
import javax.annotation.security.RolesAllowed
import javax.ws.rs.*
import javax.ws.rs.core.MediaType.APPLICATION_JSON
import javax.ws.rs.core.MediaType.TEXT_PLAIN
import javax.ws.rs.core.Response

@Path(ResourcePaths.SOURCES)
@Produces(APPLICATION_JSON)
@RolesAllowed(RoleNames.ROOT, RoleNames.USER)
class SourcesResource(private val jdbi: Jdbi) {
    private val log = LoggerFactory.getLogger(javaClass)

    @GET
    fun getSourceList() = sources().list()

    @GET
    @Path(ID_PATH)
    fun getSource(@PathParam(ID_PARAM) id: UUID) = sources().find(id) ?: sourceNotFound(id)

    @POST
    @Consumes(APPLICATION_JSON)
    fun createSource(formSource: FormSource, @Auth user: DexterUser): ResultSource {
        log.info("createSource[${user.name}]: formSource=[$formSource]")
        return jdbi.inTransaction<ResultSource, Exception>(REPEATABLE_READ) { tx ->
            val userDao = tx.attach(UsersDao::class.java)
            val sourceDao = tx.attach(SourcesDao::class.java)
            val createdBy = userDao.findByName(user.name) ?: throw NotFoundException("Unknown user: $user")
            diagnoseViolations { sourceDao.insert(formSource, createdBy.id) }
        }
    }

    @PUT
    @Consumes(APPLICATION_JSON)
    @Path(ID_PATH)
    fun updateSource(
        @PathParam(ID_PARAM) id: UUID, formSource: FormSource, @Auth user: DexterUser
    ): ResultSource = onExistingSource(id) { dao, src ->
        log.info("updateSource[${user.name}: sourceId=$src.id, formSource=$formSource")
        dao.update(id, formSource)
    }

    @DELETE
    @Path(ID_PATH)
    fun deleteSource(@PathParam(ID_PARAM) id: UUID, @Auth user: DexterUser): Response =
        onExistingSource(id) { dao, src ->
            log.info("deleteSource[${user.name}] deleting: $src")
            dao.delete(id)
            Response.noContent().build()
        }

    @GET
    @Path("$ID_PATH/$KEYWORDS")
    fun getKeywords(@PathParam(ID_PARAM) id: UUID) = onExistingSource(id) { dao, src ->
        dao.getKeywords(src.id)
    }

    @POST
    @Consumes(TEXT_PLAIN)
    @Path("$ID_PATH/$KEYWORDS")
    fun addKeyword(@PathParam(ID_PARAM) id: UUID, keywordId: String): List<ResultKeyword> =
        onExistingSource(id) { dao, src ->
            log.info("addKeyword: sourceId=${src.id}, keywordId=$keywordId")
            dao.addKeyword(src.id, keywordId.toInt())
            dao.getKeywords(src.id)
        }

    @POST
    @Consumes(APPLICATION_JSON)
    @Path("$ID_PATH/$KEYWORDS")
    fun addKeywords(@PathParam(ID_PARAM) id: UUID, keywordIds: List<Int>): List<ResultKeyword> =
        onExistingSource(id) { dao, src ->
            log.info("addKeywords: sourceId=${src.id}, keywords=$keywordIds")
            keywordIds.forEach { keywordId -> dao.addKeyword(src.id, keywordId) }
            dao.getKeywords(src.id)
        }

    @DELETE
    @Path("$ID_PATH/$KEYWORDS/{keywordId}")
    fun deleteKeyword(
        @PathParam(ID_PARAM) id: UUID, @PathParam("keywordId") keywordId: Int
    ): List<ResultKeyword> = onExistingSource(id) { dao, src ->
        log.info("deleteKeyword: sourceId=${src.id}, keywordId=$keywordId")
        dao.deleteKeyword(src.id, keywordId)
        dao.getKeywords(src.id)
    }

    @GET
    @Path("$ID_PATH/$LANGUAGES")
    fun getLanguages(@PathParam(ID_PARAM) id: UUID) =
        onExistingSource(id) { dao, src ->
            dao.getLanguages(src.id)
        }

    @POST
    @Path("$ID_PATH/$LANGUAGES")
    fun addLanguage(@PathParam(ID_PARAM) id: UUID, languageId: String) =
        onExistingSource(id) { dao, src ->
            log.info("addLanguage: sourceId=${src.id}, languageId=$languageId")
            dao.addLanguage(src.id, languageId)
            dao.getLanguages(src.id)
        }

    @POST
    @Consumes(APPLICATION_JSON)
    @Path("$ID_PATH/$LANGUAGES")
    fun addLanguages(@PathParam(ID_PARAM) id: UUID, languageIds: List<String>) =
        onExistingSource(id) { dao, src ->
            log.info("addLanguages: sourceId=${src.id}, languageIds=$languageIds")
            languageIds.forEach { languageId -> dao.addLanguage(src.id, languageId) }
            dao.getLanguages(src.id)
        }


    @DELETE
    @Path("$ID_PATH/$LANGUAGES/{languageId}")
    fun deleteLanguage(
        @PathParam(ID_PARAM) id: UUID,
        @PathParam("languageId") languageId: String
    ) = onExistingSource(id) { dao, src ->
        log.info("deleteLanguage: sourceId=${src.id}, languageId=$languageId")
        dao.deleteLanguage(src.id, languageId)
        dao.getLanguages(src.id)
    }

    private fun <R> onExistingSource(id: UUID, block: DaoBlock<SourcesDao, ResultSource, R>): R =
        jdbi.inTransaction<R, Exception>(REPEATABLE_READ) { handle ->
            handle.attach(SourcesDao::class.java).let { dao ->
                dao.find(id)?.let { source ->
                    diagnoseViolations { block.execute(dao, source) }
                } ?: sourceNotFound(id)
            }
        }

    private fun sourceNotFound(sourceId: UUID): Nothing = throw NotFoundException("Source not found: $sourceId")

    private fun sources(): SourcesDao = jdbi.onDemand(SourcesDao::class.java)
}