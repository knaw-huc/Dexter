import { H2Styled } from '../common/H2Styled';
import { ReferenceIcon } from '../reference/ReferenceIcon';
import { Grid } from '@mui/material';
import { AddNewButton } from '../common/AddNewButton';
import { SelectExistingButton } from './SelectExistingButton';
import React from 'react';
import { Reference, ResultReference } from '../../model/DexterModel';
import { ReferenceStyle } from '../reference/ReferenceStyle';
import { ReferenceListItem } from '../reference/ReferenceListItem';
import { ReferenceForm } from '../reference/ReferenceForm';
import { SelectReferenceForm } from '../reference/SelectReferenceForm';
import { useImmer } from 'use-immer';
import {
  addReferencesToSource,
  deleteReferenceFromSource,
} from '../../utils/API';
import { remove } from '../../utils/recipe/remove';
import { replace } from '../../utils/recipe/replace';
import { push } from '../../utils/recipe/push';
import { updateSourceReferences } from '../../utils/updateRemoteIds';
import { useSourcePageStore } from './SourcePageStore';
import { assign } from '../../utils/recipe/assign';
import _ from 'lodash';
import { reject } from '../../utils/reject';

export function SourceReferences(props: { referenceStyle: ReferenceStyle }) {
  const { referenceStyle } = props;
  const { source, setSource } = useSourcePageStore();
  const sourceId = source.id;
  const references = source.references;
  const [showSelectReferenceForm, setShowSelectReferenceForm] = useImmer(null);
  const [showReferenceForm, setShowReferenceForm] = useImmer(false);
  const [referenceToEdit, setReferenceToEdit] = useImmer<Reference>(null);

  async function handleUnlinkReference(reference: ResultReference) {
    if (reject('Remove this reference from this source?')) {
      return;
    }

    await deleteReferenceFromSource(sourceId, reference.id);
    setSource(s => remove(s.references, reference.id));
  }

  function handleClickEditReference(reference: Reference) {
    setReferenceToEdit(reference);
    setShowReferenceForm(true);
  }

  async function handleSavedReference(reference: ResultReference) {
    if (referenceToEdit) {
      handleEditReference(reference);
    } else {
      await addCreatedReference(reference);
    }
  }

  function handleEditReference(reference: ResultReference) {
    setSource(s => replace(s.references, reference));
    setReferenceToEdit(null);
    setShowReferenceForm(false);
  }

  async function addCreatedReference(reference: ResultReference) {
    await addReferencesToSource(sourceId, [reference.id]);
    setSource(s => push(s.references, reference));
    setShowReferenceForm(false);
  }

  function handleCloseReference() {
    setReferenceToEdit(null);
    setShowReferenceForm(false);
  }

  async function handleChangeSelectedReferences(references: Reference[]) {
    await updateSourceReferences(sourceId, references);
    setSource(source => assign(source, { references }));
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
