package nl.knaw.huc.dexter.helpers

import org.jdbi.v3.core.JdbiException
import org.postgresql.util.PSQLException
import javax.ws.rs.BadRequestException

enum class PsqlConstraintChecker(private val constraint: String, private val msg: String) {
    // These constraints are named postgres constraints, from "backend/db/Vxxx.sql"
    SOURCE_DATE_ORDER_CONSTRAINT(
        "source_earliest_before_equal_latest",
        "'earliest' MUST be less than or equal to 'latest"
    ),
    CORPUS_DATE_ORDER_CONSTRAINT(
        "corpus_earliest_before_equal_latest",
        "'earliest' MUST be less than or equal to 'latest"
    );

    companion object {
        fun interface Statement<R> {
            fun execute(): R
        }

        fun <R> checkConstraintViolations(statement: Statement<R>): R =
            try {
                statement.execute()
            } catch (ex: JdbiException) {
                val cause = ex.cause
                if (cause is PSQLException) {
                    val violatedConstraint = cause.serverErrorMessage?.constraint
                    values()
                        .find { it.constraint == violatedConstraint }
                        ?.let { throw BadRequestException(it.msg) }
                }
                throw ex
            }
    }
}