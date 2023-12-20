import React from "react";
import { initState, SourcesAction, SourcesState } from "./sourcesReducer";

interface SourcesContext {
    sourcesState: SourcesState,
    dispatchSources: React.Dispatch<SourcesAction>
}

const initSourcesContext: SourcesContext = {
    sourcesState: initState,
    dispatchSources: null
}

export const sourcesContext = React.createContext<SourcesContext>(initSourcesContext)