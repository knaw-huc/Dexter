package nl.knaw.huc.dexter.resources

import io.dropwizard.auth.Auth
import nl.knaw.huc.dexter.api.FormCorpus
import nl.knaw.huc.dexter.api.ResourcePaths
import nl.knaw.huc.dexter.api.ResourcePaths.ID_PARAM
import nl.knaw.huc.dexter.api.ResourcePaths.ID_PATH
import nl.knaw.huc.dexter.api.ResourcePaths.KEYWORDS
import nl.knaw.huc.dexter.api.ResourcePaths.LANGUAGES
import nl.knaw.huc.dexter.api.ResourcePaths.SOURCES
import nl.knaw.huc.dexter.api.ResultCorpus
import nl.knaw.huc.dexter.auth.DexterUser
import nl.knaw.huc.dexter.db.CorporaDao
import nl.knaw.huc.dexter.db.DaoBlock
import nl.knaw.huc.dexter.db.UsersDao
import nl.knaw.huc.dexter.helpers.PsqlDiagnosticsHelper.Companion.diagnoseViolations
import org.jdbi.v3.core.Jdbi
import org.jdbi.v3.core.transaction.TransactionIsolationLevel.REPEATABLE_READ
import org.slf4j.LoggerFactory
import java.util.*
import javax.ws.rs.*
import javax.ws.rs.core.MediaType.APPLICATION_JSON
import javax.ws.rs.core.MediaType.TEXT_PLAIN
import javax.ws.rs.core.Response

@Path(ResourcePaths.CORPORA)
@Produces(APPLICATION_JSON)
class CorporaResource(private val jdbi: Jdbi) {
    private val log = LoggerFactory.getLogger(javaClass)

    @GET
    fun getCorporaList() = corpora().list()

    @GET
    @Path(ID_PATH)
    fun getCorpus(@PathParam(ID_PARAM) id: UUID): ResultCorpus =
        corpora().find(id) ?: corpusNotFound(id)

    @POST
    @Consumes(APPLICATION_JSON)
    fun createCorpus(formCorpus: FormCorpus, @Auth user: DexterUser): ResultCorpus {
        log.info("createCorpus[${user.name}]: formCorpus=[$formCorpus]")
        return jdbi.inTransaction<ResultCorpus, Exception>(REPEATABLE_READ) { tx ->
            val userDao = tx.attach(UsersDao::class.java)
            val corpusDao = tx.attach(CorporaDao::class.java)
            val createdBy = userDao.findByName(user.name) ?: throw NotFoundException("Unknown user: $user")
            diagnoseViolations { corpusDao.insert(formCorpus, createdBy.id) }
        }
    }

    @PUT
    @Consumes(APPLICATION_JSON)
    @Path(ID_PATH)
    fun updateCorpus(
        @PathParam(ID_PARAM) id: UUID,
        formCorpus: FormCorpus,
        @Auth user: DexterUser
    ): ResultCorpus =
        onExistingCorpus(id) { dao, corpus ->
            log.info("updateCorpus[${user.name}]: corpusId=$corpus.id, formCorpus=$formCorpus")
            dao.update(id, formCorpus)
        }

    @DELETE
    @Path(ID_PATH)
    fun deleteCorpus(@PathParam(ID_PARAM) id: UUID, @Auth user: DexterUser): Response =
        onExistingCorpus(id) { dao, corpus ->
            log.warn("deleteCorpus[${user.name}] deleting: $corpus")
            dao.delete(id)
            Response.noContent().build()
        }

    @GET
    @Path("$ID_PATH/$KEYWORDS")
    fun getKeywords(@PathParam(ID_PARAM) id: UUID) =
        onExistingCorpus(id) { dao, corpus ->
            dao.getKeywords(corpus.id)
        }

    @POST
    @Consumes(TEXT_PLAIN)
    @Path("$ID_PATH/$KEYWORDS")
    fun addKeyword(@PathParam(ID_PARAM) id: UUID, keywordId: String) =
        onExistingCorpus(id) { dao, corpus ->
            log.info("addKeyword: corpusId=${corpus.id}, keywordId=$keywordId")
            dao.addKeyword(corpus.id, keywordId.toInt())
            dao.getKeywords(corpus.id)
        }

