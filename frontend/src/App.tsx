import React from "react"
import {Route, Routes} from "react-router-dom"
import {CollectionList} from "./components/collections/CollectionList"
import {SourcesList} from "./components/sources/SourcesList"
import {Page} from "./components/Page"
import {CollectionItemContent} from "./components/collections/CollectionItemContent"
import CssBaseline from "@mui/material/CssBaseline"
import {KeywordList} from "./components/keywords/KeywordList"
import {SourcePage} from "./components/sources/SourcePage"
import {Providers} from "./Providers"

export function App() {
    return <>
        <CssBaseline/>
        <Providers>
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
        </Providers>
    </>
}