import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { CorpusIndex } from './components/corpus/CorpusIndex';
import { Page } from './components/Page';
import { CorpusPage } from './components/corpus/CorpusPage';
import CssBaseline from '@mui/material/CssBaseline';
import { TagsPage } from './components/tag/TagsPage';
import { SourcePage } from './components/source/SourcePage';
import { Providers } from './Providers';
import { SourceIndex } from './components/source/SourceIndex';
import { MetadataKeyIndex } from './components/metadata/MetadataKeyIndex';
import './App.css';

export function App() {
  return (
    <>
      <CssBaseline />
      <Providers>
        <Routes>
          <Route path="/" element={<Page />}>
            <Route path="/" element={<Navigate to="/corpora" />} />
            <Route path="/corpora" element={<CorpusIndex />} />
            <Route path="/corpora/:corpusId" element={<CorpusPage />} />
            <Route path="/sources" element={<SourceIndex />} />
            <Route path="/sources/:sourceId" element={<SourcePage />} />
            <Route path="/tags" element={<TagsPage />} />
            <Route path="/metadata" element={<MetadataKeyIndex />} />
            <Route
              path="*"
              element={
                <p>
                  Page not found. Go back to the <a href="/">homepage &gt;</a>
                </p>
              }
            />
          </Route>
        </Routes>
      </Providers>
    </>
  );
}
