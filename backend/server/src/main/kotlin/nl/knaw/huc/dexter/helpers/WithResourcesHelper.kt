package nl.knaw.huc.dexter.helpers

import ResultMetadataValue
import nl.knaw.huc.dexter.api.*
import nl.knaw.huc.dexter.db.CorporaDao
import nl.knaw.huc.dexter.db.CorporaDao.Companion.corpusNotFound
import nl.knaw.huc.dexter.db.MetadataKeysDao
import nl.knaw.huc.dexter.db.SourcesDao
import org.jdbi.v3.core.Handle
import toResultMetadataValueWithResources
import java.util.*
import javax.ws.rs.NotFoundException

class WithResourcesHelper {
    companion object {

        fun getCorpusWithResources(
            corpusId: UUID,
            handle: Handle
        ): ResultCorpusWithResources {
            handle.attach(CorporaDao::class.java).let { corporaDao ->
                val found = corporaDao.find(corpusId) ?: corpusNotFound(corpusId)
                return found.toResultCorpusWithResources(
                    if (found.parentId != null) corporaDao.find(found.parentId) else null,
                    corporaDao.getKeywords(found.id),
                    corporaDao.getLanguages(found.id),
                    corporaDao.getSources(found.id).map { s ->
                        getSourceWithResources(s.id, handle)
                    },
                    getCorpusMetadataValueWithResources(found.id, handle)
                )
            }
        }

        fun getSourceWithResources(
            sourceId: UUID,
            handle: Handle
        ): ResultSourceWithResources {
            handle.attach(SourcesDao::class.java).let { sourceDao ->
                val found: ResultSource = sourceDao.find(sourceId) ?: SourcesDao.sourceNotFound(sourceId)
                return found.toResultSourceWithResources(
                    sourceDao.getKeywords(found.id),
                    sourceDao.getLanguages(found.id),
                    getSourceMetadataValueWithResources(found.id, handle)
                )
            }
        }

        private fun getCorpusMetadataValueWithResources(
            corpusId: UUID,
            handle: Handle
        ) = handle.attach(CorporaDao::class.java).let { corpusDao ->
            corpusDao.getMetadataValues(corpusId).map { v ->
                getMetadataValueWithResources(v, handle)
            }
        }

        private fun getSourceMetadataValueWithResources(
            sourceId: UUID,
            handle: Handle
        ) = handle.attach(SourcesDao::class.java).let { sourceDao ->
            sourceDao.getMetadataValues(sourceId).map { v ->
                getMetadataValueWithResources(v, handle)
            }
        }

        private fun getMetadataValueWithResources(value: ResultMetadataValue, handle: Handle) =
            handle.attach(MetadataKeysDao::class.java).let { keysDao ->
                value.toResultMetadataValueWithResources(
                    keysDao.find(value.keyId) ?: throw NotFoundException("Unknown key: ${value.keyId}")
                )
            }

    }
}
