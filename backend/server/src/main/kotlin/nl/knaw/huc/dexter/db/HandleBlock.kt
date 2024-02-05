package nl.knaw.huc.dexter.db

import org.jdbi.v3.core.Handle

fun interface HandleBlock<I, R> {
    fun execute(
        handle: Handle,
        it: I
    ): R
}