package nl.knaw.huc.dexter.helpers

import WereldCulturenImporter
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test


class WereldCulturenImporterTest {

    val toTest = WereldCulturenImporter()

    @Test
    fun convertsTmsIntoDexter() {
        val xml = getResource("1046366.xml")
        val result = toTest.mapTmsToDexter(xml)
        assertThat(result["externalRef"])
            .isEqualToIgnoringWhitespace("https://hdl.handle.net/20.500.11840/1046366")
        assertThat(result["description"])
            .isEqualToIgnoringWhitespace("Schildering, Schilderingen, Materiële cultuurcollectie")
        assertThat(result["earliest"])
            .isEqualToIgnoringWhitespace("1998-01-01")
        assertThat(result["latest"])
            .isEqualToIgnoringWhitespace("1998-01-02")
        assertThat(result["title"])
            .isEqualToIgnoringWhitespace("High Tide at Progress Bay")
        assertThat(result["externalId"])
            .isEqualToIgnoringWhitespace("7106-28")
    }

    private fun getResource(path: String): String {
        return this::class.java.classLoader
            .getResource(path)
            ?.readText()
            ?: throw RuntimeException("Could not load test resource $path")
    }

}