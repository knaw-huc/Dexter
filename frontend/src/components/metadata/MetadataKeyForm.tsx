import styled from '@emotion/styled';
import TextField from '@mui/material/TextField';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { FormMetadataKey, ResultMetadataKey } from '../../model/DexterModel';
import { createMetadataKey, updateMetadataKey } from '../../utils/API';
import ScrollableModal from '../common/ScrollableModal';
import {
  FormErrorMessage,
  FormErrors,
  scrollToError,
  setFormErrors,
} from '../common/FormError';
import { CloseInlineIcon } from '../common/CloseInlineIcon';
import { SubmitButton } from '../common/SubmitButton';
import { ErrorMessage } from '../common/ErrorMessage';
import { Label } from '../common/Label';
import * as yup from 'yup';
import { onSubmit } from '../../utils/onSubmit';

type MetadataKeyFormProps = {
  inEdit?: ResultMetadataKey;
  onSaved: (edited: ResultMetadataKey) => void;
  onClose: () => void;
};
styled(TextField)`
  display: block;
`;

const metadataKeySchema = yup.object({
  key: yup.string().required('Key is required'),
});

export function MetadataKeyForm(props: MetadataKeyFormProps) {
  const [errors, setErrors] = useState<FormErrors<FormMetadataKey>>();
  const [keyField, setKeyField] = useState('');
  const [isInit, setInit] = useState(false);

  useEffect(() => {
    const init = async () => {
      setKeyField(props.inEdit?.key || '');
      setErrors({} as FormErrors<FormMetadataKey>);
      setInit(true);
    };
    if (!isInit) {
      init();
    }
  }, [isInit]);

  useEffect(scrollToError, [errors]);

  async function createNewMetadataKey(data: FormMetadataKey) {
    const newMetadataKey = await createMetadataKey(data);
    return newMetadataKey.id;
  }

  async function updateExistingMetadataKey(data: FormMetadataKey) {
    const metadataKeyId = props.inEdit.id;
    await updateMetadataKey(metadataKeyId, data);
    return metadataKeyId;
  }

  async function handleSubmit() {
    const data: FormMetadataKey = { key: keyField };
    try {
      await metadataKeySchema.validate(data);
      const id = props.inEdit
        ? await updateExistingMetadataKey(data)
        : await createNewMetadataKey(data);
      props.onSaved({ id, ...data });
    } catch (error) {
      await setFormErrors(error, setErrors);
    }
  }

  if (!isInit) {
    return;
  }
  return (
    <>
      <ScrollableModal show={true} handleClose={props.onClose}>
        <CloseInlineIcon
          style={{ float: 'right', top: 0 }}
          onClick={props.onClose}
        />

        <h1>
          {props.inEdit ? 'Edit metadata field' : 'Create new metadata field'}
        </h1>
        <form onSubmit={onSubmit(handleSubmit)}>
          <FormErrorMessage error={errors.generic} />

          <Label>Metadata field</Label>
          <ErrorMessage error={errors.key} />
          <TextField
            fullWidth
            value={keyField}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setKeyField(event.currentTarget.value);
            }}
          />

          <SubmitButton onClick={handleSubmit} />
        </form>
      </ScrollableModal>
    </>
  );
}
