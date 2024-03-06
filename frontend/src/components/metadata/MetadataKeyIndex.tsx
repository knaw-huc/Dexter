import React, { useEffect, useState } from 'react';
import { getMetadataKeys } from '../../utils/API';
import { ResultMetadataKey } from '../../model/DexterModel';
import { HeaderBreadCrumb } from '../common/breadcrumb/HeaderBreadCrumb';
import { AddNewResourceButton } from '../common/AddNewResourceButton';
import { MetadataKeyListItem } from './MetadataKeyListItem';
import { MetadataKeyForm } from './MetadataKeyForm';
import { MetadataKeyIcon } from './MetadataKeyIcon';
import { useThrowSync } from '../common/error/useThrowSync';
import ErrorBoundary from '../common/error/ErrorBoundary';

export function MetadataKeyIndex() {
  const [keys, setKeys] = useState<ResultMetadataKey[]>();
  const [isFormOpen, setFormOpen] = useState(false);
  const [toEdit, setToEdit] = useState<ResultMetadataKey>();
  const throwSync = useThrowSync();
  useEffect(() => {
    getMetadataKeys()
      .then(k => setKeys(k))
      .catch(throwSync);
  }, []);

  function handleEditClick(toEdit: ResultMetadataKey) {
    setFormOpen(true);
    setToEdit(toEdit);
  }

  function handleSavedKey(key: ResultMetadataKey) {
    if (toEdit) {
      setKeys(keys.map(k => (k.id === key.id ? key : k)));
      setToEdit(null);
    } else {
      setKeys([...keys, key]);
    }
    setFormOpen(false);
  }

  function handleClose() {
    setToEdit(null);
    setFormOpen(false);
  }

  return (
    <>
      <div>
        <HeaderBreadCrumb />

        <div style={{ float: 'right' }}>
          <AddNewResourceButton
            title="New metadata field"
            onClick={() => setFormOpen(true)}
          />
        </div>

        <h1>
          <MetadataKeyIcon />
          Custom metadata fields
        </h1>
      </div>

      <ErrorBoundary>
        {keys?.map((key, i) => (
          <MetadataKeyListItem
            key={i}
            metadataKey={key}
            onDeleted={() => setKeys(keys.filter(k => k.id !== key.id))}
            onEditClick={() => handleEditClick(key)}
          />
        ))}
      </ErrorBoundary>
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
