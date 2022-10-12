package nl.knaw.huc.dexter.api

// FormKeyword is just the text String
typealias FormKeyword = String

// ResultKeyword includes 'id'
data class ResultKeyword(
    val id: Int,
    val `val`: String
)
