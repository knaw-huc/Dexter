import React, { useEffect, useState } from 'react';
import {
  AccessOptions,
  Corpus,
  FormMetadataValue,
  ResultMetadataKey,
  Source,
} from '../../model/DexterModel';
import { SelectTagField } from '../tag/SelectTagField';
import { LanguagesField } from '../language/LanguagesField';
import ScrollableModal from '../common/ScrollableModal';
import { ValidatedSelectField } from '../common/ValidatedSelectField';
import { SelectSourcesField } from './SelectSourcesField';
import { TextFieldWithError } from '../source/TextFieldWithError';
import _ from 'lodash';
import { CloseInlineIcon } from '../common/CloseInlineIcon';
import { SubmitButton } from '../common/SubmitButton';
import { MetadataValueFormFields } from '../metadata/MetadataValueFormFields';
import { Label } from '../common/Label';
import { TextareaFieldProps } from '../common/TextareaFieldProps';
import { useInitCorpusForm } from './useInitCorpusForm';
import { useSubmitCorpusForm } from './useSubmitCorpusForm';
import { onSubmit } from '../../utils/onSubmit';
import { SelectCorpusField } from './SelectCorpusField';
import { useFormErrors } from '../common/error/useFormErrors';
import { FormErrorMessage } from '../common/error/FormError';
import { ErrorP } from '../common/error/ErrorP';

type CorpusFormProps = {
  /**
   * When none provided, create new
   */
  corpusToEdit?: Corpus;

  /**
   * When none provided, hide parent corpus field
   */
  parentOptions?: Corpus[];

  sourceOptions: Source[];
  onSaved: (edited: Corpus) => void;
  onClose: () => void;
};

export function CorpusForm(props: CorpusFormProps) {
  const corpusToEdit = props.corpusToEdit;

  const [form, setForm] = useState<Corpus>();
  const { errors, setError } = useFormErrors<Corpus>();
  const [keys, setKeys] = useState<ResultMetadataKey[]>([]);
  const [values, setValues] = useState<FormMetadataValue[]>([]);

  const { init, isInit } = useInitCorpusForm({
    corpusToEdit,
    setForm,
    setKeys,
    setValues,
  });
  const { submitCorpusForm } = useSubmitCorpusForm({
    corpusToEdit,
    setError,
    onSubmitted: props.onSaved,
  });

  useEffect(init, []);

  async function handleSubmit() {
    await submitCorpusForm(form, keys, values);
  }

  function handleUnlinkSource(sourceId: string) {
    const sources = form.sources.filter(s => s.id !== sourceId);
    setForm(f => ({ ...f, sources }));
  }

  async function handleLinkSource(sourceId: string) {
    const toAdd = props.sourceOptions.find(s => s.id === sourceId);
    setForm(f => ({ ...f, sources: [...f.sources, toAdd] }));
  }

  async function handleSelectParentCorpus(corpusId: string) {
    const parent = props.parentOptions.find(o => o.id === corpusId);
    setForm(f => ({ ...f, parent }));
  }

  async function handleDeleteParentCorpus() {
    setForm(f => ({ ...f, parent: undefined }));
  }

  function renderTextField(
    fieldName: keyof Corpus,
    props?: TextareaFieldProps,
  ) {
    return (
      <TextFieldWithError
        label={_.capitalize(fieldName)}
        error={errors[fieldName]}
        value={form[fieldName] as string}
        onChange={value =>
          setForm(f => {
            const update = { ...f };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (update as any)[fieldName] = value;
            return update;
          })
        }
        {...props}
      />
    );
  }

  if (!isInit) {
    return null;
  }
  return (
    <>
      <ScrollableModal handleClose={props.onClose}>
        <CloseInlineIcon onClick={props.onClose} />
        <h1>{corpusToEdit ? 'Edit corpus' : 'Create new corpus'}</h1>
        <FormErrorMessage error={errors.generic} />
        <form onSubmit={onSubmit(handleSubmit)}>
          {renderTextField('title')}
          {renderTextField('description', { rows: 6, multiline: true })}
          {renderTextField('rights')}
          {renderTextField('ethics')}

          <ValidatedSelectField
            label="Access"
            selectedOption={form.access}
            error={errors.access}
            onSelectOption={access => setForm(f => ({ ...f, access }))}
            options={AccessOptions}
          />
          <ErrorP error={errors.access} />

          {renderTextField('location')}
          {renderTextField('earliest')}
          {renderTextField('latest')}
          {renderTextField('contributor')}
          {renderTextField('notes', { rows: 6, multiline: true })}

          <Label>Tags</Label>
          <SelectTagField
            selected={form.tags}
            onChangeSelected={tags => {
              setForm(f => ({ ...f, tags }));
            }}
            useAutocomplete
            allowCreatingNew
          />
          <ErrorP error={errors.tags} />

          <Label>Languages</Label>
          <LanguagesField
            selected={form.languages}
            onChangeSelected={languages => {
              setForm(f => ({ ...f, languages }));
            }}
          />
          <ErrorP error={errors.languages} />

          <Label>Add sources to corpus</Label>
          <SelectSourcesField
            options={props.sourceOptions}
            selected={form.sources}
            onSelectSource={handleLinkSource}
            onDeselectSource={handleUnlinkSource}
          />
          <ErrorP error={errors.sources} />

          {props.parentOptions && (
            <>
              <Label>Add to main corpus</Label>
              <SelectCorpusField
                selected={form.parent}
                options={props.parentOptions}
                onSelectCorpus={handleSelectParentCorpus}
                onDeselectCorpus={handleDeleteParentCorpus}
              />
              <ErrorP error={errors.parent} />
            </>
          )}

          <MetadataValueFormFields
            keys={keys}
            values={values}
            onChange={setValues}
          />
          <ErrorP error={errors.metadataValues} />

          <SubmitButton onClick={handleSubmit} />
        </form>
      </ScrollableModal>
    </>
  );
}
