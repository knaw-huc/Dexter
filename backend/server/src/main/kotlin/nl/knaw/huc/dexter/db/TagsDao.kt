package nl.knaw.huc.dexter.db

import nl.knaw.huc.dexter.api.FormTag
import nl.knaw.huc.dexter.api.ResultTag
import org.jdbi.v3.sqlobject.kotlin.BindKotlin
import org.jdbi.v3.sqlobject.statement.SqlQuery
import org.jdbi.v3.sqlobject.statement.SqlUpdate
import java.util.*

interface TagsDao {
    @SqlQuery("select * from tags where created_by = :userId")
    fun listByUser(userId: UUID): List<ResultTag>

    @SqlQuery("select * from tags where id = :id")
    fun find(id: Int): ResultTag?

    @SqlQuery("select * from tags where created_by = :user")
    fun findAllByUser(user: UUID): List<ResultTag>

    @SqlQuery("insert into tags (val, created_by) values (:val, :userId) returning *")
    fun insert(@BindKotlin tag: FormTag, userId: UUID): ResultTag

    @SqlQuery("update tags set val = :val where id = :id returning *")
    fun update(id: Int, @BindKotlin tag: FormTag): ResultTag

    @SqlUpdate("delete from tags where id = :id")
    fun delete(id: Int)

    @SqlQuery("select * from tags where created_by = :userId and lower(val) like lower(:key)")
    fun like(key: String, userId: UUID): List<ResultTag>
}