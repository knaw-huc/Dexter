import nl.knaw.huc.dexter.api.*

data class ResultUserResources(
    val corpora: List<ResultCorpusWithResources>,
    val sources: List<ResultSourceWithResources>,
    val metadataValues: List<ResultMetadataValue>,
    val metadataKeys: List<ResultMetadataKey>,
    // TODO:
    //    val media: List<ResultMedia>,
    //    val references: List<ResultReference>,
    //    val tags: List<ResultTag>,
    //    val languages: List<ResultLanguage>,
)