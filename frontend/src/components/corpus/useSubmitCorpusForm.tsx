import { Dispatch, SetStateAction } from 'react';
import { ErrorByField, setFormFieldErrors } from '../common/FormErrorMessage';
import {
  FormMetadataValue,
  ResultMetadataKey,
  ResultMetadataValue,
  Corpus,
  CorpusFormSubmit,
  toResultMetadataValue,
  UUID,
  FormCorpus,
} from '../../model/DexterModel';
import { createCorpus, updateCorpus } from '../../utils/API';
import { submitMetadataValues } from '../../utils/submitMetadataValues';
import {
  updateCorpusKeywords,
  updateCorpusLanguages,
  updateCorpusMetadataValues,
  updateSources,
} from '../../utils/updateRemoteIds';
import * as yup from 'yup';

type UseSubmitCorpusFormResult = {
  submitCorpusForm: (
    form: Corpus,
    keys: ResultMetadataKey[],
    values: FormMetadataValue[],
  ) => Promise<void>;
};

type UseSubmitCorpusFormParams = {
  corpusToEdit?: Corpus;
  setErrors: Dispatch<SetStateAction<ErrorByField<Corpus>[]>>;
  onSubmitted: (submitted: Corpus) => void;
  corpusId?: UUID;
};

const corpusSchema = yup.object({
  title: yup.string().required('Title is required'),
  earliest: yup.date().nullable(),
  latest: yup.date().nullable(),
});

export function useSubmitCorpusForm(
  params: UseSubmitCorpusFormParams,
): UseSubmitCorpusFormResult {
  const { setErrors, corpusToEdit, onSubmitted } = params;

  async function submitCorpusForm(
    data: CorpusFormSubmit,
    keys: ResultMetadataKey[],
    values: ResultMetadataValue[],
  ): Promise<void> {
    try {
      await corpusSchema.validate(data);
      const serverForm = toServerForm(data);
      const id = corpusToEdit
        ? await updateExistingCorpus(serverForm)
        : await createNewCorpus(serverForm);
      data.metadataValues = await submitMetadataValues(
        corpusToEdit,
        keys,
        values,
      );
      await submitLinkedResources(id, data);
      onSubmitted({ id, ...data });
    } catch (e) {
      await setFormFieldErrors(e, setErrors);
    }
  }

  function toServerForm(data: CorpusFormSubmit): FormCorpus {
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

  async function submitLinkedResources(id: string, data: CorpusFormSubmit) {
    const metadataValues = data.metadataValues.map(toResultMetadataValue);
    await updateCorpusMetadataValues(id, metadataValues);
    await updateCorpusKeywords(id, data.keywords);
    await updateCorpusLanguages(id, data.languages);
    await updateSources(id, data.sources);
  }

  return { submitCorpusForm };
}
