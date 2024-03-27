import React, { useEffect } from 'react';
import {
  Access,
  AccessOptions,
  Corpus,
  FormMetadataValue,
  ResultMetadataKey,
  Source,
} from '../../model/DexterModel';
import { SelectTagField } from '../tag/SelectTagField';
import { SelectLanguagesField } from '../language/SelectLanguagesField';
import ScrollableModal from '../common/ScrollableModal';
import { ValidatedSelectField } from '../common/ValidatedSelectField';
import { SelectSourcesField } from './SelectSourcesField';
import { TextFieldWithError } from '../common/TextFieldWithError';
import { SubmitButton } from '../common/SubmitButton';
import { MetadataValueFormFields } from '../metadata/MetadataValueFormFields';
import { TextareaFieldProps } from '../common/TextareaFieldProps';
import { useInitCorpusForm } from './useInitCorpusForm';
import { useSubmitCorpusForm } from './useSubmitCorpusForm';
import { onSubmit } from '../../utils/onSubmit';
import { SelectCorpusField } from './SelectCorpusField';
import { useFormErrors } from '../common/error/useFormErrors';
import { FormErrorMessage } from '../common/error/FormError';
import { useImmer } from 'use-immer';
import { push } from '../../utils/draft/push';
import { remove } from '../../utils/draft/remove';
import { assign } from '../../utils/draft/assign';
import { toFormHint } from '../../LabelStore';
import { Hinted } from '../common/Hinted';
import { TopRightCloseIcon } from '../common/icon/CloseIcon';

type CorpusFormProps = {
  /**
   * When none provided, create new
   */
  corpusToEdit?: Corpus;

  /**
   * When a parentCorpus is provided, hide the parent corpus field
   */
  parentCorpus?: Corpus;
  /**
   * Without a parentCorpus, parentOptions should be provided
   */
  parentOptions?: Corpus[];

  sourceOptions: Source[];
  onSaved: (edited: Corpus) => void;
  onClose: () => void;
};

export function CorpusForm(props: CorpusFormProps) {
  const corpusToEdit = props.corpusToEdit;

  const [form, setForm] = useImmer<Corpus>(null);
  const { errors, setError } = useFormErrors<Corpus>();
  const [keys, setKeys] = useImmer<ResultMetadataKey[]>([]);
  const [values, setValues] = useImmer<FormMetadataValue[]>([]);

  const { init, isInit } = useInitCorpusForm({
    corpusToEdit,
    parent: props.parentCorpus,
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

  const toHint = toFormHint('corpus');

  async function handleSubmit() {
    await submitCorpusForm(form, keys, values);
  }

  function handleUnlinkSource(sourceId: string) {
    setForm(f => remove(f.sources, sourceId));
  }

  async function handleLinkSource(sourceId: string) {
    const toAdd = props.sourceOptions.find(s => s.id === sourceId);
    setForm(f => push(f.sources, toAdd));
  }

  async function handleSelectParentCorpus(corpusId: string) {
    const parent = props.parentOptions.find(o => o.id === corpusId);
    setForm(f => assign(f, { parent }));
  }

  async function handleDeleteParentCorpus() {
    setForm(f => delete f.parent);
  }

  function renderTextField(
    fieldName: keyof Corpus,
    props?: TextareaFieldProps,
  ) {
    return (
      <TextFieldWithError
        label={<Hinted txt={fieldName} hint={toHint(fieldName)} />}
        error={errors[fieldName]}
        value={form[fieldName] as string}
        onChange={value => setForm(f => assign(f, { [fieldName]: value }))}
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
        <TopRightCloseIcon onClick={props.onClose} />
        <h1>{corpusToEdit ? 'Edit corpus' : 'Create new corpus'}</h1>
        <FormErrorMessage error={errors.generic} />
        <form onSubmit={onSubmit(handleSubmit)}>
          {renderTextField('title')}
          {renderTextField('description', { rows: 6, multiline: true })}
          {renderTextField('rights')}
          {renderTextField('ethics')}

          <ValidatedSelectField<Access>
            label={<Hinted txt="access" hint={toHint('access')} />}
            error={errors.access}
            selectedOption={form.access}
            onSelectOption={access => setForm(f => ({ ...f, access }))}
            options={AccessOptions}
          />

          {renderTextField('location')}
          {renderTextField('earliest')}
          {renderTextField('latest')}
          {renderTextField('contributor')}
          {renderTextField('notes', { rows: 6, multiline: true })}

          <SelectTagField
            label={<Hinted txt="tags" hint={toHint('tags')} />}
            error={errors.tags}
            selected={form.tags}
            onChangeSelected={tags => setForm(f => ({ ...f, tags }))}
            useAutocomplete
            allowCreatingNew
          />

          <SelectLanguagesField
            label={<Hinted txt="languages" hint={toHint('languages')} />}
            error={errors.languages}
            selected={form.languages}
            onChangeSelected={languages => setForm(f => ({ ...f, languages }))}
          />

          <SelectSourcesField
            label={<Hinted txt="Add sources" hint={toHint('sources')} />}
            error={errors.sources}
            options={props.sourceOptions}
            selected={form.sources}
            onSelectSource={handleLinkSource}
            onDeselectSource={handleUnlinkSource}
          />

          {!props.parentCorpus && (
            <SelectCorpusField
              label={<Hinted txt="Add to corpus" hint={toHint('parent')} />}
              error={errors.parent}
              selected={form.parent}
              options={props.parentOptions || []}
              onSelectCorpus={handleSelectParentCorpus}
              onDeselectCorpus={handleDeleteParentCorpus}
            />
          )}

          <MetadataValueFormFields
            label={<Hinted txt="metadata" hint={toHint('metadata')} />}
            error={errors.metadataValues}
            keys={keys}
            values={values}
            onChange={setValues}
          />

          <SubmitButton onClick={handleSubmit} />
        </form>
      </ScrollableModal>
    </>
  );
}
