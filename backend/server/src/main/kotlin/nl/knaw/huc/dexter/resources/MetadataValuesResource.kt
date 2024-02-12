package nl.knaw.huc.dexter.resources

import FormMetadataValue
import ResultMetadataValue
import UnauthorizedException
import io.dropwizard.auth.Auth
import nl.knaw.huc.dexter.api.ResourcePaths.ID_PARAM
import nl.knaw.huc.dexter.api.ResourcePaths.ID_PATH
import nl.knaw.huc.dexter.api.ResourcePaths.METADATA
import nl.knaw.huc.dexter.api.ResourcePaths.VALUES
import nl.knaw.huc.dexter.auth.DexterUser
import nl.knaw.huc.dexter.auth.RoleNames
import nl.knaw.huc.dexter.db.DaoBlock
import nl.knaw.huc.dexter.db.MetadataValuesDao
import nl.knaw.huc.dexter.db.UsersDao
import nl.knaw.huc.dexter.helpers.PsqlDiagnosticsHelper.Companion.diagnoseViolations
import org.jdbi.v3.core.Jdbi
import org.jdbi.v3.core.transaction.TransactionIsolationLevel.REPEATABLE_READ
import org.slf4j.LoggerFactory
import java.util.UUID
import javax.annotation.security.RolesAllowed
import javax.ws.rs.*
import javax.ws.rs.core.MediaType.APPLICATION_JSON
import javax.ws.rs.core.Response

@Path("$METADATA/$VALUES")
@RolesAllowed(RoleNames.USER)
@Produces(APPLICATION_JSON)
class MetadataValuesResource(private val jdbi: Jdbi) {
    private val log = LoggerFactory.getLogger(javaClass)

    @GET
    fun list(@Auth user: DexterUser) = metadataValues()
        .listByUser(user.id)

    @GET
    @Path(ID_PATH)
    fun getMetadataValue(
        @PathParam(ID_PARAM) metadataValueId: UUID,
        @Auth user: DexterUser
    ) =
        onExistingMetadataValue(metadataValueId, user.id) { _, v -> v }

    @POST
    @Consumes(APPLICATION_JSON)
    fun createMetadataValue(
        metadataValue: FormMetadataValue,
        @Auth user: DexterUser
    ): ResultMetadataValue {
        return jdbi.inTransaction<ResultMetadataValue, Exception>(REPEATABLE_READ) { tx ->
            val userDao = tx.attach(UsersDao::class.java)
            val createdBy = userDao.findByName(user.name) ?: throw NotFoundException("Unknown user: $user")
            diagnoseViolations { metadataValues().insert(metadataValue, createdBy.id) }
        }
    }

    @PUT
    @Path(ID_PATH)
    fun updateMetadataValue(
        @PathParam(ID_PARAM) id: UUID,
        formMetadataValue: FormMetadataValue,
        @Auth user: DexterUser
    ): ResultMetadataValue =
        onExistingMetadataValue(id, user.id) { dao, v ->
            log.info("updateMetadataValue: metadataValueId=${v.id}, formMetadataValue=$formMetadataValue")
            dao.update(v.id, formMetadataValue)
        }

    @DELETE
    @Path(ID_PATH)
    fun deleteMetadataValue(@PathParam(ID_PARAM) id: UUID, @Auth user: DexterUser): Response =
        onExistingMetadataValue(id, user.id) { dao, v ->
            log.warn("deleteMetadataValue[${user.name}] metadataValue=$v")
            dao.delete(v.id)
            Response.noContent().build()
        }

    private fun <R> onExistingMetadataValue(
        metadataValueId: UUID,
        userId: UUID,
        block: DaoBlock<MetadataValuesDao, ResultMetadataValue, R>
    ): R =
        jdbi.inTransaction<R, Exception>(REPEATABLE_READ) { handle ->
            handle.attach(MetadataValuesDao::class.java).let { dao ->
                dao.find(metadataValueId)?.let { metadataValue ->
                    if (metadataValue.createdBy != userId) {
                        throw UnauthorizedException()
                    }
                    diagnoseViolations { block.execute(dao, metadataValue) }
                } ?: metadataValueNotFound(metadataValueId)
            }
        }

    private fun metadataValues() = jdbi.onDemand(MetadataValuesDao::class.java)

    private fun metadataValueNotFound(metadataValueId: UUID): Nothing =
        throw NotFoundException("MetadataValue not found: $metadataValueId")
}