    @POST
    @Consumes(APPLICATION_JSON)
    @Path("$ID_PATH/$KEYWORDS")
    fun addKeywords(@PathParam(ID_PARAM) id: UUID, keywordIs: List<Int>) =
        onExistingCorpus(id) { dao, corpus ->
            log.info("addKeywords: corpusId=${corpus.id}, keywordIds=$keywordIs")
            keywordIs.forEach { keywordId -> dao.addKeyword(corpus.id, keywordId) }
            dao.getKeywords(corpus.id)
        }

    @DELETE
    @Path("$ID_PATH/$KEYWORDS/{keywordId}")
    fun deleteKeyword(
        @PathParam(ID_PARAM) id: UUID,
        @PathParam("keywordId") keywordId: Int
    ) = onExistingCorpus(id) { dao, corpus ->
        log.info("deleteKeyword: corpusId=${corpus.id}, keywordId=$keywordId")
        dao.deleteKeyword(corpus.id, keywordId)
        dao.getKeywords(corpus.id)
    }

    @GET
    @Path("$ID_PATH/$LANGUAGES")
    fun getLanguages(@PathParam(ID_PARAM) id: UUID) =
        onExistingCorpus(id) { dao, corpus ->
            dao.getLanguages(corpus.id)
        }

    @POST
    @Consumes(TEXT_PLAIN)
    @Path("$ID_PATH/$LANGUAGES")
    fun addLanguage(@PathParam(ID_PARAM) id: UUID, languageId: String) =
        onExistingCorpus(id) { dao, corpus ->
            log.info("addLanguage: corpusId=${corpus.id}, languageId=$languageId")
            dao.addLanguage(corpus.id, languageId)
            dao.getLanguages(id)
        }

    @POST
    @Consumes(APPLICATION_JSON)
    @Path("$ID_PATH/$LANGUAGES")
    fun addLanguages(@PathParam(ID_PARAM) id: UUID, languageIds: List<String>) =
        onExistingCorpus(id) { dao, corpus ->
            log.info("addLanguages: corpusId=${corpus.id}, languageIds=$languageIds")
            languageIds.forEach { languageId -> dao.addLanguage(corpus.id, languageId) }
            dao.getLanguages(corpus.id)
        }


    @DELETE
    @Path("$ID_PATH/$LANGUAGES/{languageId}")
    fun deleteLanguage(
        @PathParam(ID_PARAM) id: UUID,
        @PathParam("languageId") languageId: String
    ) = onExistingCorpus(id) { dao, corpus ->
        log.info("deleteLanguage: corpusId=${corpus.id}, languageId=$languageId")
        dao.deleteLanguage(corpus.id, languageId)
        dao.getLanguages(corpus.id)
    }

    @GET
    @Path("$ID_PATH/$SOURCES")
    fun getSources(@PathParam(ID_PARAM) corpusId: UUID) =
        onExistingCorpus(corpusId) { dao, corpus ->
            dao.getSources(corpus.id)
        }

    @POST
    @Consumes(APPLICATION_JSON)
    @Path("$ID_PATH/$SOURCES")
    fun addSources(@PathParam(ID_PARAM) corpusId: UUID, sourceIds: List<UUID>) =
        onExistingCorpus(corpusId) { dao, corpus ->
            log.info("addSources: corpusId=${corpus.id}, sourceIds=$sourceIds")
            sourceIds.forEach {sourceId -> dao.addSource(corpus.id, sourceId)}
            dao.getSources(corpus.id)
        }

    @DELETE
    @Path("$ID_PATH/$SOURCES/{sourceId}")
    fun deleteSource(
        @PathParam(ID_PARAM) id: UUID,
        @PathParam("sourceId") sourceId: UUID
    ) = onExistingCorpus(id) { dao, corpus ->
        log.info("deleteSource: corpusId=${corpus.id}, sourceId=$sourceId")
        dao.deleteSource(corpus.id, sourceId)
        dao.getSources(corpus.id)
    }

    private fun <R> onExistingCorpus(id: UUID, block: DaoBlock<CorporaDao, ResultCorpus, R>): R =
        jdbi.inTransaction<R, Exception>(REPEATABLE_READ) { handle ->
            handle.attach(CorporaDao::class.java).let { dao ->
                dao.find(id)?.let { corpus ->
                    diagnoseViolations { block.execute(dao, corpus) }
                } ?: corpusNotFound(id)
            }
        }

    private fun corpusNotFound(corpusId: UUID): Nothing = throw NotFoundException("Corpus not found: $corpusId")

    private fun corpora(): CorporaDao = jdbi.onDemand(CorporaDao::class.java)
}