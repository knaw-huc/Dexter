data class FormTmsImport(
    val url: String
)

data class ResultImport(
    val isValidExternalReference: Boolean,
    val imported: ImportedFields? = null
)

typealias ImportedFields = Map<String, String>
