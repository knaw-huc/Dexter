import { Navigate, Route, Routes } from 'react-router-dom';
import { Page } from './components/Page';
import React, { lazy } from 'react';

const CorpusIndex = lazy(() => import('./components/corpus/CorpusIndex'));
const CorpusPage = lazy(() => import('./components/corpus/CorpusPage'));
const SourceIndex = lazy(() => import('./components/source/SourceIndex'));
const SourcePage = lazy(() => import('./components/source/SourcePage'));
const TagIndex = lazy(() => import('./components/tag/TagIndex'));
const MetadataKeyIndex = lazy(
  () => import('./components/metadata/MetadataKeyIndex'),
);
const MediaIndex = lazy(() => import('./components/media/MediaIndex'));
const MediaPage = lazy(() => import('./components/media/MediaPage'));
const ReferenceIndex = lazy(
  () => import('./components/reference/ReferenceIndex'),
);

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<Page />}>
        <Route path="/" element={<Navigate to={`/corpora`} />} />

        <Route path={`/corpora`} element={<CorpusIndex />} />
        <Route path={`/corpora/:corpusId`} element={<CorpusPage />} />
        <Route path={`/sources`} element={<SourceIndex />} />
        <Route path={`/sources/:sourceId`} element={<SourcePage />} />
        <Route path={`/tags`} element={<TagIndex />} />
        <Route path={`/metadata`} element={<MetadataKeyIndex />} />
        <Route path={`/media`} element={<MediaIndex />} />
        <Route path={`/media/:mediaId`} element={<MediaPage />} />
        <Route path={`/references`} element={<ReferenceIndex />} />
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
  );
}
