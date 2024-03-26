import React, { useEffect } from 'react';
import {
  Reference,
  ResultReference,
  UserSettings,
} from '../../model/DexterModel';
import { ReferenceListItem } from './ReferenceListItem';
import {
  deleteReference,
  getReferences,
  updateUserSettings,
} from '../../utils/API';
import { AddNewResourceButton } from '../common/AddNewResourceButton';
import { List } from '@mui/material';
import { HeaderBreadCrumb } from '../common/breadcrumb/HeaderBreadCrumb';
import { ReferenceIcon } from './ReferenceIcon';
import { useThrowSync } from '../common/error/useThrowSync';
import { ReferenceForm } from './ReferenceForm';
import ErrorBoundary from '../common/error/ErrorBoundary';
import { ReferenceStyle } from './ReferenceStyle';
import { useImmer } from 'use-immer';
import { HintedTitle } from '../common/HintedTitle';
import { ValidatedSelectField } from '../common/ValidatedSelectField';
import { useUserStore } from '../../state/UserStore';

export function ReferenceIndex() {
  const [references, setReferences] = useImmer<ResultReference[]>([]);
  const [showForm, setShowForm] = useImmer(false);
  const [referenceToEdit, setReferenceToEdit] = useImmer<ResultReference>(null);

  const throwSync = useThrowSync();
  const { user, getReferenceStyle, setUser } = useUserStore();

  useEffect(() => {
    getReferences().then(setReferences).catch(throwSync);
  }, []);

  const handleDelete = async (reference: ResultReference) => {
    const warning = window.confirm(
      'Are you sure you wish to delete this reference?',
    );

    if (warning === false) return;

    try {
      await deleteReference(reference.id);
    } catch (e) {
      throwSync(e);
    }
    setReferences(references => references.filter(s => s.id !== reference.id));
  };

  const handleEdit = (reference: Reference) => {
    setReferenceToEdit(reference);
    setShowForm(true);
  };

  function handleSavedReference(reference: Reference) {
    if (referenceToEdit) {
      setReferences(prev =>
        prev.map(c => (c.id === reference.id ? reference : c)),
      );
      setReferenceToEdit(null);
    } else {
      setReferences(references => [...references, reference]);
    }
    setShowForm(false);
  }

  function handleCloseReference() {
    setReferenceToEdit(null);
    setShowForm(false);
  }

  if (!references) {
    return null;
  }
  const selectedStyle = getReferenceStyle();

  async function handleSelectReferenceStyle(selected: ReferenceStyle) {
    const update: UserSettings = { ...user.settings, referenceStyle: selected };
    try {
      await updateUserSettings(update);
    } catch (e) {
      throwSync(e);
    }
    setUser(user => void (user.settings = update));
  }

  return (
    <>
      <div>
        <HeaderBreadCrumb />

        <AddNewResourceButton
          title="New"
          onClick={() => setShowForm(true)}
          sx={{ marginRight: '1em', float: 'right' }}
        />
        <ValidatedSelectField<ReferenceStyle>
          placeholder="Select your reference style"
          selectedOption={selectedStyle}
          onSelectOption={handleSelectReferenceStyle}
          options={Object.values(ReferenceStyle)}
          sx={{
            marginRight: '1em',
            float: 'right',
            width: '10em',
          }}
          size="small"
        />
        <h1>
          <ReferenceIcon />
          <HintedTitle title="references" hint="referenceIndex" />
        </h1>
      </div>
      {showForm && (
        <ReferenceForm
          inEdit={referenceToEdit}
          onClose={handleCloseReference}
          onSaved={handleSavedReference}
          referenceStyle={selectedStyle}
        />
      )}
      {references && (
        <List sx={{ mt: '1em' }}>
          {references.map(reference => (
            <ErrorBoundary key={reference.id}>
              <ReferenceListItem
                key={reference.id}
                reference={reference}
                onDelete={() => handleDelete(reference)}
                onEdit={() => handleEdit(reference)}
                referenceStyle={selectedStyle}
              />
            </ErrorBoundary>
          ))}
        </List>
      )}
    </>
  );
}
