import { H2Styled } from '../common/H2Styled';
import { CitationIcon } from '../citation/CitationIcon';
import { Grid } from '@mui/material';
import { AddNewResourceButton } from '../common/AddNewResourceButton';
import { SelectExistingResourceButton } from './SelectExistingResourceButton';
import { CitationListItem } from '../citation/CitationListItem';
import React from 'react';
import { Citation } from '../../model/DexterModel';
import { CitationStyle } from '../citation/CitationStyle';

type SourceCitationsProps = {
  citations: Citation[];
  onClickAddNew: () => void;
  onClickAddExisting: () => void;
  onUnlink: (citation: Citation) => void;
  onClickEdit: (citation: Citation) => void;
  citationStyle: CitationStyle;
};

export function SourceCitations(props: SourceCitationsProps) {
  return (
    <>
      <H2Styled>
        <CitationIcon />
        Citations
      </H2Styled>
      <Grid container spacing={2}>
        <Grid item xs={6} md={4}>
          <AddNewResourceButton
            title="New citation"
            onClick={props.onClickAddNew}
          />
          <SelectExistingResourceButton
            title="Existing citation"
            onClick={props.onClickAddExisting}
          />
        </Grid>
        <Grid item xs={6} md={8}></Grid>
      </Grid>
      <Grid container spacing={2} sx={{ pl: 0.1, mt: 2, mb: 2 }}>
        <ul>
          {props.citations.map(citation => (
            <Grid item xs={2} key={citation.id}>
              <CitationListItem
                citation={citation}
                onDelete={() => props.onUnlink(citation)}
                onEdit={() => props.onClickEdit(citation)}
              />
            </Grid>
          ))}
        </ul>
      </Grid>
    </>
  );
}
