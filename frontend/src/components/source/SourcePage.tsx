import React from 'react';
import { useParams } from 'react-router-dom';
import { ResultLanguage, ResultMedia, Source } from '../../model/DexterModel';
import { deleteLanguageFromSourceWithWarning } from '../../utils/deleteLanguageFromSourceWithWarning';
import {
  addMediaToSource,
  deleteMediaFromSource,
  getSourceWithResourcesById,
} from '../../utils/API';
import { Languages } from '../language/Languages';
import { SourceForm } from './SourceForm';
import { EditButton } from '../common/EditButton';
import { TagList } from '../tag/TagList';
import _ from 'lodash';
import { FieldLabel, ShortFieldsSummary } from '../common/ShortFieldsSummary';
import { SourceIcon } from './SourceIcon';
import { HeaderBreadCrumb } from '../common/breadcrumb/HeaderBreadCrumb';
import { SourcesBreadCrumbLink } from './SourcesBreadCrumbLink';
import { blue, grey } from '@mui/material/colors';
import isUrl from '../../utils/isUrl';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import styled from '@emotion/styled';
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

const OpenInNewOutlinedIconStyled = styled(OpenInNewOutlinedIcon)`
  margin-left: 0.4em;
`;
const A = styled.a`
  color: ${blue[600]};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
export const SourcePage = () => {
  const params = useParams();
  const sourceId = params.sourceId;

  const [source, setSource] = React.useState<Source>(null);
  const [showForm, setShowForm] = React.useState(false);
  const [showMediaForm, setMediaShowForm] = React.useState(false);
  const [mediaToEdit, setMediaToEdit] = React.useState(null);
  const [showSelectMediaForm, setShowSelectMediaForm] = React.useState(null);

  const handleSavedForm = (update: Source) => {
    setSource(update);
    setShowForm(false);
  };

  const initSource = async () => {
    setSource(await getSourceWithResourcesById(sourceId));
  };

  React.useEffect(() => {
    if (sourceId) {
      initSource();
    }
  }, [sourceId]);

  const handleUnlinkLanguage = async (language: ResultLanguage) => {
    await deleteLanguageFromSourceWithWarning(language, params.sourceId);
    setSource(s => ({
      ...s,
      languages: s.languages.filter(l => l.id !== language.id),
    }));
  };

  async function handleUnlinkMedia(media: ResultMedia) {
    await deleteMediaFromSource(sourceId, media.id);
    setSource(s => ({ ...s, media: s.media.filter(m => m.id !== media.id) }));
  }

  const shortSourceFields: (keyof Source)[] = [
    'location',
    'earliest',
    'latest',
    'rights',
    'ethics',
    'access',
    'creator',
  ];

  function handleEditMedia(media: ResultMedia) {
    setMediaToEdit(media);
    setMediaShowForm(true);
  }

  if (!source) {
    return;
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
      />
      {source.externalRef && (
        <p style={{ marginTop: '-0.9em' }}>
          <span style={{ color: grey[600] }}>External reference: </span>
          {isUrl(source.externalRef) ? (
            <>
              <A href={source.externalRef} target="_blank" rel="noreferrer">
                {source.externalRef}
              </A>
              <OpenInNewOutlinedIconStyled fontSize="inherit" />
            </>
          ) : (
            <>{source.externalRef}</>
          )}
        </p>
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

      {!_.isEmpty(source.languages) && (
        <div>
          <h4>Languages</h4>
          <Languages
            languages={source.languages}
            onDelete={handleUnlinkLanguage}
          />
        </div>
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
          useAutocomplete
        />
      )}
    </div>
  );
};
