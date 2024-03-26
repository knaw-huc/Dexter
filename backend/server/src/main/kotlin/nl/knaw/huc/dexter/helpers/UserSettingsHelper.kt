import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import nl.knaw.huc.dexter.api.FormUserSettings
import nl.knaw.huc.dexter.api.ResultUserSettings
import nl.knaw.huc.dexter.db.UsersDao
import org.jdbi.v3.core.Jdbi
import java.util.*

/**
 * Helper to parse UserSettings from and map UserSettings from plain text user.settings
 * TODO: Can we combine jsonb from postgres with dropwizard and jdbi3-jackson2?
 */
class UserSettingsHelper(private val mapper: ObjectMapper, private val jdbi: Jdbi) {

    fun getSettings(user: UUID): ResultUserSettings {
        val settings = users().getSettingsById(user)
        return mapper.readValue(settings, ResultUserSettings::class.java)
    }

    fun updateSettings(user: UUID, settings: FormUserSettings): ResultUserSettings {
        val mapped =  mapper.writeValueAsString(settings)
        val update = users().updateSettings(user, mapped)
        return mapper.readValue(update, ResultUserSettings::class.java)
    }

    private fun users() = jdbi.onDemand(UsersDao::class.java)

}