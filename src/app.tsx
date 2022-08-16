import React from "react"
import { Routes, Route } from "react-router-dom"
import { useAppState } from "./State/reducer"
import { appContext } from "./State/context"
import { CollectionList } from "./Components/Collections/CollectionList"
import { SourcesList } from "./Components/Sources/SourcesList"
import { Home } from "./Components/Home"
import { CollectionItemContent } from "./Components/Collections/CollectionItemContent"
import { SourceItemContent } from "./Components/Sources/SourceItemContent"
import { useSourcesState } from "./State/Sources/sourcesReducer"
import { sourcesContext } from "./State/Sources/sourcesContext"

export function App() {
    const [state, dispatch] = useAppState()
    const [sourcesState, sourcesDispatch] = useSourcesState()

    return (
        <sourcesContext.Provider value={{ sourcesState, sourcesDispatch }}>
            <appContext.Provider value={{ state, dispatch }}>
                <Routes>
                    <Route path="/" element={<Home />}>
                        <Route path="/collections" element={<CollectionList />} />
                        <Route path="/collections/:collectionId" element={<CollectionItemContent />} />
                        <Route path="/sources" element={<SourcesList />} />
                        <Route path="/sources/:sourceId" element={<SourceItemContent />} />
                        <Route path="*" element={<p>There is nothing here</p>} />
                    </Route>
                </Routes>
            </appContext.Provider>
        </sourcesContext.Provider>
    )
}