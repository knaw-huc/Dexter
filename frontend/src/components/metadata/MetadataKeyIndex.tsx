import React, { useEffect } from 'react';
import { getMetadataKeys } from '../../utils/API';
import { ResultMetadataKey } from '../../model/DexterModel';
import { HeaderBreadCrumb } from '../common/breadcrumb/HeaderBreadCrumb';
import { AddNewButton } from '../common/AddNewButton';
import { MetadataKeyListItem } from './MetadataKeyListItem';
import { MetadataKeyForm } from './MetadataKeyForm';
import { MetadataKeyIcon } from './MetadataKeyIcon';
import { useThrowSync } from '../common/error/useThrowSync';
import ErrorBoundary from '../common/error/ErrorBoundary';
import { useImmer } from 'use-immer';
import { update } from '../../utils/immer/update';
import { add } from '../../utils/immer/add';
import { HintedTitle } from '../common/HintedTitle';

export function MetadataKeyIndex() {
  const [keys, setKeys] = useImmer<ResultMetadataKey[]>([]);
  const [isFormOpen, setFormOpen] = useImmer(false);
  const [toEdit, setToEdit] = useImmer<ResultMetadataKey>(null);
  const throwSync = useThrowSync();

  useEffect(() => {
    getMetadataKeys().then(setKeys).catch(throwSync);
  }, []);

  function handleEditClick(toEdit: ResultMetadataKey) {
    setFormOpen(true);
    setToEdit(toEdit);
  }

  function handleSavedKey(key: ResultMetadataKey) {
    if (toEdit) {
      setKeys(keys => update(keys, key));
      setToEdit(null);
    } else {
      setKeys(keys => add(keys, key));
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
        <ErrorBoundary key={i}>
          <MetadataKeyListItem
            metadataKey={key}
            onDeleted={() => setKeys(keys.filter(k => k.id !== key.id))}
            onEditClick={() => handleEditClick(key)}
          />
        </ErrorBoundary>
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
