import React from 'react';
import ScrollableModal from '../common/ScrollableModal';
import { SelectTagField } from '../tag/SelectTagField';
import { SelectLanguagesField } from '../language/SelectLanguagesField';
import { ValidatedSelectField } from '../common/ValidatedSelectField';
import { TextFieldWithError } from '../common/TextFieldWithError';
import { SubmitButton } from '../common/SubmitButton';
import { ImportField } from './ImportField';
import { MetadataValueFormFields } from '../metadata/MetadataValueFormFields';
import { isImportableUrl, useImportMetadata } from './useImportMetadata';
import { useSubmitSourceForm } from './useSubmitSourceForm';
import { useInitSourceForm } from './useInitSourceForm';
import { TextareaFieldProps } from '../common/TextareaFieldProps';
import { onSubmit } from '../../utils/onSubmit';
import { SelectMediaField } from '../media/SelectMediaField';
import { useFormErrors } from '../common/error/useFormErrors';
import { FormErrorMessage } from '../common/error/FormError';
import { useImmer } from 'use-immer';
import { assign } from '../../utils/recipe/assign';
import { Hinted } from '../common/Hinted';
import { toFormHint } from '../../LabelStore';
import { TopRightCloseIcon } from '../common/icon/CloseIcon';
import { Source, SubmitFormSource } from '../../model/Source';
import { ResultMetadataKey } from '../../model/Metadata';
import { Access, AccessOptions } from '../../model/Access';
import { cancel } from '../../utils/cancel';

type SourceFormProps = {
  sourceToEdit?: Source;
  corpusId?: string;
  onSaved: (data: Source) => void;
  onClose: () => void;
};

export function SourceForm(props: SourceFormProps) {
  const sourceToEdit = props.sourceToEdit;

  const [form, setForm] = useImmer<SubmitFormSource>(null);
  const { errors, setError, setFieldError, clearErrors } =
    useFormErrors<Source>();
  const [keys, setKeys] = useImmer<ResultMetadataKey[]>([]);

  const { isInit } = useInitSourceForm({
    sourceToEdit,
    setForm,
    setKeys,
  });
  const { submitSourceForm } = useSubmitSourceForm({
    sourceToEdit,
    clearErrors,
    setError,
    onSubmitted: props.onSaved,
  });
  const { isImportLoading, loadImport } = useImportMetadata({
    setError,
    setFieldError,
    form,
    setForm,
  });

  const toHint = toFormHint('source');

  async function handleImportMetadata() {
    loadImport();
  }

  async function handleSubmit() {
    await submitSourceForm(form, keys);
  }

  function renderFormField(
    fieldName: keyof SubmitFormSource,
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
  function handleClose() {
    if (cancel('Discard changes?')) {
      return;
    }
    props.onClose();
  }

  if (!isInit) {
    return null;
  }
  return (
    <ScrollableModal handleClose={handleClose}>
      <TopRightCloseIcon onClick={handleClose} />

      <h1>{sourceToEdit ? 'Edit source' : 'Create new source'}</h1>
      <FormErrorMessage error={errors.generic} />
      <form onSubmit={onSubmit(handleSubmit)}>
        <ImportField
          label={
            <Hinted txt={'External reference'} hint={toHint('externalRef')} />
          }
          error={errors.externalRef}
          value={form.externalRef}
          onChange={externalRef => setForm(f => ({ ...f, externalRef }))}
          onImport={handleImportMetadata}
          isImporting={isImportLoading}
          isRefImportable={isImportableUrl(form.externalRef)}
        />

        {renderFormField('title')}

        <TextFieldWithError
          label={
            <Hinted txt="External Identifier" hint={toHint('externalId')} />
          }
          error={errors['externalId']}
          value={form['externalId']}
          onChange={value => setForm(f => assign(f, { externalId: value }))}
        />

        {renderFormField('description', { rows: 6, multiline: true })}
        {renderFormField('creator')}
        {renderFormField('rights')}
        {renderFormField('ethics')}

        <ValidatedSelectField<Access>
          label={<Hinted txt="access" hint={toHint('access')} />}
          error={errors.access}
          selectedOption={form.access}
          onSelectOption={access => setForm(f => ({ ...f, access }))}
          options={AccessOptions}
        />

        {renderFormField('location')}
        {renderFormField('earliest')}
        {renderFormField('latest')}
        {renderFormField('notes', { rows: 6, multiline: true })}

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

        <MetadataValueFormFields
          label={<Hinted txt="metadata" hint={toHint('metadata')} />}
          error={errors.metadataValues}
          keys={keys}
          values={form.metadataValues}
          onChange={metadataValues => setForm(f => ({ ...f, metadataValues }))}
        />

        <SelectMediaField
          label={<Hinted txt="media" hint={toHint('media')} />}
          error={errors.media}
          selected={form.media}
          onChangeSelected={media => setForm(f => ({ ...f, media }))}
          allowCreatingNew
        />

        <SubmitButton onClick={handleSubmit} />
      </form>
    </ScrollableModal>
  );
}
