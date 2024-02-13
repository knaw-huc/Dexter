import com.fasterxml.jackson.databind.ObjectMapper
import org.w3c.dom.NodeList
import org.xml.sax.InputSource
import java.io.StringReader
import java.util.stream.Collectors.joining
import java.util.stream.Collectors.toList
import java.util.stream.IntStream
import javax.ws.rs.client.Client
import javax.ws.rs.client.ClientBuilder
import javax.xml.namespace.NamespaceContext
import javax.xml.xpath.XPath
import javax.xml.xpath.XPathConstants
import javax.xml.xpath.XPathFactory


data class Tms2Dexter(
    val dexterField: String,
    val tmsPath: String
)

class WereldCulturenDublinCoreImporter() {
    private val client: Client = ClientBuilder.newClient()
    private val objectMapper: ObjectMapper = ObjectMapper()
    private val xpath: XPath
    private val tms2DexterFields: List<Tms2Dexter>

    init {
        val factory: XPathFactory = XPathFactory.newInstance()
        val xpath: XPath = factory.newXPath()
        xpath.namespaceContext = WereldCollectieContext()
        this.xpath = xpath
        this.tms2DexterFields = listOf(
            Tms2Dexter(
                "externalRef",
                "//crm:E22_Human-Made_Object/@rdf:about"
            ),
            Tms2Dexter(
                "description",
                "//crm:E22_Human-Made_Object/crm:P2_has_type//rdfs:label//text()"
            ),
            Tms2Dexter(
                "title",
                "//crm:E22_Human-Made_Object/crm:P1_is_identified_by//crm:E33_E41_Linguistic_Appellation/crm:P190_has_symbolic_content//text()"
            ),
            Tms2Dexter(
                "earliest",
                "//crm:P4_has_time-span//crm:P82a_begin_of_the_begin//text()"
            ),
            Tms2Dexter(
                "latest",
                "//crm:P4_has_time-span//crm:P82b_end_of_the_end//text()"
            )
        )
    }

    fun import(url: String): ResultDublinCoreMetadata {
        val xmlResponse: String = client
            .target(url)
            .request()
            .get(String::class.java)
        return mapTmsToDexter(xmlResponse);
    }

    fun mapTmsToDexter(xmlResponse: String): HashMap<String, String> {
        val result = HashMap<String, String>();
        tms2DexterFields.forEach {
            val value: NodeList = xpath.evaluate(
                it.tmsPath,
                InputSource(StringReader(xmlResponse)),
                XPathConstants.NODESET
            ) as NodeList
            val found: List<String> = IntStream.range(0, value.length)
                .mapToObj(value::item)
                .map { n -> n.nodeValue }
                .collect(toList());
            result[it.dexterField] = found.stream().collect(joining(", "))
        }
        return result
    }
}

class WereldCollectieContext : NamespaceContext {
    override fun getNamespaceURI(prefix: String): String {
        return when (prefix) {
            "crm" -> "http://www.cidoc-crm.org/cidoc-crm/"
            "dc" -> "http://purl.org/dc/elements/1.1/"
            "rdfs" -> "http://www.w3.org/2000/01/rdf-schema#"
            "rdf" -> "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
            else -> throw IllegalArgumentException(prefix)
        }
    }

    override fun getPrefix(namespaceURI: String?): String {
        throw UnsupportedOperationException()
    }

    override fun getPrefixes(
        namespaceURI: String?
    ): Iterator<String> {
        throw UnsupportedOperationException()
    }
}
