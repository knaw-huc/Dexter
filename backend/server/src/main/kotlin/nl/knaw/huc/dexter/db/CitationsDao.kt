package nl.knaw.huc.dexter.db

import nl.knaw.huc.dexter.api.FormReference
import nl.knaw.huc.dexter.api.ResultReference
import org.jdbi.v3.sqlobject.customizer.BindList
import org.jdbi.v3.sqlobject.kotlin.BindKotlin
import org.jdbi.v3.sqlobject.statement.SqlQuery
import org.jdbi.v3.sqlobject.statement.SqlUpdate
import java.util.*

interface ReferencesDao {
    @SqlQuery("select * from \"references\" where created_by = :userId")
    fun listByUser(userId: UUID): List<ResultReference>

    @SqlQuery("select * from \"references\" where id = :id")
    fun find(id: UUID): ResultReference?

    @SqlQuery("insert into \"references\" (input, terms, csl, created_by) values (:input, :terms, :csl, :userId) returning *")
    fun insert(@BindKotlin reference: FormReference, userId: UUID): ResultReference

    @SqlQuery("update \"references\" set input = :input, terms = :terms, csl = :csl where id = :id returning *")
    fun update(id: UUID, @BindKotlin reference: FormReference): ResultReference

    @SqlQuery(
        "select * from \"references\" where  created_by = :userId and terms like all (array[ <terms> ]) limit 10"
    )
    fun like(@BindList("terms") terms: List<String>, userId: UUID): List<ResultReference>

    @SqlUpdate("delete from \"references\" where id = :id")
    fun delete(id: UUID)

}