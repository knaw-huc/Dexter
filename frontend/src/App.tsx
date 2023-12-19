import React from "react"
import {Route, Routes} from "react-router-dom"
import {CollectionList} from "./Components/Collections/CollectionList"
import {SourcesList} from "./Components/Sources/SourcesList"
import {Page} from "./Components/Page"
import {CollectionItemContent} from "./Components/Collections/CollectionItemContent"
import ErrorHandler from "./Components/ErrorHandler"
import {useErrorState} from "./State/Error/errorReducer"
import CssBaseline from "@mui/material/CssBaseline"
import {KeywordList} from "./Components/keywords/KeywordList"
import {SourcePage} from "./Components/Sources/SourcePage"
import {Providers} from "./Providers"

export function App() {
    const [errorState] = useErrorState()

    return <>
        <CssBaseline/>
        <Providers>
            <ErrorHandler error={errorState.error}>
                <Routes>
                    <Route path="/" element={<Page/>}>
                        <Route path="/corpora" element={<CollectionList/>}/>
                        <Route path="/corpora/:corpusId" element={<CollectionItemContent/>}/>
                        <Route path="/sources" element={<SourcesList/>}/>
                        <Route path="/sources/:sourceId" element={<SourcePage/>}/>
                        <Route path="/keywords" element={<KeywordList/>}/>
                        <Route path="*" element={<p>Page not found... <a href="/">Homepage &gt;</a></p>}/>
                    </Route>
                </Routes>
            </ErrorHandler>
        </Providers>
    </>
}