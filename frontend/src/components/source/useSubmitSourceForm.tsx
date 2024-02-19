import { Dispatch, SetStateAction } from 'react';
import { FormErrors, setFormErrors } from '../common/FormError';
import {
  ResultMetadataKey,
  Source,
  SourceFormSubmit,
  UUID,
} from '../../model/DexterModel';
import {
  addSourcesToCorpus,
  createSource,
  updateSource,
} from '../../utils/API';
import { createMetadataValues } from '../../utils/createMetadataValues';
import {
  updateSourceLanguages,
  updateSourceMedia,
  updateSourceMetadataValues,
  updateSourceTags,
} from '../../utils/updateRemoteIds';
import { sourceFormValidator } from './sourceFormValidator';

type UseSubmitSourceFormResult = {
  submitSourceForm: (
    form: SourceFormSubmit,
    keys: ResultMetadataKey[],
  ) => Promise<void>;
};

type UseSubmitSourceFormParams = {
  sourceToEdit?: Source;
  setErrors: Dispatch<SetStateAction<FormErrors<Source>>>;
  onSubmitted: (submitted: Source) => void;
  corpusId?: UUID;
};

export function useSubmitSourceForm(
  params: UseSubmitSourceFormParams,
): UseSubmitSourceFormResult {
  const { setErrors, sourceToEdit, corpusId, onSubmitted } = params;

  async function submitSourceForm(
    toSubmit: SourceFormSubmit,
    keys: ResultMetadataKey[],
  ): Promise<void> {
    try {
      await sourceFormValidator.validate(toSubmit);
      const id: UUID = sourceToEdit
        ? await updateExistingSource(toSubmit)
        : await createNewSource(toSubmit);

      /**
       * Create metadata values here
       * and not in the metadata value form component
       * to prevent creating inaccessible db entries.
       * (All other resources can be viewed and deleted
       * at their resource page.)
       */
      const metadataValues = await createMetadataValues(
        sourceToEdit,
        keys,
        toSubmit.metadataValues,
      );

      const source: Source = { ...toSubmit, id, metadataValues };
      await linkResources(source);
      onSubmitted(source);
    } catch (error) {
      await setFormErrors(error, setErrors);
    }
  }

  async function linkResources(source: Source) {
    const id = source.id;
    await updateSourceMetadataValues(id, source.metadataValues);
    await updateSourceTags(id, source.tags);
    await updateSourceLanguages(id, source.languages);
    await updateSourceMedia(id, source.media);
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
