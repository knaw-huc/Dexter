import React, { useState } from 'react';
import {
  FormattedCitation,
  FormCitation,
  isFormatted,
  ResultCitation,
} from '../../model/DexterModel';
import { createCitation } from '../../utils/API';
import * as yup from 'yup';
import { useFormErrors } from '../common/error/useFormErrors';
import { FormErrorMessage } from '../common/error/FormError';
import { FieldError } from '../common/error/FieldError';
import ScrollableModal from '../common/ScrollableModal';
import { CloseInlineIcon } from '../common/CloseInlineIcon';
import { onSubmit } from '../../utils/onSubmit';
import { SubmitButton } from '../common/SubmitButton';
import { CitationField } from './CitationField';

type CitationFormProps = {
  inEdit?: FormattedCitation | ResultCitation;
  onSaved: (edited: ResultCitation) => void;
  onClose: () => void;
};

const citationSchema = yup.object({
  input: yup.string().required('Citation input cannot be empty'),
});

export function CitationForm(props: CitationFormProps) {
  const citation = props.inEdit;
  const [form, setForm] = useState<FormCitation>({
    input: citation?.input || '',
  });
  const { errors, setError } = useFormErrors<FormCitation>();

  async function handleSubmit() {
    try {
      await citationSchema.validate(form);
      const newCitation = await createCitation(form);
      setForm(f => ({ ...f, input: '' }));
      props.onSaved(newCitation);
    } catch (error) {
      await setError(error);
    }
  }

  return (
    <>
      <ScrollableModal handleClose={props.onClose} fullHeight={false}>
        <CloseInlineIcon onClick={props.onClose} />
        <form onSubmit={onSubmit(handleSubmit)}>
          <h1>{citation ? 'Edit citation' : 'Create new citation'}</h1>
          <FormErrorMessage error={errors.generic} />
          <FieldError error={errors.input} />
          <CitationField
            input={form.input}
            formatted={isFormatted(citation) ? citation.formatted : null}
            onChange={input => setForm(f => ({ ...f, input }))}
          />
          <SubmitButton onClick={handleSubmit} />
        </form>
      </ScrollableModal>
    </>
  );
}
