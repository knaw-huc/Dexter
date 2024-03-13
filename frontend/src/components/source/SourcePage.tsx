import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Citation,
  ResultCitation,
  ResultMedia,
  Source,
} from '../../model/DexterModel';
import {
  addCitationsToSource,
  addMediaToSource,
  deleteCitationFromSource,
  deleteMediaFromSource,
  getSourceWithResourcesById,
} from '../../utils/API';
import { SourceForm } from './SourceForm';
import { EditButton } from '../common/EditButton';
import { TagList } from '../tag/TagList';
import _ from 'lodash';
import { FieldLabel, ShortFieldsSummary } from '../common/ShortFieldsSummary';
import { SourceIcon } from './SourceIcon';
import { HeaderBreadCrumb } from '../common/breadcrumb/HeaderBreadCrumb';
import { SourcesBreadCrumbLink } from './SourcesBreadCrumbLink';
import { MetadataValuePageFields } from '../metadata/MetadataValuePageFields';
import { Title } from '../media/Title';
import { MediaForm } from '../media/MediaForm';
import { SelectMediaForm } from './SelectMediaForm';
import { H2Styled } from '../common/H2Styled';
import { ExternalLink } from '../common/ExternalLink';
import { useThrowSync } from '../common/error/useThrowSync';
import { SourceMedia } from './SourceMedia';
import { SourceCitations } from './SourceCitations';
import { replaceById } from '../../utils/replaceById';
import { defaultCitationStyle } from '../citation/CitationStyle';
import { CitationForm } from '../citation/CitationForm';
import { SelectCitationForm } from '../citation/SelectCitationForm';
import {
  updateSourceCitations,
  updateSourceMedia,
} from '../../utils/updateRemoteIds';

