package nl.knaw.huc.dexter.db

fun interface DaoBlock<D, I, R> {
    fun execute(dao: D, it: I): R
}