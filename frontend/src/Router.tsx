import { Navigate, Route, Routes } from 'react-router-dom';
import { Page } from './components/Page';
import React, { lazy } from 'react';

const CorpusIndex = lazy(
  /* webpackPrefetch: true */ () => import('./components/corpus/CorpusIndex'),
);
const CorpusPage = lazy(
  /* webpackPrefetch: true */ () => import('./components/corpus/CorpusPage'),
);
const SourceIndex = lazy(
  /* webpackPrefetch: true */ () => import('./components/source/SourceIndex'),
);
const SourcePage = lazy(
  /* webpackPrefetch: true */ () => import('./components/source/SourcePage'),
);
const TagIndex = lazy(
  /* webpackPrefetch: true */ () => import('./components/tag/TagIndex'),
);
const MetadataKeyIndex = lazy(
  /* webpackPrefetch: true */
  () => import('./components/metadata/MetadataKeyIndex'),
);
const MediaIndex = lazy(
  () => import(/* webpackPrefetch: true */ './components/media/MediaIndex'),
);
const MediaPage = lazy(
  () => import(/* webpackPrefetch: true */ './components/media/MediaPage'),
);
const ReferenceIndex = lazy(
  /* webpackPrefetch: true */
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
