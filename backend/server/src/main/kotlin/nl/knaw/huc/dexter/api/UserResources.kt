import nl.knaw.huc.dexter.api.*

data class ResultUserResources(
    val corpora: List<ResultCorpusWithChildIds>,
    val sources: List<ResultSourceWithChildIds>,
    val metadataValues: List<ResultMetadataValue>,
    val metadataKeys: List<ResultMetadataKey>,
    val media: List<ResultMedia>,
    val references: List<ResultReference>,
    val tags: List<ResultTag>,
)