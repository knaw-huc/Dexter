import React from 'react';
import { useParams } from 'react-router-dom';
import { Source } from '../../model/DexterModel';
import { SourceForm } from './SourceForm';
import { EditButton } from '../common/EditButton';
import { TagList } from '../tag/TagList';
import _ from 'lodash';
import {
  FieldLabel,
  KeyLabel,
  ShortFieldsSummary,
} from '../common/ShortFieldsSummary';
import { SourceIcon } from './SourceIcon';
import { HeaderBreadCrumb } from '../common/breadcrumb/HeaderBreadCrumb';
import { SourcesBreadCrumbLink } from './SourcesBreadCrumbLink';
import { MetadataValuePageFields } from '../metadata/MetadataValuePageFields';
import { H2Styled } from '../common/H2Styled';
import { ExternalLink } from '../common/ExternalLink';
import { useThrowSync } from '../common/error/useThrowSync';
import { SourceMedia } from './SourceMedia';
import { SourceReferences } from './SourceReferences';
import { useImmer } from 'use-immer';
import { DeleteButton } from '../common/DeleteButton';
import { useDeleteSource } from './useDeleteSource';
import { useSourcePageStore } from './SourcePageStore';
import { HintedTitle } from '../common/HintedTitle';
import { useUserStore } from '../../state/UserStore';
import { assign } from '../../utils/draft/assign';
import { useInitSourcePage } from './useInitSourcePage';

export const SourcePage = () => {
  const sourceId = useParams().sourceId;
  const { source, setSource } = useSourcePageStore();
  const { isInit } = useInitSourcePage({ sourceId, setSource });

  const referenceStyle = useUserStore().getReferenceStyle();

  const [showForm, setShowForm] = useImmer(false);
  const throwSync = useThrowSync();
  const { deleteSource } = useDeleteSource({ onError: throwSync });

  const handleSavedForm = (update: Source) => {
    setSource(source => assign(source, update));
    setShowForm(false);
  };

  const shortSourceFields: KeyLabel<Source>[] = [
    { key: 'externalId', label: 'external ID' },
    { key: 'location' },
    { key: 'languages' },
    { key: 'earliest' },
    { key: 'latest' },
    { key: 'rights' },
    { key: 'ethics' },
    { key: 'access' },
    { key: 'creator' },
  ];

  if (!isInit) {
    return null;
  }
  return (
    <div>
      <HeaderBreadCrumb>
        <SourcesBreadCrumbLink />
      </HeaderBreadCrumb>

      <DeleteButton onDelete={() => deleteSource(source)} />
      <EditButton
        sx={{ marginRight: '1em' }}
        onEdit={() => {
          setShowForm(true);
        }}
      />
      <h1>
        <SourceIcon verticalAlign="middle" fontSize="large" />
        <HintedTitle title={source.title} hint="sourcePage" />
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
        fields={shortSourceFields}
        fieldMapper={(source, field) => {
          if (field === 'languages')
            return source[field].map(l => l.refName).join(', ');
        }}
      />
      {source.externalRef && (
        <ExternalLink
          url={source.externalRef}
          fieldName="externalRef"
          fieldLabel="External reference"
        />
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

      <SourceMedia />

      <SourceReferences referenceStyle={referenceStyle} />

      {showForm && (
        <SourceForm
          sourceToEdit={source}
          onSaved={handleSavedForm}
          onClose={() => {
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
};
