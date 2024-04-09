import React from 'react';
import { ResultMetadataKey } from '../../model/DexterModel';
import { HeaderBreadCrumb } from '../common/breadcrumb/HeaderBreadCrumb';
import { AddNewButton } from '../common/AddNewButton';
import { MetadataKeyListItem } from './MetadataKeyListItem';
import { MetadataKeyForm } from './MetadataKeyForm';
import { MetadataKeyIcon } from './MetadataKeyIcon';
import { useImmer } from 'use-immer';
import { HintedTitle } from '../common/HintedTitle';
import { useMetadata } from '../../state/resources/hooks/useMetadata';
import _ from 'lodash';

export function MetadataKeyIndex() {
  const [isFormOpen, setFormOpen] = useImmer(false);
  const [toEdit, setToEdit] = useImmer<ResultMetadataKey>(null);
  const keys = useMetadata().getMetadataKeys();
  function handleEditClick(toEdit: ResultMetadataKey) {
    setFormOpen(true);
    setToEdit(toEdit);
  }

  function handleSavedKey() {
    if (toEdit) {
      setToEdit(null);
    }
    setFormOpen(false);
  }

  function handleClose() {
    setToEdit(null);
    setFormOpen(false);
  }

  if (!keys) {
    return null;
  }
  return (
    <>
      <div>
        <HeaderBreadCrumb />

        <div style={{ float: 'right' }}>
          <AddNewButton onClick={() => setFormOpen(true)} />
        </div>

        <h1>
          <MetadataKeyIcon />
          <HintedTitle title="Custom metadata fields" hint="metadataKeyIndex" />
        </h1>
      </div>

      {keys?.map((key, i) => (
        <MetadataKeyListItem
          key={i}
          metadataKey={key}
          onDeleted={_.noop}
          onEditClick={() => handleEditClick(key)}
        />
      ))}
      {isFormOpen && (
        <MetadataKeyForm
          inEdit={toEdit}
          onSaved={handleSavedKey}
          onClose={handleClose}
        />
      )}
    </>
  );
}
