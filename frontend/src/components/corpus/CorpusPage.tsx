import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CorpusForm } from './CorpusForm';
import { EditButton } from '../common/EditButton';
import _ from 'lodash';
import { TagList } from '../tag/TagList';
import {
  FieldLabel,
  KeyLabel,
  ShortFieldsSummary,
} from '../common/ShortFieldsSummary';
import { CorpusIcon } from './CorpusIcon';
import { HeaderBreadCrumb } from '../common/breadcrumb/HeaderBreadCrumb';
import { CorporaBreadCrumbLink } from './CorporaBreadCrumbLink';
import { CorpusParentBreadCrumbLink } from './CorpusParentBreadCrumbLink';
import { MetadataValuePageFields } from '../metadata/MetadataValuePageFields';
import { CorpusSources } from './CorpusSources';
import { CorpusSubcorpora } from './CorpusSubcorpora';
import { useImmer } from 'use-immer';
import { DeleteButton } from '../common/DeleteButton';
import { useThrowSync } from '../common/error/useThrowSync';
import { ExportButton } from '../export/ExportButton';
import { ExportForm } from '../export/ExportForm';
import { HintedTitle } from '../common/HintedTitle';
import { cancel } from '../../utils/cancel';
import { useCorpora } from '../../resources/useCorpora';
import { Corpus } from '../../model/Corpus';

export default function CorpusPage() {
  const corpusId = useParams().corpusId;

  const { getCorpus, deleteCorpus, findSourceOptions, findCorpusOptions } =
    useCorpora();

  const corpus = getCorpus(corpusId);

  const [showCorpusForm, setShowCorpusForm] = useImmer(false);
  const [showExporter, setShowExporter] = useImmer(false);
  const [isExported, setExported] = useImmer(false);

  const throwSync = useThrowSync();
  const navigate = useNavigate();

  const handleSavedCorpusForm = () => {
    handleSavedCorpus();
  };

  const handleSavedCorpus = () => {
    setShowCorpusForm(false);
  };

  function handleCloseCorpusForm() {
    setShowCorpusForm(false);
  }

  async function handleDeleteCorpus() {
    if (cancel('Are you sure you wish to delete this corpus?')) {
      return;
    }

    try {
      navigate(`/corpora`);
      await deleteCorpus(corpus.id);
    } catch (e) {
      throwSync(e);
    }
  }

  const shortCorpusFields: KeyLabel<Corpus>[] = [
    { key: 'location' },
    { key: 'languages' },
    { key: 'earliest' },
    { key: 'latest' },
    { key: 'rights' },
    { key: 'ethics' },
    { key: 'access' },
    { key: 'contributor' },
  ];

  function handleExported() {
    setShowExporter(false);
    setExported(true);
  }

  if (!corpus) {
    return;
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
        fields={shortCorpusFields}
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

      <CorpusSubcorpora corpusId={corpusId} />

      <CorpusSources corpusId={corpusId} />

      {showCorpusForm && (
        <CorpusForm
          corpusToEdit={corpus}
          parentOptions={findCorpusOptions(corpusId)}
          sourceOptions={findSourceOptions(corpusId)}
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
}
