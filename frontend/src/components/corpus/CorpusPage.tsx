import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Corpus, Source } from '../../model/DexterModel';
import { CorpusForm } from './CorpusForm';
import {
  addSourcesToCorpus,
  deleteSourceFromCorpus,
  getCorporaWithResources,
  getCorpusWithResourcesById,
  getSourcesWithResources,
  updateCorpus,
} from '../../utils/API';
import { SourceForm } from '../source/SourceForm';
import { EditButton } from '../common/EditButton';
import { SelectSourcesForm } from './SelectSourcesForm';
import _ from 'lodash';
import { TagList } from '../tag/TagList';
import { FieldLabel, ShortFieldsSummary } from '../common/ShortFieldsSummary';
import { CorpusIcon } from './CorpusIcon';
import { HeaderBreadCrumb } from '../common/breadcrumb/HeaderBreadCrumb';
import { CorporaBreadCrumbLink } from './CorporaBreadCrumbLink';
import { CorpusParentBreadCrumbLink } from './CorpusParentBreadCrumbLink';
import { MetadataValuePageFields } from '../metadata/MetadataValuePageFields';
import { Title } from '../media/Title';
import { SelectCorpusForm } from './SelectCorpusForm';
import { useThrowSync } from '../common/error/useThrowSync';
import { CorpusSources } from './CorpusSources';
import { CorpusSubcorpora } from './CorpusSubcorpora';
import { useImmer } from 'use-immer';
import { add } from '../../utils/immer/add';
import { remove } from '../../utils/immer/remove';

export const CorpusPage = () => {
  const corpusId = useParams().corpusId;

  const [corpus, setCorpus] = useImmer<Corpus>(null);
  const [sourceOptions, setSourceOptions] = useImmer<Source[]>([]);
  const [corpusOptions, setCorpusOptions] = useImmer<Corpus[]>([]);

  const [showCorpusForm, setShowCorpusForm] = useImmer(false);
  const [showSubcorpusForm, setShowSubcorpusForm] = useImmer(false);
  const [showSelectSubcorpusForm, setShowSelectSubcorpusForm] = useImmer(false);

  const [showSourceForm, setShowSourceForm] = useImmer(false);
  const [showSelectSourceForm, setShowSelectSourceForm] = useImmer(false);

  const throwSync = useThrowSync();

  useEffect(() => {
    init();

    async function init() {
      try {
        setCorpus(await getCorpusWithResourcesById(corpusId));
        setSourceOptions(await getSourcesWithResources());
        setCorpusOptions(
          await getCorporaWithResources().then(all =>
            all.filter(c => c.id !== corpusId),
          ),
        );
      } catch (e) {
        throwSync(e);
      }
    }
  }, []);

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
    setCorpus(c => add(subcorpus, c.subcorpora));
    setShowSubcorpusForm(false);
  };

  async function handleSavedSource(update: Source) {
    await addSourcesToCorpus(corpusId, [update.id]);
    setCorpus(c => add(update, c.sources));
    setShowSourceForm(false);
  }

  const handleSelectSource = async (corpusId: string, sourceId: string) => {
    await addSourcesToCorpus(corpusId, [sourceId]);
    const toLink = sourceOptions.find(s => s.id === sourceId);
    setCorpus(c => add(toLink, c.sources));
  };

  const handleDeselectSource = async (corpusId: string, sourceId: string) => {
    const warning = window.confirm(
      'Are you sure you wish to remove this source from this corpus?',
    );

    if (warning === false) return;

    await deleteSourceFromCorpus(corpusId, sourceId);
    setCorpus(c => remove(sourceId, c.sources));
  };

  const handleSelectSubcorpus = async (subcorpusId: string) => {
    const subcorpus = corpusOptions.find(c => c.id === subcorpusId);
    subcorpus.parent = corpus;
    await updateCorpus(subcorpusId, { ...subcorpus, parentId: corpus.id });
    setCorpus(c => add(subcorpus, c.subcorpora));
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
    handleDeletedSubcorpus(subcorpus);
  };

  function handleDeletedSubcorpus(subcorpus: Corpus) {
    setCorpus(c => remove(subcorpus.id, c.subcorpora));
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
        <CorpusSubcorpora
          subcorpora={corpus.subcorpora}
          onAddNew={() => setShowSubcorpusForm(true)}
          onAddExisting={() => setShowSelectSubcorpusForm(true)}
          onDeleted={handleDeletedSubcorpus}
        />
      )}

      {!_.isEmpty(corpus.sources) && (
        <CorpusSources
          sources={corpus.sources}
          onAddNew={() => setShowSourceForm(true)}
          onAddExisting={() => setShowSelectSourceForm(true)}
          onUnlink={source => handleDeselectSource(corpus.id, source.id)}
        />
      )}

      {(showCorpusForm || showSubcorpusForm) && (
        <CorpusForm
          corpusToEdit={showSubcorpusForm ? null : corpus}
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
          onSaved={handleSavedSource}
        />
      )}
      {showSelectSubcorpusForm && (
        <SelectCorpusForm
          label="Add subcorpora"
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
