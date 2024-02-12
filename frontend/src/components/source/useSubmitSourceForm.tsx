import { Dispatch, SetStateAction } from 'react';
import { FormErrors, setFormErrors } from '../common/FormErrorMessage';
import {
  FormMetadataValue,
  ResultMetadataKey,
  ResultMetadataValue,
  Source,
  SourceFormSubmit,
  toResultMetadataValue,
  UUID,
} from '../../model/DexterModel';
import {
  addSourcesToCorpus,
  createSource,
  updateSource,
} from '../../utils/API';
import { submitMetadataValues } from '../../utils/submitMetadataValues';
import {
  updateSourceLanguages,
  updateSourceMetadataValues,
  updateSourceTags,
} from '../../utils/updateRemoteIds';
import * as yup from 'yup';

type UseSubmitSourceFormResult = {
  submitSourceForm: (
    form: Source,
    keys: ResultMetadataKey[],
    values: FormMetadataValue[],
  ) => Promise<void>;
};

type UseSubmitSourceFormParams = {
  sourceToEdit?: Source;
  setErrors: Dispatch<SetStateAction<FormErrors<Source>>>;
  onSubmitted: (submitted: Source) => void;
  corpusId?: UUID;
};

const sourceSchema = yup.object({
  title: yup.string().required('Title is required'),
  earliest: yup.date().nullable(),
  latest: yup.date().nullable(),
});

export function useSubmitSourceForm(
  params: UseSubmitSourceFormParams,
): UseSubmitSourceFormResult {
  const { setErrors, sourceToEdit, corpusId, onSubmitted } = params;

  async function submitSourceForm(
    data: SourceFormSubmit,
    keys: ResultMetadataKey[],
    values: ResultMetadataValue[],
  ): Promise<void> {
    try {
      await sourceSchema.validate(data);
      const id: UUID = sourceToEdit
        ? await updateExistingSource(data)
        : await createNewSource(data);
      data.metadataValues = await submitMetadataValues(
        sourceToEdit,
        keys,
        values,
      );
      await submitLinkedResources(id, data);
      onSubmitted({ id, ...data });
    } catch (error) {
      await setFormErrors(error, setErrors);
    }
  }

  async function submitLinkedResources(id: UUID, data: SourceFormSubmit) {
    const metadataValues = data.metadataValues.map(toResultMetadataValue);
    await updateSourceMetadataValues(id, metadataValues);
    await updateSourceTags(id, data.tags);
    await updateSourceLanguages(id, data.languages);
  }

  async function updateExistingSource(data: SourceFormSubmit): Promise<UUID> {
    const sourceId = sourceToEdit.id;
    await updateSource(sourceId, data);
    return sourceId;
  }

  async function createNewSource(data: SourceFormSubmit): Promise<UUID> {
    const newSource = await createSource(data);
    const sourceId = newSource.id;
    if (corpusId) {
      await addSourcesToCorpus(corpusId, [sourceId]);
    }
    return sourceId;
  }

  return { submitSourceForm };
}
