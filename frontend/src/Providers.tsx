import React from "react"
import { collectionsContext } from "./State/Collections/collectionContext"
import { useCollectionsState } from "./State/Collections/collectionReducer"
import { errorContext } from "./State/Error/errorContext"
import { useErrorState } from "./State/Error/errorReducer"
import { sourcesContext } from "./State/Sources/sourcesContext"
import { useSourcesState } from "./State/Sources/sourcesReducer"

export const Providers = (props: { children: React.ReactNode }) => {
    const [sourcesState, sourcesDispatch] = useSourcesState()
    const [collectionsState, collectionsDispatch] = useCollectionsState()
    const [errorState, errorDispatch] = useErrorState()

    return (
        <sourcesContext.Provider value={{ sourcesState, sourcesDispatch }}>
            <errorContext.Provider value={{ errorState, errorDispatch }}>
                <collectionsContext.Provider value={{ collectionsState, collectionsDispatch }}>
                    {props.children}
                </collectionsContext.Provider>
            </errorContext.Provider>
        </sourcesContext.Provider>
    )
}