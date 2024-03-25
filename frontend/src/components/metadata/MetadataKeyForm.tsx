import styled from '@emotion/styled';
import TextField from '@mui/material/TextField';
import React, { ChangeEvent, useEffect } from 'react';
import { FormMetadataKey, ResultMetadataKey } from '../../model/DexterModel';
import { createMetadataKey, updateMetadataKey } from '../../utils/API';
import ScrollableModal from '../common/ScrollableModal';
import { CloseInlineIcon } from '../common/CloseInlineIcon';
import { SubmitButton } from '../common/SubmitButton';
import { Label } from '../common/Label';
import * as yup from 'yup';
import { onSubmit } from '../../utils/onSubmit';
import { useFormErrors } from '../common/error/useFormErrors';
import { FormErrorMessage } from '../common/error/FormError';
import { FieldError } from '../common/error/FieldError';
import { useImmer } from 'use-immer';

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
  const { errors, setError } = useFormErrors<FormMetadataKey>();
  const [keyField, setKeyField] = useImmer('');
  const [isInit, setInit] = useImmer(false);

  useEffect(() => {
    const init = async () => {
      setKeyField(props.inEdit?.key || '');
      setInit(true);
    };
    if (!isInit) {
      init();
    }
  }, [isInit]);

  async function handleSubmit() {
    const data: FormMetadataKey = { key: keyField };
    try {
      await metadataKeySchema.validate(data);
      const result = props.inEdit
        ? await updateExistingMetadataKey(data)
        : await createNewMetadataKey(data);
      props.onSaved({ ...result });
    } catch (error) {
      await setError(error);
    }
  }

  async function createNewMetadataKey(
    data: FormMetadataKey,
  ): Promise<ResultMetadataKey> {
    return await createMetadataKey(data);
  }

  async function updateExistingMetadataKey(
    data: FormMetadataKey,
  ): Promise<ResultMetadataKey> {
    const metadataKeyId = props.inEdit.id;
    return await updateMetadataKey(metadataKeyId, data);
  }

  if (!isInit) {
    return;
  }
  return (
    <>
      <ScrollableModal handleClose={props.onClose} fullHeight={false}>
        <CloseInlineIcon onClick={props.onClose} />

        <h1>
          {props.inEdit ? 'Edit metadata field' : 'Create new metadata field'}
        </h1>
        <form onSubmit={onSubmit(handleSubmit)}>
          <FormErrorMessage error={errors.generic} />

          <Label>Metadata field</Label>
          <FieldError error={errors.key} />
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
