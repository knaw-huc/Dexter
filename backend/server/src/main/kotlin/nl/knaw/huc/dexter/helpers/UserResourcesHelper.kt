import nl.knaw.huc.dexter.api.ResultCorpusWithResources
import nl.knaw.huc.dexter.api.ResultSourceWithResources
import nl.knaw.huc.dexter.db.CorporaDao
import nl.knaw.huc.dexter.db.MetadataKeysDao
import nl.knaw.huc.dexter.db.MetadataValuesDao
import nl.knaw.huc.dexter.db.SourcesDao
import nl.knaw.huc.dexter.helpers.WithResourcesHelper.Companion.addCorpusResources
import nl.knaw.huc.dexter.helpers.WithResourcesHelper.Companion.addSourceResources
import org.jdbi.v3.core.Jdbi
import org.jdbi.v3.core.transaction.TransactionIsolationLevel.REPEATABLE_READ
import java.util.*

class UserResourcesHelper(private val jdbi: Jdbi) {

    fun getResources(user: UUID): ResultUserResources {
        return jdbi.inTransaction<ResultUserResources, Exception>(REPEATABLE_READ) { handle ->
            ResultUserResources(
                jdbi.onDemand(CorporaDao::class.java).findAllByUser(user).map { c -> addCorpusResources(c, handle) },
                jdbi.onDemand(SourcesDao::class.java).findAllByUser(user).map { c -> addSourceResources(c, handle) },
                jdbi.onDemand(MetadataValuesDao::class.java).findAllByUser(user),
                jdbi.onDemand(MetadataKeysDao::class.java).findAllByUser(user),
            )
        }
    }


}