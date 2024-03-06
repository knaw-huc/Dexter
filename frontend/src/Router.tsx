import { Navigate, Route, Routes } from 'react-router-dom';
import { Page } from './components/Page';
import { CorpusIndex } from './components/corpus/CorpusIndex';
import { CorpusPage } from './components/corpus/CorpusPage';
import { SourceIndex } from './components/source/SourceIndex';
import { SourcePage } from './components/source/SourcePage';
import { TagIndex } from './components/tag/TagIndex';
import { MetadataKeyIndex } from './components/metadata/MetadataKeyIndex';
import React from 'react';
import { MediaIndex } from './components/media/MediaIndex';
import { corpora, media, metadata, sources, tags } from './model/Resources';
import { MediaPage } from './components/media/MediaPage';
import { Citation } from './components/source/Citation';

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<Page />}>
        <Route path="/" element={<Navigate to={`/${corpora}`} />} />
        <Route path={`/${corpora}`} element={<CorpusIndex />} />
        <Route path={`/${corpora}/:corpusId`} element={<CorpusPage />} />
        <Route path={`/${sources}`} element={<SourceIndex />} />
        <Route path={`/${sources}/:sourceId`} element={<SourcePage />} />
        <Route path={`/${tags}`} element={<TagIndex />} />
        <Route path={`/${metadata}`} element={<MetadataKeyIndex />} />
        <Route path={`/${media}`} element={<MediaIndex />} />
        <Route path={`/${media}/:mediaId`} element={<MediaPage />} />
        <Route path={`/citation`} element={<Citation />} />
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
