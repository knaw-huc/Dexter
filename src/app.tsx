import React from "react"
import { Routes, Route } from "react-router-dom"
import { useAppState } from "./State/reducer"
import { appContext } from "./State/context"
import { CollectionList } from "./Components/CollectionList"
import { Resources } from "./Components/Resources"
import { Home } from "./Components/Home"
// import { Collections } from "./Model/DexterModel"
import { CollectionItemContent } from "./Components/CollectionItemContent"

export function App() {
    const [state, dispatch] = useAppState()

    return (
        <appContext.Provider value={{ state, dispatch }}>
            <Routes>
                <Route path="/" element={<Home />}>
                    <Route path="/collections" element={<CollectionList />} />
                    <Route path="/collections/:collectionId" element={<CollectionItemContent />} />
                    <Route path="resources" element={<Resources />} />
                    <Route path="*" element={<p>There is nothing here</p>} />
                </Route>
            </Routes>
        </appContext.Provider>
    )
}