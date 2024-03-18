import React, { useEffect } from 'react';
import { Source } from '../../model/DexterModel';
import { SourceListItem } from './SourceListItem';
import {
  deleteMetadataValue,
  deleteSource,
  getSourcesWithResources,
} from '../../utils/API';
import { SourceForm } from './SourceForm';
import { AddNewResourceButton } from '../common/AddNewResourceButton';
import { List } from '@mui/material';
import { HeaderBreadCrumb } from '../common/breadcrumb/HeaderBreadCrumb';
import { SourceIcon } from './SourceIcon';
import { useThrowSync } from '../common/error/useThrowSync';
import { useImmer } from 'use-immer';
import { remove } from '../../utils/immer/remove';
import { update } from '../../utils/immer/update';
import { add } from '../../utils/immer/add';
import _ from 'lodash';

export function SourceIndex() {
  const [sources, setSources] = useImmer<Source[]>([]);
  const [showForm, setShowForm] = useImmer(false);
  const [sourceToEdit, setSourceToEdit] = useImmer<Source>(null);

  const throwSync = useThrowSync();

  useEffect(() => {
    getSourcesWithResources().then(setSources).catch(throwSync);
  }, []);

  const handleDelete = async (source: Source) => {
    const warning = window.confirm(
      'Are you sure you wish to delete this source?',
    );

    if (warning === false) return;

    try {
      for (const mv of source.metadataValues) {
        await deleteMetadataValue(mv.id);
      }
      await deleteSource(source.id);
    } catch (e) {
      throwSync(e);
    }
    setSources(sources => remove(source.id, sources));
  };

  const handleEdit = (source: Source) => {
    setSourceToEdit(source);
    setShowForm(true);
  };

  function handleSaveSource(source: Source) {
    if (sourceToEdit) {
      setSources(sources => update(source, sources));
      setSourceToEdit(null);
    } else {
      setSources(sources => add(source, sources));
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
          <AddNewResourceButton
            title="New source"
            onClick={() => setShowForm(true)}
          />
        </div>

        <h1>
          <SourceIcon />
          Sources
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
