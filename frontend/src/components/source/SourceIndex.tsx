import React from 'react';
import { Source } from '../../model/DexterModel';
import { SourceListItem } from './SourceListItem';
import { SourceForm } from './SourceForm';
import { AddNewButton } from '../common/AddNewButton';
import { List } from '@mui/material';
import { HeaderBreadCrumb } from '../common/breadcrumb/HeaderBreadCrumb';
import { SourceIcon } from './SourceIcon';
import { useThrowSync } from '../common/error/useThrowSync';
import { useImmer } from 'use-immer';
import _ from 'lodash';
import { useDeleteSource } from './useDeleteSource';
import { HintedTitle } from '../common/HintedTitle';
import { useSources } from '../../resources/useSources';

export function SourceIndex() {
  const sources = useSources().getSources();
  const [showForm, setShowForm] = useImmer(false);
  const [sourceToEdit, setSourceToEdit] = useImmer<Source>(null);
  const throwSync = useThrowSync();
  const { deleteSource } = useDeleteSource({ onError: throwSync });

  const handleDelete = async (source: Source) => {
    deleteSource(source);
  };

  const handleEdit = (source: Source) => {
    setSourceToEdit(source);
    setShowForm(true);
  };

  function handleSaveSource() {
    if (sourceToEdit) {
      setSourceToEdit(null);
    }
    setShowForm(false);
  }

  function handleCloseSource() {
    setSourceToEdit(null);
    setShowForm(false);
  }

  if (!sources) {
    return null;
  }
  return (
    <>
      <div>
        <HeaderBreadCrumb />

        <div style={{ float: 'right' }}>
          <AddNewButton onClick={() => setShowForm(true)} />
        </div>

        <h1>
          <SourceIcon />
          <HintedTitle title="Sources" hint="sourceIndex" />
        </h1>
      </div>
      {showForm && (
        <SourceForm
          onClose={handleCloseSource}
          onSaved={handleSaveSource}
          sourceToEdit={sourceToEdit}
        />
      )}
      {sources && (
        <List sx={{ mt: '1em' }}>
          {_.orderBy(sources, ['updatedAt'], ['desc']).map(source => (
            <SourceListItem
              key={source.id}
              source={source}
              onDelete={() => handleDelete(source)}
              onEdit={() => handleEdit(source)}
            />
          ))}
        </List>
      )}
    </>
  );
}
