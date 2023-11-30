package nl.knaw.huc.dexter.helpers

import WereldCulturenDublinCoreImporter
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test


class WereldCulturenDublinCoreImporterTest {

    val toTest = WereldCulturenDublinCoreImporter()

    @Test
    @Throws(Exception::class)
    fun convertsTmsIntoDublinCore() {
        val xml = getResource("1046366.xml")
        val result = toTest.mapTmsToDc(xml)
        assertThat(result["Identifier"])
            .isEqualToIgnoringWhitespace("https://hdl.handle.net/20.500.11840/1046366")
        assertThat(result["Description"])
            .isEqualToIgnoringWhitespace("Schildering, Schilderingen, Materiële cultuurcollectie")
        assertThat(result["Creator"])
            .isEqualToIgnoringWhitespace("https://hdl.handle.net/10.200.30000/foobar")
        assertThat(result["Date"])
            .isEqualToIgnoringWhitespace("1998")
        assertThat(result["Title"])
            .isEqualToIgnoringWhitespace("High Tide at Progress Bay")
        assertThat(result["Format"])
            .isEqualToIgnoringWhitespace("155 x 180 cm")
    }

    private fun getResource(path: String): String {
        return this::class.java.classLoader
            .getResource(path)
            ?.readText()
            ?: throw RuntimeException("Could not load test resource $path")
    }

}