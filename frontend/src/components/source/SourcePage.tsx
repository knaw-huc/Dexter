import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ResultMedia, Source } from '../../model/DexterModel';
import {
  addMediaToSource,
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
import { Grid } from '@mui/material';
import { NoResults } from '../common/NoResults';
import { MediaPreview } from '../media/MediaPreview';
import { MediaForm } from '../media/MediaForm';
import { AddNewResourceButton } from '../common/AddNewResourceButton';
import { SelectExistingResourceButton } from './SelectExistingResourceButton';
import { SelectMediaForm } from './SelectMediaForm';
import { MediaIcon } from '../media/MediaIcon';
import { H2Styled } from '../common/H2Styled';
import { ExternalLink } from '../common/ExternalLink';
import { useThrowSync } from '../common/error/useThrowSync';

export const SourcePage = () => {
  const sourceId = useParams().sourceId;

  const [source, setSource] = useState<Source>();
  const [showForm, setShowForm] = useState(false);
  const [showMediaForm, setMediaShowForm] = useState(false);
  const [mediaToEdit, setMediaToEdit] = useState(null);
  const [showSelectMediaForm, setShowSelectMediaForm] = useState(null);
  const throwSync = useThrowSync();

  useEffect(() => {
    getSourceWithResourcesById(sourceId).then(setSource).catch(throwSync);
  }, []);

  const handleSavedForm = (update: Source) => {
    setSource(update);
    setShowForm(false);
  };

  async function handleUnlinkMedia(media: ResultMedia) {
    await deleteMediaFromSource(sourceId, media.id);
    setSource(s => ({ ...s, media: s.media.filter(m => m.id !== media.id) }));
  }

  function handleEditMedia(media: ResultMedia) {
    setMediaToEdit(media);
    setMediaShowForm(true);
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
    setMediaShowForm(false);
  }

  async function addCreatedMedia(media: ResultMedia) {
    await addMediaToSource(sourceId, [media.id]);
    setSource(s => ({ ...s, media: [...s.media, media] }));
    setMediaShowForm(false);
  }

  function handleCloseMedia() {
    setMediaToEdit(null);
    setMediaShowForm(false);
  }

  async function handleChangeSelectedMedia(media: ResultMedia[]) {
    await addMediaToSource(
      sourceId,
      media.map(m => m.id),
    );
    setSource(s => ({ ...s, media }));
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

      <H2Styled>
        <MediaIcon />
        Media
      </H2Styled>
      <Grid container spacing={2}>
        <Grid item xs={6} md={4}>
          <AddNewResourceButton
            title="New media"
            onClick={() => setMediaShowForm(true)}
          />
          <SelectExistingResourceButton
            title="Existing media"
            onClick={() => setShowSelectMediaForm(true)}
          />
        </Grid>
        <Grid item xs={6} md={8}></Grid>
      </Grid>
      {!_.isEmpty(source.media) ? (
        <Grid container spacing={2} sx={{ pl: 0.1, mt: 2, mb: 2 }}>
          {source.media.map(media => (
            <Grid item xs={2} key={media.id}>
              <MediaPreview
                media={media}
                onDelete={() => handleUnlinkMedia(media)}
                onEdit={() => handleEditMedia(media)}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <NoResults message="No media" />
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
    </div>
  );
};
