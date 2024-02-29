package nl.knaw.huc.dexter.helpers

import ResultMetadataValue
import nl.knaw.huc.dexter.api.*
import nl.knaw.huc.dexter.db.CorporaDao
import nl.knaw.huc.dexter.db.MetadataKeysDao
import nl.knaw.huc.dexter.db.SourcesDao
import org.jdbi.v3.core.Handle
import toResultMetadataValueWithResources
import java.util.*
import javax.ws.rs.NotFoundException

class WithResourcesHelper {
    companion object {

        fun addCorpusResources(
            corpus: ResultCorpus,
            handle: Handle
        ): ResultCorpusWithResources {
            handle.attach(CorporaDao::class.java).let { corporaDao ->
                return corpus.toResultCorpusWithResources(
                    if (corpus.parentId != null) corporaDao.find(corpus.parentId) else null,
                    corporaDao.getTags(corpus.id),
                    corporaDao.getLanguages(corpus.id),
                    corporaDao.getSources(corpus.id).map { source ->
                        addSourceResources(source, handle)
                    },
                    getCorpusMetadataValueWithResources(corpus.id, handle),
                    corporaDao.getMedia(corpus.id),
                    corporaDao.getSubcorpora(corpus.id).map { subcorpus ->
                        addCorpusResources(subcorpus, handle)
                    }
                )
            }
        }

        fun addSourceResources(
            source: ResultSource,
            handle: Handle
        ): ResultSourceWithResources {
            handle.attach(SourcesDao::class.java).let { sourceDao ->
                return source.toResultSourceWithResources(
                    sourceDao.getTags(source.id),
                    sourceDao.getLanguages(source.id),
                    getSourceMetadataValueWithResources(source.id, handle),
                    sourceDao.getMedia(source.id),
                    sourceDao.getCorpora(source.id)
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
