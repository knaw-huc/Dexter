package nl.knaw.huc.dexter.db

import nl.knaw.huc.dexter.api.FormKeyword
import nl.knaw.huc.dexter.api.ResultKeyword
import org.jdbi.v3.sqlobject.statement.SqlQuery
import org.jdbi.v3.sqlobject.statement.SqlUpdate

interface KeywordsDao {
    @SqlQuery("select * from keywords")
    fun list(): List<ResultKeyword>

    @SqlQuery("select * from keywords where id = :id")
    fun find(id: Int): ResultKeyword?

    @SqlQuery("insert into keywords (val) values (:keyword) returning *")
    fun insert(keyword: FormKeyword): ResultKeyword

    @SqlQuery("update keywords set val = :keyword where id = :id returning *")
    fun update(id: Int, keyword: FormKeyword): ResultKeyword

    @SqlUpdate("delete from keywords where id = :id")
    fun delete(id: Int)
}