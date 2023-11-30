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


data class Tms2Dc(
    val dcField: String,
    val tmsPath: String,
    val type: String
)

class WereldCulturenDublinCoreImporter() {
    private val client: Client = ClientBuilder.newClient()
    private val objectMapper: ObjectMapper = ObjectMapper()
    private val xpath: XPath
    private val tms2DcFields: List<Tms2Dc>

    init {
        val factory: XPathFactory = XPathFactory.newInstance()
        val xpath: XPath = factory.newXPath()
        xpath.namespaceContext = WereldCollectieContext()
        this.xpath = xpath
        this.tms2DcFields = listOf(
            Tms2Dc(
                "Identifier",
                "//crm:E22_Human-Made_Object/@rdf:about",
                "value"
            ),
            Tms2Dc(
                "Description",
                "//crm:E22_Human-Made_Object/crm:P2_has_type//rdfs:label//text()",
                "data"
            ),
            Tms2Dc(
                "Format",
                "//crm:P43_has_dimension//crm:P190_has_symbolic_content//text()",
                "data"
            ),
            Tms2Dc(
                "Title",
                "//crm:E22_Human-Made_Object/crm:P1_is_identified_by//crm:E33_E41_Linguistic_Appellation/crm:P190_has_symbolic_content//text()",
                "data"
            ),
            Tms2Dc(
                "Date",
                "//crm:P108i_was_produced_by//crm:E12_Production//crm:P4_has_time-span//crm:P1_is_identified_by//crm:P190_has_symbolic_content//text()",
                "data"
            ),
            Tms2Dc(
                "Creator",
                "//crm:P108i_was_produced_by//crm:P14_carried_out_by/@rdf:resource",
                "value"
            ),
        )
    }

    fun import(form: FormTmsExport): ResultDublinCoreMetadata {
        val xmlResponse: String = client
            .target(form.url)
            .request()
            .get(String::class.java)
        return mapTmsToDc(xmlResponse);
    }

    fun mapTmsToDc(xmlResponse: String): HashMap<String, String> {
        val result = HashMap<String, String>();
        tms2DcFields.forEach {
            val value: NodeList = xpath.evaluate(
                it.tmsPath,
                InputSource(StringReader(xmlResponse)),
                XPathConstants.NODESET
            ) as NodeList
            val found: List<String> = IntStream.range(0, value.length)
                .mapToObj(value::item)
                .map { n -> n.nodeValue }
                .collect(toList());
            result[it.dcField] = found.stream().collect(joining(", "))
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
