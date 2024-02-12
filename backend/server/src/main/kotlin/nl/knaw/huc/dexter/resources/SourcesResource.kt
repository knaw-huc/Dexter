package nl.knaw.huc.dexter.resources

import ResultMetadataValue
import UnauthorizedException
import io.dropwizard.auth.Auth
import nl.knaw.huc.dexter.api.*
import nl.knaw.huc.dexter.api.ResourcePaths.ID_PARAM
import nl.knaw.huc.dexter.api.ResourcePaths.ID_PATH
import nl.knaw.huc.dexter.api.ResourcePaths.TAGS
import nl.knaw.huc.dexter.api.ResourcePaths.LANGUAGES
import nl.knaw.huc.dexter.api.ResourcePaths.METADATA
import nl.knaw.huc.dexter.api.ResourcePaths.VALUES
import nl.knaw.huc.dexter.api.ResourcePaths.WITH_RESOURCES
import nl.knaw.huc.dexter.auth.DexterUser
import nl.knaw.huc.dexter.auth.RoleNames
import nl.knaw.huc.dexter.db.DaoBlock
import nl.knaw.huc.dexter.db.HandleBlock
import nl.knaw.huc.dexter.db.SourcesDao
import nl.knaw.huc.dexter.db.SourcesDao.Companion.sourceNotFound
import nl.knaw.huc.dexter.db.UsersDao
import nl.knaw.huc.dexter.helpers.PsqlDiagnosticsHelper.Companion.diagnoseViolations
import nl.knaw.huc.dexter.helpers.WithResourcesHelper.Companion.addSourceResources
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
@RolesAllowed(RoleNames.USER)
@Produces(APPLICATION_JSON)
class SourcesResource(private val jdbi: Jdbi) {
    private val log = LoggerFactory.getLogger(javaClass)

    @GET
    fun getSourceList(
        @Auth user: DexterUser
    ) = sources().listByUser(user.id)

    @GET
    @Path(WITH_RESOURCES)
    fun getSourceWithResourcesList(
        @Auth user: DexterUser
    ): List<ResultSourceWithResources> {
        log.info("get all sources with resources")

        return jdbi.inTransaction<List<ResultSourceWithResources>, Exception>(REPEATABLE_READ) { handle ->
            handle.attach(SourcesDao::class.java).let { sourceDao ->
                sourceDao.listByUser(user.id).map { source ->
                        addSourceResources(source, handle)
                    }
            }
        }
    }

    @GET
    @Path(ID_PATH)
    fun getSource(
        @PathParam(ID_PARAM) id: UUID, @Auth user: DexterUser
    ): ResultSource {
        return sources().findByUser(id, user.id) ?: sourceNotFound(id)
    }

    @GET
    @Path("$ID_PATH/$WITH_RESOURCES")
    fun getSourceWithResources(
        @PathParam(ID_PARAM) id: UUID, @Auth user: DexterUser
    ): ResultSourceWithResources {
        log.info("get source $id with resources")
        return onAccessibleSourceWithHandle(id, user.id) { handle, source ->
            addSourceResources(source, handle)
        }
    }

    @POST
    @Consumes(APPLICATION_JSON)
    fun createSource(
        formSource: FormSource, @Auth user: DexterUser
    ): ResultSource {
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
    ): ResultSource = onAccessibleSource(id, user.id) { dao, src ->
        log.info("updateSource[${user.name}: sourceId=$src.id, formSource=$formSource")
        dao.update(id, formSource)
    }

    @DELETE
    @Path(ID_PATH)
    fun deleteSource(
        @PathParam(ID_PARAM) id: UUID, @Auth user: DexterUser
    ): Response = onAccessibleSource(id, user.id) { dao, src ->
        log.info("deleteSource[${user.name}] deleting: $src")
        dao.delete(id)
        Response.noContent().build()
    }

    @GET
    @Path("$ID_PATH/$TAGS")
    fun getTags(
        @PathParam(ID_PARAM) id: UUID, @Auth user: DexterUser
    ) = onAccessibleSource(id, user.id) { dao, src ->
        dao.getTags(src.id)
    }

    @POST
    @Consumes(TEXT_PLAIN)
    @Path("$ID_PATH/$TAGS")
    fun addTag(
        @PathParam(ID_PARAM) id: UUID, tagId: String, @Auth user: DexterUser
    ): List<ResultTag> = onAccessibleSource(id, user.id) { dao, src ->
        log.info("addTag: sourceId=${src.id}, tagId=$tagId")
        dao.addTag(src.id, tagId.toInt())
        dao.getTags(src.id)
    }

