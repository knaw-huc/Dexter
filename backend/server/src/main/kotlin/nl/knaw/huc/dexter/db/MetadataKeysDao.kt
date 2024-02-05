package nl.knaw.huc.dexter.db

import FormMetadataKey
import ResultMetadataKey
import org.jdbi.v3.sqlobject.kotlin.BindKotlin
import org.jdbi.v3.sqlobject.statement.SqlQuery
import org.jdbi.v3.sqlobject.statement.SqlUpdate
import java.util.UUID

interface MetadataKeysDao {
    @SqlQuery("select * from metadata_keys where created_by = :id")
    fun listByUser(id: UUID): List<ResultMetadataKey>

    @SqlQuery("select * from metadata_keys where id = :id")
    fun find(id: UUID): ResultMetadataKey?

    @SqlQuery("insert into metadata_keys (key, created_by) values (:key, :createdBy) returning *")
    fun insert(@BindKotlin metadataKey: FormMetadataKey, createdBy: UUID): ResultMetadataKey

    @SqlQuery("update metadata_keys set key = :key where id = :id returning *")
    fun update(id: UUID, @BindKotlin metadataKey: FormMetadataKey): ResultMetadataKey

    @SqlUpdate("delete from metadata_keys where id = :id")
    fun delete(id: UUID)

}