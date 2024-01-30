package nl.knaw.huc.dexter.db

import FormMetadataValue
import ResultMetadataValue
import org.jdbi.v3.sqlobject.kotlin.BindKotlin
import org.jdbi.v3.sqlobject.statement.SqlQuery
import org.jdbi.v3.sqlobject.statement.SqlUpdate
import java.util.UUID

interface MetadataValuesDao {
    @SqlQuery("select * from metadata_values")
    fun list(): List<ResultMetadataValue>

    @SqlQuery("select * from metadata_values where id = :id")
    fun find(id: UUID): ResultMetadataValue?

    @SqlQuery("insert into metadata_values (key_id, value, created_by) values (:keyId, :value, :createdBy) returning *")
    fun insert(
        @BindKotlin metadataValue: FormMetadataValue,
        createdBy: UUID
    ): ResultMetadataValue

    @SqlQuery("update metadata_values set value = :value where id = :id returning *")
    fun update(id: UUID, @BindKotlin metadataValue: FormMetadataValue): ResultMetadataValue

    /**
     * Cascaded delete also deletes link table entries
     */
    @SqlUpdate("delete from metadata_values where id = :id")
    fun delete(id: UUID)

}