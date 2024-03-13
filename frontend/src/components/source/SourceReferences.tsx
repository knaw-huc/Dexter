import { H2Styled } from '../common/H2Styled';
import { ReferenceIcon } from '../reference/ReferenceIcon';
import { Grid } from '@mui/material';
import { AddNewResourceButton } from '../common/AddNewResourceButton';
import { SelectExistingResourceButton } from './SelectExistingResourceButton';
import React from 'react';
import { Reference } from '../../model/DexterModel';
import { ReferenceStyle } from '../reference/ReferenceStyle';
import { ReferenceListItem } from '../reference/ReferenceListItem';

type SourceReferencesProps = {
  references: Reference[];
  onClickAddNew: () => void;
  onClickAddExisting: () => void;
  onUnlink: (reference: Reference) => void;
  onClickEdit: (reference: Reference) => void;
  referenceStyle: ReferenceStyle;
};

export function SourceReferences(props: SourceReferencesProps) {
  return (
    <>
      <H2Styled>
        <ReferenceIcon />
        References
      </H2Styled>
      <Grid container spacing={2}>
        <Grid item xs={6} md={4}>
          <AddNewResourceButton title="New" onClick={props.onClickAddNew} />
          <SelectExistingResourceButton
            title="Existing"
            onClick={props.onClickAddExisting}
          />
        </Grid>
        <Grid item xs={6} md={8}></Grid>
      </Grid>
      <ul style={{ paddingLeft: 0 }}>
        {props.references.map(reference => (
          <ReferenceListItem
            key={reference.id}
            reference={reference}
            onDelete={() => props.onUnlink(reference)}
            onEdit={() => props.onClickEdit(reference)}
            referenceStyle={props.referenceStyle}
            hideIcon={true}
          />
        ))}
      </ul>
    </>
  );
}
