import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Corpus,
  ResultTag,
  ResultLanguage,
  Source,
} from '../../model/DexterModel';
import { CorpusForm } from './CorpusForm';
import { errorContext } from '../../state/error/errorContext';
import {
  addSourcesToCorpus,
  deleteLanguageFromCorpus,
  deleteSourceFromCorpus,
  getCorporaWithResources,
  getCorpusWithResourcesById,
  getSourcesWithResources,
} from '../../utils/API';
import { Languages } from '../language/Languages';
import { SourcePreview } from '../source/SourcePreview';
import { SourceForm } from '../source/SourceForm';
import { EditButton } from '../common/EditButton';
import { AddNewResourceButton } from '../common/AddNewResourceButton';
import { SelectExistingResourceButton } from '../source/SelectExistingResourceButton';
import { SelectSourcesForm } from './SelectSourcesForm';
import _ from 'lodash';
import { Grid } from '@mui/material';
import { TagList } from '../tag/TagList';
import { TagsFilter } from '../tag/TagsFilter';
import { FieldLabel, ShortFieldsSummary } from '../common/ShortFieldsSummary';
import { CorpusIcon } from './CorpusIcon';
import { HeaderBreadCrumb } from '../common/breadcrumb/HeaderBreadCrumb';
import { CorporaBreadCrumbLink } from './CorporaBreadCrumbLink';
import { CorpusParentBreadCrumbLink } from './CorpusParentBreadCrumbLink';
import { NoResults } from '../common/NoResults';
import { MetadataValuePageFields } from '../metadata/MetadataValuePageFields';
import { Title } from '../media/Title';
import { SourceIcon } from '../source/SourceIcon';

