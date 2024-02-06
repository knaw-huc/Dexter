import styled from '@emotion/styled';
import { yupResolver } from '@hookform/resolvers/yup';
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
import {
  addKeywordsToCorpus,
  addLanguagesToCorpus,
  addMetadataValueToCorpus,
  addSourcesToCorpus,
  createCorpus,
  deleteKeywordFromCorpus,
  deleteLanguageFromCorpus,
  deleteMetadataValueFromCorpus,
  deleteSourceFromCorpus,
  getMetadataKeys,
  updateCorpus,
} from '../../utils/API';
import { AddKeywordField } from '../keyword/AddKeywordField';
import { LanguagesField } from '../language/LanguagesField';
import { ParentCorpusField } from './ParentCorpusField';
import ScrollableModal from '../common/ScrollableModal';
import { ValidatedSelectField } from '../common/ValidatedSelectField';
import { LinkSourceField } from './LinkSourceField';
import {
  ErrorByField,
  filterFormFieldErrors,
  FormError,
  scrollToError,
} from '../common/FormError';
import { TextFieldWithError } from '../source/TextFieldWithError';
import { ErrorMsg } from '../common/ErrorMsg';
import _ from 'lodash';
import { CloseInlineIcon } from '../common/CloseInlineIcon';
import { SubmitButton } from '../common/SubmitButton';
import { MetadataValueFormFields } from '../metadata/MetadataValueFormFields';
import { submitMetadataValues } from '../../utils/submitMetadataValues';
import { updateLinkedResourcesWith } from '../../utils/updateRemoteIds';

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
  const {
    setValue,
    formState: { errors },
    watch,
  } = useForm<Corpus>({
    resolver: yupResolver(validationSchema),
  });
  const [fieldError, setFieldError] = useState<ErrorByField>();
  const [isInit, setInit] = useState(false);
  const [isLoaded, setLoaded] = useState(false);
  const [keys, setKeys] = useState<ResultMetadataKey[]>([]);
  const [values, setValues] = useState<FormMetadataValue[]>([]);

  const allSources = props.sourceOptions;
  const selectedSources = watch('sources');
  const selectedParent = watch('parent');
  const updateMetadataValues = updateLinkedResourcesWith(
    addMetadataValueToCorpus,
    deleteMetadataValueFromCorpus,
  );
  const updateSources = updateLinkedResourcesWith(
    addSourcesToCorpus,
    deleteSourceFromCorpus,
  );
  const updateLanguages = updateLinkedResourcesWith(
    addLanguagesToCorpus,
    deleteLanguageFromCorpus,
  );
  const updateKeywords = updateLinkedResourcesWith(
    addKeywordsToCorpus,
    deleteKeywordFromCorpus,
  );

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
    if (fieldError) {
      scrollToError();
    }
  }, [fieldError]);

  function toServerForm(data: CorpusFormSubmit): ServerFormCorpus {
    return {
      ...data,
      parentId: data.parent?.id,
    };
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

  async function handleSubmit(data: CorpusFormSubmit) {
    try {
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
      await filterFormFieldErrors(e, setFieldError);
    }
  }

  async function submitLinkedResources(id: string, data: CorpusFormSubmit) {
    await updateMetadataValues(
      id,
      data.metadataValues.map(toResultMetadataValue),
    );
    await updateKeywords(id, data.keywords);
    await updateLanguages(id, data.languages);
    await updateSources(id, data.sources);
  }

  function handleUnlinkSource(sourceId: string) {
    return setValue(
      'sources',
      selectedSources.filter(s => s.id !== sourceId),
    );
  }

  async function handleLinkSource(sourceId: string) {
    const toAdd = allSources.find(s => s.id === sourceId);
    return setValue('sources', [...selectedSources, toAdd]);
  }

  async function handleSelectParentCorpus(corpusId: string) {
    return setValue(
      'parent',
      props.parentOptions.find(o => o.id === corpusId),
    );
  }

  async function handleDeleteParentCorpus() {
    return setValue('parent', undefined);
  }

  function getErrorMessage(field: keyof Corpus): string | undefined {
    if (errors[field]?.message) {
      return errors[field].message;
    }
    if (fieldError?.field === field) {
      return fieldError.error.message;
    }
  }

  function renderFormField(fieldName: keyof Corpus) {
    return (
      <TextFieldWithError
        label={_.capitalize(fieldName)}
        message={getErrorMessage(fieldName)}
        value={watch(fieldName)}
        onChange={event => setValue(fieldName, event.target.value)}
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
        <FormError error={fieldError} />
        <form>
          {renderFormField('title')}
          <TextFieldWithError
            label="Description"
            message={getErrorMessage('description')}
            value={watch('description')}
            onChange={event => setValue('description', event.target.value)}
            multiline
            rows={6}
          />
          {renderFormField('rights')}
          <ValidatedSelectField
            label="Access"
            message={errors.access?.message}
            selectedOption={watch('access')}
            onSelectOption={v => setValue('access', v)}
            options={AccessOptions}
          />
          {renderFormField('location')}
          {renderFormField('earliest')}
          {renderFormField('latest')}
          {renderFormField('contributor')}
          <TextFieldWithError
            label="notes"
            message={getErrorMessage('notes')}
            value={watch('notes')}
            onChange={event => setValue('notes', event.target.value)}
            multiline
            rows={6}
          />
          <Label>Keywords</Label>
          <AddKeywordField
            selected={watch('keywords')}
            onChangeSelected={selected => {
              setValue('keywords', selected);
            }}
          />
          <ErrorMsg msg={getErrorMessage('keywords')} />
          <Label>Languages</Label>
          <LanguagesField
            selected={watch('languages')}
            onChangeSelected={selected => {
              setValue('languages', selected);
            }}
          />
          <ErrorMsg msg={getErrorMessage('languages')} />
          <Label>Add sources to corpus</Label>
          <LinkSourceField
            options={allSources}
            selected={selectedSources}
            onLinkSource={handleLinkSource}
            onUnlinkSource={handleUnlinkSource}
          />
          <ErrorMsg msg={getErrorMessage('sources')} />
          <Label>Add to main corpus</Label>
          <ParentCorpusField
            selected={selectedParent}
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
        <ErrorMsg msg={getErrorMessage('parent')} />
      </ScrollableModal>
    </>
  );
}
