package nl.knaw.huc.dexter.db

import nl.knaw.huc.dexter.api.FormUserSettings
import nl.knaw.huc.dexter.api.User
import nl.knaw.huc.dexter.api.UserResult
import org.jdbi.v3.sqlobject.customizer.Bind
import org.jdbi.v3.sqlobject.customizer.BindPojo
import org.jdbi.v3.sqlobject.kotlin.BindKotlin
import org.jdbi.v3.sqlobject.statement.SqlBatch
import org.jdbi.v3.sqlobject.statement.SqlQuery
import org.jdbi.v3.sqlobject.statement.SqlUpdate
import java.util.*

interface UsersDao {
    @SqlQuery("select * from users")
    fun list(): List<User>

    @SqlBatch("insert into users (name, settings) values (?, '{}') on conflict (name) do nothing")
    fun insertMany(userNames: Iterable<String>)

    @SqlQuery("select * from users where name = :name")
    fun findByName(name: String): User?

    @SqlQuery("select * from users where id = :id")
    fun findById(id: UUID): User?

    @SqlQuery("select settings from users where id = :id")
    fun getSettingsById(id: UUID): String

    @SqlUpdate("delete from users where name = :name")
    fun deleteByName(name: String)

    @SqlUpdate("delete from users where id = :id")
    fun deleteById(id: UUID)

    @SqlQuery("update users set settings = :settings where id = :id returning settings")
    fun updateSettings(id: UUID, settings: String): String

}

