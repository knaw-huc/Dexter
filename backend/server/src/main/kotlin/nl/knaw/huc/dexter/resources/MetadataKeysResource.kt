package nl.knaw.huc.dexter.resources

import FormMetadataKey
import ResultMetadataKey
import UnauthorizedException
import io.dropwizard.auth.Auth
import nl.knaw.huc.dexter.api.ResourcePaths.ID_PARAM
import nl.knaw.huc.dexter.api.ResourcePaths.ID_PATH
import nl.knaw.huc.dexter.api.ResourcePaths.KEYS
import nl.knaw.huc.dexter.api.ResourcePaths.METADATA
import nl.knaw.huc.dexter.auth.DexterUser
import nl.knaw.huc.dexter.auth.RoleNames
import nl.knaw.huc.dexter.db.DaoBlock
import nl.knaw.huc.dexter.db.MetadataKeysDao
import nl.knaw.huc.dexter.helpers.PsqlDiagnosticsHelper.Companion.diagnoseViolations
import org.jdbi.v3.core.Jdbi
import org.jdbi.v3.core.transaction.TransactionIsolationLevel.REPEATABLE_READ
import org.slf4j.LoggerFactory
import java.util.UUID
import javax.annotation.security.RolesAllowed
import javax.ws.rs.*
import javax.ws.rs.core.MediaType.APPLICATION_JSON
import javax.ws.rs.core.Response

@Path("$METADATA/$KEYS")
@RolesAllowed(RoleNames.USER)
@Produces(APPLICATION_JSON)
class MetadataKeysResource(private val jdbi: Jdbi) {
    private val log = LoggerFactory.getLogger(javaClass)

    @GET
    fun list(@Auth user: DexterUser): List<ResultMetadataKey> {
        return metadataKeys().listByUser(user.id)
    }

    @GET
    @Path(ID_PATH)
    fun getMetadataKey(@PathParam(ID_PARAM) metadataKeyId: UUID, @Auth user: DexterUser) =
        onAccessibleMetadataKey(metadataKeyId, user.id) { _, k -> k }

    @POST
    @Consumes(APPLICATION_JSON)
    fun createMetadataKey(
        metadataKey: FormMetadataKey,
        @Auth user: DexterUser
    ): ResultMetadataKey {
        log.info("createMetadataKey: [$metadataKey]")
        return jdbi.inTransaction<ResultMetadataKey, Exception>(REPEATABLE_READ) { tx ->
            diagnoseViolations { metadataKeys().insert(metadataKey, user.id) }
        }
    }

    @PUT
    @Path(ID_PATH)
    fun updateMetadataKey(
        @PathParam(ID_PARAM) id: UUID,
        formMetadataKey: FormMetadataKey,
        @Auth user: DexterUser
    ): ResultMetadataKey =
        onAccessibleMetadataKey(id, user.id) { dao, kw ->
            log.info("updateMetadataKey: metadataKeyId=${kw.id}, formMetadataKey=$formMetadataKey")
            dao.update(kw.id, formMetadataKey)
        }

    @DELETE
    @Path(ID_PATH)
    fun deleteMetadataKey(@PathParam(ID_PARAM) id: UUID, @Auth user: DexterUser): Response =
        onAccessibleMetadataKey(id, user.id) { dao, kw ->
            log.warn("deleteMetadataKey[${user.name}] metadataKey=$kw")
            dao.delete(kw.id)
            Response.noContent().build()
        }

    private fun <R> onAccessibleMetadataKey(
        metadataKeyId: UUID,
        userId: UUID,
        block: DaoBlock<MetadataKeysDao, ResultMetadataKey, R>
    ): R =
        jdbi.inTransaction<R, Exception>(REPEATABLE_READ) { handle ->
            handle.attach(MetadataKeysDao::class.java).let { dao ->
                dao.find(metadataKeyId)?.let { metadataKey ->
                    if (metadataKey.createdBy != userId) {
                        throw UnauthorizedException()
                    }
                    diagnoseViolations { block.execute(dao, metadataKey) }
                } ?: metadataKeyNotFound(metadataKeyId)
            }
        }

    private fun metadataKeys() = jdbi.onDemand(MetadataKeysDao::class.java)

    private fun metadataKeyNotFound(metadataKeyId: UUID): Nothing =
        throw NotFoundException("MetadataKey not found: $metadataKeyId")
}