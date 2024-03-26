import React, { useEffect } from 'react';
import { Source } from '../../model/DexterModel';
import { SourceListItem } from './SourceListItem';
import { getSourcesWithResources } from '../../utils/API';
import { SourceForm } from './SourceForm';
import { AddNewButton } from '../common/AddNewButton';
import { List } from '@mui/material';
import { HeaderBreadCrumb } from '../common/breadcrumb/HeaderBreadCrumb';
import { SourceIcon } from './SourceIcon';
import { useThrowSync } from '../common/error/useThrowSync';
import { useImmer } from 'use-immer';
import { update } from '../../utils/immer/update';
import { add } from '../../utils/immer/add';
import _ from 'lodash';
import { useDeleteSource } from './useDeleteSource';
import { remove } from '../../utils/immer/remove';
import { HintedTitle } from '../common/HintedTitle';

export function SourceIndex() {
  const [sources, setSources] = useImmer<Source[]>([]);
  const [showForm, setShowForm] = useImmer(false);
  const [sourceToEdit, setSourceToEdit] = useImmer<Source>(null);
  const throwSync = useThrowSync();
  const { deleteSource } = useDeleteSource({ onError: throwSync });

  useEffect(() => {
    getSourcesWithResources().then(setSources).catch(throwSync);
  }, []);

  const handleDelete = async (source: Source) => {
    deleteSource(source);
    setSources(sources => remove(sources, source.id));
  };

  const handleEdit = (source: Source) => {
    setSourceToEdit(source);
    setShowForm(true);
  };

  function handleSaveSource(source: Source) {
    if (sourceToEdit) {
      setSources(sources => update(sources, source));
      setSourceToEdit(null);
    } else {
      setSources(sources => add(sources, source));
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
          <HintedTitle title="sources" hint="sourceIndex" />
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
          {_.sortBy(sources, ['updatedAt']).map(source => (
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
