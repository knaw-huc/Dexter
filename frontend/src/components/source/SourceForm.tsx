import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import {
  AccessOptions,
  FormMetadataValue,
  ImportResult,
  ResultMetadataKey,
  Source,
  SourceFormSubmit,
  toFormMetadataValue,
  toResultMetadataValue,
  UUID,
} from '../../model/DexterModel';
import {
  addKeywordsToSource,
  addLanguagesToSource,
  addMetadataValueToSource,
  addSourcesToCorpus,
  createSource,
  deleteKeywordFromCorpus,
  deleteLanguageFromCorpus,
  deleteMetadataValueFromCorpus,
  getMetadataKeys,
  postImport,
  updateSource,
} from '../../utils/API';
import ScrollableModal from '../common/ScrollableModal';
import { AddKeywordField } from '../keyword/AddKeywordField';
import { LanguagesField } from '../language/LanguagesField';
import isUrl from '../../utils/isUrl';
import { useDebounce } from '../../utils/useDebounce';
import { Label } from '../common/Label';
import { ValidatedSelectField } from '../common/ValidatedSelectField';
import { ErrorMsg } from '../common/ErrorMsg';
import { TextFieldWithError } from './TextFieldWithError';
import {
  ErrorByField,
  setFormFieldErrors,
  FormErrorMessage,
  scrollToError,
  putErrorByField,
  getErrorMessage,
  GENERIC,
} from '../common/FormErrorMessage';
import { CloseInlineIcon } from '../common/CloseInlineIcon';
import { SubmitButton } from '../common/SubmitButton';
import { ImportField } from './ImportField';
import _ from 'lodash';
import { MetadataValueFormFields } from '../metadata/MetadataValueFormFields';
import { submitMetadataValues } from '../../utils/submitMetadataValues';
import { updateLinkedResourcesWith } from '../../utils/updateRemoteIds';

const formFields: (keyof Source)[] = [
  'externalRef',
  'title',
  'description',
  'creator',
  'rights',
  'access',
  'location',
  'earliest',
  'latest',
  'notes',
  'keywords',
  'languages',
];

type SourceFormProps = {
  sourceToEdit?: Source;
  corpusId?: string;
  onSave: (data: Source) => void;
  onClose: () => void;
};

const schema = yup.object({
  title: yup.string().required('Title is required'),
});

