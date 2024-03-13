import React, { useEffect, useState } from 'react';
import {
  FormCitation,
  ResultCitation,
  SubmitFormCitation,
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
import { useDebounce } from '../../utils/useDebounce';
import { useFormattedCitation } from './useFormattedCitation';
import { CitationStyle } from './CitationStyle';

const citationSchema = yup.object({
  input: yup.string().required('Citation input cannot be empty'),
});

const defaults: SubmitFormCitation = {
  input: '',
  terms: '',
  isLoading: false,
  formatted: '',
};

type CitationFormProps = {
  inEdit?: ResultCitation;
  onSaved: (update: ResultCitation) => void;
  onClose: () => void;
  citationStyle: CitationStyle;
};

export function CitationForm(props: CitationFormProps) {
  const toEdit = props.inEdit;

  const [form, setForm] = useState<SubmitFormCitation>({
    ...(toEdit || defaults),
    isLoading: false,
  });
  const debouncedInput = useDebounce(form.input);
  const { errors, setError } = useFormErrors<FormCitation>();
  const { load } = useFormattedCitation({
    setCitation: setForm,
  });

  useEffect(() => {
    // Waarom lukt doi https://doi.org/10.1145/3343413.3377969 niet?
    console.log('useEffect', form.input);
    load(form, props.citationStyle);
  }, [debouncedInput, props.citationStyle]);

  async function handleSubmit() {
    try {
      const toSubmit = { ...form };
      await citationSchema.validate(toSubmit);
      props.onSaved(await createCitation(toSubmit));
    } catch (error) {
      await setError(error);
    }
  }

  return (
    <>
      <ScrollableModal handleClose={props.onClose} fullHeight={false}>
        <CloseInlineIcon onClick={props.onClose} />
        <form onSubmit={onSubmit(handleSubmit)}>
          <h1>{toEdit ? 'Edit citation' : 'Create new citation'}</h1>
          <FormErrorMessage error={errors.generic} />
          <FieldError error={errors.input} />
          <CitationField
            toEdit={form}
            onChange={input => setForm(f => ({ ...f, input }))}
            citationStyle={props.citationStyle}
          />
          <SubmitButton onClick={handleSubmit} />
        </form>
      </ScrollableModal>
    </>
  );
}
