import React, { useEffect } from 'react';
import * as yup from 'yup';
import { useFormErrors } from '../common/error/useFormErrors';
import { FormErrorMessage } from '../common/error/FormError';
import { FieldError } from '../common/error/FieldError';
import ScrollableModal from '../common/ScrollableModal';
import { onSubmit } from '../../utils/onSubmit';
import { SubmitButton } from '../common/SubmitButton';
import { ReferenceField } from './ReferenceField';
import { useDebounce } from '../../utils/useDebounce';
import { useLoadReference } from './useLoadReference';
import { ReferenceStyle } from './ReferenceStyle';
import { useImmer } from 'use-immer';
import { Hinted } from '../common/Hinted';
import { toFormHint } from '../../LabelStore';
import { TopRightCloseIcon } from '../common/icon/CloseIcon';
import { useReferences } from '../../resources/useReferences';
import {
  FormReference,
  ResultReference,
  SubmitFormReference,
} from '../../model/Reference';
import { UUID } from '../../model/Id';

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
  const { updateReference, createReference } = useReferences();
  const toEdit = props.inEdit;
  const [initialInput] = useImmer<string>(props.inEdit?.input);
  const [form, setForm] = useImmer<SubmitFormReference>(toForm(toEdit));
  const debouncedInput = useDebounce(form.input);
  const { errors, setError } = useFormErrors<FormReference>();
  const { load } = useLoadReference({ onLoaded: setForm });
  const [isLoading, setLoading] = useImmer(false);

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

  const toHint = toFormHint('reference');

  async function createNew(toSubmit: FormReference) {
    return createReference(toSubmit);
  }

  async function updateExisting(id: UUID, toSubmit: FormReference) {
    return updateReference(id, toSubmit);
  }

  async function handleSubmit() {
    try {
      const toSubmit = { ...form };
      await referenceSchema.validate(toSubmit);
      const result = props.inEdit
        ? await updateExisting(props.inEdit.id, toSubmit)
        : await createNew(toSubmit);
      props.onSaved(result);
    } catch (error) {
      await setError(error);
    }
  }

  return (
    <>
      <ScrollableModal handleClose={props.onClose} fullHeight={false}>
        <TopRightCloseIcon onClick={props.onClose} />
        <form onSubmit={onSubmit(handleSubmit)}>
          <h1>{toEdit ? 'Edit reference' : 'Create new reference'}</h1>
          <FormErrorMessage error={errors.generic} />
          <FieldError error={errors.input} />
          <ReferenceField
            label={<Hinted txt="references" hint={toHint('reference')} />}
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
    terms: defaults.terms,
  };
}
