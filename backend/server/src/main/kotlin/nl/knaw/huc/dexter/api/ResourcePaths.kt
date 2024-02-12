package nl.knaw.huc.dexter.api

// refactor>move to 'common' module later on?
object ResourcePaths {
    // main paths
    const val ABOUT = "about"
    const val ADMIN = "admin"
    const val CORPORA = "corpora"
    const val TAGS = "tags"
    const val LANGUAGES = "languages"
    const val METADATA = "metadata"
    const val SOURCES = "sources"
    const val USER = "user"
    const val WERELDCULTUREN = "wereldculturen"
    // sub paths
    const val USERS = "users"

    const val AUTOCOMPLETE = "autocomplete"
    const val LOGIN = "login"
    const val KEYS = "keys"
    const val VALUES = "values"

    const val WITH_RESOURCES = "with-resources"

    // params
    const val ID_PARAM = "id"
    const val ID_PATH = "{$ID_PARAM}"

    const val IMPORT = "import"
}