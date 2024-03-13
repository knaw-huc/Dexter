import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Reference,
  ResultReference,
  ResultMedia,
  Source,
} from '../../model/DexterModel';
import {
  addReferencesToSource,
  addMediaToSource,
  deleteReferenceFromSource,
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
import { SourceReferences } from './SourceReferences';
import { replaceById } from '../../utils/replaceById';
import { defaultReferenceStyle } from '../reference/ReferenceStyle';
import { ReferenceForm } from '../reference/ReferenceForm';
import { SelectReferenceForm } from '../reference/SelectReferenceForm';
import {
  updateSourceReferences,
  updateSourceMedia,
} from '../../utils/updateRemoteIds';

export const SourcePage = () => {
  const sourceId = useParams().sourceId;

  const [source, setSource] = useState<Source>();
  const [showForm, setShowForm] = useState(false);
  const [showMediaForm, setShowMediaForm] = useState(false);
  const [showReferenceForm, setShowReferenceForm] = useState(false);
  const [mediaToEdit, setMediaToEdit] = useState(null);
  const [referenceToEdit, setReferenceToEdit] = useState<Reference>(null);
  const [showSelectMediaForm, setShowSelectMediaForm] = useState(null);
  const [showSelectReferenceForm, setShowSelectReferenceForm] = useState(null);
  const throwSync = useThrowSync();

  const referenceStyle = defaultReferenceStyle;

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

  async function handleUnlinkReference(reference: ResultReference) {
    const warning = window.confirm(
      'Are you sure you wish to remove this reference?',
    );
    if (warning === false) return;

    await deleteReferenceFromSource(sourceId, reference.id);
    setSource(s => ({
      ...s,
      references: s.references.filter(c => c.id !== reference.id),
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

  function handleClickEditReference(reference: Reference) {
    setReferenceToEdit(reference);
    setShowReferenceForm(true);
  }

  async function handleSavedReference(reference: ResultReference) {
    if (referenceToEdit) {
      handleEditReference(reference);
    } else {
      await addCreatedReference(reference);
    }
  }

  function handleEditReference(reference: ResultReference) {
    setSource(s => ({
      ...s,
      references: replaceById(reference, s.references),
    }));
    setReferenceToEdit(null);
    setShowReferenceForm(false);
  }

  async function addCreatedReference(reference: ResultReference) {
    await addReferencesToSource(sourceId, [reference.id]);
    setSource(s => ({ ...s, references: [...s.references, reference] }));
    setShowReferenceForm(false);
  }

  function handleCloseReference() {
    setReferenceToEdit(null);
    setShowReferenceForm(false);
  }

  function handleCloseMedia() {
    setMediaToEdit(null);
    setShowMediaForm(false);
  }

  async function handleChangeSelectedMedia(media: ResultMedia[]) {
    await updateSourceMedia(sourceId, media);
    setSource(s => ({ ...s, media }));
  }

  async function handleChangeSelectedReferences(references: Reference[]) {
    await updateSourceReferences(sourceId, references);
    setSource(s => ({ ...s, references }));
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
        <SourceReferences
          references={source.references}
          onUnlink={handleUnlinkReference}
          onClickAddNew={() => setShowReferenceForm(true)}
          onClickEdit={handleClickEditReference}
          referenceStyle={referenceStyle}
          onClickAddExisting={() => setShowSelectReferenceForm(true)}
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
      {showReferenceForm && (
        <ReferenceForm
          onClose={handleCloseReference}
          onSaved={handleSavedReference}
          inEdit={referenceToEdit}
          referenceStyle={referenceStyle}
        />
      )}
      {showSelectReferenceForm && (
        <SelectReferenceForm
          selected={source.references}
          onChangeSelected={handleChangeSelectedReferences}
          onClose={() => setShowSelectReferenceForm(false)}
          referenceStyle={referenceStyle}
        />
      )}
    </div>
  );
};
