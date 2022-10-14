package nl.knaw.huc.dexter.api

data class ResultLanguage(
    val id: String,
    val part2b: String?,
    val part2t: String?,
    val part1: String?,
    val scope: Char,
    val type: Char,
    val refName: String,
    val comment: String?
)
