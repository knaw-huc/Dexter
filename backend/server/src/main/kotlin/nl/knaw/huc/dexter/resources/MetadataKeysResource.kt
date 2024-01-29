package nl.knaw.huc.dexter.resources

import FormMetadataKey
import ResultMetadataKey
import io.dropwizard.auth.Auth
import nl.knaw.huc.dexter.api.ResourcePaths
import nl.knaw.huc.dexter.api.ResourcePaths.AUTOCOMPLETE
import nl.knaw.huc.dexter.api.ResourcePaths.ID_PARAM
import nl.knaw.huc.dexter.api.ResourcePaths.ID_PATH
import nl.knaw.huc.dexter.api.ResultSource
import nl.knaw.huc.dexter.auth.DexterUser
import nl.knaw.huc.dexter.db.DaoBlock
import nl.knaw.huc.dexter.db.MetadataKeysDao
import nl.knaw.huc.dexter.db.SourcesDao
import nl.knaw.huc.dexter.db.UsersDao
import nl.knaw.huc.dexter.helpers.PsqlDiagnosticsHelper.Companion.diagnoseViolations
import org.jdbi.v3.core.Jdbi
import org.jdbi.v3.core.transaction.TransactionIsolationLevel.REPEATABLE_READ
import org.slf4j.LoggerFactory
import java.util.UUID
import javax.ws.rs.*
import javax.ws.rs.core.MediaType.APPLICATION_JSON
import javax.ws.rs.core.Response

@Path("${ResourcePaths.METADATA}/${ResourcePaths.KEYS}")
@Produces(APPLICATION_JSON)
class MetadataKeysResource(private val jdbi: Jdbi) {
    private val log = LoggerFactory.getLogger(javaClass)

    @GET
    fun list() = metadataKeys().list()

    @GET
    @Path(ID_PATH)
    fun getMetadataKey(@PathParam(ID_PARAM) metadataKeyId: UUID) =
        metadataKeys().find(metadataKeyId) ?: metadataKeyNotFound(metadataKeyId)

    @POST
    @Consumes(APPLICATION_JSON)
    fun createMetadataKey(
        metadataKey: FormMetadataKey,
        @Auth user: DexterUser
    ): ResultMetadataKey {
        log.info("createMetadataKey: [$metadataKey]")
        return jdbi.inTransaction<ResultMetadataKey, Exception>(REPEATABLE_READ) { tx ->
            val userDao = tx.attach(UsersDao::class.java)
            val createdBy = userDao.findByName(user.name) ?: throw NotFoundException("Unknown user: $user")
            diagnoseViolations { metadataKeys().insert(metadataKey, createdBy.id)}
        }
    }

    @PUT
    @Path(ID_PATH)
    fun updateMetadataKey(@PathParam(ID_PARAM) id: UUID, formMetadataKey: FormMetadataKey): ResultMetadataKey =
        onExistingMetadataKey(id) { dao, kw ->
            log.info("updateMetadataKey: metadataKeyId=${kw.id}, formMetadataKey=$formMetadataKey")
            dao.update(kw.id, formMetadataKey)
        }

    @DELETE
    @Path(ID_PATH)
    fun deleteMetadataKey(@PathParam(ID_PARAM) id: UUID, @Auth user: DexterUser): Response =
        onExistingMetadataKey(id) { dao, kw ->
            log.warn("deleteMetadataKey[${user.name}] metadataKey=$kw")
            dao.delete(kw.id)
            Response.noContent().build()
        }

    private fun <R> onExistingMetadataKey(metadataKeyId: UUID, block: DaoBlock<MetadataKeysDao, ResultMetadataKey, R>): R =
        jdbi.inTransaction<R, Exception>(REPEATABLE_READ) { handle ->
            handle.attach(MetadataKeysDao::class.java).let { dao ->
                dao.find(metadataKeyId)?.let { metadataKey ->
                    diagnoseViolations { block.execute(dao, metadataKey) }
                } ?: metadataKeyNotFound(metadataKeyId)
            }
        }

    private fun metadataKeys() = jdbi.onDemand(MetadataKeysDao::class.java)

    private fun metadataKeyNotFound(metadataKeyId: UUID): Nothing = throw NotFoundException("MetadataKey not found: $metadataKeyId")
}