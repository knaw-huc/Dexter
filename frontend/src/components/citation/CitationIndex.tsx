import React, { useEffect, useState } from 'react';
import { Citation, ResultCitation } from '../../model/DexterModel';
import { CitationListItem } from './CitationListItem';
import { deleteCitation, getCitations } from '../../utils/API';
import { AddNewResourceButton } from '../common/AddNewResourceButton';
import { List } from '@mui/material';
import { HeaderBreadCrumb } from '../common/breadcrumb/HeaderBreadCrumb';
import { CitationIcon } from './CitationIcon';
import { useThrowSync } from '../common/error/useThrowSync';
import { CitationForm } from './CitationForm';
import ErrorBoundary from '../common/error/ErrorBoundary';
import { defaultCitationStyle } from './CitationStyle';

export function CitationIndex() {
  const [citations, setCitations] = useState<ResultCitation[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [citationToEdit, setCitationToEdit] = useState<ResultCitation>(null);
  const citationStyle = defaultCitationStyle;

  const throwSync = useThrowSync();

  useEffect(() => {
    getCitations().then(setCitations).catch(throwSync);
  }, []);

  const handleDelete = async (citation: ResultCitation) => {
    const warning = window.confirm(
      'Are you sure you wish to delete this citation?',
    );

    if (warning === false) return;

    try {
      await deleteCitation(citation.id);
    } catch (e) {
      throwSync(e);
    }
    setCitations(citations => citations.filter(s => s.id !== citation.id));
  };

  const handleEdit = (citation: Citation) => {
    setCitationToEdit(citation);
    setShowForm(true);
  };

  function handleSavedCitation(citation: Citation) {
    if (citationToEdit) {
      setCitations(prev =>
        prev.map(c => (c.id === citation.id ? citation : c)),
      );
      setCitationToEdit(null);
    } else {
      setCitations(citations => [...citations, citation]);
    }
    setShowForm(false);
  }

  function handleCloseCitation() {
    setCitationToEdit(null);
    setShowForm(false);
  }

  if (!citations) {
    return null;
  }
  return (
    <>
      <div>
        <HeaderBreadCrumb />

        <div style={{ float: 'right' }}>
          <AddNewResourceButton
            title="New citation"
            onClick={() => setShowForm(true)}
          />
        </div>

        <h1>
          <CitationIcon />
          Citations
        </h1>
      </div>
      {showForm && (
        <CitationForm
          inEdit={citationToEdit}
          onClose={handleCloseCitation}
          onSaved={handleSavedCitation}
          citationStyle={citationStyle}
        />
      )}
      {citations && (
        <List sx={{ mt: '1em' }}>
          {citations.map(citation => (
            <ErrorBoundary key={citation.id}>
              <CitationListItem
                key={citation.id}
                citation={citation}
                onDelete={() => handleDelete(citation)}
                onEdit={() => handleEdit(citation)}
              />
            </ErrorBoundary>
          ))}
        </List>
      )}
    </>
  );
}
