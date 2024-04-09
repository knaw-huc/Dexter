import { H2Styled } from '../common/H2Styled';
import { ReferenceIcon } from '../reference/ReferenceIcon';
import { Grid } from '@mui/material';
import { AddNewButton } from '../common/AddNewButton';
import { SelectExistingButton } from './SelectExistingButton';
import React from 'react';
import { Reference, ResultReference, UUID } from '../../model/DexterModel';
import { ReferenceStyle } from '../reference/ReferenceStyle';
import { ReferenceListItem } from '../reference/ReferenceListItem';
import { ReferenceForm } from '../reference/ReferenceForm';
import { SelectReferenceForm } from '../reference/SelectReferenceForm';
import { useImmer } from 'use-immer';
import _ from 'lodash';
import { reject } from '../../utils/reject';
import { useSources } from '../../state/resources/hooks/useSources';

export function SourceReferences(props: {
  sourceId: UUID;
  referenceStyle: ReferenceStyle;
}) {
  const {
    getSource,
    updateSourceReferences,
    addReferencesToSource,
    deleteReferenceFromSource,
  } = useSources();
  const sourceId = props.sourceId;
  const source = getSource(sourceId);
  const references = source.references;

  const { referenceStyle } = props;
  const [showSelectReferenceForm, setShowSelectReferenceForm] = useImmer(null);
  const [showReferenceForm, setShowReferenceForm] = useImmer(false);
  const [referenceToEdit, setReferenceToEdit] = useImmer<Reference>(null);

  async function handleUnlinkReference(reference: ResultReference) {
    if (reject('Remove this reference from this source?')) {
      return;
    }
    await deleteReferenceFromSource(sourceId, reference.id);
  }

  function handleClickEditReference(reference: Reference) {
    setReferenceToEdit(reference);
    setShowReferenceForm(true);
  }

  async function handleSavedReference(reference: ResultReference) {
    if (referenceToEdit) {
      handleEditReference();
    } else {
      await addCreatedReference(reference);
    }
  }

  function handleEditReference() {
    setReferenceToEdit(null);
    setShowReferenceForm(false);
  }

  async function addCreatedReference(reference: ResultReference) {
    await addReferencesToSource(sourceId, [reference.id]);
    setShowReferenceForm(false);
  }

  function handleCloseReference() {
    setReferenceToEdit(null);
    setShowReferenceForm(false);
  }

  async function handleChangeSelectedReferences(references: Reference[]) {
    await updateSourceReferences(sourceId, references);
  }

  const hasReferences = !_.isEmpty(references);

  return (
    <>
      <H2Styled>
        <ReferenceIcon />
        References
      </H2Styled>
      <Grid container spacing={2}>
        <Grid item xs={6} md={4}>
          <AddNewButton onClick={() => setShowReferenceForm(true)} />
          <SelectExistingButton
            onClick={() => setShowSelectReferenceForm(true)}
          />
        </Grid>
        <Grid item xs={6} md={8}></Grid>
      </Grid>
      {hasReferences && (
        <ul style={{ paddingLeft: 0 }}>
          {references.map(reference => (
            <ReferenceListItem
              key={reference.id}
              reference={reference}
              onUnlink={() => handleUnlinkReference(reference)}
              onEdit={() => handleClickEditReference(reference)}
              referenceStyle={props.referenceStyle}
              hideIcon={true}
            />
          ))}
        </ul>
      )}
      {showReferenceForm && (
        <ReferenceForm
          onClose={handleCloseReference}
          onSaved={handleSavedReference}
          inEdit={referenceToEdit}
          referenceStyle={referenceStyle}
        />
      )}
      {showSelectReferenceForm && (
        <SelectReferenceForm
          selected={source.references}
          onChangeSelected={handleChangeSelectedReferences}
          onClose={() => setShowSelectReferenceForm(false)}
          referenceStyle={referenceStyle}
        />
      )}
    </>
  );
}
