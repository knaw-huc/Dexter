import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Corpus, Source } from '../../model/DexterModel';
import { CorpusForm } from './CorpusForm';
import {
  deleteCorpus,
  deleteMetadataValue,
  getCorporaWithResources,
  getCorpusWithResourcesById,
  getSourcesWithResources,
} from '../../utils/API';
import { EditButton } from '../common/EditButton';
import _ from 'lodash';
import { TagList } from '../tag/TagList';
import { FieldLabel, ShortFieldsSummary } from '../common/ShortFieldsSummary';
import { CorpusIcon } from './CorpusIcon';
import { HeaderBreadCrumb } from '../common/breadcrumb/HeaderBreadCrumb';
import { CorporaBreadCrumbLink } from './CorporaBreadCrumbLink';
import { CorpusParentBreadCrumbLink } from './CorpusParentBreadCrumbLink';
import { MetadataValuePageFields } from '../metadata/MetadataValuePageFields';
import { Title } from '../media/Title';
import { CorpusSources } from './CorpusSources';
import { CorpusSubcorpora } from './CorpusSubcorpora';
import { useImmer } from 'use-immer';
import { DeleteButton } from '../common/DeleteButton';
import { corpora } from '../../model/Resources';
import { ErrorAlert } from '../common/error/ErrorAlert';
import { toMessage } from '../common/error/toMessage';

export const CorpusPage = () => {
  const corpusId = useParams().corpusId;

  const [corpus, setCorpus] = useImmer<Corpus>(null);
  const [sourceOptions, setSourceOptions] = useImmer<Source[]>([]);
  const [corpusOptions, setCorpusOptions] = useImmer<Corpus[]>([]);
  const [error, setError] = useImmer<Error>(null);
  const [showCorpusForm, setShowCorpusForm] = useImmer(false);

  const navigate = useNavigate();
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
        setError(e);
      }
    }
  }, []);

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
    const warning = window.confirm(
      'Are you sure you wish to delete this corpus?',
    );

    if (warning === false) return;

    try {
      for (const value of corpus.metadataValues) {
        await deleteMetadataValue(value.id);
      }
      await deleteCorpus(corpus.id);
      navigate(`/${corpora}`);
    } catch (e) {
      setError(e);
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

  if (!corpus) {
    return null;
  }
  return (
    <div>
      <ErrorAlert message={toMessage(error)} onClose={() => setError(null)} />
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
          parent={corpus}
          subcorpora={corpus.subcorpora}
          options={corpusOptions}
          sourceOptions={sourceOptions}
          onChanged={subcorpora => setCorpus(c => ({ ...c, subcorpora }))}
        />
      )}

      {!_.isEmpty(corpus.sources) && (
        <CorpusSources
          corpusId={corpusId}
          onChanged={sources => setCorpus(c => ({ ...c, sources }))}
          sources={corpus.sources}
          options={sourceOptions}
        />
      )}

      {showCorpusForm && (
        <CorpusForm
          corpusToEdit={corpus}
          parentOptions={corpusOptions}
          sourceOptions={sourceOptions}
          onClose={handleCloseCorpusForm}
          onSaved={handleSavedCorpusForm}
        />
      )}
    </div>
  );
};
