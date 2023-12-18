package nl.knaw.huc.dexter.db

import nl.knaw.huc.dexter.api.User
import org.jdbi.v3.sqlobject.statement.SqlBatch
import org.jdbi.v3.sqlobject.statement.SqlQuery
import org.jdbi.v3.sqlobject.statement.SqlUpdate
import java.util.*

interface UsersDao {
    @SqlQuery("select * from users")
    fun list(): List<User>

    @SqlBatch("insert into users (name) values (?) on conflict (name) do nothing")
    fun insertMany(userNames: Iterable<String>)

    @SqlQuery("select * from users where name = :name")
    fun findByName(name: String): User?

    @SqlQuery("select * from users where id = :id")
    fun findById(id: UUID): User?

    @SqlUpdate("delete from users where name = :name")
    fun deleteByName(name: String)

    @SqlUpdate("delete from users where id = :id")
    fun deleteById(id: UUID)

}