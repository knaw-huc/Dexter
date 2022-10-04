package nl.knaw.huc.dexter.api

// refactor>move to 'common' module later on?
data class AboutInfo(
        val appName: String,
        val version: String,
        val startedAt: String,
        val baseURI: String,
        val sourceCode: String = "https://github.com/knaw-huc/Dexter"
)
