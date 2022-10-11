package nl.knaw.huc.dexter.db

import nl.knaw.huc.dexter.api.User
import org.jdbi.v3.sqlobject.kotlin.BindKotlin
import org.jdbi.v3.sqlobject.statement.SqlQuery
import org.jdbi.v3.sqlobject.statement.SqlUpdate
import java.util.*

interface UsersDao {
    @SqlQuery("insert into users (id,name) values (:id, :name) returning *")
    fun insert(@BindKotlin user: User): User

    @SqlQuery("insert into users (name) values (:name) returning *")
    fun create(name: String): User

    @SqlQuery("select * from users where name = :name")
    fun findByName(name: String): User?

    @SqlQuery("select * from users where id = :id")
    fun findById(id: UUID): User?

    @SqlUpdate("delete from users where name = ?")
    fun deleteByName(name: String)
}