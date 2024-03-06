import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Corpus, ResultTag, Source } from '../../model/DexterModel';
import { CorpusForm } from './CorpusForm';
import {
  addSourcesToCorpus,
  deleteSourceFromCorpus,
  getCorporaWithResources,
  getCorpusWithResourcesById,
  getSourcesWithResources,
  updateCorpus,
} from '../../utils/API';
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
import { CorpusPreview } from './CorpusPreview';
import { H2Styled } from '../common/H2Styled';
import { SelectCorpusForm } from './SelectCorpusForm';
import { useThrowSync } from '../common/error/useThrowSync';

export const CorpusPage = () => {
  const params = useParams();
  const corpusId = params.corpusId;

  const [corpus, setCorpus] = useState<Corpus>(null);
  const [sourceOptions, setSourceOptions] = useState<Source[]>(null);
  const [corpusOptions, setCorpusOptions] = useState<Corpus[]>(null);

  const [showCorpusForm, setShowCorpusForm] = useState(false);
  const [showSubcorpusForm, setShowSubcorpusForm] = useState(false);
  const [showSelectSubcorpusForm, setShowSelectSubcorpusForm] = useState(false);
  const [subcorpusFilterTags, setSubcorpusFilterTags] = useState<ResultTag[]>(
    [],
  );
  const [showSourceForm, setShowSourceForm] = useState(false);
  const [showSelectSourceForm, setShowSelectSourceForm] = useState(false);
  const [sourceFilterTags, setSourceFilterTags] = useState<ResultTag[]>([]);

  const throwSync = useThrowSync();

  useEffect(() => {
    init();

    async function init() {
      try {
        const corpusWithResources = await getCorpusWithResourcesById(corpusId);
        setCorpus({
          ...corpusWithResources,
        });
        setSourceOptions(await getSourcesWithResources());
        setCorpusOptions(
          await getCorporaWithResources().then(all =>
            all.filter(c => c.id !== corpusId),
          ),
        );
      } catch (e) {
        throwSync(new Error(`Could not init page of corpus ${corpusId}`, e));
      }
    }
  }, [corpusId]);

  const handleSavedCorpusForm = (corpus: Corpus) => {
    if (showCorpusForm) {
      handleSavedCorpus(corpus);
    } else {
      handleSavedSubcorpus(corpus);
    }
  };

  const handleSavedCorpus = (corpus: Corpus) => {
    setCorpus(corpus);
    setShowCorpusForm(false);
  };

  const handleSavedSubcorpus = async (subcorpus: Corpus) => {
    subcorpus.parent = corpus;
    await updateCorpus(subcorpus.id, { ...subcorpus, parentId: corpus.id });
    setCorpus(corpus => ({
      ...corpus,
      subcorpora: [...corpus.subcorpora, subcorpus],
    }));
    setShowSubcorpusForm(false);
  };

  const handleSaveSource = (update: Source) => {
    setCorpus(corpus => ({
      ...corpus,
      sources: [...corpus.sources, update],
    }));
    setShowSourceForm(false);
  };
  const handleSelectSource = async (corpusId: string, sourceId: string) => {
    await addSourcesToCorpus(corpusId, [sourceId]);
    const toLink = sourceOptions.find(s => s.id === sourceId);
    setCorpus(corpus => ({
      ...corpus,
      sources: [...corpus.sources, toLink],
    }));
  };

  const handleDeselectSource = async (corpusId: string, sourceId: string) => {
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

  const handleSelectSubcorpus = async (subcorpusId: string) => {
    const subcorpus = corpusOptions.find(c => c.id === subcorpusId);
    subcorpus.parent = corpus;
    await updateCorpus(subcorpusId, { ...subcorpus, parentId: corpus.id });
    setCorpus(corpus => ({
      ...corpus,
      subcorpora: [...corpus.subcorpora, subcorpus],
    }));
  };

  function handleCloseCorpusForm() {
    setShowSubcorpusForm(false);
    setShowCorpusForm(false);
  }

  const handleDeselectSubcorpus = async (subcorpusId: string) => {
    const warning = window.confirm(
      'Are you sure you wish to remove this subcorpus from this corpus?',
    );

    if (warning === false) return;

    const subcorpus = corpusOptions.find(c => c.id === subcorpusId);
    await updateCorpus(subcorpusId, subcorpus);
    setCorpus(corpus => ({
      ...corpus,
      subcorpora: corpus.subcorpora.filter(c => c.id !== subcorpusId),
    }));
  };

  function handleDeletedSubcorpus(subcorpus: Corpus) {
    setCorpus(corpus => ({
      ...corpus,
      subcorpora: corpus.subcorpora.filter(c => c.id !== subcorpus.id),
    }));
  }

  const shortCorpusFields: (keyof Corpus)[] = [
    'location',
    'languages',
    'earliest',
    'latest',
    'rights',
    'ethics',
    'access',
    'contributor',
  ];

  function getFilteredSources(): Source[] {
    if (!corpus?.sources) {
      return [];
    }
    if (!sourceFilterTags.length) {
      return corpus.sources;
    }
    return corpus.sources.filter(cs =>
      sourceFilterTags.every(ft => cs.tags.find(cst => cst.id === ft.id)),
    );
  }

  function getFilteredSubcorpora(): Corpus[] {
    if (!corpus?.subcorpora) {
      return [];
    }
    if (!subcorpusFilterTags.length) {
      return corpus.subcorpora;
    }
    return corpus.subcorpora.filter(subcorpus => {
      const subcorpusTags = getCorpusTags(subcorpus);
      return subcorpusFilterTags.every(ft =>
        subcorpusTags.find(cst => cst.id === ft.id),
      );
    });
  }

  if (!corpus) {
    return null;
  }

  return (
    <div>
      <HeaderBreadCrumb>
        <CorporaBreadCrumbLink />
        {corpus?.parent && (
          <CorpusParentBreadCrumbLink parent={corpus.parent} />
        )}
      </HeaderBreadCrumb>

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
        fieldMapper={(corpus, field) =>
          field === 'languages' && corpus[field].map(l => l.refName).join(', ')
        }
      />

      {corpus.notes && (
        <>
          <h2>Notes</h2>
          <p>{corpus.notes}</p>
        </>
      )}

      {!_.isEmpty(corpus.metadataValues) && (
        <MetadataValuePageFields values={corpus.metadataValues} />
      )}

      {!_.isEmpty(corpus.subcorpora) && (
        <>
          <H2Styled>
            <CorpusIcon />
            Subcorpora
          </H2Styled>
          <Grid container spacing={2}>
            <Grid item xs={6} md={4}>
              <AddNewResourceButton
                title="New corpus"
                onClick={() => {
                  setShowSubcorpusForm(true);
                }}
              />
              <SelectExistingResourceButton
                title="Existing corpus"
                onClick={() => setShowSelectSubcorpusForm(true)}
              />
            </Grid>
            <Grid item xs={6} md={8}>
              <TagsFilter
                placeholder="Filter corpora by their tags, plus the tags of their subcorpora and sources "
                all={getCorpusTags(corpus)}
                selected={subcorpusFilterTags}
                onChangeSelected={update => setSubcorpusFilterTags(update)}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ pl: 0.1, pr: 1, mt: 2, mb: 2 }}>
            {getFilteredSubcorpora().map(c => (
              <Grid item xs={4} key={c.id}>
                <CorpusPreview
                  corpus={c}
                  onDeleted={() => handleDeletedSubcorpus(corpus)}
                />
              </Grid>
            ))}
          </Grid>
        </>
      )}

      <H2Styled>
        <SourceIcon />
        Sources
      </H2Styled>
      <Grid container spacing={2}>
        <Grid item xs={6} md={4}>
          <AddNewResourceButton
            title="New source"
            onClick={() => setShowSourceForm(true)}
          />
          <SelectExistingResourceButton
            title="Existing source"
            onClick={() => setShowSelectSourceForm(true)}
          />
        </Grid>
        <Grid item xs={6} md={8}>
          <TagsFilter
            placeholder="Filter sources by their tags"
            all={getAllSourceTags(corpus)}
            selected={sourceFilterTags}
            onChangeSelected={update => setSourceFilterTags(update)}
          />
        </Grid>
      </Grid>
      {!_.isEmpty(corpus.sources) ? (
        <Grid container spacing={2} sx={{ pl: 0.1, pr: 1, mt: 2, mb: 2 }}>
          {getFilteredSources().map(source => (
            <Grid item xs={4} key={source.id}>
              <SourcePreview
                source={source}
                corpusId={corpus.id}
                onUnlinkSource={() =>
                  handleDeselectSource(corpus.id, source.id)
                }
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <NoResults message="No sources" />
      )}

      {(showCorpusForm || showSubcorpusForm) && (
        <CorpusForm
          corpusToEdit={corpus}
          parentOptions={showSubcorpusForm ? null : corpusOptions}
          sourceOptions={sourceOptions}
          onClose={handleCloseCorpusForm}
          onSaved={handleSavedCorpusForm}
        />
      )}
      {showSourceForm && (
        <SourceForm
          corpusId={corpusId}
          onClose={() => setShowSourceForm(false)}
          onSaved={handleSaveSource}
        />
      )}
      {showSelectSubcorpusForm && (
        <SelectCorpusForm
          options={corpusOptions.filter(c => !c.parent)}
          onSelectCorpus={handleSelectSubcorpus}
          onDeselectCorpus={handleDeselectSubcorpus}
          onClose={() => setShowSelectSubcorpusForm(false)}
        />
      )}
      {showSelectSourceForm && (
        <SelectSourcesForm
          options={sourceOptions}
          selected={corpus.sources}
          onSelectSource={sourceId => handleSelectSource(corpusId, sourceId)}
          onDeselectSource={sourceId =>
            handleDeselectSource(corpusId, sourceId)
          }
          onClose={() => setShowSelectSourceForm(false)}
        />
      )}
    </div>
  );
};

function getAllSourceTags(corpus: Corpus) {
  return _.uniqBy(corpus.sources.map(s => s.tags).flat(), 'id');
}

function getCorpusTags(subcorpus: Corpus): ResultTag[] {
  const all = [
    ...subcorpus.tags,
    ...subcorpus.sources.flatMap(s => s.tags),
    ...subcorpus.subcorpora.flatMap(getCorpusTags),
  ];
  return _.uniqBy(all, 'id');
}
