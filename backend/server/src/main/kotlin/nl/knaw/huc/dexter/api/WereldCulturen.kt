data class FormTmsImport(
    val url: String
)

data class ResultTmsImport(
    val isValidExternalReference: Boolean,
    val imported: ResultDublinCoreMetadata? = null
)

typealias ResultDublinCoreMetadata = Map<String, String>;