    @POST
    @Consumes(APPLICATION_JSON)
    @Path("$ID_PATH/$TAGS")
    fun addTags(
        @PathParam(ID_PARAM) id: UUID, tagIds: List<Int>, @Auth user: DexterUser
    ): List<ResultTag> = onAccessibleSource(id, user.id) { dao, src ->
        log.info("addTags: sourceId=${src.id}, tags=$tagIds")
        tagIds.forEach { tagId -> dao.addTag(src.id, tagId) }
        dao.getTags(src.id)
    }

    @DELETE
    @Path("$ID_PATH/$TAGS/{tagId}")
    fun deleteTag(
        @PathParam(ID_PARAM) id: UUID, @PathParam("tagId") tagId: Int, @Auth user: DexterUser
    ): List<ResultTag> = onAccessibleSource(id, user.id) { dao, src ->
        log.info("deleteTag: sourceId=${src.id}, tagId=$tagId")
        dao.deleteTag(src.id, tagId)
        dao.getTags(src.id)
    }

    @GET
    @Path("$ID_PATH/$LANGUAGES")
    fun getLanguages(
        @PathParam(ID_PARAM) id: UUID, @Auth user: DexterUser
    ) = onAccessibleSource(id, user.id) { dao, src ->
        dao.getLanguages(src.id)
    }

    @POST
    @Path("$ID_PATH/$LANGUAGES")
    fun addLanguage(
        @PathParam(ID_PARAM) id: UUID, languageId: String, @Auth user: DexterUser
    ) = onAccessibleSource(id, user.id) { dao, src ->
        log.info("addLanguage: sourceId=${src.id}, languageId=$languageId")
        dao.addLanguage(src.id, languageId)
        dao.getLanguages(src.id)
    }

    @POST
    @Consumes(APPLICATION_JSON)
    @Path("$ID_PATH/$LANGUAGES")
    fun addLanguages(
        @PathParam(ID_PARAM) id: UUID, languageIds: List<String>, @Auth user: DexterUser
    ) = onAccessibleSource(id, user.id) { dao, src ->
        log.info("addLanguages: sourceId=${src.id}, languageIds=$languageIds")
        languageIds.forEach { languageId -> dao.addLanguage(src.id, languageId) }
        dao.getLanguages(src.id)
    }

    @DELETE
    @Path("$ID_PATH/$LANGUAGES/{languageId}")
    fun deleteLanguage(
        @PathParam(ID_PARAM) id: UUID, @PathParam("languageId") languageId: String, @Auth user: DexterUser
    ) = onAccessibleSource(id, user.id) { dao, src ->
        log.info("deleteLanguage: sourceId=${src.id}, languageId=$languageId")
        dao.deleteLanguage(src.id, languageId)
        dao.getLanguages(src.id)
    }

    @GET
    @Path("$ID_PATH/$METADATA/$VALUES")
    fun getMetadataValue(
        @PathParam(ID_PARAM) id: UUID, @Auth user: DexterUser
    ): List<ResultMetadataValue> = onAccessibleSource(id, user.id) { dao, sourceId ->
        dao.getMetadataValues(sourceId.id)
    }

    @POST
    @Consumes(APPLICATION_JSON)
    @Path("$ID_PATH/$METADATA/$VALUES")
    fun addMetadataValues(
        @PathParam(ID_PARAM) sourceId: UUID, metadataValueIds: List<UUID>, @Auth user: DexterUser
    ): List<ResultMetadataValue> = onAccessibleSource(sourceId, user.id) { dao, source ->
        log.info("addMetadataValues: sourceId=${source.id}, metadataValueIds=$metadataValueIds")
        metadataValueIds.forEach { sourceId -> dao.addMetadataValue(source.id, sourceId) }
        dao.getMetadataValues(source.id)
    }

    private fun <R> onAccessibleSourceWithHandle(
        sourceId: UUID,
        userId: UUID,
        block: HandleBlock<ResultSource, R>
    ): R = jdbi.inTransaction<R, Exception>(REPEATABLE_READ) { handle ->
        handle.attach(SourcesDao::class.java).let { dao ->
            dao.findByUser(sourceId, userId)?.let { source ->
                if (source.createdBy != userId) {
                    throw UnauthorizedException()
                }
                diagnoseViolations {
                    block.execute(handle, source)
                }
            } ?: sourceNotFound(sourceId)
        }
    }

    private fun <R> onAccessibleSource(
        sourceId: UUID, userId: UUID, block: DaoBlock<SourcesDao, ResultSource, R>
    ): R = onAccessibleSourceWithHandle(sourceId, userId) { handle, src ->
        handle.attach(SourcesDao::class.java).let { dao ->
            block.execute(dao, src)
        }
    }

    private fun sources(): SourcesDao = jdbi.onDemand(SourcesDao::class.java)
}