package nl.knaw.huc.dexter.db

import nl.knaw.huc.dexter.api.FormCorpus
import nl.knaw.huc.dexter.api.ResultCorpus
import org.jdbi.v3.sqlobject.kotlin.BindKotlin
import org.jdbi.v3.sqlobject.statement.SqlQuery
import org.jdbi.v3.sqlobject.statement.SqlUpdate
import java.util.*

interface CorporaDao {
    @SqlQuery(
        "insert into corpora " +
                "(parent_id,title,description,rights,access,location,earliest,latest,contributor,notes,created_by) " +
                "values " +
                "(:parentId,:title,:description,:rights,:access,:location,:earliest,:latest,:contributor,:notes,:createdBy) " +
                "returning *"
    )
    fun insert(@BindKotlin formCorpus: FormCorpus, createdBy: UUID): ResultCorpus

    @SqlQuery("select * from corpora where id = :id")
    fun find(id: UUID): ResultCorpus?

    @SqlQuery(
        "update corpora " +
                "set (parent_id,title,description,rights,access,location,earliest,latest,contributor,notes) " +
                "= (:parentId,:title,:description,:rights,:access,:location,:earliest,:latest,:contributor,:notes) " +
                "where id = :id " +
                "returning *"
    )
    fun update(id: UUID, @BindKotlin formCorpus: FormCorpus): ResultCorpus

    @SqlQuery("select * from corpora")
    fun list(): List<ResultCorpus>

    @SqlUpdate("delete from corpora where id = :id")
    fun delete(id: UUID)
}