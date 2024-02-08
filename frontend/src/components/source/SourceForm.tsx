import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import {
  AccessOptions,
  FormMetadataValue,
  ResultImport,
  ResultMetadataKey,
  Source,
  SourceFormSubmit,
  toFormMetadataValue,
  toResultMetadataValue,
  UUID,
} from '../../model/DexterModel';
import {
  addSourcesToCorpus,
  createSource,
  getMetadataKeys,
  postImport,
  updateSource,
} from '../../utils/API';
import ScrollableModal from '../common/ScrollableModal';
import { SelectKeywordsField } from '../keyword/SelectKeywordsField';
import { LanguagesField } from '../language/LanguagesField';
import isUrl from '../../utils/isUrl';
import { Label } from '../common/Label';
import { ValidatedSelectField } from '../common/ValidatedSelectField';
import { ErrorMsg } from '../common/ErrorMsg';
import { TextFieldWithError } from './TextFieldWithError';
import {
  ErrorByField,
  FormErrorMessage,
  GENERIC,
  getErrorMessage,
  scrollToError,
  setFormFieldErrors,
  upsertFieldError,
} from '../common/FormErrorMessage';
import { CloseInlineIcon } from '../common/CloseInlineIcon';
import { SubmitButton } from '../common/SubmitButton';
import { ImportField } from './ImportField';
import _ from 'lodash';
import { MetadataValueFormFields } from '../metadata/MetadataValueFormFields';
import { submitMetadataValues } from '../../utils/submitMetadataValues';
import {
  updateSourceKeywords,
  updateSourceLanguages,
  updateSourceMetadataValues,
} from '../../utils/updateRemoteIds';

type SourceFormProps = {
  sourceToEdit?: Source;
  corpusId?: string;
  onSave: (data: Source) => void;
  onClose: () => void;
};

const defaults: Source = {
  title: '',
  description: undefined,
  rights: undefined,
  access: undefined,
  location: undefined,
  earliest: undefined,
  latest: undefined,
  notes: undefined,
  keywords: [],
  languages: [],
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

export function SourceForm(props: SourceFormProps) {
  const [form, setForm] = useState<Source>();
  const [isInit, setInit] = useState(false);
  const [errors, setErrors] = useState<ErrorByField<Source>[]>([]);
  const [isImportLoading, setImportLoading] = useState(false);
  const [keys, setKeys] = useState<ResultMetadataKey[]>([]);
  const [values, setValues] = useState<FormMetadataValue[]>([]);

  useEffect(() => {
    if (!isInit) init();

    async function init() {
      setKeys(await getMetadataKeys());

      const toEdit = props.sourceToEdit;
      if (toEdit) {
        setForm({ ...(toEdit ?? defaults) });
        const formValues = toEdit.metadataValues.map(toFormMetadataValue);
        setValues(formValues);
      }
      setKeys(await getMetadataKeys());
      setInit(true);
    }
  }, []);

  useEffect(() => {
    scrollToError();
  }, [errors]);

  async function handleImportMetadata() {
    const warning = window.confirm(
      'Importing overwrites existing values. Are you sure you want to import?',
    );

    if (warning === false) return;

    if (isImportLoading) {
      return;
    }
    if (!isUrl(form.externalRef)) {
      return;
    }

    setImportLoading(true);
    let tmsImport: ResultImport;
    try {
      tmsImport = await postImport(new URL(form.externalRef));
    } catch (e) {
      await setFormFieldErrors(e, setErrors);
    }
    if (!tmsImport || !tmsImport.isValidExternalReference) {
      setErrors(prev =>
        upsertFieldError(
          prev,
          new ErrorByField('externalRef', 'Is not a valid external reference'),
        ),
      );
    }
    const update: Source = { ...form };

    Object.keys(update).forEach((key: keyof Source) => {
      if (tmsImport.imported[key]) {
        if (typeof update[key] === 'string') {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (update as any)[key] = tmsImport.imported[key];
        }
      }
    });
    setForm(update);
    setImportLoading(false);
  }

  async function handleSubmit(data: SourceFormSubmit) {
    try {
      await validationSchema.validate(data);
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
      await setFormFieldErrors(error, setErrors);
    }
  }

  async function submitLinkedResources(id: UUID, data: SourceFormSubmit) {
    const metadataValues = data.metadataValues.map(toResultMetadataValue);
    await updateSourceMetadataValues(id, metadataValues);
    await updateSourceKeywords(id, data.keywords);
    await updateSourceLanguages(id, data.languages);
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
        value={form[fieldName] as string}
        onChange={v =>
          setForm(f => {
            const update = { ...f };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (update as any)[fieldName] = v;
            return update;
          })
        }
        message={getErrorMessage<Source>(fieldName, errors)}
      />
    );
  }

  if (!isInit) {
    return null;
  }
  return (
    <ScrollableModal show={true} handleClose={props.onClose}>
      <CloseInlineIcon
        style={{ float: 'right', top: 0 }}
        onClick={props.onClose}
      />

      <h1>{props.sourceToEdit ? 'Edit source' : 'Create new source'}</h1>
      <FormErrorMessage error={errors.find(e => e.field === GENERIC)} />
      <form>
        <ImportField
          label="External Reference"
          value={form.externalRef}
          onChange={externalRef => setForm(f => ({ ...f, externalRef }))}
          message={getErrorMessage<Source>('externalRef', errors)}
          onImport={handleImportMetadata}
          isImporting={isImportLoading}
          isRefImportable={isImportableUrl(form.externalRef)}
        />

        {renderFormField('title')}

        <TextFieldWithError
          label="Description"
          value={form.description}
          onChange={description => setForm(f => ({ ...f, description }))}
          message={getErrorMessage<Source>('description', errors)}
          multiline
          rows={6}
        />

        {renderFormField('creator')}
        {renderFormField('rights')}

        <ValidatedSelectField
          label="Access"
          message={getErrorMessage<Source>('access', errors)}
          selectedOption={form.access}
          onSelectOption={access => setForm(f => ({ ...f, access }))}
          options={AccessOptions}
        />

        {renderFormField('location')}
        {renderFormField('earliest')}
        {renderFormField('latest')}
        {renderFormField('notes')}

        <Label>Keywords</Label>
        <SelectKeywordsField
          selected={form.keywords}
          onChangeSelected={keywords => setForm(f => ({ ...f, keywords }))}
          useAutocomplete
          allowCreatingNew
        />
        <ErrorMsg msg={getErrorMessage<Source>('keywords', errors)} />

        <Label>Languages</Label>
        <LanguagesField
          selected={form.languages}
          onChangeSelected={languages => setForm(f => ({ ...f, languages }))}
        />
        <ErrorMsg msg={getErrorMessage<Source>('languages', errors)} />

        <MetadataValueFormFields
          keys={keys}
          values={values}
          onChange={setValues}
        />

        <SubmitButton onClick={() => handleSubmit(form)} />
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
