import React, { useEffect, useState } from 'react';
import {
  AccessOptions,
  FormMetadataValue,
  ResultMetadataKey,
  Source,
} from '../../model/DexterModel';
import ScrollableModal from '../common/ScrollableModal';
import { SelectKeywordsField } from '../keyword/SelectKeywordsField';
import { LanguagesField } from '../language/LanguagesField';
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
} from '../common/FormErrorMessage';
import { CloseInlineIcon } from '../common/CloseInlineIcon';
import { SubmitButton } from '../common/SubmitButton';
import { ImportField } from './ImportField';
import _ from 'lodash';
import { MetadataValueFormFields } from '../metadata/MetadataValueFormFields';
import { isImportableUrl, useImportMetadata } from './useImportMetadata';
import { useSubmitSourceForm } from './useSubmitSourceForm';
import { useInitSourceForm } from './useInitSourceForm';

type SourceFormProps = {
  sourceToEdit?: Source;
  corpusId?: string;
  onSave: (data: Source) => void;
  onClose: () => void;
};

export function SourceForm(props: SourceFormProps) {
  const sourceToEdit = props.sourceToEdit;

  const [form, setForm] = useState<Source>();
  const [errors, setErrors] = useState<ErrorByField<Source>[]>([]);
  const [keys, setKeys] = useState<ResultMetadataKey[]>([]);
  const [values, setValues] = useState<FormMetadataValue[]>([]);

  const { init, isInit } = useInitSourceForm({
    sourceToEdit,
    setValues,
    setForm,
    setKeys,
  });
  const { submitSourceForm } = useSubmitSourceForm({
    sourceToEdit,
    setErrors,
    onSubmitted: props.onSave,
  });
  const { isImportLoading, loadImport } = useImportMetadata({ setErrors });

  useEffect(init, []);
  useEffect(scrollToError, [errors]);

  async function handleImportMetadata() {
    setForm(await loadImport(form));
  }

  async function handleSubmit() {
    await submitSourceForm(form, keys, values);
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

      <h1>{sourceToEdit ? 'Edit source' : 'Create new source'}</h1>
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

        <SubmitButton onClick={handleSubmit} />
      </form>
    </ScrollableModal>
  );
}
