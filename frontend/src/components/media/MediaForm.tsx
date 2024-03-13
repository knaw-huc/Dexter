import styled from '@emotion/styled';
import TextField from '@mui/material/TextField';
import React, { useEffect, useState } from 'react';
import {
  FormMedia,
  ResultMedia,
  supportedMediaTypes,
} from '../../model/DexterModel';
import { createMedia, updateMedia } from '../../utils/API';
import ScrollableModal from '../common/ScrollableModal';
import { CloseInlineIcon } from '../common/CloseInlineIcon';
import { SubmitButton } from '../common/SubmitButton';
import * as yup from 'yup';
import { onSubmit } from '../../utils/onSubmit';
import { validUrl } from '../../utils/validateFields';
import { useFormErrors } from '../common/error/useFormErrors';
import { FormErrorMessage } from '../common/error/FormError';
import { FieldError } from '../common/error/FieldError';
import { TextFieldWithError } from '../common/TextFieldWithError';

type MediaFormProps = {
  inEdit?: ResultMedia;
  onSaved: (edited: ResultMedia) => void;
  onClose: () => void;
};

styled(TextField)`
  display: block;
`;

const mediaSchema = yup.object({
  url: yup.string().required('Url is required').test(validUrl),
});

export function MediaForm(props: MediaFormProps) {
  const [form, setForm] = useState<FormMedia>();
  const { errors, setError } = useFormErrors<FormMedia>();
  const [isInit, setInit] = useState(false);

  useEffect(() => {
    const init = async () => {
      const inEdit = props.inEdit;
      setForm({
        url: inEdit?.url || '',
        title: inEdit?.title || '',
      });
      setInit(true);
    };
    if (!isInit) {
      init();
    }
  }, [isInit]);

  async function createNewMedia() {
    return createMedia(form);
  }

  async function updateExistingMedia(): Promise<ResultMedia> {
    const mediaId = props.inEdit.id;
    return updateMedia(mediaId, form);
  }

  async function handleSubmit() {
    try {
      await mediaSchema.validate(form);
      const result = props.inEdit
        ? await updateExistingMedia()
        : await createNewMedia();
      props.onSaved(result);
    } catch (error) {
      await setError(error);
    }
  }

  if (!isInit) {
    return;
  }
  return (
    <>
      <ScrollableModal handleClose={props.onClose} fullHeight={false}>
        <CloseInlineIcon onClick={props.onClose} />

        <h1>{props.inEdit ? 'Edit media' : 'Add media'}</h1>
        <form onSubmit={onSubmit(handleSubmit)}>
          <FormErrorMessage error={errors.generic} />
          <FieldError error={errors.title} />
          <TextFieldWithError
            label="Title"
            error={errors.title}
            value={form.title}
            onChange={change => {
              setForm(f => ({ ...f, title: change }));
            }}
          />

          <TextFieldWithError
            label={`Url (${supportedMediaTypes.join(', ')})`}
            error={errors.url}
            value={form.url}
            onChange={change => {
              setForm(f => ({ ...f, url: change }));
            }}
          />

          <SubmitButton onClick={handleSubmit} />
        </form>
      </ScrollableModal>
    </>
  );
}
