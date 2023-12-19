import React from "react";
import { initState, SourcesAction, SourcesState } from "./sourcesReducer";

interface SourcesContext {
    sources: SourcesState,
    setSources: React.Dispatch<SourcesAction>
}

const initSourcesContext: SourcesContext = {
    sources: initState,
    setSources: null
}

export const sourcesContext = React.createContext<SourcesContext>(initSourcesContext)