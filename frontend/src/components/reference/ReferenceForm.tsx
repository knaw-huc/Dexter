import React, { useEffect, useState } from 'react';
import {
  FormReference,
  ResultReference,
  SubmitFormReference,
} from '../../model/DexterModel';
import { createReference } from '../../utils/API';
import * as yup from 'yup';
import { useFormErrors } from '../common/error/useFormErrors';
import { FormErrorMessage } from '../common/error/FormError';
import { FieldError } from '../common/error/FieldError';
import ScrollableModal from '../common/ScrollableModal';
import { CloseInlineIcon } from '../common/CloseInlineIcon';
import { onSubmit } from '../../utils/onSubmit';
import { SubmitButton } from '../common/SubmitButton';
import { ReferenceField } from './ReferenceField';
import { useDebounce } from '../../utils/useDebounce';
import { useLoadReference } from './useLoadReference';
import { ReferenceStyle } from './ReferenceStyle';

const referenceSchema = yup.object({
  input: yup.string().required('Reference input cannot be empty'),
});

const defaults: SubmitFormReference = {
  input: '',
  terms: '',
  csl: '',
};

type ReferenceFormProps = {
  inEdit?: ResultReference;
  onSaved: (update: ResultReference) => void;
  onClose: () => void;
  referenceStyle: ReferenceStyle;
};

export function ReferenceForm(props: ReferenceFormProps) {
  const toEdit = props.inEdit;
  const [initialInput] = useState<string>(props.inEdit?.input);
  const [form, setForm] = useState<SubmitFormReference>(toForm(toEdit));
  const debouncedInput = useDebounce(form.input);
  const { errors, setError } = useFormErrors<FormReference>();
  const { load } = useLoadReference({ onLoaded: setForm });
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (debouncedInput !== initialInput) {
      setLoading(true);
    }
  }, [form.input]);

  useEffect(() => {
    loadReference();
    async function loadReference() {
      if (debouncedInput === initialInput) {
        setForm(toForm(props.inEdit));
        setLoading(false);
      } else {
        await load(form, props.referenceStyle);
        setLoading(false);
      }
    }
  }, [debouncedInput, props.referenceStyle, initialInput]);

  async function handleSubmit() {
    try {
      const toSubmit = { ...form };
      await referenceSchema.validate(toSubmit);
      props.onSaved(await createReference(toSubmit));
    } catch (error) {
      await setError(error);
    }
  }

  return (
    <>
      <ScrollableModal handleClose={props.onClose} fullHeight={false}>
        <CloseInlineIcon onClick={props.onClose} />
        <form onSubmit={onSubmit(handleSubmit)}>
          <h1>{toEdit ? 'Edit reference' : 'Create new reference'}</h1>
          <FormErrorMessage error={errors.generic} />
          <FieldError error={errors.input} />
          <ReferenceField
            toEdit={form}
            onChange={input => setForm(f => ({ ...f, input }))}
            referenceStyle={props.referenceStyle}
            isLoading={isLoading}
          />
          <SubmitButton onClick={handleSubmit} />
        </form>
      </ScrollableModal>
    </>
  );
}

function toForm(toEdit: ResultReference): FormReference {
  return {
    ...(toEdit || defaults),
  };
}
