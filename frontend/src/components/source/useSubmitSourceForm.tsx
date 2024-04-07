import {
  ResultMetadataKey,
  Source,
  SubmitFormSource,
  UUID,
} from '../../model/DexterModel';
import { createSource, updateSource } from '../../utils/API';
import { createMetadataValues } from '../../utils/createMetadataValues';
import {
  updateSourceLanguages,
  updateSourceMedia,
  updateSourceMetadataValues,
  updateSourceTags,
} from '../../utils/updateRemoteIds';
import { sourceFormValidator } from './sourceFormValidator';
import { useCorpora } from '../../state/resources/hooks/useCorpora';

type UseSubmitSourceFormResult = {
  submitSourceForm: (
    form: SubmitFormSource,
    keys: ResultMetadataKey[],
  ) => Promise<void>;
};

type UseSubmitSourceFormParams = {
  sourceToEdit?: Source;
  setError: (error: Error) => Promise<void>;
  onSubmitted: (submitted: Source) => void;
  corpusId?: UUID;
};

export function useSubmitSourceForm(
  params: UseSubmitSourceFormParams,
): UseSubmitSourceFormResult {
  const { setError, sourceToEdit, corpusId, onSubmitted } = params;
  const { addSourcesToCorpus } = useCorpora();
  async function submitSourceForm(
    toSubmit: SubmitFormSource,
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
      await setError(error);
    }
  }

  async function linkResources(source: Source) {
    const id = source.id;
    await updateSourceMetadataValues(id, source.metadataValues);
    await updateSourceTags(id, source.tags);
    await updateSourceLanguages(id, source.languages);
    await updateSourceMedia(id, source.media);
  }

  async function updateExistingSource(data: SubmitFormSource): Promise<UUID> {
    const sourceId = sourceToEdit.id;
    await updateSource(sourceId, data);
    return sourceId;
  }

  async function createNewSource(data: SubmitFormSource): Promise<UUID> {
    const newSource = await createSource(data);
    const sourceId = newSource.id;
    if (corpusId) {
      await addSourcesToCorpus(corpusId, [sourceId]);
    }
    return sourceId;
  }

  return { submitSourceForm };
}
