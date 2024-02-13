import React, { useContext, useEffect, useState } from 'react';
import { Source } from '../../model/DexterModel';
import { SourceListItem } from './SourceListItem';
import { getSourcesWithResources } from '../../utils/API';
import { SourceForm } from './SourceForm';
import { AddNewResourceButton } from './AddNewResourceButton';
import { List } from '@mui/material';
import { errorContext } from '../../state/error/errorContext';
import { HeaderBreadCrumb } from '../common/breadcrumb/HeaderBreadCrumb';

export function SourceIndex() {
  const [showForm, setShowForm] = React.useState(false);
  const [sources, setSources] = useState<Source[]>();
  const [isInit, setInit] = useState(false);
  const { dispatchError } = useContext(errorContext);
  const [sourceToEdit, setSourceToEdit] = React.useState<Source>(null);

  useEffect(() => {
    async function initResources() {
      try {
        setSources(await getSourcesWithResources());
      } catch (e) {
        dispatchError(e);
      }
    }

    if (!isInit) {
      setInit(true);
      initResources();
    }
  }, [isInit]);

  const handleDelete = (source: Source) => {
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

        <h1>Sources</h1>
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
