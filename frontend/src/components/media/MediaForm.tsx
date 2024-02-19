import styled from '@emotion/styled';
import TextField from '@mui/material/TextField';
import React, { useEffect, useState } from 'react';
import {
  FormMedia,
  ResultMedia,
  supportedMediaSubTypes,
} from '../../model/DexterModel';
import { createMedia, updateMedia } from '../../utils/API';
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
import * as yup from 'yup';
import { onSubmit } from '../../utils/onSubmit';
import { validUrl } from '../../utils/validateFields';

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
  const [errors, setErrors] = useState<FormErrors<FormMedia>>();
  const [form, setForm] = useState<FormMedia>();
  const [isInit, setInit] = useState(false);

  useEffect(() => {
    const init = async () => {
      const inEdit = props.inEdit;
      setForm({
        url: inEdit?.url || '',
        title: inEdit?.title || '',
      });
      setErrors({} as FormErrors<FormMedia>);
      setInit(true);
    };
    if (!isInit) {
      init();
    }
  }, [isInit]);

  useEffect(scrollToError, [errors]);

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

        <h1>{props.inEdit ? 'Edit media' : 'Add media'}</h1>
        <form onSubmit={onSubmit(handleSubmit)}>
          <FormErrorMessage error={errors.generic} />
          <ErrorMessage error={errors.title} />
          <TextField
            fullWidth
            placeholder={`Title`}
            value={form.title}
            style={{ marginBottom: '0.5em' }}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setForm(f => ({ ...f, title: event.target.value }));
            }}
          />

          <ErrorMessage error={errors.url} />
          <TextField
            fullWidth
            placeholder={`Url (${supportedMediaSubTypes.join(', ')})`}
            value={form.url}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setForm(f => ({ ...f, url: event.target.value }));
            }}
          />

          <SubmitButton onClick={handleSubmit} />
        </form>
      </ScrollableModal>
    </>
  );
}
