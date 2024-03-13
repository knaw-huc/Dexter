import {
  Corpus,
  SubmitFormCorpus,
  FormCorpus,
  FormMetadataValue,
  ResultMetadataKey,
  ResultMetadataValue,
  toResultMetadataValue,
  UUID,
} from '../../model/DexterModel';
import { createCorpus, updateCorpus } from '../../utils/API';
import { createMetadataValues } from '../../utils/createMetadataValues';
import {
  updateCorpusLanguages,
  updateCorpusMetadataValues,
  updateCorpusTags,
  updateSources,
} from '../../utils/updateRemoteIds';
import { corpusFormValidator } from './corpusFormValidator';

type UseSubmitCorpusFormResult = {
  submitCorpusForm: (
    form: Corpus,
    keys: ResultMetadataKey[],
    values: FormMetadataValue[],
  ) => Promise<void>;
};

type UseSubmitCorpusFormParams = {
  corpusToEdit?: Corpus;
  setError: (error: Error) => Promise<void>;
  onSubmitted: (submitted: Corpus) => void;
  corpusId?: UUID;
};

export function useSubmitCorpusForm(
  params: UseSubmitCorpusFormParams,
): UseSubmitCorpusFormResult {
  const { corpusToEdit, onSubmitted, setError } = params;

  async function submitCorpusForm(
    toSubmit: SubmitFormCorpus,
    keys: ResultMetadataKey[],
    values: ResultMetadataValue[],
  ): Promise<void> {
    try {
      await corpusFormValidator.validate(toSubmit);
      const serverForm = toServerForm(toSubmit);
      const id = corpusToEdit
        ? await updateExistingCorpus(serverForm)
        : await createNewCorpus(serverForm);
      const metadataValues = await createMetadataValues(
        corpusToEdit,
        keys,
        values,
      );
      const corpus: Corpus = {
        ...toSubmit,
        metadataValues,
        id,
      };
      await linkResources(corpus);
      onSubmitted(corpus);
    } catch (e) {
      await setError(e);
    }
  }

  function toServerForm(data: SubmitFormCorpus): FormCorpus {
    const parentId = data.parent?.id;
    return { ...data, parentId };
  }

  async function createNewCorpus(data: FormCorpus) {
    const newCorpus = await createCorpus(data);
    return newCorpus.id;
  }

  async function updateExistingCorpus(data: FormCorpus) {
    const corpusId = corpusToEdit.id;
    await updateCorpus(corpusId, data);
    return corpusId;
  }

  async function linkResources(data: Corpus) {
    const id = data.id;
    const metadataValues = data.metadataValues.map(toResultMetadataValue);
    await updateCorpusMetadataValues(id, metadataValues);
    await updateCorpusTags(id, data.tags);
    await updateCorpusLanguages(id, data.languages);
    await updateSources(id, data.sources);
  }

  return { submitCorpusForm };
}
