import React, { useEffect, useState } from 'react';
import {
  AccessOptions,
  Corpus,
  FormMetadataValue,
  ResultMetadataKey,
  Source,
} from '../../model/DexterModel';
import { SelectKeywordsField } from '../keyword/SelectKeywordsField';
import { LanguagesField } from '../language/LanguagesField';
import { ParentCorpusField } from './ParentCorpusField';
import ScrollableModal from '../common/ScrollableModal';
import { ValidatedSelectField } from '../common/ValidatedSelectField';
import { LinkSourceField } from './LinkSourceField';
import {
  ErrorByField,
  FormErrorMessage,
  GENERIC,
  getErrorMessage,
  scrollToError,
} from '../common/FormErrorMessage';
import { TextFieldWithError } from '../source/TextFieldWithError';
import { ErrorMsg } from '../common/ErrorMsg';
import _ from 'lodash';
import { CloseInlineIcon } from '../common/CloseInlineIcon';
import { SubmitButton } from '../common/SubmitButton';
import { MetadataValueFormFields } from '../metadata/MetadataValueFormFields';
import { Label } from '../common/Label';
import { TextareaFieldProps } from '../common/TextareaFieldProps';
import { useInitCorpusForm } from './useInitCorpusForm';
import { useSubmitCorpusForm } from './useSubmitCorpusForm';

type CorpusFormProps = {
  corpusToEdit?: Corpus;
  parentOptions: Corpus[];
  sourceOptions: Source[];
  onSave: (edited: Corpus) => void;
  onClose: () => void;
};

export function CorpusForm(props: CorpusFormProps) {
  const corpusToEdit = props.corpusToEdit;

  const [form, setForm] = useState<Corpus>();
  const [errors, setErrors] = useState<ErrorByField<Corpus>[]>([]);
  const [keys, setKeys] = useState<ResultMetadataKey[]>([]);

  const [values, setValues] = useState<FormMetadataValue[]>([]);
  const { init, isInit } = useInitCorpusForm({
    corpusToEdit,
    setValues,
    setForm,
    setKeys,
  });
  const { submitCorpusForm } = useSubmitCorpusForm({
    corpusToEdit,
    setErrors,
    onSubmitted: props.onSave,
  });

  useEffect(init, []);
  useEffect(scrollToError, [errors]);

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
        message={getErrorMessage<Corpus>(fieldName, errors)}
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
      <ScrollableModal show={true} handleClose={props.onClose}>
        <CloseInlineIcon
          style={{ float: 'right', top: 0 }}
          onClick={props.onClose}
        />
        <h1>{corpusToEdit ? 'Edit corpus' : 'Create new corpus'}</h1>
        <FormErrorMessage error={errors.find(e => e.field === GENERIC)} />
        <form>
          {renderTextField('title')}
          {renderTextField('description', { rows: 6, multiline: true })}
          {renderTextField('rights')}
          <ValidatedSelectField
            label="Access"
            message={getErrorMessage<Corpus>('access', errors)}
            selectedOption={form.access}
            onSelectOption={access => setForm(f => ({ ...f, access }))}
            options={AccessOptions}
          />
          {renderTextField('location')}
          {renderTextField('earliest')}
          {renderTextField('latest')}
          {renderTextField('contributor')}
          {renderTextField('notes', { rows: 6, multiline: true })}
          <Label>Keywords</Label>
          <SelectKeywordsField
            selected={form.keywords}
            onChangeSelected={keywords => {
              setForm(f => ({ ...f, keywords }));
            }}
            useAutocomplete
            allowCreatingNew
          />
          <ErrorMsg msg={getErrorMessage<Corpus>('keywords', errors)} />
          <Label>Languages</Label>
          <LanguagesField
            selected={form.languages}
            onChangeSelected={languages => {
              setForm(f => ({ ...f, languages }));
            }}
          />
          <ErrorMsg msg={getErrorMessage<Corpus>('languages', errors)} />
          <Label>Add sources to corpus</Label>
          <LinkSourceField
            options={props.sourceOptions}
            selected={form.sources}
            onLinkSource={handleLinkSource}
            onUnlinkSource={handleUnlinkSource}
          />
          <ErrorMsg msg={getErrorMessage<Corpus>('sources', errors)} />
          <Label>Add to main corpus</Label>
          <ParentCorpusField
            selected={form.parent}
            options={props.parentOptions}
            onSelectParentCorpus={handleSelectParentCorpus}
            onDeleteParentCorpus={handleDeleteParentCorpus}
          />
          <MetadataValueFormFields
            keys={keys}
            values={values}
            onChange={setValues}
          />
          <SubmitButton onClick={handleSubmit} />
        </form>
        <ErrorMsg msg={getErrorMessage<Corpus>('parent', errors)} />
      </ScrollableModal>
    </>
  );
}
