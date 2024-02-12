package nl.knaw.huc.dexter.db

import nl.knaw.huc.dexter.api.FormKeyword
import nl.knaw.huc.dexter.api.ResultKeyword
import org.jdbi.v3.sqlobject.kotlin.BindKotlin
import org.jdbi.v3.sqlobject.statement.SqlQuery
import org.jdbi.v3.sqlobject.statement.SqlUpdate

interface TagsDao {
    @SqlQuery("select * from keywords")
    fun list(): List<ResultKeyword>

    @SqlQuery("select * from keywords where id = :id")
    fun find(id: Int): ResultKeyword?

    @SqlQuery("insert into keywords (val) values (:val) returning *")
    fun insert(@BindKotlin keyword: FormKeyword): ResultKeyword

    @SqlQuery("update keywords set val = :val where id = :id returning *")
    fun update(id: Int, @BindKotlin keyword: FormKeyword): ResultKeyword

    @SqlUpdate("delete from keywords where id = :id")
    fun delete(id: Int)

    @SqlQuery("select * from keywords where lower(val) like lower(:key)")
    fun like(key: String): List<ResultKeyword>
}