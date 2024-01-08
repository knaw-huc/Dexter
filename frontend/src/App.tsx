import React from "react"
import {Navigate, Route, Routes} from "react-router-dom"
import {CorpusIndex} from "./components/collections/CorpusIndex"
import {Page} from "./components/Page"
import {CorpusPage} from "./components/collections/CorpusPage"
import CssBaseline from "@mui/material/CssBaseline"
import {KeywordsPage} from "./components/keywords/KeywordsPage"
import {SourcePage} from "./components/sources/SourcePage"
import {Providers} from "./Providers"
import {SourceIndex} from "./components/sources/SourceIndex"

export function App() {
    return <>
        <CssBaseline/>
        <Providers>
            <Routes>
                <Route path="/" element={<Page/>}>
                    <Route path="/" element={<Navigate to="/corpora"/>}/>
                    <Route path="/corpora" element={<CorpusIndex/>}/>
                    <Route path="/corpora/:corpusId" element={<CorpusPage/>}/>
                    <Route path="/sources" element={<SourceIndex/>}/>
                    <Route path="/sources/:sourceId" element={<SourcePage/>}/>
                    <Route path="/keywords" element={<KeywordsPage/>}/>
                    <Route path="*" element={<p>Page not found... <a href="/">Homepage &gt;</a></p>}/>
                </Route>
            </Routes>
        </Providers>
    </>
}