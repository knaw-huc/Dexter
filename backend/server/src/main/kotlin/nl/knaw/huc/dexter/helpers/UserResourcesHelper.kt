import nl.knaw.huc.dexter.api.ResultCorpusWithResources
import nl.knaw.huc.dexter.db.CorporaDao
import nl.knaw.huc.dexter.helpers.WithResourcesHelper.Companion.addCorpusResources
import org.jdbi.v3.core.Jdbi
import org.jdbi.v3.core.transaction.TransactionIsolationLevel.REPEATABLE_READ
import java.util.*

class UserResourcesHelper(private val jdbi: Jdbi) {

    fun getResources(user: UUID): ResultUserResources {
        val resources = ResultUserResources(
            findAllCorporaWithResourcesByUser(user)
        )
        return resources
    }

    private fun findAllCorporaWithResourcesByUser(user: UUID): List<ResultCorpusWithResources> =
        jdbi.inTransaction<List<ResultCorpusWithResources>, Exception>(REPEATABLE_READ) { handle ->
            jdbi.onDemand(CorporaDao::class.java).findAllByUser(user).map { c -> addCorpusResources(c, handle) }
        }

}