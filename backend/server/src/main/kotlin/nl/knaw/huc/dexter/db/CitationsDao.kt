package nl.knaw.huc.dexter.db

import nl.knaw.huc.dexter.api.FormCitation
import nl.knaw.huc.dexter.api.ResultCitation
import org.jdbi.v3.sqlobject.customizer.BindList
import org.jdbi.v3.sqlobject.kotlin.BindKotlin
import org.jdbi.v3.sqlobject.statement.SqlQuery
import org.jdbi.v3.sqlobject.statement.SqlUpdate
import java.util.*

interface CitationsDao {
    @SqlQuery("select * from citations where created_by = :userId")
    fun listByUser(userId: UUID): List<ResultCitation>

    @SqlQuery("select * from citations where id = :id")
    fun find(id: UUID): ResultCitation?

    @SqlQuery("insert into citations (input, terms, formatted, created_by) values (:input, :terms, :formatted, :userId) returning *")
    fun insert(@BindKotlin citation: FormCitation, userId: UUID): ResultCitation

    @SqlQuery("update citations set input = :input, terms = :terms, formatted = :formatted where id = :id returning *")
    fun update(id: UUID, @BindKotlin citation: FormCitation): ResultCitation

    @SqlQuery(
        "select * from citations where terms like all (array[ <terms> ])"
    )
    fun like(@BindList("terms") terms: List<String>, userId: UUID): List<ResultCitation>

    @SqlUpdate("delete from citations where id = :id")
    fun delete(id: UUID)

}