package nl.knaw.huc.dexter.db

import nl.knaw.huc.dexter.api.FormCitation
import nl.knaw.huc.dexter.api.ResultCitation
import org.jdbi.v3.sqlobject.kotlin.BindKotlin
import org.jdbi.v3.sqlobject.statement.SqlQuery
import org.jdbi.v3.sqlobject.statement.SqlUpdate
import java.util.*

interface CitationsDao {
    @SqlQuery("select * from citations where created_by = :userId")
    fun listByUser(userId: UUID): List<ResultCitation>

    @SqlQuery("select * from citations where id = :id")
    fun find(id: Int): ResultCitation?

    @SqlQuery("insert into citations (val, created_by) values (:val, :userId) returning *")
    fun insert(@BindKotlin citation: FormCitation, userId: UUID): ResultCitation

    @SqlQuery("update citations set val = :val where id = :id returning *")
    fun update(id: Int, @BindKotlin citation: FormCitation): ResultCitation

    @SqlUpdate("delete from citations where id = :id")
    fun delete(id: Int)

}