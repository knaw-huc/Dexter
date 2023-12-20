import React from "react"
import {Navigate, Route, Routes} from "react-router-dom"
import {CollectionsPage} from "./components/collections/CollectionsPage"
import {SourcesPage} from "./components/sources/SourcesList"
import {Page} from "./components/Page"
import {CollectionPage} from "./components/collections/CollectionPage"
import CssBaseline from "@mui/material/CssBaseline"
import {KeywordsPage} from "./components/keywords/KeywordsPage"
import {SourcePage} from "./components/sources/SourcePage"
import {Providers} from "./Providers"

export function App() {
    return <>
        <CssBaseline/>
        <Providers>
            <Routes>
                <Route path="/" element={<Page/>}>
                    <Route path="/" element={<Navigate to="/corpora"/>}/>
                    <Route path="/corpora" element={<CollectionsPage/>}/>
                    <Route path="/corpora/:corpusId" element={<CollectionPage/>}/>
                    <Route path="/sources" element={<SourcesPage/>}/>
                    <Route path="/sources/:sourceId" element={<SourcePage/>}/>
                    <Route path="/keywords" element={<KeywordsPage/>}/>
                    <Route path="*" element={<p>Page not found... <a href="/">Homepage &gt;</a></p>}/>
                </Route>
            </Routes>
        </Providers>
    </>
}