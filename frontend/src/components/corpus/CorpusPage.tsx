import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Corpus } from '../../model/DexterModel';
import { CorpusForm } from './CorpusForm';
import { deleteCorpus, deleteMetadataValue } from '../../utils/API';
import { EditButton } from '../common/EditButton';
import _ from 'lodash';
import { TagList } from '../tag/TagList';
import { FieldLabel, ShortFieldsSummary } from '../common/ShortFieldsSummary';
import { CorpusIcon } from './CorpusIcon';
import { HeaderBreadCrumb } from '../common/breadcrumb/HeaderBreadCrumb';
import { CorporaBreadCrumbLink } from './CorporaBreadCrumbLink';
import { CorpusParentBreadCrumbLink } from './CorpusParentBreadCrumbLink';
import { MetadataValuePageFields } from '../metadata/MetadataValuePageFields';
import { CorpusSources } from './CorpusSources';
import { CorpusSubcorpora } from './CorpusSubcorpora';
import { useImmer } from 'use-immer';
import { DeleteButton } from '../common/DeleteButton';
import { corpora } from '../../model/Resources';
import { useCorpusPageStore } from './CorpusPageStore';
import { useThrowSync } from '../common/error/useThrowSync';
import { ExportButton } from '../export/ExportButton';
import { ExportForm } from '../export/ExportForm';
import { HintedTitle } from '../common/HintedTitle';
import { reject } from '../../utils/reject';
import { useInitCorpusPage } from './useInitCorpusPage';

export const CorpusPage = () => {
  const corpusId = useParams().corpusId;
  const {
    corpus,
    setCorpus,
    setAllSources,
    setAllCorpora,
    getCorpusOptions,
    getSourceOptions,
  } = useCorpusPageStore();
  const { isInit } = useInitCorpusPage({
    corpusId,
    setCorpus,
    setAllCorpora,
    setAllSources,
  });

  const [showCorpusForm, setShowCorpusForm] = useImmer(false);
  const [showExporter, setShowExporter] = useImmer(false);
  const [isExported, setExported] = useImmer(false);

  const throwSync = useThrowSync();
  const navigate = useNavigate();

  const handleSavedCorpusForm = (corpus: Corpus) => {
    handleSavedCorpus(corpus);
  };

  const handleSavedCorpus = (corpus: Corpus) => {
    setCorpus(corpus);
    setShowCorpusForm(false);
  };

  function handleCloseCorpusForm() {
    setShowCorpusForm(false);
  }

  async function handleDeleteCorpus() {
    if (reject('Are you sure you wish to delete this corpus?')) {
      return;
    }

    try {
      for (const value of corpus.metadataValues) {
        await deleteMetadataValue(value.id);
      }
      await deleteCorpus(corpus.id);
      navigate(`/${corpora}`);
    } catch (e) {
      throwSync(e);
    }
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

  function handleExported() {
    setShowExporter(false);
    setExported(true);
  }

  if (!isInit) {
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

      <DeleteButton onDelete={handleDeleteCorpus} />
      <EditButton
        sx={{ marginRight: '1em' }}
        onEdit={() => setShowCorpusForm(true)}
      />
      <ExportButton
        sx={{ marginRight: '1em' }}
        onExport={() => setShowExporter(true)}
        isExported={isExported}
      />
      <h1 style={{ marginTop: 0 }}>
        <CorpusIcon />
        <HintedTitle title={corpus.title} hint="corpusPage" />
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

      <CorpusSubcorpora />

      <CorpusSources />

      {showCorpusForm && (
        <CorpusForm
          corpusToEdit={corpus}
          parentOptions={getCorpusOptions()}
          sourceOptions={getSourceOptions()}
          onClose={handleCloseCorpusForm}
          onSaved={handleSavedCorpusForm}
        />
      )}
      {showExporter && (
        <ExportForm
          toExport={corpus}
          onExported={() => handleExported()}
          onClose={() => setShowExporter(false)}
        />
      )}
    </div>
  );
};
