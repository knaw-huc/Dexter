import React from "react"
import { initState, SourcesAction, SourcesState } from "./sourcesReducer"

interface SourcesContext {
    sourcesState: SourcesState,
    sourcesDispatch: React.Dispatch<SourcesAction>
}

const initSourcesContext: SourcesContext = {
    sourcesState: initState,
    sourcesDispatch: null
}

export const sourcesContext = React.createContext<SourcesContext>(initSourcesContext)