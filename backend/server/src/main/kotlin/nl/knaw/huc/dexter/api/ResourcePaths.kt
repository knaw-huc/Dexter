package nl.knaw.huc.dexter.api

// refactor>move to 'common' module later on?
object ResourcePaths {
    // main paths
    const val ABOUT = "about"
    const val ADMIN = "admin"
    const val CORPORA = "corpora"
    const val KEYWORDS = "keywords"
    const val SOURCES = "sources"

    // sub paths
    const val USERS = "users"

    // params
    const val ID_PARAM = "id"
    const val ID_PATH = "{$ID_PARAM}"
}