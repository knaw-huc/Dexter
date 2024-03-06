import React, { useEffect, useState } from 'react';
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

export function SourceIndex() {
  const [showForm, setShowForm] = useState(false);
  const [sources, setSources] = useState<Source[]>();
  const [sourceToEdit, setSourceToEdit] = useState<Source>(null);

  const throwSync = useThrowSync();

  useEffect(() => {
    init();

    async function init() {
      try {
        const sources = await getSourcesWithResources();
        setSources(sources);
      } catch (e) {
        throwSync(e);
      }
    }
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
    setSources(sources => sources.filter(s => s.id !== source.id));
  };

  const handleEdit = (source: Source) => {
    setSourceToEdit(source);
    setShowForm(true);
  };

  function handleSaveSource(source: Source) {
    if (sourceToEdit) {
      setSources(sources =>
        sources.map(s => (s.id === source.id ? source : s)),
      );
      setSourceToEdit(null);
    } else {
      setSources(sources => [...sources, source]);
    }
    setShowForm(false);
  }

  function handleCloseSource() {
    setSourceToEdit(null);
    setShowForm(false);
  }

  function byUpdatedAtDesc(s1: Source, s2: Source) {
    return s1.updatedAt < s2.updatedAt ? 1 : -1;
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
          {sources.sort(byUpdatedAtDesc).map(source => (
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
