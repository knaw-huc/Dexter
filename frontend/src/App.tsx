import React from "react"
import {Navigate, Route, Routes} from "react-router-dom"
import {CorpusIndex} from "./components/corpus/CorpusIndex"
import {Page} from "./components/Page"
import {CorpusPage} from "./components/corpus/CorpusPage"
import CssBaseline from "@mui/material/CssBaseline"
import {KeywordsPage} from "./components/keyword/KeywordsPage"
import {SourcePage} from "./components/source/SourcePage"
import {Providers} from "./Providers"
import {SourceIndex} from "./components/source/SourceIndex"
import {MetadataKeyIndex} from "./components/metadata/MetadataKeyIndex"
import './App.css'
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
                    <Route path="/metadata" element={<MetadataKeyIndex />}/>
                    <Route path="*" element={<p>Page not found... <a href="/">Homepage &gt;</a></p>}/>
                </Route>
            </Routes>
        </Providers>
    </>
}