import React, { useEffect, useState } from 'react';
import {
  Citation,
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
import { useFormatCitation } from './useFormatCitation';
import _ from 'lodash';
import { CitationStyle } from './CitationStyle';

const citationSchema = yup.object({
  input: yup.string().required('Citation input cannot be empty'),
  formatted: yup
    .string()
    .required('Save after styled citation has been loaded'),
});

const defaults: SubmitFormCitation = {
  input: '',
  isLoading: false,
  formatted: '',
};

type CitationFormProps = {
  toEdit?: Citation;
  onSaved: (update: ResultCitation) => void;
  onClose: () => void;
  citationStyle: CitationStyle;
};

export function CitationForm(props: CitationFormProps) {
  const toEdit = props.toEdit;

  const [form, setForm] = useState<SubmitFormCitation>({
    ...(toEdit || defaults),
  });
  const debouncedInput = useDebounce(form.input);
  const { errors, setError } = useFormErrors<FormCitation>();
  const { format } = useFormatCitation({
    onFormatted: setForm,
    onError: _.noop,
  });

  useEffect(() => {
    console.log('useEffect', { debouncedInput });
    format(form, props.citationStyle);
  }, [debouncedInput, props.citationStyle]);

  async function handleSubmit() {
    try {
      await citationSchema.validate(form);
      props.onSaved(await createCitation(form));
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
