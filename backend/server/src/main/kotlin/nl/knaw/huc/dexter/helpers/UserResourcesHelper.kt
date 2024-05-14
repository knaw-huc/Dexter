package nl.knaw.huc.dexter.helpers

import ResultUserResources
import nl.knaw.huc.dexter.api.*
import nl.knaw.huc.dexter.db.*
import org.jdbi.v3.core.Handle
import org.jdbi.v3.core.Jdbi
import org.jdbi.v3.core.transaction.TransactionIsolationLevel.REPEATABLE_READ
import java.util.*

class UserResourcesHelper(private val jdbi: Jdbi) {

    fun getResources(user: UUID): ResultUserResources {
        return jdbi.inTransaction<ResultUserResources, Exception>(REPEATABLE_READ) { handle ->
            ResultUserResources(
                jdbi.onDemand(CorporaDao::class.java).findAllByUser(user).map { c -> addCorpusChildIds(c, handle) },
                jdbi.onDemand(SourcesDao::class.java).findAllByUser(user).map { c -> addSourceChildIds(c, handle) },
                jdbi.onDemand(MetadataValuesDao::class.java).findAllByUser(user),
                jdbi.onDemand(MetadataKeysDao::class.java).findAllByUser(user),
                jdbi.onDemand(MediaDao::class.java).findAllByUser(user),
                jdbi.onDemand(ReferencesDao::class.java).findAllByUser(user),
                jdbi.onDemand(TagsDao::class.java).findAllByUser(user)
            )
        }
    }

    companion object {

        fun addCorpusChildIds(
            corpus: ResultCorpus,
            handle: Handle
        ): ResultCorpusWithChildIds {
            handle.attach(CorporaDao::class.java).let { corporaDao ->
                return corpus.toResultCorpusWithChildIds(
                    corporaDao.getTagIds(corpus.id),
                    corporaDao.getLanguageIds(corpus.id),
                    corporaDao.getSourceIds(corpus.id),
                    corporaDao.getMetadataValueIds(corpus.id),
                    corporaDao.getMediaIds(corpus.id),
                    corporaDao.getSubcorpusIds(corpus.id)
                )
            }
        }

        fun addSourceChildIds(
            source: ResultSource,
            handle: Handle
        ): ResultSourceWithChildIds {
            handle.attach(SourcesDao::class.java).let { sourceDao ->
                return source.toResultSourceWithChildIds(
                    sourceDao.getReferenceIds(source.id),
                    sourceDao.getCorpusIds(source.id),
                    sourceDao.getLanguageIds(source.id),
                    sourceDao.getMediaIds(source.id),
                    sourceDao.getMetadataValueIds(source.id),
                    sourceDao.getTagIds(source.id),
                )
            }
        }

    }

}