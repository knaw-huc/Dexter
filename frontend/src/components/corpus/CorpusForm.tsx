import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import {
  AccessOptions,
  Corpus,
  CorpusFormSubmit,
  FormCorpus,
  FormMetadataValue,
  ResultMetadataKey,
  Source,
  toFormMetadataValue,
  toResultMetadataValue,
} from '../../model/DexterModel';
import { createCorpus, getMetadataKeys, updateCorpus } from '../../utils/API';
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
  setFormFieldErrors,
} from '../common/FormErrorMessage';
import { TextFieldWithError } from '../source/TextFieldWithError';
import { ErrorMsg } from '../common/ErrorMsg';
import _ from 'lodash';
import { CloseInlineIcon } from '../common/CloseInlineIcon';
import { SubmitButton } from '../common/SubmitButton';
import { MetadataValueFormFields } from '../metadata/MetadataValueFormFields';
import { submitMetadataValues } from '../../utils/submitMetadataValues';
import {
  updateCorpusKeywords,
  updateCorpusLanguages,
  updateCorpusMetadataValues,
  updateSources,
} from '../../utils/updateRemoteIds';
import { Label } from '../common/Label';
import { TextareaFieldProps } from '../common/TextareaFieldProps';

type CorpusFormProps = {
  corpusToEdit?: Corpus;
  parentOptions: Corpus[];
  sourceOptions: Source[];
  onSave: (edited: Corpus) => void;
  onClose: () => void;
};

const defaults: Corpus = {
  parent: undefined,
  title: '',
  description: undefined,
  rights: undefined,
  access: undefined,
  location: undefined,
  earliest: undefined,
  latest: undefined,
  contributor: undefined,
  notes: undefined,
  keywords: [],
  languages: [],
  sources: [],
  metadataValues: [],

  // Not created or modified by form:
  id: undefined,
  createdBy: undefined,
  createdAt: undefined,
  updatedAt: undefined,
};

const validationSchema = yup.object({
  title: yup.string().required('Title is required'),
  earliest: yup.date().nullable(),
  latest: yup.date().nullable(),
});

export function CorpusForm(props: CorpusFormProps) {
  const [form, setForm] = useState<Corpus>();
  const [isInit, setInit] = useState(false);
  const [errors, setErrors] = useState<ErrorByField<Corpus>[]>([]);
  const [keys, setKeys] = useState<ResultMetadataKey[]>([]);
  const [values, setValues] = useState<FormMetadataValue[]>([]);

  useEffect(() => {
    if (!isInit) init();

    async function init() {
      const toEdit = props.corpusToEdit;
      if (toEdit) {
        setForm({ ...(toEdit ?? defaults) });
        const formValues = toEdit.metadataValues.map(toFormMetadataValue);
        setValues(formValues);
      }
      setKeys(await getMetadataKeys());
      setInit(true);
    }
  }, []);

  useEffect(scrollToError, [errors]);

  function toServerForm(data: CorpusFormSubmit): FormCorpus {
    const parentId = data.parent?.id;
    return { ...data, parentId };
  }

  async function handleSubmit(data: Corpus) {
    try {
      await validationSchema.validate(data);
      const serverForm = toServerForm(data);
      const id = props.corpusToEdit
        ? await updateExistingCorpus(serverForm)
        : await createNewCorpus(serverForm);
      data.metadataValues = await submitMetadataValues(
        props.corpusToEdit,
        keys,
        values,
      );
      await submitLinkedResources(id, data);
      props.onSave({ id, ...data });
    } catch (e) {
      await setFormFieldErrors(e, setErrors);
    }
  }

  async function createNewCorpus(data: FormCorpus) {
    const newCorpus = await createCorpus(data);
    return newCorpus.id;
  }

  async function updateExistingCorpus(data: FormCorpus) {
    const corpusId = props.corpusToEdit.id;
    await updateCorpus(corpusId, data);
    return corpusId;
  }

  async function submitLinkedResources(id: string, data: CorpusFormSubmit) {
    const metadataValues = data.metadataValues.map(toResultMetadataValue);
    await updateCorpusMetadataValues(id, metadataValues);
    await updateCorpusKeywords(id, data.keywords);
    await updateCorpusLanguages(id, data.languages);
    await updateSources(id, data.sources);
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
        <h1>{props.corpusToEdit ? 'Edit corpus' : 'Create new corpus'}</h1>
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
          <SubmitButton onClick={() => handleSubmit(form)} />
        </form>
        <ErrorMsg msg={getErrorMessage<Corpus>('parent', errors)} />
      </ScrollableModal>
    </>
  );
}
