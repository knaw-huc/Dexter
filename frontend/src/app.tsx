import React from "react";
import { Route, Routes } from "react-router-dom";
import { CollectionItemContent } from "./Components/Collections/CollectionItemContent";
import { CollectionList } from "./Components/Collections/CollectionList";
import { Home } from "./Components/Home";
import { KeywordList } from "./Components/keywords/KeywordList";
import { SourceItemContent } from "./Components/Sources/SourceItemContent";
import { SourcesList } from "./Components/Sources/SourcesList";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />}>
        <Route path="/corpora" element={<CollectionList />} />
        <Route path="/corpora/:corpusId" element={<CollectionItemContent />} />
        <Route path="/sources" element={<SourcesList />} />
        <Route path="/sources/:sourceId" element={<SourceItemContent />} />
        <Route path="/keywords" element={<KeywordList />} />
        <Route path="*" element={<p>There is nothing here</p>} />
      </Route>
    </Routes>
  );
}
