package nl.knaw.huc.dexter.api

// refactor>move to 'common' module later on?
object ResourcePaths {
    // main paths
    const val ABOUT = "about"
    const val ADMIN = "admin"
    const val CORPORA = "corpora"
    const val KEYWORDS = "keywords"
    const val LANGUAGES = "languages"
    const val SOURCES = "sources"
    const val WERELDCULTUREN = "wereldculturen"

    // sub paths
    const val USERS = "users"
    const val AUTOCOMPLETE = "autocomplete"

    // params
    const val ID_PARAM = "id"
    const val ID_PATH = "{$ID_PARAM}"

    const val CONVERT = "convert"
}