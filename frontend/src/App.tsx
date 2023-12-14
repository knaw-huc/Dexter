import React from "react"
import {Navigate, Route, Routes} from "react-router-dom"
import {CollectionList} from "./Components/Collections/CollectionList"
import {SourcesList} from "./Components/Sources/SourcesList"
import {Page} from "./Components/Page"
import {CollectionItemContent} from "./Components/Collections/CollectionItemContent"
import {SourcePage} from "./Components/Sources/SourcePage"
import {useSourcesState} from "./State/Sources/sourcesReducer"
import {sourcesContext} from "./State/Sources/sourcesContext"
import {collectionsContext} from "./State/Collections/collectionContext"
import {useCollectionsState} from "./State/Collections/collectionReducer"
import ErrorHandler from "./Components/ErrorHandler"
import {useErrorState} from "./State/Error/errorReducer"
import {errorContext} from "./State/Error/errorContext"
import CssBaseline from "@mui/material/CssBaseline"

export function App() {
    const [sourcesState, sourcesDispatch] = useSourcesState()
    const [collectionsState, collectionsDispatch] = useCollectionsState()
    const [errorState, setError] = useErrorState()

    return <>
        <CssBaseline/>
        <ErrorHandler error={errorState.error}>
            <sourcesContext.Provider value={{sources: sourcesState, setSources: sourcesDispatch}}>
                <collectionsContext.Provider value={{collectionsState, collectionsDispatch}}>
                    <errorContext.Provider value={{errorState, setError}}>
                        <Routes>
                            <Route path="/" element={<Page/>}>
                                <Route path="/" element={<Navigate to="/corpora" replace />}/>
                                <Route path="/corpora" element={<CollectionList/>}/>
                                <Route path="/corpora/:corpusId" element={<CollectionItemContent/>}/>
                                <Route path="/sources" element={<SourcesList/>}/>
                                <Route path="/sources/:sourceId" element={<SourcePage/>}/>
                                <Route path="*" element={<p>Page not found... <a href="/">Homepage &gt;</a></p>}/>
                            </Route>
                        </Routes>
                    </errorContext.Provider>
                </collectionsContext.Provider>
            </sourcesContext.Provider>
        </ErrorHandler>
    </>
}