export const SourcePage = () => {
  const sourceId = useParams().sourceId;

  const [source, setSource] = useState<Source>();
  const [showForm, setShowForm] = useState(false);
  const [showMediaForm, setShowMediaForm] = useState(false);
  const [showCitationForm, setShowCitationForm] = useState(false);
  const [mediaToEdit, setMediaToEdit] = useState(null);
  const [citationToEdit, setCitationToEdit] = useState<Citation>(null);
  const [showSelectMediaForm, setShowSelectMediaForm] = useState(null);
  const [showSelectCitationForm, setShowSelectCitationForm] = useState(null);
  const throwSync = useThrowSync();

  const citationStyle = defaultCitationStyle;

  useEffect(() => {
    init();

    async function init() {
      getSourceWithResourcesById(sourceId).then(setSource).catch(throwSync);
    }
  }, []);

  const handleSavedForm = (update: Source) => {
    setSource(update);
    setShowForm(false);
  };

  async function handleUnlinkMedia(media: ResultMedia) {
    await deleteMediaFromSource(sourceId, media.id);
    setSource(s => ({ ...s, media: s.media.filter(m => m.id !== media.id) }));
  }

  async function handleUnlinkCitation(citation: ResultCitation) {
    await deleteCitationFromSource(sourceId, citation.id);
    setSource(s => ({
      ...s,
      citations: s.citations.filter(c => c.id !== citation.id),
    }));
  }

  function handleClickEditMedia(media: ResultMedia) {
    setMediaToEdit(media);
    setShowMediaForm(true);
  }

  async function handleSavedMedia(media: ResultMedia) {
    if (mediaToEdit) {
      handleEditedMedia(media);
    } else {
      await addCreatedMedia(media);
    }
  }

  function handleEditedMedia(media: ResultMedia) {
    setSource(s => ({
      ...s,
      media: s.media.map(s => (s.id === media.id ? media : s)),
    }));
    setMediaToEdit(null);
    setShowMediaForm(false);
  }

  async function addCreatedMedia(media: ResultMedia) {
    await addMediaToSource(sourceId, [media.id]);
    setSource(s => ({ ...s, media: [...s.media, media] }));
    setShowMediaForm(false);
  }

  function handleClickEditCitation(citation: Citation) {
    setCitationToEdit(citation);
    setShowCitationForm(true);
  }

  async function handleSavedCitation(citation: ResultCitation) {
    if (citationToEdit) {
      handleEditCitation(citation);
    } else {
      await addCreatedCitation(citation);
    }
  }

  function handleEditCitation(citation: ResultCitation) {
    setSource(s => ({
      ...s,
      citations: replaceById(citation, s.citations),
    }));
    setCitationToEdit(null);
    setShowCitationForm(false);
  }

  async function addCreatedCitation(citation: ResultCitation) {
    await addCitationsToSource(sourceId, [citation.id]);
    setSource(s => ({ ...s, citations: [...s.citations, citation] }));
    setShowCitationForm(false);
  }

  function handleCloseCitation() {
    setCitationToEdit(null);
    setShowCitationForm(false);
  }

  function handleCloseMedia() {
    setMediaToEdit(null);
    setShowMediaForm(false);
  }

  async function handleChangeSelectedMedia(media: ResultMedia[]) {
    await updateSourceMedia(sourceId, media);
    setSource(s => ({ ...s, media }));
  }

  async function handleChangeSelectedCitations(citations: Citation[]) {
    await updateSourceCitations(sourceId, citations);
    setSource(s => ({ ...s, citations }));
  }

  const shortSourceFields: (keyof Source)[] = [
    'location',
    'languages',
    'earliest',
    'latest',
    'rights',
    'ethics',
    'access',
    'creator',
  ];

  if (!source) {
    return null;
  }
  return (
    <div>
      <HeaderBreadCrumb>
        <SourcesBreadCrumbLink />
      </HeaderBreadCrumb>

      <EditButton
        onEdit={() => {
          setShowForm(true);
        }}
      />
      <h1>
        <SourceIcon verticalAlign="middle" fontSize="large" />
        <Title title={source.title} />
      </h1>
      <p>{source.description}</p>
      {!_.isEmpty(source.tags) && (
        <>
          <FieldLabel label="Tags" />
          <TagList tags={source.tags} />
        </>
      )}
      <ShortFieldsSummary<Source>
        resource={source}
        fieldNames={shortSourceFields}
        fieldMapper={(source, field) =>
          field === 'languages' && source[field].map(l => l.refName).join(', ')
        }
      />
      {source.externalRef && (
        <ExternalLink url={source.externalRef} fieldName="externalRef" />
      )}
      {source.notes && (
        <>
          <H2Styled>Notes</H2Styled>
          <p>{source.notes}</p>
        </>
      )}

      {!_.isEmpty(source.metadataValues) && (
        <MetadataValuePageFields values={source.metadataValues} />
      )}

      {!_.isEmpty(source.media) && (
        <SourceMedia
          media={source.media}
          onUnlink={handleUnlinkMedia}
          onClickAddNew={() => setShowMediaForm(true)}
          onClickAddExisting={() => setShowSelectMediaForm(true)}
          onClickEdit={handleClickEditMedia}
        />
      )}

      {!_.isEmpty(source.media) && (
        <SourceCitations
          citations={source.citations}
          onUnlink={handleUnlinkCitation}
          onClickAddNew={() => setShowCitationForm(true)}
          onClickEdit={handleClickEditCitation}
          citationStyle={citationStyle}
          onClickAddExisting={() => setShowSelectCitationForm(true)}
        />
      )}

      {showForm && (
        <SourceForm
          sourceToEdit={source}
          onSaved={handleSavedForm}
          onClose={() => {
            setShowForm(false);
          }}
        />
      )}
      {showMediaForm && (
        <MediaForm
          onClose={handleCloseMedia}
          onSaved={handleSavedMedia}
          inEdit={mediaToEdit}
        />
      )}
      {showSelectMediaForm && (
        <SelectMediaForm
          selected={source.media}
          onChangeSelected={handleChangeSelectedMedia}
          onClose={() => setShowSelectMediaForm(false)}
        />
      )}
      {showCitationForm && (
        <CitationForm
          onClose={handleCloseCitation}
          onSaved={handleSavedCitation}
          inEdit={citationToEdit}
          citationStyle={citationStyle}
        />
      )}
      {showSelectCitationForm && (
        <SelectCitationForm
          selected={source.citations}
          onChangeSelected={handleChangeSelectedCitations}
          onClose={() => setShowSelectCitationForm(false)}
          citationStyle={citationStyle}
        />
      )}
    </div>
  );
};
