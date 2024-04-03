import nl.knaw.huc.dexter.api.*

data class ResultUserResources(
    val corpora: List<ResultCorpusWithResources>,
    val sources: List<ResultSourceWithResources>,
    // TODO:
    //    val media: List<ResultMedia>,
    //    val references: List<ResultReference>,
    //    val languages: List<ResultLanguage>,
    //    val tags: List<ResultTag>,
    //    val metadataValues: List<ResultMetadataValueWithResources>,
    //    val metadataKeys: List<ResultMetadataKey>,
)