export function SourceForm(props: SourceFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm<Source>({
    resolver: yupResolver(schema),
    mode: 'onBlur',
    defaultValues: { keywords: [], languages: [], access: null },
  });

  const [isExternalRefLoading, setExternalRefLoading] = useState(false);
  const externalRef = watch('externalRef');
  const debouncedExternalRef = useDebounce<string>(externalRef, 500);
  const [fieldErrors, setFieldErrors] = useState<ErrorByField<Source>[]>();
  const [keys, setKeys] = useState<ResultMetadataKey[]>([]);
  const [values, setValues] = useState<FormMetadataValue[]>([]);

  const updateMetadataValues = updateLinkedResourcesWith(
    addMetadataValueToSource,
    deleteMetadataValueFromCorpus,
  );
  const updateLanguages = updateLinkedResourcesWith(
    addLanguagesToSource,
    deleteLanguageFromCorpus,
  );
  const updateKeywords = updateLinkedResourcesWith(
    addKeywordsToSource,
    deleteKeywordFromCorpus,
  );

  useEffect(() => {
    init();

    async function init() {
      setKeys(await getMetadataKeys());

      if (props.sourceToEdit) {
        formFields.map((field: keyof Source) => {
          setValue(field, props.sourceToEdit[field]);
        });
        const formValues =
          props.sourceToEdit.metadataValues.map(toFormMetadataValue);
        setValues(formValues);
      }
    }
  }, [props.sourceToEdit, setValue]);

  useEffect(() => {
    if (fieldErrors) {
      console.error('field error:', fieldErrors);
      scrollToError();
    }
  }, [fieldErrors]);

  async function handleImportMetadata() {
    const warning = window.confirm(
      'Importing overwrites existing values. Are you sure you want to import?',
    );

    if (warning === false) return;

    if (isExternalRefLoading) {
      return;
    }
    if (!isUrl(debouncedExternalRef)) {
      return;
    }

    setExternalRefLoading(true);
    let tmsImport: ImportResult;
    try {
      tmsImport = await postImport(new URL(debouncedExternalRef));
    } catch (e) {
      await setFormFieldErrors(e, setFieldErrors);
    }
    if (!tmsImport || !tmsImport.isValidExternalReference) {
      setFieldErrors(prev =>
        putErrorByField(prev, {
          field: 'externalRef',
          error: { message: 'Is not a valid external reference' },
        }),
      );
    } else {
      Object.keys(tmsImport.imported).forEach(key => {
        if (tmsImport.imported[key]) {
          setValue(key as keyof Source, tmsImport.imported[key]);
        }
      });
    }
    setExternalRefLoading(false);
  }

  async function onSubmit(data: SourceFormSubmit) {
    try {
      const id: UUID = props.sourceToEdit
        ? await updateExistingSource(data)
        : await createNewSource(data);
      data.metadataValues = await submitMetadataValues(
        props.sourceToEdit,
        keys,
        values,
      );
      await submitLinkedResources(id, data);
      props.onSave({ id, ...data });
    } catch (error) {
      await setFormFieldErrors(error, setFieldErrors);
    }
  }

  async function submitLinkedResources(id: UUID, data: SourceFormSubmit) {
    await updateMetadataValues(
      id,
      data.metadataValues.map(toResultMetadataValue),
    );
    await updateKeywords(id, data.keywords);
    await updateLanguages(id, data.languages);
  }

  async function updateExistingSource(data: SourceFormSubmit): Promise<UUID> {
    const sourceId = props.sourceToEdit.id;
    await updateSource(sourceId, data);
    return sourceId;
  }

  async function createNewSource(data: SourceFormSubmit): Promise<UUID> {
    const newSource = await createSource(data);
    const sourceId = newSource.id;
    if (props.corpusId?.length) {
      await addSourcesToCorpus(props.corpusId, [sourceId]);
    }
    return sourceId;
  }

  function renderFormField(fieldName: keyof Source) {
    return (
      <TextFieldWithError
        label={_.capitalize(fieldName)}
        value={watch(fieldName) as string}
        onChange={v => setValue(fieldName, v)}
        message={getErrorMessage<Source>(fieldName, fieldErrors)}
      />
    );
  }

  return (
    <ScrollableModal show={true} handleClose={props.onClose}>
      <CloseInlineIcon
        style={{ float: 'right', top: 0 }}
        onClick={props.onClose}
      />

      <h1>{props.sourceToEdit ? 'Edit source' : 'Create new source'}</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormErrorMessage error={fieldErrors.find(e => e.field === GENERIC)} />

        <ImportField
          label="External Reference"
          {...register('externalRef')}
          message={getErrorMessage<Source>('externalRef', fieldErrors)}
          onImport={handleImportMetadata}
          isImporting={isExternalRefLoading}
          isRefImportable={isImportableUrl(watch('externalRef'))}
        />

        {renderFormField('title')}

        <TextFieldWithError
          label="Description"
          value={watch('description') as string}
          onChange={v => setValue('description', v)}
          message={getErrorMessage<Source>('description', fieldErrors)}
          multiline
          rows={6}
        />

        {renderFormField('creator')}
        {renderFormField('rights')}

        <ValidatedSelectField
          label="Access"
          message={getErrorMessage<Source>('access', fieldErrors)}
          selectedOption={watch('access')}
          onSelectOption={e => setValue('access', e)}
          options={AccessOptions}
        />

        {renderFormField('location')}
        {renderFormField('earliest')}
        {renderFormField('latest')}
        {renderFormField('notes')}

        <Label>Keywords</Label>
        <AddKeywordField
          selected={watch('keywords')}
          onChangeSelected={selected => {
            setValue('keywords', selected);
          }}
        />
        <ErrorMsg msg={getErrorMessage<Source>('keywords', fieldErrors)} />

        <Label>Languages</Label>
        <LanguagesField
          selected={watch('languages')}
          onChangeSelected={selected => {
            setValue('languages', selected);
          }}
        />
        <ErrorMsg msg={getErrorMessage<Source>('languages', fieldErrors)} />

        <MetadataValueFormFields
          keys={keys}
          values={values}
          onChange={setValues}
        />

        <SubmitButton />
      </form>
    </ScrollableModal>
  );
}

const IMPORTABLE_URL = new RegExp(
  'https://hdl\\.handle\\.net/[0-9.]*/([0-9]*)',
);

function isImportableUrl(externalRef?: string): boolean {
  return IMPORTABLE_URL.test(externalRef);
}
