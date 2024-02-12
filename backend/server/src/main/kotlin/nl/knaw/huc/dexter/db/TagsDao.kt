package nl.knaw.huc.dexter.db

import nl.knaw.huc.dexter.api.FormTag
import nl.knaw.huc.dexter.api.ResultTag
import org.jdbi.v3.sqlobject.kotlin.BindKotlin
import org.jdbi.v3.sqlobject.statement.SqlQuery
import org.jdbi.v3.sqlobject.statement.SqlUpdate

interface TagsDao {
    @SqlQuery("select * from tags")
    fun list(): List<ResultTag>

    @SqlQuery("select * from tags where id = :id")
    fun find(id: Int): ResultTag?

    @SqlQuery("insert into tags (val) values (:val) returning *")
    fun insert(@BindKotlin tag: FormTag): ResultTag

    @SqlQuery("update tags set val = :val where id = :id returning *")
    fun update(id: Int, @BindKotlin tag: FormTag): ResultTag

    @SqlUpdate("delete from tags where id = :id")
    fun delete(id: Int)

    @SqlQuery("select * from tags where lower(val) like lower(:key)")
    fun like(key: String): List<ResultTag>
}