package nl.knaw.huc.dexter.resources

import FormMetadataValue
import ResultMetadataValue
import io.dropwizard.auth.Auth
import nl.knaw.huc.dexter.api.ResourcePaths
import nl.knaw.huc.dexter.api.ResourcePaths.AUTOCOMPLETE
import nl.knaw.huc.dexter.api.ResourcePaths.ID_PARAM
import nl.knaw.huc.dexter.api.ResourcePaths.ID_PATH
import nl.knaw.huc.dexter.auth.DexterUser
import nl.knaw.huc.dexter.db.DaoBlock
import nl.knaw.huc.dexter.db.MetadataValuesDao
import nl.knaw.huc.dexter.db.UsersDao
import nl.knaw.huc.dexter.helpers.PsqlDiagnosticsHelper.Companion.diagnoseViolations
import org.jdbi.v3.core.Jdbi
import org.jdbi.v3.core.transaction.TransactionIsolationLevel.REPEATABLE_READ
import org.slf4j.LoggerFactory
import java.util.UUID
import javax.ws.rs.*
import javax.ws.rs.core.MediaType.APPLICATION_JSON
import javax.ws.rs.core.Response

@Path("${ResourcePaths.METADATA}/${ResourcePaths.VALUES}")
@Produces(APPLICATION_JSON)
class MetadataValuesResource(private val jdbi: Jdbi) {
    private val log = LoggerFactory.getLogger(javaClass)

    @GET
    fun list() = metadataValues().list()

    @GET
    @Path(ID_PATH)
    fun getMetadataValue(@PathParam(ID_PARAM) metadataValueId: UUID) =
        metadataValues().find(metadataValueId) ?: metadataValueNotFound(metadataValueId)

    @POST
    @Consumes(APPLICATION_JSON)
    fun createMetadataValue(
        metadataValue: FormMetadataValue,
        @Auth user: DexterUser
    ): ResultMetadataValue {
        return jdbi.inTransaction<ResultMetadataValue, Exception>(REPEATABLE_READ) { tx ->
            val userDao = tx.attach(UsersDao::class.java)
            val createdBy = userDao.findByName(user.name) ?: throw NotFoundException("Unknown user: $user")
            diagnoseViolations { metadataValues().insert(metadataValue, createdBy.id)}
        }
    }

    @PUT
    @Path(ID_PATH)
    fun updateMetadataValue(@PathParam(ID_PARAM) id: UUID, formMetadataValue: FormMetadataValue): ResultMetadataValue =
        onExistingMetadataValue(id) { dao, kw ->
            log.info("updateMetadataValue: metadataValueId=${kw.id}, formMetadataValue=$formMetadataValue")
            dao.update(kw.id, formMetadataValue)
        }

    @DELETE
    @Path(ID_PATH)
    fun deleteMetadataValue(@PathParam(ID_PARAM) id: UUID, @Auth user: DexterUser): Response =
        onExistingMetadataValue(id) { dao, kw ->
            log.warn("deleteMetadataValue[${user.name}] metadataValue=$kw")
            dao.delete(kw.id)
            Response.noContent().build()
        }

    private fun <R> onExistingMetadataValue(metadataValueId: UUID, block: DaoBlock<MetadataValuesDao, ResultMetadataValue, R>): R =
        jdbi.inTransaction<R, Exception>(REPEATABLE_READ) { handle ->
            handle.attach(MetadataValuesDao::class.java).let { dao ->
                dao.find(metadataValueId)?.let { metadataValue ->
                    diagnoseViolations { block.execute(dao, metadataValue) }
                } ?: metadataValueNotFound(metadataValueId)
            }
        }

    private fun metadataValues() = jdbi.onDemand(MetadataValuesDao::class.java)

    private fun metadataValueNotFound(metadataValueId: UUID): Nothing = throw NotFoundException("MetadataValue not found: $metadataValueId")
}