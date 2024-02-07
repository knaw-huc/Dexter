import styled from '@emotion/styled';
import TextField from '@mui/material/TextField';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import {
  AccessOptions,
  Corpus,
  CorpusFormSubmit,
  FormMetadataValue,
  ResultMetadataKey,
  ServerFormCorpus,
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
import {
  TextareaFieldProps,
  TextFieldWithError,
} from '../source/TextFieldWithError';
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

type CorpusFormProps = {
  corpusToEdit?: Corpus;
  parentOptions: Corpus[];
  sourceOptions: Source[];
  onSave: (edited: Corpus) => void;
  onClose: () => void;
};
styled(TextField)`
  display: block;
`;
const Label = styled.label`
  font-weight: bold;
`;

const formFields: (keyof Corpus)[] = [
  'parent',
  'title',
  'description',
  'rights',
  'access',
  'location',
  'earliest',
  'latest',
  'contributor',
  'notes',
  'keywords',
  'languages',
  'sources',
];

const validationSchema = yup.object({
  title: yup.string().required('Title is required'),
});

export function CorpusForm(props: CorpusFormProps) {
  const { setValue, watch } = useForm<Corpus>();

  const [fieldErrors, setFieldErrors] = useState<ErrorByField<Corpus>[]>([]);
  const [isInit, setInit] = useState(false);
  const [isLoaded, setLoaded] = useState(false);
  const [keys, setKeys] = useState<ResultMetadataKey[]>([]);
  const [values, setValues] = useState<FormMetadataValue[]>([]);

  const allSources = props.sourceOptions;

  useEffect(() => {
    const init = async () => {
      if (props.corpusToEdit) {
        formFields.map((field: keyof Corpus) => {
          setValue(field, props.corpusToEdit[field]);
        });
        const formValues =
          props.corpusToEdit.metadataValues.map(toFormMetadataValue);
        setValues(formValues);
      }
      setKeys(await getMetadataKeys());
      setLoaded(true);
    };
    if (!isInit) {
      setInit(true);
      init();
    }
  }, [isInit, isLoaded]);

  useEffect(() => {
    if (fieldErrors) {
      scrollToError();
    }
  }, [fieldErrors]);

  function toServerForm(data: CorpusFormSubmit): ServerFormCorpus {
    const parentId = data.parent?.id;
    return { ...data, parentId };
  }

  async function handleSubmit(data: CorpusFormSubmit) {
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
      await setFormFieldErrors(e, setFieldErrors);
    }
  }

  async function createNewCorpus(data: ServerFormCorpus) {
    const newCorpus = await createCorpus(data);
    return newCorpus.id;
  }

  async function updateExistingCorpus(data: ServerFormCorpus) {
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
    const update = watch('sources').filter(s => s.id !== sourceId);
    return setValue('sources', update);
  }

  async function handleLinkSource(sourceId: string) {
    const toAdd = allSources.find(s => s.id === sourceId);
    return setValue('sources', [...watch('sources'), toAdd]);
  }

  async function handleSelectParentCorpus(corpusId: string) {
    const update = props.parentOptions.find(o => o.id === corpusId);
    setValue('parent', update);
  }

  async function handleDeleteParentCorpus() {
    return setValue('parent', undefined);
  }

  function renderTextField(
    fieldName: keyof Corpus,
    props?: TextareaFieldProps,
  ) {
    return (
      <TextFieldWithError
        label={_.capitalize(fieldName)}
        message={getErrorMessage<Corpus>(fieldName, fieldErrors)}
        value={watch(fieldName) as string}
        onChange={value => setValue(fieldName, value)}
        {...props}
      />
    );
  }

  if (!isLoaded) {
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
        <FormErrorMessage error={fieldErrors.find(e => e.field === GENERIC)} />
        <form>
          {renderTextField('title')}
          {renderTextField('description', { rows: 6, multiline: true })}
          {renderTextField('rights')}
          <ValidatedSelectField
            label="Access"
            message={getErrorMessage<Corpus>('access', fieldErrors)}
            selectedOption={watch('access')}
            onSelectOption={v => setValue('access', v)}
            options={AccessOptions}
          />
          {renderTextField('location')}
          {renderTextField('earliest')}
          {renderTextField('latest')}
          {renderTextField('contributor')}
          {renderTextField('notes', { rows: 6, multiline: true })}
          <Label>Keywords</Label>
          <SelectKeywordsField
            selected={watch('keywords') ?? []}
            onChangeSelected={selected => {
              setValue('keywords', selected);
            }}
            useAutocomplete
            allowCreatingNew
          />
          <ErrorMsg msg={getErrorMessage<Corpus>('keywords', fieldErrors)} />
          <Label>Languages</Label>
          <LanguagesField
            selected={watch('languages')}
            onChangeSelected={selected => {
              setValue('languages', selected);
            }}
          />
          <ErrorMsg msg={getErrorMessage<Corpus>('languages', fieldErrors)} />
          <Label>Add sources to corpus</Label>
          <LinkSourceField
            options={allSources}
            selected={watch('sources')}
            onLinkSource={handleLinkSource}
            onUnlinkSource={handleUnlinkSource}
          />
          <ErrorMsg msg={getErrorMessage<Corpus>('sources', fieldErrors)} />
          <Label>Add to main corpus</Label>
          <ParentCorpusField
            selected={watch('parent')}
            options={props.parentOptions}
            onSelectParentCorpus={handleSelectParentCorpus}
            onDeleteParentCorpus={handleDeleteParentCorpus}
          />
          <MetadataValueFormFields
            keys={keys}
            values={values}
            onChange={setValues}
          />
          <SubmitButton onClick={() => handleSubmit(watch())} />
        </form>
        <ErrorMsg msg={getErrorMessage<Corpus>('parent', fieldErrors)} />
      </ScrollableModal>
    </>
  );
}
