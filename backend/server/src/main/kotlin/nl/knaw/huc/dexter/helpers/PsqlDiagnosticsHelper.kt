package nl.knaw.huc.dexter.helpers

import org.jdbi.v3.core.JdbiException
import org.postgresql.util.PSQLException
import javax.ws.rs.BadRequestException

enum class PsqlDiagnosticsHelper(
    private val constraint: String,
    private val msg: String,
    private val includeDetail: Boolean = false
) {
    // These constraints are named postgres constraints, from "backend/db/Vxxx.sql"
    SOURCES_DATE_ORDER_CONSTRAINT(
        "sources_earliest_before_equal_latest",
        "'earliest' MUST be less than or equal to 'latest"
    ),
    SOURCES_UNIQUE_TITLE_CONSTRAINT(
        "sources_title_key",
        "Titles MUST be unique",
        includeDetail = true
    ),
    CORPORA_DATE_ORDER_CONSTRAINT(
        "corpora_earliest_before_equal_latest",
        "'earliest' MUST be less than or equal to 'latest"
    ),
    CORPORA_UNIQUE_TITLE_CONSTRAINT(
        "corpora_title_key",
        "Titles MUST be unique",
        includeDetail = true
    );

    companion object {
        fun interface Statement<R> {
            fun execute(): R
        }

        fun <R> diagnoseViolations(statement: Statement<R>): R =
            try {
                statement.execute()
            } catch (ex: JdbiException) {
                val cause = ex.cause
                if (cause is PSQLException) {
                    cause.serverErrorMessage?.let { errMsg ->
                        System.err.println("AAP: $errMsg")
                        val msg: String = values()
                            .find { it.constraint == errMsg.constraint }
                            ?.let {
                                if (it.includeDetail) "$it.msg. ${errMsg.detail}"
                                else it.msg
                            }
                            ?: errMsg.detail
                            ?: errMsg.constraint
                            ?: errMsg.toString()
                        throw BadRequestException(msg)
                    }
                }
                throw ex
            }
    }
}