import React, { useEffect, useState } from 'react';
import {
  FormattedCitation,
  isFormatted,
  ResultCitation,
} from '../../model/DexterModel';
import { CitationListItem } from './CitationListItem';
import { deleteCitation, getCitations } from '../../utils/API';
import { AddNewResourceButton } from '../common/AddNewResourceButton';
import { List } from '@mui/material';
import { HeaderBreadCrumb } from '../common/breadcrumb/HeaderBreadCrumb';
import { CitationIcon } from './CitationIcon';
import { useThrowSync } from '../common/error/useThrowSync';
import { CitationForm } from './CitationForm';
import ErrorBoundary from '../common/error/ErrorBoundary';
import _ from 'lodash';
import { formatCitation } from './formatCitation';
import { CitationStyle } from './CitationStyle';

export function CitationIndex() {
  const citationStyle = CitationStyle.apa;
  const [citations, setCitations] =
    useState<(ResultCitation | FormattedCitation)[]>();
  const [showForm, setShowForm] = useState(false);
  const [citationToEdit, setCitationToEdit] = useState<ResultCitation>(null);

  const throwSync = useThrowSync();

  useEffect(() => {
    getCitations().then(setCitations).catch(throwSync);
  }, []);

  useEffect(() => {
    formatCitations();

    async function formatCitations() {
      if (_.isEmpty(citations)) {
        return;
      }
      citations.forEach((c, i) => {
        if (isFormatted(c)) {
          return;
        }
        formatCitation(c.input, citationStyle).then(formatted => {
          const update = { ...c, formatted };
          setCitations(citations => {
            citations[i] = update;
            return citations;
          });
        });
      });
    }
  }, [citations]);

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

  const handleEdit = (citation: ResultCitation) => {
    setCitationToEdit(citation);
    setShowForm(true);
  };

  function handleSaveCitation(citation: ResultCitation) {
    if (citationToEdit) {
      setCitations(citations =>
        citations.map(s => (s.id === citation.id ? citation : s)),
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
          onClose={handleCloseCitation}
          onSaved={handleSaveCitation}
          inEdit={citationToEdit}
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