export const CorpusPage = () => {
  const [corpus, setCorpus] = useState<Corpus>(null);
  const [sourceOptions, setSourceOptions] = useState<Source[]>(null);
  const [parentOptions, setParentOptions] = useState<Corpus[]>(null);
  const { dispatchError } = useContext(errorContext);
  const params = useParams();

  const corpusId = params.corpusId;

  const [showCorpusForm, setShowCorpusForm] = useState(false);
  const [showSourceForm, setShowSourceForm] = useState(false);
  const [showLinkSourceForm, setShowLinkSourceForm] = useState(false);
  const [filterTags, setFilterTags] = useState<ResultTag[]>([]);

  const initResources = async (id: string) => {
    const corpusWithResources = await getCorpusWithResourcesById(id).catch(
      dispatchError,
    );
    if (!corpusWithResources) {
      dispatchError(new Error(`No corpus found with ID ${id}`));
      return;
    }
    setCorpus({
      ...corpusWithResources,
    });
    setSourceOptions(await getSourcesWithResources());
    setParentOptions(
      await getCorporaWithResources().then(all => all.filter(c => c.id !== id)),
    );
  };

  useEffect(() => {
    initResources(corpusId);
  }, [corpusId]);

  const handleSavedCorpus = (corpus: Corpus) => {
    setCorpus(corpus);
    setShowCorpusForm(false);
  };

  const handleSaveSource = (update: Source) => {
    setCorpus(corpus => ({
      ...corpus,
      sources: [...corpus.sources, update],
    }));
    setShowSourceForm(false);
  };

  const handleDeleteLanguage = async (language: ResultLanguage) => {
    const warning = window.confirm(
      'Are you sure you wish to delete this language?',
    );

    if (warning === false) return;

    await deleteLanguageFromCorpus(corpusId, language.id);
    setCorpus(corpus => ({
      ...corpus,
      languages: corpus.languages.filter(l => l.id !== language.id),
    }));
  };

  const handleUnlinkSource = async (corpusId: string, sourceId: string) => {
    const warning = window.confirm(
      'Are you sure you wish to remove this source from this corpus?',
    );

    if (warning === false) return;

    await deleteSourceFromCorpus(corpusId, sourceId);
    setCorpus(corpus => ({
      ...corpus,
      sources: corpus.sources.filter(s => s.id !== sourceId),
    }));
  };

  const handleLinkSource = async (corpusId: string, sourceId: string) => {
    await addSourcesToCorpus(corpusId, [sourceId]);
    const toLink = sourceOptions.find(s => s.id === sourceId);
    setCorpus(corpus => ({
      ...corpus,
      sources: [...corpus.sources, toLink],
    }));
  };

  const shortCorpusFields: (keyof Corpus)[] = [
    'location',
    'earliest',
    'latest',
    'rights',
    'ethics',
    'access',
    'contributor',
  ];

  function getFilteredCorpusSources() {
    if (!corpus?.sources) {
      return [];
    }
    if (!filterTags.length) {
      return corpus.sources;
    }
    return corpus.sources.filter(cs =>
      filterTags.every(ft => cs.tags.find(cst => cst.id === ft.id)),
    );
  }

  const filteredCorpusSources = getFilteredCorpusSources();

  return (
    <div>
      <HeaderBreadCrumb>
        <CorporaBreadCrumbLink />
        {corpus?.parent && (
          <CorpusParentBreadCrumbLink parent={corpus.parent} />
        )}
      </HeaderBreadCrumb>

      {corpus && (
        <>
          <EditButton onEdit={() => setShowCorpusForm(true)} />
          <h1 style={{ marginTop: 0 }}>
            <CorpusIcon />
            <Title title={corpus.title} />
          </h1>
          {corpus.description && <p>{corpus.description}</p>}
          {!_.isEmpty(corpus.tags) && (
            <>
              <FieldLabel label="Tags" />
              <TagList tags={corpus.tags} />
            </>
          )}
          <ShortFieldsSummary<Corpus>
            resource={corpus}
            fieldNames={shortCorpusFields}
          />

          {!_.isEmpty(corpus.languages) && (
            <div>
              <h4>Languages:</h4>
              <Languages
                languages={corpus.languages}
                onDelete={handleDeleteLanguage}
              />
            </div>
          )}
          {corpus.notes && (
            <>
              <h2>Notes</h2>
              <p>{corpus.notes}</p>
            </>
          )}

          {!_.isEmpty(corpus.metadataValues) && (
            <MetadataValuePageFields values={corpus.metadataValues} />
          )}

          <h2>
            <SourceIcon />
            Sources
          </h2>
          <Grid container spacing={2}>
            <Grid item xs={6} md={4}>
              <AddNewResourceButton
                title="New source"
                onClick={() => setShowSourceForm(true)}
              />
              <SelectExistingResourceButton
                title="Existing source"
                onClick={() => setShowLinkSourceForm(true)}
              />
            </Grid>
            <Grid item xs={6} md={8}>
              <TagsFilter
                all={_.uniqBy(corpus.sources.map(s => s.tags).flat(), 'val')}
                selected={filterTags}
                onChangeSelected={update => setFilterTags(update)}
              />
            </Grid>
          </Grid>
          {!_.isEmpty(corpus.sources) ? (
            <Grid container spacing={2} sx={{ pl: 0.1, pr: 1, mt: 2, mb: 2 }}>
              {filteredCorpusSources.map(source => (
                <Grid item xs={4} key={source.id}>
                  <SourcePreview
                    source={source}
                    corpusId={corpus.id}
                    onUnlinkSource={() =>
                      handleUnlinkSource(corpus.id, source.id)
                    }
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <NoResults message="No sources" />
          )}

          {showLinkSourceForm && (
            <SelectSourcesForm
              options={sourceOptions}
              selected={corpus.sources}
              onLinkSource={sourceId => handleLinkSource(corpusId, sourceId)}
              onUnlinkSource={sourceId =>
                handleUnlinkSource(corpusId, sourceId)
              }
              onClose={() => setShowLinkSourceForm(false)}
            />
          )}
        </>
      )}
      {showCorpusForm && (
        <CorpusForm
          corpusToEdit={corpus}
          parentOptions={parentOptions}
          sourceOptions={sourceOptions}
          onClose={() => setShowCorpusForm(false)}
          onSaved={handleSavedCorpus}
        />
      )}
      {showSourceForm && (
        <SourceForm
          corpusId={corpusId}
          onClose={() => setShowSourceForm(false)}
          onSaved={handleSaveSource}
        />
      )}
    </div>
  );
};
