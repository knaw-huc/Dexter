import React from "react"
import {Routes, Route} from "react-router-dom"
import {CollectionList} from "./Components/Collections/CollectionList"
import {SourcesList} from "./Components/Sources/SourcesList"
import {Home} from "./Components/Home"
import {CollectionItemContent} from "./Components/Collections/CollectionItemContent"
import {SourcePage} from "./Components/Sources/SourcePage"
import {useSourcesState} from "./State/Sources/sourcesReducer"
import {sourcesContext} from "./State/Sources/sourcesContext"
import {collectionsContext} from "./State/Collections/collectionContext"
import {useCollectionsState} from "./State/Collections/collectionReducer"
import Errorhandler from "./Errorhandler"
import {useErrorState} from "./State/Error/errorReducer"
import {errorContext} from "./State/Error/errorContext"

export function App() {
    const [sourcesState, sourcesDispatch] = useSourcesState()
    const [collectionsState, collectionsDispatch] = useCollectionsState()
    const [errorState, setError] = useErrorState()

    return (
        <Errorhandler
            errorState={errorState}
        >
            <sourcesContext.Provider value={{sources: sourcesState, setSources: sourcesDispatch}}>
                <collectionsContext.Provider value={{collectionsState, collectionsDispatch}}>
                    <errorContext.Provider value={{errorState, updateError: setError}}>
                        <Routes>
                            <Route path="/" element={<Home/>}>
                                <Route path="/corpora" element={<CollectionList/>}/>
                                <Route path="/corpora/:corpusId" element={<CollectionItemContent/>}/>
                                <Route path="/sources" element={<SourcesList/>}/>
                                <Route path="/sources/:sourceId" element={<SourcePage/>}/>
                                <Route path="*" element={<p>There is nothing here</p>}/>
                            </Route>
                        </Routes>
                    </errorContext.Provider>
                </collectionsContext.Provider>
            </sourcesContext.Provider>
        </Errorhandler>
    )
}